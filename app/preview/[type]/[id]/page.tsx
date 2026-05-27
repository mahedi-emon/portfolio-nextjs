/**
 * /preview/[type]/[id]?t=<hmac-token>
 *
 * Private preview of an unpublished item — used by the admin to share a draft
 * with someone before flipping its status to "published".
 *
 * Security: the token is an HMAC of (type:id) signed with PREVIEW_SECRET.
 * Without the correct token the route returns 404, so guessing IDs gets
 * nobody anywhere. Tokens rotate when PREVIEW_SECRET rotates.
 *
 * Render strategy: the route uses the service-role client to bypass the
 * status='published' filter, but otherwise renders the exact same JSX
 * shape as the public detail pages so the admin sees what visitors will
 * see post-publish.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, EyeOff } from "lucide-react";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { deserializeRow, type DbRow } from "@/lib/cms/mappers";
import { DB_TABLES } from "@/lib/cms/tables";
import { isValidType, verifyPreviewToken, type PreviewType } from "@/lib/preview/token";
import type { Blog, Project, Publication, Achievement } from "@/lib/cms/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TABLES: Record<PreviewType, string> = {
  blog: DB_TABLES.BLOGS,
  project: DB_TABLES.PROJECTS,
  publication: DB_TABLES.PUBLICATIONS,
  achievement: DB_TABLES.ACHIEVEMENTS,
};

const SECTION_KEYS: Record<PreviewType, string> = {
  blog: "blogs",
  project: "projects",
  publication: "publications",
  achievement: "achievements",
};

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { type, id } = await params;
  const { t } = await searchParams;

  if (!isValidType(type)) notFound();
  if (!verifyPreviewToken(type, id, t)) notFound();

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(TABLES[type])
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const item = deserializeRow(data as DbRow, SECTION_KEYS[type]);
  if (!item) notFound();

  return (
    <div className="min-h-screen bg-[#0B1320] text-[#C9D1D9]">
      {/* Preview banner — always shows so the viewer knows this is unpublished */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-4 py-3 shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <EyeOff className="h-5 w-5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">
                Preview mode — this {type} is not yet public
              </p>
              <p className="text-[11px] text-white/80 truncate">
                Status:{" "}
                <span className="font-semibold uppercase">
                  {String((item as Record<string, unknown>).status ?? "draft")}
                </span>
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Exit
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {type === "blog" && <BlogPreview blog={item as unknown as Blog} />}
        {type === "project" && <ProjectPreview project={item as unknown as Project} />}
        {type === "publication" && (
          <PublicationPreview publication={item as unknown as Publication} />
        )}
        {type === "achievement" && (
          <AchievementPreview achievement={item as unknown as Achievement} />
        )}
      </main>
    </div>
  );
}

function BlogPreview({ blog }: { blog: Blog }) {
  return (
    <article className="space-y-8">
      {blog.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={blog.coverImageUrl}
          alt={blog.title}
          className="w-full aspect-[16/9] rounded-2xl object-cover border border-white/10"
        />
      )}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{blog.title}</h1>
        {blog.excerpt && <p className="text-lg text-[#C9D1D9]">{blog.excerpt}</p>}
        <div className="flex flex-wrap gap-3 text-sm text-white/60">
          {blog.author && <span>{blog.author}</span>}
          {blog.publishedDate && (
            <span>
              {new Date(blog.publishedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {blog.readTime ? <span>{blog.readTime} min read</span> : null}
        </div>
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-[#C77DFF]/10 border border-[#C77DFF]/25 text-[10px] font-semibold text-[#C77DFF] uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      {blog.content && (
        <div
          className="prose prose-invert max-w-none text-base leading-relaxed text-[#C9D1D9] [&_a]:text-[#C77DFF] [&_a:hover]:underline [&>p]:mb-4 [&>h2]:mt-8 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h3]:mt-6 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-white [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/40 [&_pre]:p-4"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
        />
      )}
    </article>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  return (
    <article className="space-y-8">
      {project.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="w-full aspect-[16/9] rounded-2xl object-cover border border-white/10"
        />
      )}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">{project.title}</h1>
        <p className="text-lg text-[#C9D1D9]">{project.summary}</p>
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-full bg-[#C77DFF]/10 border border-[#C77DFF]/25 text-[10px] font-semibold text-[#C77DFF] uppercase tracking-wider"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </header>
      {project.description && (
        <div
          className="prose prose-invert max-w-none text-base leading-relaxed text-[#C9D1D9] [&_a]:text-[#C77DFF] [&_a:hover]:underline [&>p]:mb-4 [&>h2]:mt-8 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
        />
      )}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.galleryImages.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`${project.title} ${i + 1}`}
                className="w-full aspect-video object-cover rounded-xl border border-white/10"
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function PublicationPreview({ publication }: { publication: Publication }) {
  return (
    <article className="space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-white">{publication.title}</h1>
      {publication.authors && publication.authors.length > 0 && (
        <p className="text-sm text-white/60">{publication.authors.join(", ")}</p>
      )}
      <div className="text-sm text-[#C77DFF] font-medium">
        {publication.venue} {publication.year && `· ${publication.year}`}
      </div>
      {publication.abstract && (
        <p className="text-base text-[#C9D1D9] leading-relaxed">{publication.abstract}</p>
      )}
    </article>
  );
}

function AchievementPreview({ achievement }: { achievement: Achievement }) {
  const coverImage = achievement.certificateImageUrl || achievement.galleryImages?.[0];
  return (
    <article className="space-y-6">
      {coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt={achievement.title}
          className="w-full aspect-[16/9] rounded-2xl object-cover border border-white/10"
        />
      )}
      <h1 className="text-3xl sm:text-4xl font-bold text-white">{achievement.title}</h1>
      <div className="text-sm text-[#C77DFF] font-medium">
        {achievement.issuer} {achievement.year && `· ${achievement.year}`}
      </div>
      <p className="text-base text-[#C9D1D9] leading-relaxed">{achievement.description}</p>
    </article>
  );
}
