"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Code,
  Quote,
  Award,
  ChevronRight,
  Sparkles,
  Zap,
  Rocket,
  Star,
  CheckCircle2,
  FileText,
  Calendar,
  Clock,
} from "lucide-react";
import { ProjectCardCarousel } from "./ProjectCardCarousel";
import { GithubIcon } from "@/components/common/BrandIcons";
import { ResumeViewerModal } from "@/components/common/ResumeViewerModal";
import { CertificateModal } from "@/components/common/CertificateModal";
import type {
  Achievement,
  Blog,
  Certification,
  Client,
  Education,
  Hero,
  Project,
  Resume,
  Service,
  TechStackCategory,
  Testimonial,
  About,
  ResumeSettings,
} from "@/lib/cms/types";

const TechToolIcon = ({ tool }: { tool: { name: string; logoUrl: string | null } }) => {
  const [imgError, setImgError] = useState(false);
  const showImage = !!tool.logoUrl && !imgError;

  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-xl bg-[#0B1320]/50 border border-white/10 flex items-center justify-center">
        {!showImage && <Code className="w-5 h-5 text-white/60" />}
      </div>
      {showImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className="absolute inset-0 w-10 h-10 rounded-xl object-contain p-1 bg-[#0B1320] border border-white/10 group-hover/item:border-[#C77DFF]/50 transition-colors"
          src={tool.logoUrl as string}
          alt={tool.name}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
};

export type HomeData = {
  hero: Hero;
  about: About;
  services: Service[];
  projects: Project[];
  blogs: Blog[];
  testimonials: Testimonial[];
  clients: Client[];
  achievements: Achievement[];
  certifications: Certification[];
  education: Education[];
  resumes: Resume[];
  resumeSettings: ResumeSettings;
  techStackCategories: TechStackCategory[];
};

export function HomePageClient({ data }: { data: HomeData }) {
  const {
    hero,
    about,
    services,
    projects,
    blogs,
    testimonials,
    clients,
    achievements,
    certifications,
    education,
    resumes,
    resumeSettings,
    techStackCategories,
  } = data;

  const featuredProjects = projects.filter((p) => p.featured);
  const activeResume =
    resumes.find((r) => r.id === resumeSettings.activeResumeId && r.status === "active") ??
    resumes.find((r) => r.status === "active");

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{
    imageUrl: string;
    title: string;
  } | null>(null);

  // Intersection Observer for scroll-reveal animations
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [
    services.length,
    projects.length,
    blogs.length,
    testimonials.length,
    clients.length,
    achievements.length,
    certifications.length,
  ]);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
  };

  const sectionClass = (id: string) =>
    `transition-all duration-1000 ${
      visibleSections.has(id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    }`;

  return (
    <div className="space-y-32">
      {/* ───────── HERO ───────── */}
      <section
        id="hero"
        ref={setSectionRef("hero")}
        className={`relative min-h-[85vh] flex items-center ${sectionClass("hero")}`}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(199,125,255,0.15),transparent_60%)]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(157,78,221,0.1),transparent_60%)]" />
          <div className="absolute top-20 left-[10%] w-4 h-4 rounded-full bg-[#C77DFF]/40 animate-float-slow" />
          <div className="absolute top-40 right-[15%] w-6 h-6 rounded-full bg-[#9D4EDD]/30 animate-float-medium" />
          <div className="absolute bottom-32 left-[20%] w-3 h-3 rounded-full bg-[#C77DFF]/50 animate-float-fast" />
          <div
            className="absolute top-1/3 right-[25%] w-5 h-5 rounded-full bg-[#E0AAFF]/25 animate-float-slow"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-1/4 right-[10%] w-4 h-4 rounded-full bg-[#C77DFF]/35 animate-float-medium"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-[60%] left-[5%] w-3 h-3 rounded-full bg-[#9D4EDD]/40 animate-float-fast"
            style={{ animationDelay: "3s" }}
          />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          <div className="space-y-8 lg:pr-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] animate-slide-up text-white">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] bg-[length:200%_auto] bg-clip-text text-transparent inline pb-2 animate-gradient-x whitespace-nowrap">
                {hero.fullName || about.fullName || "Full Name"}
              </span>
            </h1>

            <p
              className="text-xl text-[#C9D1D9] max-w-xl leading-relaxed animate-slide-up delay-200 hover:text-white transition-colors"
              style={{ animationFillMode: "both" }}
            >
              {hero.subheadline || "Full-stack engineer focused on scalable web platforms."}
            </p>

            <div
              className="flex flex-wrap gap-4 animate-slide-up delay-300"
              style={{ animationFillMode: "both" }}
            >
              <Link
                href={hero.ctaPrimaryHref || "/portfolio"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C77DFF] text-[#0B1320] font-semibold shadow-lg shadow-[#C77DFF]/20 hover:shadow-xl hover:shadow-[#C77DFF]/30 hover:-translate-y-1 transition-all duration-300 group"
              >
                {hero.ctaPrimaryLabel || "View Portfolio"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
              </Link>
              <Link
                href={hero.ctaSecondaryHref || "/contact"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-white/20 text-white font-medium hover:border-[#C77DFF]/50 hover:-translate-y-1 transition-all duration-300"
              >
                {hero.ctaSecondaryLabel || "Contact Me"}
              </Link>
            </div>

            <div
              className="flex gap-8 pt-8 border-t border-white/10 animate-slide-up delay-500"
              style={{ animationFillMode: "both" }}
            >
              <div className="group cursor-default">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  {projects.length}+
                </div>
                <div className="text-sm text-white/60 group-hover:text-[#C77DFF] transition-colors">
                  Projects
                </div>
              </div>
              <div className="group cursor-default">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  {clients.length}+
                </div>
                <div className="text-sm text-white/60 group-hover:text-[#C77DFF] transition-colors">
                  Clients
                </div>
              </div>
              <div className="group cursor-default">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  {certifications.length}+
                </div>
                <div className="text-sm text-white/60 group-hover:text-[#C77DFF] transition-colors">
                  Certifications
                </div>
              </div>
            </div>
          </div>

          {/* Profile image visual with spinning border */}
          <div className="relative hidden lg:flex justify-center items-center lg:pl-8">
            <div className="absolute w-80 h-80 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-20 blur-3xl animate-hero-glow-entrance" />

            <div className="relative animate-hero-entrance">
              {hero.heroImageUrl ? (
                <div className="relative group">
                  <div className="absolute -inset-3 rounded-3xl overflow-hidden">
                    <div
                      className="absolute inset-0 animate-spin-border"
                      style={{
                        background:
                          "conic-gradient(from 0deg, #C77DFF, #9D4EDD, #E0AAFF, #C77DFF, #9D4EDD, #C77DFF)",
                      }}
                    />
                  </div>
                  <div className="absolute -inset-1 bg-[#0B1320] rounded-3xl" />

                  <div className="absolute -inset-4 rounded-3xl overflow-hidden opacity-40 group-hover:opacity-70 transition-opacity">
                    <div
                      className="absolute inset-0 blur-xl animate-reverse-spin"
                      style={{
                        background:
                          "conic-gradient(from 180deg, #C77DFF, transparent, #9D4EDD, transparent, #C77DFF)",
                      }}
                    />
                  </div>

                  <div className="absolute -inset-6 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />

                  <Image
                    className="relative w-80 h-80 rounded-3xl object-cover border-4 border-white/10 shadow-2xl shadow-[#C77DFF]/20 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-[#C77DFF]/50"
                    src={hero.heroImageUrl}
                    alt={hero.fullName || "Profile"}
                    width={320}
                    height={320}
                    priority
                    quality={92}
                    sizes="320px"
                  />
                </div>
              ) : (
                <div className="relative group">
                  <div className="absolute -inset-3 rounded-3xl overflow-hidden">
                    <div
                      className="absolute inset-0 animate-spin-border"
                      style={{
                        background:
                          "conic-gradient(from 0deg, #C77DFF, #9D4EDD, #E0AAFF, #C77DFF, #9D4EDD, #C77DFF)",
                      }}
                    />
                  </div>
                  <div className="absolute -inset-1 bg-[#0B1320] rounded-3xl" />
                  <div className="relative w-80 h-80 rounded-3xl bg-gradient-to-br from-[#1a1f35] to-[#0B1320] border-4 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C77DFF]/10 to-transparent" />
                    <span className="text-7xl font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                      {(hero.fullName || about.fullName || "U")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="absolute -top-6 -right-6 p-4 bg-[#0B1320]/80 backdrop-blur-sm border border-[#C77DFF]/30 rounded-2xl shadow-xl shadow-[#C77DFF]/20 animate-sparkle-entrance-1 animate-sparkle-1 hover:scale-110 hover:border-[#C77DFF]/60 transition-all cursor-pointer">
                <Zap className="w-8 h-8 text-[#C77DFF] drop-shadow-[0_0_8px_rgba(199,125,255,0.5)]" />
              </div>
              <div className="absolute -bottom-6 -left-6 p-4 bg-[#0B1320]/80 backdrop-blur-sm border border-[#C77DFF]/30 rounded-2xl shadow-xl shadow-[#C77DFF]/20 animate-sparkle-entrance-2 animate-sparkle-2 hover:scale-110 hover:border-[#C77DFF]/60 transition-all cursor-pointer">
                <Rocket className="w-8 h-8 text-[#C77DFF] drop-shadow-[0_0_8px_rgba(199,125,255,0.5)]" />
              </div>
              <div className="absolute top-1/2 -right-12 p-3 bg-[#0B1320]/80 backdrop-blur-sm border border-[#9D4EDD]/30 rounded-xl shadow-lg shadow-[#9D4EDD]/20 animate-sparkle-entrance-3 animate-sparkle-3 hover:scale-110 transition-all cursor-pointer">
                <Sparkles className="w-6 h-6 text-[#9D4EDD] drop-shadow-[0_0_8px_rgba(157,78,221,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ABOUT ───────── */}
      <section
        id="about-section"
        ref={setSectionRef("about-section")}
        className={sectionClass("about-section")}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            About{" "}
            <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto animate-fade-in">
            Passionate about creating impactful digital experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="relative group">
            {about.profileImageUrl ? (
              <>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] rounded-3xl opacity-60 blur-sm group-hover:opacity-100 transition-opacity animate-gradient-border" />
                <div className="absolute -inset-4 bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] rounded-3xl blur opacity-25 group-hover:opacity-40 transition-all duration-500" />
                <Image
                  className="relative w-full aspect-square rounded-3xl object-cover shadow-2xl shadow-[#C77DFF]/20 border-2 border-white/10 transition-all duration-500 group-hover:scale-[1.02] group-hover:border-[#C77DFF]/50"
                  src={about.profileImageUrl}
                  alt={about.fullName || "Profile"}
                  width={500}
                  height={500}
                  quality={92}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              </>
            ) : (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] rounded-3xl opacity-40 blur-sm animate-gradient-border" />
                <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-[#1a1f35] to-[#0B1320] border-2 border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C77DFF]/10 to-transparent" />
                  <span className="text-8xl font-bold bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                    {(about.fullName || hero.fullName || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <p className="text-lg text-[#C9D1D9] leading-relaxed hover:text-white transition-colors duration-300">
              {about.bio && about.bio.length > 200 ? `${about.bio.slice(0, 200).trim()}...` : about.bio}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {about.currentRole && (
                <div className="p-4 rounded-2xl bg-[#0B1320]/60 border border-white/10 hover:border-[#C77DFF]/50 transition-all">
                  <div className="text-xs font-semibold text-[#C77DFF] uppercase tracking-wider mb-1">
                    Current Role
                  </div>
                  <div className="font-medium text-white">{about.currentRole}</div>
                </div>
              )}
              {about.researchInterest && (
                <div className="p-4 rounded-2xl bg-[#0B1320]/60 border border-white/10 hover:border-[#C77DFF]/50 transition-all">
                  <div className="text-xs font-semibold text-[#C77DFF] uppercase tracking-wider mb-1">
                    Research Interest
                  </div>
                  <div className="font-medium text-white">{about.researchInterest}</div>
                </div>
              )}
            </div>

            {education.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0B1320]/60 border border-white/10 hover:border-[#C77DFF]/30 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] flex items-center justify-center shadow-lg shadow-[#C77DFF]/20">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-white">Education</div>
                </div>
                <div className="text-[#C9D1D9]">
                  {education[0].degree}
                  {education[0].field ? ` in ${education[0].field}` : ""}
                </div>
                <div className="text-sm text-white/60">
                  {education[0].institution} •{" "}
                  {education[0].endDate
                    ? new Date(education[0].endDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </div>
                {education[0].grade && (
                  <div className="text-sm text-white/60 mt-1">
                    <span className="text-[#C77DFF]">Grade:</span> {education[0].grade}
                  </div>
                )}
              </div>
            )}

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 mt-4 rounded-xl bg-[#C77DFF] text-[#0B1320] font-semibold shadow-lg shadow-[#C77DFF]/30 hover:shadow-xl hover:shadow-[#C77DFF]/50 hover:-translate-y-1 transition-all duration-300 group"
            >
              <span>Learn More About Me</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── TECH STACK ───────── */}
      {techStackCategories.length > 0 && (
        <section id="skills" ref={setSectionRef("skills")} className={sectionClass("skills")}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Tech Stack &{" "}
              <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Tools
              </span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">
              Technologies I work with to bring ideas to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStackCategories.map((category, catIndex) => (
              <div
                key={category.id}
                className="group p-6 rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out hover:-translate-y-1"
                style={{ animationDelay: `${catIndex * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-white mb-6 pb-4 border-b border-white/10">
                  {category.categoryName}
                </h3>
                <div className="space-y-4">
                  {(category.tools ?? []).map((tool) => (
                    <div key={tool.id} className="flex items-center gap-4 group/item">
                      <TechToolIcon tool={tool} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#C9D1D9]">{tool.name}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#0B1320]/50 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] transition-all duration-1000 ease-out progress-bar"
                            style={{ width: `${tool.proficiencyLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───────── SERVICES ───────── */}
      {services.length > 0 && (
        <section
          id="services-section"
          ref={setSectionRef("services-section")}
          className={sectionClass("services-section")}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C77DFF]/10 border border-[#C77DFF]/20 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C77DFF]" />
              <span className="text-xs font-semibold text-[#C77DFF] uppercase tracking-wider">What I Offer</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              My{" "}
              <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">End-to-end solutions tailored to your goals</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, index) => (
              <article
                key={service.id}
                className="group relative rounded-3xl bg-[#0B1320]/85 backdrop-blur-sm border border-white/[0.08] shadow-xl shadow-[#C77DFF]/[0.08] overflow-hidden hover:shadow-2xl hover:shadow-[#C77DFF]/[0.25] hover:border-[#C77DFF]/40 hover:-translate-y-2 transition-all duration-500 ease-out animate-fade-in flex flex-col"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {service.imageUrl ? (
                  <div className="relative w-full h-56 overflow-hidden">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      quality={88}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/40 to-transparent" />
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#0B1320]/85 backdrop-blur-md border border-[#C77DFF]/30 shadow-lg">
                      <span className="text-[11px] font-bold text-[#C77DFF]">0{index + 1}</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-56 bg-gradient-to-br from-[#C77DFF]/20 via-[#0B1320] to-[#9D4EDD]/20 flex items-center justify-center overflow-hidden border-b border-white/5">
                    {/* Animated decorative blobs */}
                    <div className="absolute inset-0 opacity-60">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#C77DFF]/30 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#9D4EDD]/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
                    </div>
                    {/* Spinning ring */}
                    <div
                      className="absolute w-32 h-32 rounded-full opacity-50"
                      style={{
                        background: "conic-gradient(from 0deg, #C77DFF, transparent, #9D4EDD, transparent, #C77DFF)",
                        animation: "spin 8s linear infinite",
                      }}
                    />
                    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] flex items-center justify-center shadow-2xl shadow-[#C77DFF]/40 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#0B1320]/85 backdrop-blur-md border border-[#C77DFF]/30 shadow-lg">
                      <span className="text-[11px] font-bold text-[#C77DFF]">0{index + 1}</span>
                    </div>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#C77DFF] transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-[#C9D1D9] leading-relaxed line-clamp-3 mb-5 flex-1">{service.summary}</p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#C77DFF] group-hover:gap-3 transition-all pt-3 border-t border-white/10 mt-auto"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {services.length > 6 && (
            <div className="mt-10 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#C77DFF]/40 text-[#C77DFF] font-semibold hover:bg-[#C77DFF]/10 hover:border-[#C77DFF] transition-all"
              >
                View All Services <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ───────── FEATURED PROJECTS ───────── */}
      {featuredProjects.length > 0 && (
        <section
          id="projects-section"
          ref={setSectionRef("projects-section")}
          className={sectionClass("projects-section")}
        >
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                Featured{" "}
                <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
              <p className="text-[#C9D1D9]">Some of my best work</p>
            </div>
            <Link
              href="/portfolio"
              className="hidden sm:flex items-center gap-2 text-[#C77DFF] font-medium hover:gap-3 transition-all"
            >
              View All <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredProjects.slice(0, 4).map((project, idx) => {
              const gallery = project.galleryImages ?? [];
              const allImages = project.coverImageUrl
                ? [project.coverImageUrl, ...gallery]
                : gallery;
              return (
                <article
                  key={project.id}
                  className="group relative rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] overflow-hidden hover:shadow-xl hover:shadow-[#C77DFF]/[0.15] hover:border-white/[0.12] hover:-translate-y-1 transition-all duration-600 ease-out animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Cover image / carousel */}
                  <div className="relative h-72 overflow-hidden">
                    {allImages.length > 0 ? (
                      <ProjectCardCarousel
                        images={allImages}
                        alt={project.title}
                        priority={idx < 2}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#C77DFF]/20 via-[#0B1320] to-[#9D4EDD]/20 flex items-center justify-center">
                        <Code className="w-16 h-16 text-[#C77DFF]/50" />
                      </div>
                    )}

                    {/* Soft bottom-only shadow so action buttons stay readable
                        without darkening the rest of the cover image */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1320]/85 to-transparent pointer-events-none z-10" />

                    {/* Code + Live Demo
                        Touch (< 1024px): always visible
                        Desktop (>= 1024px): hidden by default, revealed on card hover.
                        Logic lives in globals.css `.project-actions` — Tailwind v4
                        variant-chaining lg:group-hover: doesn't reliably emit CSS. */}
                    <div className="project-actions absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#0B1320] text-sm font-semibold shadow-lg hover:scale-105 transition-transform"
                        >
                          <GithubIcon className="w-4 h-4" /> Code
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] text-white text-sm font-semibold shadow-lg shadow-[#C77DFF]/40 hover:scale-105 transition-transform"
                        >
                          <ExternalLink className="w-4 h-4" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#C77DFF] transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-[#C9D1D9] line-clamp-2 text-sm leading-relaxed">
                      {project.summary}
                    </p>

                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-full bg-[#C77DFF]/10 border border-[#C77DFF]/25 text-[10px] font-semibold text-[#C77DFF] uppercase tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 5 && (
                          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60">
                            +{project.techStack.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C77DFF] hover:gap-2.5 transition-all"
                    >
                      View Case Study <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#C77DFF] text-[#C77DFF] font-semibold hover:bg-[#C77DFF] hover:text-white transition-all"
            >
              View All Projects <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      {/* ───────── BLOG ───────── */}
      {blogs.length > 0 && (
        <section
          id="blog-section"
          ref={setSectionRef("blog-section")}
          className={sectionClass("blog-section")}
        >
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-white">
                Latest{" "}
                <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                  Blog Posts
                </span>
              </h2>
              <p className="text-[#C9D1D9]">Thoughts, tutorials, and insights</p>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-2 text-[#C77DFF] font-medium hover:gap-3 transition-all"
            >
              Read More <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((post, idx) => (
              <article
                key={post.id}
                className="group rounded-3xl bg-[#0B1320]/85 backdrop-blur-sm border border-white/[0.08] shadow-xl shadow-[#C77DFF]/[0.08] overflow-hidden hover:shadow-2xl hover:shadow-[#C77DFF]/[0.25] hover:border-[#C77DFF]/40 hover:-translate-y-2 transition-all duration-500 ease-out animate-fade-in flex flex-col"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Header — always renders, 208px tall */}
                {post.coverImageUrl ? (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block w-full h-52 overflow-hidden"
                  >
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/30 to-transparent" />
                    {post.readTime ? (
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0B1320]/85 backdrop-blur-md border border-white/20">
                        <Clock className="w-3 h-3 text-[#C77DFF]" />
                        <span className="text-[10px] font-bold text-white">{post.readTime} min read</span>
                      </div>
                    ) : null}
                    {/* Article badge */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] shadow-lg">
                      <FileText className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Article</span>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative block w-full h-52 bg-gradient-to-br from-[#9D4EDD]/25 via-[#0B1320] to-[#C77DFF]/25 overflow-hidden border-b border-white/10"
                  >
                    {/* Decorative animated blobs */}
                    <div className="absolute inset-0 opacity-60">
                      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#C77DFF]/30 rounded-full blur-3xl animate-pulse" />
                      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[#9D4EDD]/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
                    </div>
                    {/* Left accent bar */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#C77DFF] to-[#9D4EDD]" />
                    {/* Large quote mark */}
                    <div className="relative h-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] flex items-center justify-center shadow-2xl shadow-[#C77DFF]/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Quote className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    {/* Article badge */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] shadow-lg">
                      <FileText className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Article</span>
                    </div>
                    {post.readTime ? (
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0B1320]/85 backdrop-blur-md border border-white/20">
                        <Clock className="w-3 h-3 text-[#C77DFF]" />
                        <span className="text-[10px] font-bold text-white">{post.readTime} min read</span>
                      </div>
                    ) : null}
                  </Link>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full bg-[#C77DFF]/10 border border-[#C77DFF]/25 text-[10px] font-semibold text-[#C77DFF] uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#C77DFF] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </Link>
                  {post.excerpt && (
                    <p className="text-[#C9D1D9] text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                    {post.publishedDate ? (
                      <span className="inline-flex items-center gap-1 text-xs text-white/50">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    ) : <span />}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-[#C77DFF] text-sm font-semibold group-hover:gap-2 transition-all"
                    >
                      Read more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ───────── TESTIMONIALS ───────── */}
      {testimonials.length > 0 && (
        <section
          id="testimonials-section"
          ref={setSectionRef("testimonials-section")}
          className={sectionClass("testimonials-section")}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Client{" "}
              <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Testimonials
              </span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">What people say about working with me</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((item, idx) => (
              <blockquote
                key={item.id}
                className="group relative p-8 pt-20 rounded-3xl bg-gradient-to-br from-[#1a1f35]/80 via-[#0B1320]/90 to-[#0B1320] backdrop-blur-sm border border-white/[0.1] shadow-xl shadow-[#C77DFF]/[0.08] hover:shadow-2xl hover:shadow-[#C77DFF]/[0.22] hover:border-[#C77DFF]/40 hover:-translate-y-2 transition-all duration-500 ease-out animate-fade-in flex flex-col overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Decorative quote — HUGE, gradient, top-right */}
                <div className="absolute -top-6 -right-2 text-[180px] font-serif leading-none text-transparent bg-gradient-to-br from-[#C77DFF]/30 to-[#9D4EDD]/10 bg-clip-text select-none pointer-events-none">
                  &ldquo;
                </div>

                {/* Animated glow on hover */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#C77DFF]/20 to-transparent rounded-full -translate-y-16 -translate-x-16 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Star rating — uses item.rating from admin; defaults to 5 */}
                {(() => {
                  const rating =
                    typeof item.rating === "number" && item.rating > 0 ? item.rating : 5;
                  const clamped = Math.max(1, Math.min(5, rating));
                  return (
                    <div className="relative flex items-center gap-0.5 mb-5">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          fill={i < Math.floor(clamped) ? "#FFB800" : "transparent"}
                          stroke="#FFB800"
                          strokeWidth={1.5}
                          className="w-4 h-4 drop-shadow-[0_0_4px_rgba(255,184,0,0.5)]"
                        />
                      ))}
                      <span className="ml-2 text-xs font-semibold text-white/60">
                        {clamped.toFixed(1)}
                      </span>
                    </div>
                  );
                })()}

                <p className="relative text-base text-white leading-relaxed mb-6 flex-1 font-medium">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <footer className="relative flex items-center gap-4 pt-5 border-t border-white/10">
                  {item.avatarUrl ? (
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] opacity-80 blur-sm" />
                      <Image
                        src={item.avatarUrl}
                        alt={item.author}
                        width={56}
                        height={56}
                        quality={88}
                        sizes="56px"
                        className="relative w-14 h-14 rounded-full object-cover border-2 border-[#0B1320]"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] border-2 border-[#0B1320] flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex-shrink-0">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] opacity-80 blur-sm" />
                      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] flex items-center justify-center text-white font-bold text-xl border-2 border-[#0B1320] shadow-lg">
                        {item.author?.charAt(0).toUpperCase() ?? "A"}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] border-2 border-[#0B1320] flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate text-base">{item.author}</div>
                    {(item.role || item.company) ? (
                      <div className="text-xs text-[#C77DFF] truncate font-medium mt-0.5">
                        {item.role}
                        {item.role && item.company && <span className="text-white/40 mx-1.5">·</span>}
                        {item.company && <span className="text-[#C9D1D9]">{item.company}</span>}
                      </div>
                    ) : (
                      <div className="text-xs text-[#C9D1D9]/60 mt-0.5">Verified Client</div>
                    )}
                    {item.projectName ? (
                      <div className="text-[10px] text-white/40 truncate mt-1">
                        ↳ {item.projectName}
                      </div>
                    ) : null}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* ───────── CLIENTS ───────── */}
      {clients.length > 0 && (
        <section
          id="clients-section"
          ref={setSectionRef("clients-section")}
          className={sectionClass("clients-section")}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Trusted{" "}
              <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Clients
              </span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">
              Companies I&apos;ve had the pleasure to work with
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {clients.map((client, index) => {
              const initials = (client.name ?? "")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const content = (
                <div
                  className={`group relative p-6 rounded-2xl bg-[#0B1320]/80 backdrop-blur-sm border shadow-lg hover:shadow-xl hover:shadow-[#C77DFF]/[0.15] transition-all duration-500 ease-out flex flex-col items-center justify-center h-48 hover:-translate-y-2 overflow-hidden ${
                    client.featured
                      ? "border-[#C77DFF]/30 shadow-[#C77DFF]/[0.1]"
                      : "border-white/[0.06] shadow-[#C77DFF]/[0.05] hover:border-[#C77DFF]/30"
                  }`}
                >
                  {client.featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[#C77DFF]/20 border border-[#C77DFF]/30">
                      <span className="text-[10px] font-semibold text-[#C77DFF] uppercase tracking-wider">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-br from-[#C77DFF]/0 to-[#9D4EDD]/0 group-hover:from-[#C77DFF]/5 group-hover:to-[#9D4EDD]/10 transition-all duration-500" />

                  {client.logoUrl ? (
                    <Image
                      className="max-h-14 w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                      src={client.logoUrl}
                      alt={`${client.name} logo`}
                      width={200}
                      height={80}
                      quality={90}
                      sizes="200px"
                    />
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#C77DFF]/20 to-[#9D4EDD]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150" />
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C77DFF]/10 to-[#9D4EDD]/5 border border-[#C77DFF]/20 flex items-center justify-center group-hover:border-[#C77DFF]/50 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-[#C77DFF]/10 group-hover:shadow-[#C77DFF]/30">
                        <span className="text-2xl font-bold bg-gradient-to-br from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent drop-shadow-sm">
                          {initials}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-base font-semibold text-white/90 group-hover:text-white transition-colors duration-300 text-center tracking-wide">
                    {client.name}
                  </div>

                  {client.industry && (
                    <div className="mt-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#C77DFF]/10 to-[#9D4EDD]/10 border border-[#C77DFF]/20 group-hover:border-[#C77DFF]/40 transition-all duration-300">
                      <span className="text-xs font-medium text-[#C77DFF]/80 group-hover:text-[#C77DFF] transition-colors">
                        {client.industry}
                      </span>
                    </div>
                  )}

                  {client.projectDuration && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-[#C77DFF]/50" />
                      <span>{client.projectDuration}</span>
                    </div>
                  )}

                  {client.websiteUrl && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ExternalLink className="w-4 h-4 text-[#C77DFF]" />
                    </div>
                  )}
                </div>
              );

              if (client.websiteUrl) {
                return (
                  <a
                    key={client.id}
                    href={client.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <div
                  key={client.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ───────── ACHIEVEMENTS ───────── */}
      {achievements.length > 0 && (
        <section
          id="achievements-section"
          ref={setSectionRef("achievements-section")}
          className={sectionClass("achievements-section")}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Awards &{" "}
              <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Achievements
              </span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">Recognition and milestones</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.slice(0, 6).map((item, idx) => {
              const coverImage = item.certificateImageUrl || item.galleryImages?.[0];
              const extraGalleryCount = (item.galleryImages?.length ?? 0) - (item.certificateImageUrl ? 0 : 1);
              return (
                <article
                  key={item.id}
                  className="group rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-2xl hover:shadow-[#C77DFF]/[0.20] hover:border-[#C77DFF]/30 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {coverImage ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={coverImage}
                        alt={item.title}
                        fill
                        quality={88}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/20 to-transparent" />

                      {/* Year ribbon */}
                      {item.year && (
                        <div className="absolute top-0 right-4 flex flex-col items-center">
                          <div className="px-3 py-2 bg-gradient-to-b from-[#C77DFF] to-[#9D4EDD] shadow-xl shadow-[#C77DFF]/40">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{item.year}</span>
                          </div>
                          <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#9D4EDD]" />
                        </div>
                      )}

                      {/* Award icon overlay */}
                      <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-[#0B1320]/85 backdrop-blur-sm border border-[#C77DFF]/40 flex items-center justify-center shadow-lg">
                        <Award className="w-6 h-6 text-[#C77DFF]" />
                      </div>

                      {/* Gallery count */}
                      {extraGalleryCount > 0 && (
                        <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-[#0B1320]/85 backdrop-blur-sm border border-white/15">
                          <span className="text-[10px] font-bold text-white">+{extraGalleryCount} photos</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full h-48 bg-gradient-to-br from-[#C77DFF]/15 via-[#0B1320] to-[#9D4EDD]/15 flex items-center justify-center overflow-hidden">
                      {item.year && (
                        <div className="absolute top-0 right-4 flex flex-col items-center">
                          <div className="px-3 py-2 bg-gradient-to-b from-[#C77DFF] to-[#9D4EDD] shadow-xl shadow-[#C77DFF]/40">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{item.year}</span>
                          </div>
                          <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-t-[10px] border-l-transparent border-r-transparent border-t-[#9D4EDD]" />
                        </div>
                      )}
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] flex items-center justify-center shadow-xl shadow-[#C77DFF]/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#C77DFF] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-sm text-[#C77DFF] font-semibold mb-3">{item.issuer}</div>
                    <p className="text-sm text-[#C9D1D9] line-clamp-3 mb-4">{item.description}</p>
                    {item.externalLink && (
                      <a
                        className="inline-flex items-center gap-1.5 text-[#C77DFF] text-sm font-semibold hover:gap-2.5 transition-all"
                        href={item.externalLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View details <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ───────── CERTIFICATIONS ───────── */}
      {certifications.length > 0 && (
        <section
          id="certifications-section"
          ref={setSectionRef("certifications-section")}
          className={sectionClass("certifications-section")}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Professional{" "}
              <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
                Certifications
              </span>
            </h2>
            <p className="text-[#C9D1D9] max-w-2xl mx-auto">Verified skills and expertise</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <article
                key={cert.id}
                className="group p-6 rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out hover:-translate-y-1"
              >
                <div className="flex items-start gap-5">
                  {cert.certificateImageUrl ? (
                    <Image
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-[#C77DFF]/50 transition-colors"
                      src={cert.certificateImageUrl}
                      alt={cert.certificateTitle}
                      width={64}
                      height={64}
                      quality={88}
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C77DFF]/20 to-[#9D4EDD]/20 flex items-center justify-center">
                      <Award className="w-8 h-8 text-[#C77DFF]" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-white group-hover:text-[#C77DFF] transition-colors">
                      {cert.certificateTitle}
                    </h3>
                    <div className="text-sm text-[#C77DFF] font-medium">{cert.issuer}</div>
                    <div className="text-xs text-white/60">
                      Issued: {cert.issueDate}
                      {cert.expiryDate ? ` • Expires: ${cert.expiryDate}` : ""}
                    </div>
                    {cert.credentialId && (
                      <div className="text-xs text-white/60">ID: {cert.credentialId}</div>
                    )}
                    <div className="flex gap-3 pt-2">
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-[#C77DFF] font-medium hover:gap-2 transition-all"
                        >
                          Verify <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {(cert.certificateImageUrl || cert.certificateFileUrl) && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCertificate({
                              imageUrl: (cert.certificateImageUrl ||
                                cert.certificateFileUrl) as string,
                              title: cert.certificateTitle,
                            })
                          }
                          className="inline-flex items-center gap-1 text-sm text-[#C9D1D9] hover:text-[#C77DFF] font-medium transition-colors"
                        >
                          View Certificate <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ───────── RESUME CTA ───────── */}
      {activeResume && (
        <section
          id="resume-section"
          ref={setSectionRef("resume-section")}
          className={`${sectionClass("resume-section")} -mx-4 sm:-mx-6 lg:-mx-8 px-0`}
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1320] via-[#0B1320]/80 to-[#0B1320] py-16 sm:py-20 lg:py-24 text-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#C77DFF] rounded-full opacity-10 blur-3xl animate-morph floating" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C77DFF] rounded-full opacity-5 blur-3xl animate-pulse-glow" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-slide-up">
                Want to know more?
              </h2>
              <p
                className="text-[#C9D1D9] text-lg sm:text-xl max-w-xl mx-auto mb-8 animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                Download my resume to see my full experience, education, and skills
              </p>

              <div
                className="flex flex-wrap justify-center gap-4 animate-slide-up"
                style={{ animationDelay: "400ms" }}
              >
                <button
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#C77DFF] text-[#0B1320] font-semibold shadow-xl shadow-[#C77DFF]/30 hover:shadow-2xl hover:shadow-[#C77DFF]/40 hover:-translate-y-1 hover:scale-105 transition-all duration-300 group"
                  type="button"
                  onClick={() => setIsResumeOpen(true)}
                >
                  View Resume
                  <ExternalLink className="w-5 h-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <ResumeViewerModal
        isOpen={isResumeOpen}
        previewUrl={activeResume?.fileUrl}
        onClose={() => setIsResumeOpen(false)}
      />

      <CertificateModal
        isOpen={!!selectedCertificate}
        imageUrl={selectedCertificate?.imageUrl}
        title={selectedCertificate?.title}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}
