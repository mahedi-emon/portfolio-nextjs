import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Code, ExternalLink } from "lucide-react";
import { JsonLd } from "@/components/common/JsonLd";
import { getProjectBySlug } from "@/lib/cms/queries";
import { projectDetailSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project)
    return buildMetadata({
      page: "portfolio",
      title: "Project not found",
      description: "",
      path: `/portfolio/${slug}`,
      noindex: true,
    });
  return buildMetadata({
    page: "portfolio",
    title: `${project.title} — Project Case Study`,
    description: project.summary,
    path: `/portfolio/${slug}`,
    image: project.coverImageUrl || undefined,
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd data={projectDetailSchema(project)} />

      <article className="space-y-10 pb-16">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#C9D1D9] hover:text-[#C77DFF] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to portfolio
        </Link>

        <header className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{project.title}</h1>
          <p className="text-lg text-[#C9D1D9]">{project.summary}</p>
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[#C77DFF]/30 bg-[#C77DFF]/10 px-3 py-1 text-xs font-medium text-[#C77DFF]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white hover:border-[#C77DFF]/40 hover:bg-[#C77DFF]/10 transition-all"
              >
                <Code className="h-4 w-4" /> View Code
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#C77DFF]/30"
              >
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
          </div>
        </header>

        {project.coverImageUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {project.description && (
          <div
            className="prose prose-invert max-w-none text-base leading-relaxed text-[#C9D1D9] [&_a]:text-[#C77DFF] [&_a:hover]:underline [&>p]:mb-4 [&>h2]:mt-8 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h3]:mt-6 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-white [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/40 [&_pre]:p-4"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
          />
        )}

        {project.galleryImages && project.galleryImages.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.galleryImages.map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-video overflow-hidden rounded-xl border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${project.title} — image ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
