import type { Metadata } from "next";
import { PortfolioPageClient } from "@/components/public/PortfolioPageClient";
import { JsonLd } from "@/components/common/JsonLd";
import {
  getAchievements,
  getCertifications,
  getProjects,
  getPublications,
} from "@/lib/cms/queries";
import { portfolioPageSchemas } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    page: "portfolio",
    title: "Portfolio — Projects & Achievements | Mahedi Hasan Emon",
    description:
      "Browse the portfolio of Mahedi Hasan Emon — featured projects, case studies, publications, achievements, and professional certifications in web development.",
    path: "/portfolio",
  });
}

export default async function PortfolioPage() {
  const [projects, publications, achievements, certifications] = await Promise.all([
    getProjects(),
    getPublications(),
    getAchievements(),
    getCertifications(),
  ]);

  return (
    <>
      <JsonLd data={portfolioPageSchemas(projects)} />
      <PortfolioPageClient
        data={{ projects, publications, achievements, certifications }}
      />
    </>
  );
}
