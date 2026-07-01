import type { Metadata } from "next";
import { ContactPageClient } from "@/components/public/ContactPageClient";
import { JsonLd } from "@/components/common/JsonLd";
import { getContact } from "@/lib/cms/queries";
import { contactPageSchema, breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/keywords";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    page: "contact",
    title: "Contact Me",
    description:
      "Get in touch with Mahedi Hasan Emon for freelance work, collaborations, or project inquiries.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const contact = await getContact();

  const schemas = [
    contactPageSchema(),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Contact", url: `${SITE_URL}/contact` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <ContactPageClient contact={contact} />
    </>
  );
}
