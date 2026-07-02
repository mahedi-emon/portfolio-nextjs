/**
 * Server-side CMS query helpers.
 *
 * PUBLIC queries (hero, about, projects, blogs, etc.) are wrapped in BOTH:
 *   - React `cache()` — dedupes within a single request (layout + page).
 *   - Next.js `unstable_cache` — caches the *result* across requests via the
 *     Data Cache, so even cold visitors past the ISR window only trigger ONE
 *     Supabase round-trip per (tag, revalidate) window, shared by every page.
 *
 * All public queries use the stateless `supabasePublic` client (anon key,
 * no cookies) — required because cookie-bound clients can't be cached
 * across requests.
 *
 * ADMIN queries (contact messages) keep the cookie-bound server client so
 * RLS still enforces auth.
 *
 * Cache invalidation: `/api/admin/revalidate` calls revalidateTag('cms', ...)
 * which nukes everything tagged "cms" the next time it's read.
 */

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { defaultAbout, defaultContact, defaultHero, defaultResumeSettings } from "./defaults";
import { deserializeRow, deserializeRows, slugify, type DbRow } from "./mappers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabasePublic } from "@/lib/supabase/public";
import { DB_TABLES } from "./tables";
import type {
  About,
  Achievement,
  Blog,
  Certification,
  Client,
  Contact,
  ContactMessage,
  Education,
  Experience,
  Hero,
  Project,
  Publication,
  Resume,
  ResumeSettings,
  Service,
  Skill,
  TechStackCategory,
  Testimonial,
} from "./types";

/** Common cache settings — 1 hour TTL, all tagged "cms" + a specific subtag. */
const CACHE_TTL_SECONDS = 3600;
const tags = (subtag: string) => ["cms", `cms:${subtag}`];

// ============================================================================
// Singletons
// ============================================================================

export const getHero = cache(
  unstable_cache(
    async (): Promise<Hero> => {
      const { data, error } = await supabasePublic.from(DB_TABLES.HERO).select("*").single();
      if (error || !data) return defaultHero as Hero;
      return deserializeRow<Hero>(data as DbRow, "hero") ?? (defaultHero as Hero);
    },
    ["cms:hero"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("hero") },
  ),
);

export const getAbout = cache(
  unstable_cache(
    async (): Promise<About> => {
      const { data, error } = await supabasePublic.from(DB_TABLES.ABOUT).select("*").single();
      if (error || !data) return defaultAbout as About;
      return deserializeRow<About>(data as DbRow, "about") ?? (defaultAbout as About);
    },
    ["cms:about"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("about") },
  ),
);

export const getContact = cache(
  unstable_cache(
    async (): Promise<Contact> => {
      const { data, error } = await supabasePublic.from(DB_TABLES.CONTACT).select("*").single();
      if (error || !data) return defaultContact as Contact;

      const row = deserializeRow<Record<string, unknown>>(data as DbRow, "contact") ?? {};
      return {
        pageIntroText: (row.pageIntroText as string) ?? null,
        hireMeLabel: (row.hireMeLabel as string) ?? "Hire Me",
        contactInfo: {
          email: (row.email as string) ?? "",
          phone: (row.phone as string) ?? null,
          location: (row.location as string) ?? null,
        },
        socialLinks: (row.socialLinks as Contact["socialLinks"]) ?? [],
      };
    },
    ["cms:contact"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("contact") },
  ),
);

export const getResumeSettings = cache(
  unstable_cache(
    async (): Promise<ResumeSettings> => {
      const { data, error } = await supabasePublic
        .from(DB_TABLES.RESUME_SETTINGS)
        .select("*")
        .single();
      if (error || !data) return defaultResumeSettings;
      return {
        activeResumeId: ((data as DbRow).active_resume_id as string | null) ?? null,
      };
    },
    ["cms:resume-settings"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("resume-settings") },
  ),
);

// ============================================================================
// Collections — published only, cached
// ============================================================================

/** Columns needed for the home/portfolio listing cards (skip heavy HTML). */
const PROJECT_LIST_COLS =
  "id, slug, title, summary, cover_image_url, gallery_images, github_url, live_demo_url, tech_stack, featured, status, order_index, created_at, updated_at";

/** Full project columns including the heavy `description` HTML — slug page only. */
const PROJECT_FULL_COLS = "*";

/** Columns needed for the blog listing — skip heavy `content`. */
const BLOG_LIST_COLS =
  "id, slug, title, excerpt, cover_image_url, author, published_date, read_time, tags, status, order_index, created_at, updated_at";

