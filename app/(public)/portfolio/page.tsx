import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Code, FolderKanban } from "lucide-react";
import { JsonLd } from "@/components/common/JsonLd";
import { getProjects } from "@/lib/cms/queries";
import { portfolioPageSchemas } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    page: "portfolio",
    title: "Portfolio — Projects & Case Studies",
    description:
      "Selected projects by Mahedi Hasan Emon — full-stack web apps, SaaS platforms, ML systems, and open-source contributions.",
    path: "/portfolio",
  });
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      <JsonLd data={portfolioPageSchemas(projects)} />

      <div className="space-y-16 pb-16">
        <section className="text-center pt-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white animate-fade-in">
            My{" "}
            <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>
          <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
            Production-ready apps, SaaS platforms, and research projects.
          </p>
        </section>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-[#C77DFF]/10 flex items-center justify-center mb-6">
              <FolderKanban className="w-10 h-10 text-[#C77DFF]" />
            </div>
            <p className="text-[#C9D1D9]">No projects published yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <article
                key={project.id}
                className="group rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] overflow-hidden hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative h-56 overflow-hidden">
                  {project.coverImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={project.coverImageUrl}
                      alt={project.title}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#C77DFF]/20 to-[#9D4EDD]/10 flex items-center justify-center">
                      <FolderKanban className="w-16 h-16 text-[#C77DFF]/40" />
                    </div>
                  )}
                  {project.featured && (
                    <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[#C77DFF] px-3 py-1 text-xs font-semibold text-[#0B1320] shadow-lg shadow-[#C77DFF]/40">
                      Featured
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 flex gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-[#0B1320] text-sm font-medium hover:bg-white transition-colors"
                      >
                        <Code className="w-4 h-4" /> Code
                      </a>
                    )}
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C77DFF] text-white text-sm font-medium hover:bg-[#9D4EDD] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Live
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <Link href={`/portfolio/${project.slug}`}>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#C77DFF] transition-colors">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-[#C9D1D9] line-clamp-2 mb-3">{project.summary}</p>
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-[#C9D1D9]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="text-[11px] font-medium text-[#C77DFF]">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-1 text-[#C77DFF] text-sm font-medium hover:gap-2 transition-all"
                  >
                    View details <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
