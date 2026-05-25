import type { Metadata } from "next";
import { ServicesPageClient } from "@/components/public/ServicesPageClient";
import { JsonLd } from "@/components/common/JsonLd";
import { getServices } from "@/lib/cms/queries";
import { servicesPageSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    page: "services",
    title: "Web Development Services",
    description:
      "Professional services by Mahedi Hasan Emon — full-stack web development with React, Next.js, Django, applied ML/NLP, REST APIs, and cloud deployment.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <JsonLd data={servicesPageSchema(services)} />
      <ServicesPageClient services={services} />
    </>
  );
}
