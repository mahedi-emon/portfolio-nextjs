"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  FolderKanban,
  BookOpen,
  Trophy,
  Award,
  ExternalLink,
  Code,
  FileText,
  Eye,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { ProjectCardCarousel } from "@/components/public/ProjectCardCarousel";
import { CertificateModal } from "@/components/common/CertificateModal";
import type {
  Achievement,
  Certification,
  Project,
  Publication,
} from "@/lib/cms/types";

const tabs = ["projects", "publications", "achievements"] as const;
type TabKey = (typeof tabs)[number];

const tabConfig: Record<TabKey, { icon: typeof FolderKanban; label: string }> = {
  projects: { icon: FolderKanban, label: "Projects" },
  publications: { icon: BookOpen, label: "Publications" },
  achievements: { icon: Trophy, label: "Achievements" },
};

export type PortfolioData = {
  projects: Project[];
  publications: Publication[];
  achievements: Achievement[];
  certifications: Certification[];
};

export function PortfolioPageClient({ data }: { data: PortfolioData }) {
  const { projects, publications, achievements, certifications } = data;
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certModalImage, setCertModalImage] = useState("");

  const handleViewCertificate = (imageUrl: string) => {
    setCertModalImage(imageUrl);
    setCertModalOpen(true);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="relative pt-8 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-5 blur-3xl animate-pulse-glow" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 text-[#C77DFF] animate-spin-slow" />
          <span className="text-sm font-medium text-[#C77DFF]">My Portfolio</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fade-in text-white">
          Work &{" "}
          <span className="gradient-text text-shimmer hover:animate-wiggle inline-block">
            Achievements
          </span>
        </h1>
        <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
          A curated collection of my projects, publications, and achievements throughout my career.
        </p>
      </section>

      {/* Tab Navigation */}
      <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex justify-center overflow-x-auto pb-4 -mb-4 px-4 sm:px-0">
          <div className="inline-flex p-1.5 bg-[#0B1320]/60 rounded-2xl border border-white/10 whitespace-nowrap min-w-fit">
            {tabs.map((tab, index) => {
              const config = tabConfig[tab];
              const Icon = config.icon;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "bg-[#0B1320]/50 text-white shadow-md border border-white/20"
                      : "text-white/60 hover:text-[#C9D1D9]"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-[#C77DFF] animate-bounce-subtle" : ""} transition-colors`}
                  />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Tab */}
      {activeTab === "projects" && projects.length > 0 && (
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const gallery = project.galleryImages ?? [];
            const allImages = project.coverImageUrl
              ? [project.coverImageUrl, ...gallery]
              : gallery;
            return (
              <article
                key={project.id}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Subtle gradient glow ring — animates in on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-sm opacity-0 group-hover:opacity-[0.15] transition-opacity duration-600 ease-out pointer-events-none" />
                <div className="relative h-full bg-[#0B1320]/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.15] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    {allImages.length > 0 ? (
                      <ProjectCardCarousel images={allImages} alt={project.title} />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#C77DFF]/15 via-[#0B1320] to-[#9D4EDD]/15 flex items-center justify-center">
                        <FolderKanban className="w-16 h-16 text-[#C77DFF]/50 animate-bounce-subtle" />
                      </div>
                    )}

                    {/* Dark gradient overlay so buttons stay readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/20 to-transparent pointer-events-none z-10" />

                    {project.featured && (
                      <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] shadow-lg shadow-[#C77DFF]/30">
                        <Sparkles className="w-3 h-3 text-white" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Code + Live Demo — hidden on desktop, revealed on hover.
                        On mobile (no hover), always visible. */}
                    <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap gap-2 opacity-100 translate-y-0 md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 ease-out">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#0B1320] text-xs font-semibold shadow-lg hover:scale-105 transition-transform"
                        >
                          <Code className="w-3.5 h-3.5" /> Code
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] text-white text-xs font-semibold shadow-lg shadow-[#C77DFF]/40 hover:scale-105 transition-transform"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#C77DFF] transition-colors line-clamp-2">
                      {project.title}
                    </h2>
                    <p className="text-[#C9D1D9] text-sm mb-4 line-clamp-2">{project.summary}</p>

                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-full bg-[#C77DFF]/10 border border-[#C77DFF]/20 text-[10px] font-semibold text-[#C77DFF] uppercase tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60">
                            +{project.techStack.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-end pt-4 border-t border-white/10 mt-auto">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-[#C77DFF] font-semibold hover:gap-2 transition-all"
                      >
                        Case study <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {activeTab === "projects" && projects.length === 0 && (
        <EmptyState title="No Projects Yet" body="Projects will appear here once they are added and published." />
      )}

      {/* Publications Tab */}
      {activeTab === "publications" && publications.length > 0 && (
        <section className="space-y-6">
          {publications.map((pub, index) => (
            <article
              key={pub.id}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
              <div className="relative bg-[#0B1320]/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out">
                <div className="grid md:grid-cols-[200px_1fr] gap-6 p-6">
                  {pub.coverImageUrl ? (
                    <div className="relative h-40 md:h-full rounded-xl overflow-hidden img-hover-shine min-h-[160px]">
                      <Image
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        src={pub.coverImageUrl}
                        alt={pub.title}
                        fill
                        quality={88}
                        sizes="200px"
                      />
                    </div>
                  ) : (
                    <div className="h-40 md:h-full rounded-xl bg-gradient-to-br from-[#0B1320]/50 to-[#0B1320]/60 flex items-center justify-center animate-bg-pan">
                      <BookOpen className="w-12 h-12 text-[#C77DFF] animate-bounce-subtle" />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C77DFF]/20 text-[#C77DFF] text-xs font-semibold w-fit mb-3 group-hover:bg-[#C77DFF]/30 transition-colors">
                      <BookOpen className="w-3 h-3 group-hover:animate-wiggle" />
                      {pub.venue || "Publication"}
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#C77DFF] transition-colors">
                      {pub.title}
                    </h2>

                    {Array.isArray(pub.authors) && pub.authors.length > 0 && (
                      <p className="text-sm text-white/60 mb-2">{pub.authors.join(", ")}</p>
                    )}

                    {pub.year && (
                      <p className="text-sm text-[#C77DFF] font-medium mb-3">Published {pub.year}</p>
                    )}

                    {pub.abstract && (
                      <p className="text-[#C9D1D9] text-sm line-clamp-2 mb-4">{pub.abstract}</p>
                    )}

                    <div className="flex items-center gap-3 mt-auto">
                      {pub.paperUrl && (
                        <a
                          href={pub.paperUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] text-sm font-medium hover:bg-[#C77DFF]/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group/link"
                        >
                          <ExternalLink className="w-4 h-4 group-hover/link:animate-wiggle" />
                          View Paper
                        </a>
                      )}
                      {pub.pdfUrl && (
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B1320]/50 text-[#C9D1D9] text-sm font-medium hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group/link"
                        >
                          <FileText className="w-4 h-4 group-hover/link:animate-bounce-subtle" />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === "publications" && publications.length === 0 && (
        <EmptyState title="No Publications Yet" body="Publications will appear here once they are added and published." />
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (achievements.length > 0 || certifications.length > 0) && (
        <section className="space-y-12">
          {achievements.length > 0 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 transition-all duration-500 ease-out">
                  <Trophy className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h2 className="text-2xl font-bold text-white hover:text-[#C77DFF] transition-colors">
                  Achievements & Awards
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((item, index) => {
                  const coverImage = item.certificateImageUrl || item.galleryImages?.[0];
                  const extraGalleryCount = (item.galleryImages?.length ?? 0) - (item.certificateImageUrl ? 0 : 1);
                  return (
                    <article
                      key={item.id}
                      className="group relative animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.18] transition-all duration-600 ease-out" />
                      <div className="relative h-full bg-[#0B1320]/85 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-2xl hover:shadow-[#C77DFF]/[0.18] hover:-translate-y-2 hover:border-[#C77DFF]/30 transition-all duration-500 ease-out flex flex-col">
                        {coverImage ? (
                          <div className="relative h-44 overflow-hidden">
                            <Image
                              src={coverImage}
                              alt={item.title}
                              fill
                              quality={88}
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/30 to-transparent" />
                            {item.year && (
                              <div className="absolute top-0 right-4 flex flex-col items-center">
                                <div className="px-3 py-2 bg-gradient-to-b from-[#C77DFF] to-[#9D4EDD] shadow-xl shadow-[#C77DFF]/40">
                                  <span className="text-xs font-bold text-white">{item.year}</span>
                                </div>
                                <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#9D4EDD]" />
                              </div>
                            )}
                            <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-[#0B1320]/85 backdrop-blur-sm border border-[#C77DFF]/40 flex items-center justify-center">
                              <Trophy className="w-5 h-5 text-[#C77DFF]" />
                            </div>
                            {extraGalleryCount > 0 && (
                              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#0B1320]/85 backdrop-blur-sm border border-white/15">
                                <span className="text-[10px] font-bold text-white">+{extraGalleryCount} photos</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="relative h-44 bg-gradient-to-br from-[#C77DFF]/15 via-[#0B1320] to-[#9D4EDD]/15 flex items-center justify-center">
                            {item.year && (
                              <div className="absolute top-0 right-4 flex flex-col items-center">
                                <div className="px-3 py-2 bg-gradient-to-b from-[#C77DFF] to-[#9D4EDD] shadow-xl shadow-[#C77DFF]/40">
                                  <span className="text-xs font-bold text-white">{item.year}</span>
                                </div>
                                <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#9D4EDD]" />
                              </div>
                            )}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] flex items-center justify-center shadow-xl shadow-[#C77DFF]/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                              <Trophy className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        )}

                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#C77DFF] transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-[#C77DFF] font-semibold mb-3">{item.issuer}</p>
                          {item.description && (
                            <p className="text-[#C9D1D9] text-sm line-clamp-3 mb-3 flex-1">{item.description}</p>
                          )}
                          {item.externalLink && (
                            <a
                              href={item.externalLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-[#C77DFF] font-semibold hover:gap-2.5 transition-all mt-auto pt-3 border-t border-white/10"
                            >
                              View details <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 transition-all duration-500 ease-out">
                  <Award className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <h2 className="text-2xl font-bold text-white hover:text-[#C77DFF] transition-colors">
                  Certifications
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <article
                    key={cert.id}
                    className="group relative animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-2xl blur-sm opacity-[0.06] group-hover:blur-md group-hover:opacity-[0.14] transition-all duration-600 ease-out" />
                    <div className="relative h-full bg-[#0B1320]/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg shadow-[#C77DFF]/[0.05] border border-white/[0.06] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-600 ease-out">
                      {cert.certificateImageUrl && (
                        <div className="relative h-40 overflow-hidden img-hover-shine">
                          <Image
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            src={cert.certificateImageUrl}
                            alt={cert.certificateTitle}
                            fill
                            quality={88}
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-bold text-white group-hover:text-[#C77DFF] transition-colors">
                          {cert.certificateTitle}
                        </h3>
                        <p className="text-[#C77DFF] text-sm font-medium">{cert.issuer}</p>
                        <p className="text-xs text-white/60 mt-1">Issued: {cert.issueDate}</p>
                        {cert.expiryDate && (
                          <p className="text-xs text-white/60">Expires: {cert.expiryDate}</p>
                        )}
                        {cert.credentialId && (
                          <p className="text-xs text-white/60 mt-2 truncate">ID: {cert.credentialId}</p>
                        )}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                          {cert.certificateImageUrl && (
                            <button
                              type="button"
                              onClick={() => handleViewCertificate(cert.certificateImageUrl as string)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C77DFF]/20 text-[#C77DFF] text-xs font-medium hover:bg-[#C77DFF]/30 hover:-translate-y-0.5 transition-all duration-300 group/btn"
                            >
                              <Eye className="w-3 h-3 group-hover/btn:animate-wiggle" />
                              View
                            </button>
                          )}
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B1320]/50 text-[#C9D1D9] text-xs font-medium hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 group/link"
                            >
                              <ExternalLink className="w-3 h-3 group-hover/link:animate-bounce-subtle" />
                              Verify
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === "achievements" && achievements.length === 0 && certifications.length === 0 && (
        <EmptyState
          title="No Achievements Yet"
          body="Achievements and certifications will appear here once they are added and published."
        />
      )}

      <CertificateModal
        isOpen={certModalOpen}
        imageUrl={certModalImage}
        onClose={() => setCertModalOpen(false)}
      />
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="animate-fade-in">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#C77DFF]/10 flex items-center justify-center mb-6">
          <Inbox className="w-10 h-10 text-[#C77DFF]" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-[#C9D1D9] max-w-md">{body}</p>
      </div>
    </section>
  );
}
