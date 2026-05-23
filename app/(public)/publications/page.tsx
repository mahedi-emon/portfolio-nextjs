import type { Metadata } from "next";
import { ExternalLink, FileText } from "lucide-react";
import { JsonLd } from "@/components/common/JsonLd";
import { getPublications } from "@/lib/cms/queries";
import { publicationsPageSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    page: "publications",
    title: "Publications & Research",
    description:
      "Research papers and academic publications by Mahedi Hasan Emon in NLP, BanglaBERT, document classification, and software engineering.",
    path: "/publications",
  });
}

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <>
      <JsonLd data={publicationsPageSchema(publications)} />

      <div className="space-y-12 pb-16">
        <section className="text-center pt-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white animate-fade-in">
            Publications &{" "}
            <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
              Research
            </span>
          </h1>
          <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
            Peer-reviewed research and academic contributions.
          </p>
        </section>

        {publications.length === 0 ? (
          <p className="text-center text-[#C9D1D9]/60">No publications yet.</p>
        ) : (
          <div className="space-y-5">
            {publications.map((pub, i) => (
              <article
                key={pub.id}
                className="group rounded-2xl border border-white/10 bg-[#0B1320]/80 backdrop-blur-sm p-6 hover:border-[#C77DFF]/40 hover:-translate-y-0.5 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#C77DFF]/15 text-[#C77DFF]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold leading-tight text-white group-hover:text-[#C77DFF] transition-colors">
                      {pub.title}
                    </h3>
                    {pub.authors && pub.authors.length > 0 && (
                      <p className="mt-1 text-sm text-[#C9D1D9]">{pub.authors.join(", ")}</p>
                    )}
                    <p className="mt-2 text-xs font-medium uppercase tracking-wider text-[#C77DFF]">
                      {pub.venue} · {pub.year}
                    </p>
                    {pub.abstract && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#C9D1D9]">
                        {pub.abstract}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {pub.paperUrl && (
                        <a
                          href={pub.paperUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C77DFF] hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Paper
                        </a>
                      )}
                      {pub.pdfUrl && (
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C77DFF] hover:underline"
                        >
                          <FileText className="h-3.5 w-3.5" /> PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
