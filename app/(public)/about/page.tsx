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
import { aboutPageSchemas } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

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

  return (
    <>
      <JsonLd
        data={aboutPageSchemas({
          about,
          socialUrls: contact.socialLinks?.map((s) => s.url) ?? [],
        })}
      />
      <AboutPageClient
        data={{ about, contact, skills, education, experience, certifications }}
      />
    </>
  );
}
