import type { Metadata } from "next";
import { ContactPageClient } from "@/components/public/ContactPageClient";
import { JsonLd } from "@/components/common/JsonLd";
import { getContact } from "@/lib/cms/queries";
import { contactPageSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

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
  return (
    <>
      <JsonLd data={contactPageSchema()} />
      <ContactPageClient contact={contact} />
    </>
  );
}
