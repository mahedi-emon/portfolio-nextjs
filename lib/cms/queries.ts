/**
 * Server-side CMS query helpers.
 *
 * Use these from Server Components and Route Handlers. Each function performs
 * one Supabase fetch and returns a typed, camelCased object (or array).
 *
 * Wrapped in React's `cache()` so duplicate calls *within the same request*
 * (e.g. layout + page both fetching `getHero()`) only hit Supabase once.
 *
 * Singleton getters return a default object if the row is missing — never null —
 * so callers can render safely without conditional checks.
 */

import { cache } from "react";
import { defaultAbout, defaultContact, defaultHero, defaultResumeSettings } from "./defaults";
import { deserializeRow, deserializeRows, type DbRow } from "./mappers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

// ============================================================================
// Singletons
// ============================================================================

export const getHero = cache(async (): Promise<Hero> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(DB_TABLES.HERO).select("*").single();

  if (error || !data) return defaultHero as Hero;
  return deserializeRow<Hero>(data as DbRow, "hero") ?? (defaultHero as Hero);
});

export const getAbout = cache(async (): Promise<About> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(DB_TABLES.ABOUT).select("*").single();

  if (error || !data) return defaultAbout as About;
  return deserializeRow<About>(data as DbRow, "about") ?? (defaultAbout as About);
});

export const getContact = cache(async (): Promise<Contact> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(DB_TABLES.CONTACT).select("*").single();

  if (error || !data) return defaultContact as Contact;

  const row = deserializeRow<Record<string, unknown>>(data as DbRow, "contact") ?? {};
  // Flatten contact_info → contactInfo nested shape
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
});

export const getResumeSettings = cache(async (): Promise<ResumeSettings> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(DB_TABLES.RESUME_SETTINGS)
    .select("*")
    .single();

  if (error || !data) return defaultResumeSettings;
  return {
    activeResumeId: ((data as DbRow).active_resume_id as string | null) ?? null,
  };
});

// ============================================================================
// Collections — published only by default for public pages
// ============================================================================

type CollectionOpts = {
  includeUnpublished?: boolean;
  limit?: number;
};

function maybePublishedFilter<T>(query: T, includeUnpublished?: boolean): T {
  if (includeUnpublished) return query;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (query as any).eq("status", "published");
}

export async function getProjects(opts: CollectionOpts = {}): Promise<Project[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from(DB_TABLES.PROJECTS).select("*").order("order_index");
  query = maybePublishedFilter(query, opts.includeUnpublished);
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return deserializeRows<Project>(data as DbRow[], "projects");
}

export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(DB_TABLES.PROJECTS)
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("order_index")
    .limit(limit);

  if (error || !data || data.length === 0) {
    return getProjects({ limit });
  }
  return deserializeRows<Project>(data as DbRow[], "projects");
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(DB_TABLES.PROJECTS)
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return deserializeRow<Project>(data as DbRow, "projects");
}

export async function getProjectSlugs(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.PROJECTS)
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((r) => r.slug as string).filter(Boolean);
}

export async function getBlogs(opts: CollectionOpts = {}): Promise<Blog[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from(DB_TABLES.BLOGS)
    .select("*")
    .order("published_date", { ascending: false });
  query = maybePublishedFilter(query, opts.includeUnpublished);
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return deserializeRows<Blog>(data as DbRow[], "blogs");
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(DB_TABLES.BLOGS)
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return deserializeRow<Blog>(data as DbRow, "blogs");
}

export async function getBlogSlugs(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.BLOGS)
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((r) => r.slug as string).filter(Boolean);
}

export async function getServices(opts: CollectionOpts = {}): Promise<Service[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from(DB_TABLES.SERVICES).select("*").order("order_index");
  query = maybePublishedFilter(query, opts.includeUnpublished);

  const { data, error } = await query;
  if (error || !data) return [];
  return deserializeRows<Service>(data as DbRow[], "services");
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.SKILLS)
    .select("*")
    .eq("status", "published")
    .order("order_index");
  return deserializeRows<Skill>((data ?? []) as DbRow[], "skills");
}

export async function getTechStackCategories(): Promise<TechStackCategory[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.TECH_STACK_CATEGORIES)
    .select("*")
    .eq("status", "published")
    .order("order_index");
  return deserializeRows<TechStackCategory>(
    (data ?? []) as DbRow[],
    "techStackCategories",
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.TESTIMONIALS)
    .select("*")
    .eq("status", "published")
    .order("order_index");
  return deserializeRows<Testimonial>((data ?? []) as DbRow[], "testimonials");
}

export async function getAchievements(opts: CollectionOpts = {}): Promise<Achievement[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from(DB_TABLES.ACHIEVEMENTS).select("*").order("order_index");
  query = maybePublishedFilter(query, opts.includeUnpublished);

  const { data } = await query;
  return deserializeRows<Achievement>((data ?? []) as DbRow[], "achievements");
}

export async function getEducation(): Promise<Education[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.EDUCATION)
    .select("*")
    .eq("status", "published")
    .order("order_index");
  return deserializeRows<Education>((data ?? []) as DbRow[], "education");
}

export async function getExperience(): Promise<Experience[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.EXPERIENCE)
    .select("*")
    .eq("status", "published")
    .order("order_index");
  return deserializeRows<Experience>((data ?? []) as DbRow[], "experience");
}

export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.CERTIFICATIONS)
    .select("*")
    .eq("status", "published")
    .order("order_index");
  return deserializeRows<Certification>((data ?? []) as DbRow[], "certifications");
}

export async function getPublications(): Promise<Publication[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.PUBLICATIONS)
    .select("*")
    .eq("status", "published")
    .order("order_index");
  return deserializeRows<Publication>((data ?? []) as DbRow[], "publications");
}

export async function getPublicationSlugs(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.PUBLICATIONS)
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((r) => r.slug as string).filter(Boolean);
}

export async function getClients(): Promise<Client[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.CLIENTS)
    .select("*")
    .eq("status", "published")
    .order("order_index");
  return deserializeRows<Client>((data ?? []) as DbRow[], "clients");
}

export async function getResumes(): Promise<Resume[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from(DB_TABLES.RESUMES).select("*");
  return deserializeRows<Resume>((data ?? []) as DbRow[], "resumes");
}

export async function getActiveResume(): Promise<Resume | null> {
  const settings = await getResumeSettings();
  if (!settings.activeResumeId) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.RESUMES)
    .select("*")
    .eq("id", settings.activeResumeId)
    .maybeSingle();
  if (!data) return null;
  return deserializeRow<Resume>(data as DbRow, "resumes");
}

// ============================================================================
// Admin-only
// ============================================================================

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(DB_TABLES.CONTACT_MESSAGES)
    .select("*")
    .order("created_at", { ascending: false });
  return deserializeRows<ContactMessage>(
    (data ?? []) as DbRow[],
    "contactMessages",
  );
}
