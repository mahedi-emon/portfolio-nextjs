import type { Metadata } from "next";
import { HomePageClient } from "@/components/public/HomePageClient";
import { JsonLd } from "@/components/common/JsonLd";
import {
  getAbout,
  getAchievements,
  getBlogs,
  getCertifications,
  getClients,
  getContact,
  getEducation,
  getHero,
  getProjects,
  getResumeSettings,
  getResumes,
  getServices,
  getTechStackCategories,
  getTestimonials,
} from "@/lib/cms/queries";
import { homePageSchemas } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getHero();
  const title = `${hero.fullName || "Mahedi Hasan Emon"} — Full-Stack Developer & Portfolio`;
  const description =
    hero.subheadline ||
    hero.headline ||
    "Full-Stack Developer specializing in scalable web platforms, React, Next.js, Django, and applied ML/NLP.";
  return buildMetadata({
    page: "home",
    title,
    description,
    path: "/",
    image: hero.heroImageUrl || undefined,
  });
}

export default async function HomePage() {
  const [
    hero,
    about,
    contact,
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
  ] = await Promise.all([
    getHero(),
    getAbout(),
    getContact(),
    getServices(),
    getProjects(),
    getBlogs({ limit: 3 }), // home shows only 3
    getTestimonials(),
    getClients(),
    getAchievements(),
    getCertifications(),
    getEducation(),
    getResumes(),
    getResumeSettings(),
    getTechStackCategories(),
  ]);

  return (
    <>
      <JsonLd
        data={homePageSchemas({
          hero,
          about,
          socialUrls: contact.socialLinks?.map((s) => s.url) ?? [],
        })}
      />
      <HomePageClient
        data={{
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
        }}
      />
    </>
  );
}