const BLOG_FULL_COLS = "*";

export const getProjects = cache(
  unstable_cache(
    async (): Promise<Project[]> => {
      const { data, error } = await supabasePublic
        .from(DB_TABLES.PROJECTS)
        .select(PROJECT_LIST_COLS)
        .eq("status", "published")
        .order("order_index");
      if (error || !data) return [];
      return deserializeRows<Project>(data as DbRow[], "projects");
    },
    ["cms:projects-list"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("projects") },
  ),
);

export const getProjectBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<Project | null> => {
      // 1. Try exact match first
      const { data, error } = await supabasePublic
        .from(DB_TABLES.PROJECTS)
        .select(PROJECT_FULL_COLS)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (!error && data) {
        return deserializeRow<Project>(data as DbRow, "projects");
      }

      // 2. Fallback to slugified match
      const { data: allData } = await supabasePublic
        .from(DB_TABLES.PROJECTS)
        .select(PROJECT_FULL_COLS)
        .eq("status", "published");
      const target = slugify(slug);
      const match = (allData ?? []).find(
        (r) => slugify((r.slug as string) || "") === target
      );
      if (match) {
        return deserializeRow<Project>(match as DbRow, "projects");
      }
      return null;
    },
    ["cms:project-detail"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("projects") },
  ),
);

export const getProjectSlugs = cache(
  unstable_cache(
    async (): Promise<string[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.PROJECTS)
        .select("slug")
        .eq("status", "published");
      return (data ?? []).map((r) => slugify((r.slug as string) || "")).filter(Boolean);
    },
    ["cms:project-slugs"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("projects") },
  ),
);

export const getBlogs = cache(
  unstable_cache(
    async (limit?: number): Promise<Blog[]> => {
      let query = supabasePublic
        .from(DB_TABLES.BLOGS)
        .select(BLOG_LIST_COLS)
        .eq("status", "published")
        .order("published_date", { ascending: false });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error || !data) return [];
      return deserializeRows<Blog>(data as DbRow[], "blogs");
    },
    ["cms:blogs-list"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("blogs") },
  ),
);

/** Convenience overload — call as `getBlogs({ limit: 3 })` to match older API. */
export const getBlogsWithOpts = (opts: { limit?: number } = {}): Promise<Blog[]> =>
  getBlogs(opts.limit);

export const getBlogBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<Blog | null> => {
      // 1. Try exact match first
      const { data, error } = await supabasePublic
        .from(DB_TABLES.BLOGS)
        .select(BLOG_FULL_COLS)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (!error && data) {
        return deserializeRow<Blog>(data as DbRow, "blogs");
      }

      // 2. Fallback to slugified match
      const { data: allData } = await supabasePublic
        .from(DB_TABLES.BLOGS)
        .select(BLOG_FULL_COLS)
        .eq("status", "published");
      const target = slugify(slug);
      const match = (allData ?? []).find(
        (r) => slugify((r.slug as string) || "") === target
      );
      if (match) {
        return deserializeRow<Blog>(match as DbRow, "blogs");
      }
      return null;
    },
    ["cms:blog-detail"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("blogs") },
  ),
);

export const getBlogSlugs = cache(
  unstable_cache(
    async (): Promise<string[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.BLOGS)
        .select("slug")
        .eq("status", "published");
      return (data ?? []).map((r) => slugify((r.slug as string) || "")).filter(Boolean);
    },
    ["cms:blog-slugs"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("blogs") },
  ),
);

export const getServices = cache(
  unstable_cache(
    async (): Promise<Service[]> => {
      const { data, error } = await supabasePublic
        .from(DB_TABLES.SERVICES)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      if (error || !data) return [];
      return deserializeRows<Service>(data as DbRow[], "services");
    },
    ["cms:services"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("services") },
  ),
);

export const getSkills = cache(
  unstable_cache(
    async (): Promise<Skill[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.SKILLS)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      return deserializeRows<Skill>((data ?? []) as DbRow[], "skills");
    },
    ["cms:skills"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("skills") },
  ),
);

export const getTechStackCategories = cache(
  unstable_cache(
    async (): Promise<TechStackCategory[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.TECH_STACK_CATEGORIES)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      return deserializeRows<TechStackCategory>(
        (data ?? []) as DbRow[],
        "techStackCategories",
      );
    },
    ["cms:tech-stack"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("tech-stack") },
  ),
);

