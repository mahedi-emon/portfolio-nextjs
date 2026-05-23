import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Briefcase, Award, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/common/JsonLd";
import {
  getAbout,
  getCertifications,
  getContact,
  getEducation,
  getExperience,
  getSkills,
} from "@/lib/cms/queries";
import { aboutPageSchemas } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout();
  return buildMetadata({
    page: "about",
    title: `About ${about.fullName || "Mahedi Hasan Emon"}`,
    description:
      about.tagline ||
      "Get to know Mahedi Hasan Emon — Full-Stack Software Engineer skilled in React, Next.js, Django, ML/NLP, and DevOps.",
    path: "/about",
    image: about.profileImageUrl || undefined,
    type: "profile",
  });
}

export default async function AboutPage() {
  const [about, contact, education, experience, skills, certifications] = await Promise.all([
    getAbout(),
    getContact(),
    getEducation(),
    getExperience(),
    getSkills(),
    getCertifications(),
  ]);

  return (
    <>
      <JsonLd
        data={aboutPageSchemas({
          about,
          socialUrls: contact.socialLinks?.map((s) => s.url) ?? [],
        })}
      />

      <div className="space-y-20 pb-16">
        {/* Hero */}
        <section className="text-center pt-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white animate-fade-in">
            About{" "}
            <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              Me
            </span>
          </h1>
          {about.tagline && (
            <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
              {about.tagline}
            </p>
          )}
        </section>

        {/* Profile + Bio */}
        <section className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          {about.profileImageUrl && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] rounded-3xl opacity-60 blur-sm group-hover:opacity-100 transition-opacity animate-gradient-border" />
              <div className="absolute -inset-4 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur opacity-25 group-hover:opacity-40 transition-all duration-500" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.profileImageUrl}
                alt={about.fullName}
                className="relative w-full aspect-square rounded-3xl object-cover shadow-2xl shadow-[#C77DFF]/20 border-2 border-white/10 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-[#C77DFF]/50"
              />
            </div>
          )}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">{about.fullName}</h2>
            {about.currentRole && (
              <p className="text-sm font-medium uppercase tracking-wider text-[#C77DFF]">
                {about.currentRole}
              </p>
            )}
            {about.bio && (
              <div
                className="prose prose-invert max-w-none text-base leading-relaxed text-[#C9D1D9] [&>p]:mb-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(about.bio) }}
              />
            )}
            {about.researchInterest && (
              <div className="rounded-xl border border-[#C77DFF]/20 bg-[#C77DFF]/[0.05] p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#C77DFF]">
                  Research Interest
                </h3>
                <p className="text-sm text-[#C9D1D9]">{about.researchInterest}</p>
              </div>
            )}
          </div>
        </section>

        {/* Skills */}
        {skills.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Core{" "}
              <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Skills
              </span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((skill, i) => (
                <div
                  key={skill.id}
                  className="rounded-xl border border-white/10 bg-[#0B1320]/60 p-4 backdrop-blur-sm hover:border-[#C77DFF]/30 transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-white">{skill.name}</span>
                    <span className="text-xs text-[#C77DFF]">{skill.level}/5</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] progress-bar"
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Work{" "}
              <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            <div className="space-y-5">
              {experience.map((exp, i) => (
                <div
                  key={exp.id}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-[#0B1320]/60 p-6 hover:border-[#C77DFF]/40 transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#C77DFF]/15 text-[#C77DFF]">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                    <p className="text-sm text-[#C77DFF]">{exp.company}</p>
                    <p className="mt-1 text-xs text-[#C9D1D9]/60">
                      {exp.startDate ?? ""} — {exp.endDate ?? "Present"}
                    </p>
                    {exp.description && (
                      <div
                        className="mt-3 text-sm leading-relaxed text-[#C9D1D9]"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(exp.description) }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Education{" "}
            </h2>
            <div className="space-y-5">
              {education.map((edu, i) => (
                <div
                  key={edu.id}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-[#0B1320]/60 p-6 hover:border-[#C77DFF]/40 transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#C77DFF]/15 text-[#C77DFF]">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {edu.degree}
                      {edu.field ? `, ${edu.field}` : ""}
                    </h3>
                    <p className="text-sm text-[#C77DFF]">{edu.institution}</p>
                    <p className="mt-1 text-xs text-[#C9D1D9]/60">
                      {edu.startDate ?? ""} — {edu.endDate ?? "Present"}
                      {edu.grade ? ` · ${edu.grade}` : ""}
                    </p>
                    {edu.description && (
                      <p className="mt-2 text-sm text-[#C9D1D9]">{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Certifications</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert, i) => (
                <div
                  key={cert.id}
                  className="flex gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 p-4 hover:border-[#C77DFF]/40 transition-all animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <Award className="h-5 w-5 flex-shrink-0 text-[#C77DFF]" />
                  <div className="min-w-0">
                    <h4 className="truncate font-semibold text-white">{cert.certificateTitle}</h4>
                    <p className="truncate text-xs text-[#C9D1D9]/70">{cert.issuer}</p>
                    {cert.issueDate && (
                      <p className="text-[11px] text-[#C9D1D9]/50">{cert.issueDate}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="text-center pt-8">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C77DFF] text-[#0B1320] font-semibold shadow-lg shadow-[#C77DFF]/30 hover:shadow-xl hover:shadow-[#C77DFF]/50 hover:-translate-y-1 transition-all duration-300 group"
          >
            <span>Let&apos;s Work Together</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </div>
    </>
  );
}
