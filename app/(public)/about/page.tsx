import type { Metadata } from "next";
import { AboutPageClient } from "@/components/public/AboutPageClient";
import { JsonLd } from "@/components/common/JsonLd";
import {
  getAbout,
  getCertifications,
  getContact,
  getEducation,
  getExperience,
  getSkills,
} from "@/lib/cms/queries";
import { aboutPageSchemas, breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/keywords";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout();
  return buildMetadata({
    page: "about",
    title: `About ${about.fullName || "Mahedi Hasan Emon"} — Skills, Experience & Education`,
    description:
      about.tagline ||
      `Learn about ${about.fullName || "Mahedi Hasan Emon"} — Full-Stack Software Engineer. Skills, professional experience, education, certifications.`,
    path: "/about",
    image: about.profileImageUrl || undefined,
    type: "profile",
  });
}

export default async function AboutPage() {
  const [about, contact, skills, education, experience, certifications] = await Promise.all([
    getAbout(),
    getContact(),
    getSkills(),
    getEducation(),
    getExperience(),
    getCertifications(),
  ]);

  const schemas = [
    ...aboutPageSchemas({
      about,
      socialUrls: contact.socialLinks?.map((s) => s.url) ?? [],
    }),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "About", url: `${SITE_URL}/about` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <AboutPageClient
        data={{ about, contact, skills, education, experience, certifications }}
      />
    </>
  );
}