export const getTestimonials = cache(
  unstable_cache(
    async (): Promise<Testimonial[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.TESTIMONIALS)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      return deserializeRows<Testimonial>((data ?? []) as DbRow[], "testimonials");
    },
    ["cms:testimonials"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("testimonials") },
  ),
);

export const getAchievements = cache(
  unstable_cache(
    async (): Promise<Achievement[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.ACHIEVEMENTS)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      return deserializeRows<Achievement>((data ?? []) as DbRow[], "achievements");
    },
    ["cms:achievements"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("achievements") },
  ),
);

export const getEducation = cache(
  unstable_cache(
    async (): Promise<Education[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.EDUCATION)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      return deserializeRows<Education>((data ?? []) as DbRow[], "education");
    },
    ["cms:education"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("education") },
  ),
);

export const getExperience = cache(
  unstable_cache(
    async (): Promise<Experience[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.EXPERIENCE)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      return deserializeRows<Experience>((data ?? []) as DbRow[], "experience");
    },
    ["cms:experience"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("experience") },
  ),
);

export const getCertifications = cache(
  unstable_cache(
    async (): Promise<Certification[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.CERTIFICATIONS)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      return deserializeRows<Certification>((data ?? []) as DbRow[], "certifications");
    },
    ["cms:certifications"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("certifications") },
  ),
);

export const getPublications = cache(
  unstable_cache(
    async (): Promise<Publication[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.PUBLICATIONS)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      return deserializeRows<Publication>((data ?? []) as DbRow[], "publications");
    },
    ["cms:publications"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("publications") },
  ),
);

export const getPublicationSlugs = cache(
  unstable_cache(
    async (): Promise<string[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.PUBLICATIONS)
        .select("slug")
        .eq("status", "published");
      return (data ?? []).map((r) => r.slug as string).filter(Boolean);
    },
    ["cms:publication-slugs"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("publications") },
  ),
);

export const getClients = cache(
  unstable_cache(
    async (): Promise<Client[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.CLIENTS)
        .select("*")
        .eq("status", "published")
        .order("order_index");
      return deserializeRows<Client>((data ?? []) as DbRow[], "clients");
    },
    ["cms:clients"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("clients") },
  ),
);

export const getResumes = cache(
  unstable_cache(
    async (): Promise<Resume[]> => {
      const { data } = await supabasePublic.from(DB_TABLES.RESUMES).select("*");
      return deserializeRows<Resume>((data ?? []) as DbRow[], "resumes");
    },
    ["cms:resumes"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("resumes") },
  ),
);

/** Backwards-compat helper — combines resumeSettings + resumes to find the active one. */
export async function getActiveResume(): Promise<Resume | null> {
  const settings = await getResumeSettings();
  if (!settings.activeResumeId) return null;
  const resumes = await getResumes();
  return resumes.find((r) => r.id === settings.activeResumeId) ?? null;
}

/** Featured projects helper — derives from the cached project list. */
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  return featured.length > 0 ? featured.slice(0, limit) : all.slice(0, limit);
}


export const getProjectSitemapData = cache(
  unstable_cache(
    async (): Promise<{ slug: string; updatedAt: string }[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.PROJECTS)
        .select("slug, updated_at")
        .eq("status", "published");
      return (data ?? []).map((r) => ({
        slug: slugify((r.slug as string) || ""),
        updatedAt: (r.updated_at as string) || new Date().toISOString(),
      })).filter(item => item.slug);
    },
    ["cms:project-sitemap"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("projects") },
  ),
);

export const getBlogSitemapData = cache(
  unstable_cache(
    async (): Promise<{ slug: string; updatedAt: string }[]> => {
      const { data } = await supabasePublic
        .from(DB_TABLES.BLOGS)
        .select("slug, updated_at")
        .eq("status", "published");
      return (data ?? []).map((r) => ({
        slug: slugify((r.slug as string) || ""),
        updatedAt: (r.updated_at as string) || new Date().toISOString(),
      })).filter(item => item.slug);
    },
    ["cms:blog-sitemap"],
    { revalidate: CACHE_TTL_SECONDS, tags: tags("blogs") },
  ),
);

// ============================================================================
// Admin-only (cookie-bound, RLS-enforced, NOT cached cross-request)
// ============================================================================

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.CONTACT_MESSAGES)
    .select("*")
    .order("created_at", { ascending: false });
  return deserializeRows<ContactMessage>((data ?? []) as DbRow[], "contactMessages");
}
