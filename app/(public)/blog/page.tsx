import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Quote, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/common/JsonLd";
import { getBlogs } from "@/lib/cms/queries";
import { blogListSchema, breadcrumbSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/keywords";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    page: "blog",
    title: "Blog — Articles & Tutorials",
    description:
      "In-depth articles on web development, React, Next.js, Django, ML/NLP, and DevOps by Mahedi Hasan Emon.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  const schemas = [
    blogListSchema(blogs),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />

      <div className="space-y-16 pb-16">
        <section className="relative pt-8 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] rounded-full opacity-10 blur-3xl animate-morph floating-delayed" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B1320]/60 border border-white/10 mb-6 animate-slide-in-left">
            <Sparkles className="w-4 h-4 text-[#C77DFF] animate-spin-slow" />
            <span className="text-sm font-medium text-[#C77DFF]">Insights & Tutorials</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white animate-fade-in">
            Latest{" "}
            <span className="bg-gradient-to-r from-[#C77DFF] via-[#E0AAFF] to-[#9D4EDD] bg-clip-text text-transparent text-shimmer">
              Articles
            </span>
          </h1>
          <p className="text-lg text-[#C9D1D9] max-w-2xl mx-auto animate-slide-up">
            Thoughts, tutorials, and lessons from shipping production software.
          </p>
        </section>

        {blogs.length === 0 ? (
          <p className="text-center text-[#C9D1D9]/60">No blog posts yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, i) => {
              const date = blog.publishedDate ? new Date(blog.publishedDate) : null;
              return (
                <article
                  key={blog.id}
                  className="group rounded-3xl bg-[#0B1320]/85 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] overflow-hidden hover:shadow-2xl hover:shadow-[#C77DFF]/[0.18] hover:border-[#C77DFF]/30 hover:-translate-y-2 transition-all duration-500 ease-out animate-fade-in flex flex-col"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {blog.coverImageUrl ? (
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="relative block w-full h-48 overflow-hidden"
                    >
                      <Image
                        src={blog.coverImageUrl}
                        alt={blog.title}
                        fill
                        quality={88}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320]/80 via-transparent to-transparent" />
                      {blog.readTime ? (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0B1320]/85 backdrop-blur-sm border border-white/15">
                          <span className="text-[10px] font-bold text-white inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {blog.readTime} min
                          </span>
                        </div>
                      ) : null}
                    </Link>
                  ) : (
                    <div className="relative w-full h-48 bg-gradient-to-br from-[#9D4EDD]/15 via-[#0B1320] to-[#C77DFF]/15 flex items-center justify-center overflow-hidden border-b border-white/5">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#C77DFF] to-[#9D4EDD]" />
                      <Quote className="w-16 h-16 text-[#C77DFF]/40" />
                      {blog.readTime ? (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0B1320]/85 backdrop-blur-sm border border-white/15">
                          <span className="text-[10px] font-bold text-white inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {blog.readTime} min
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-[#C77DFF]/10 border border-[#C77DFF]/20 text-[10px] font-semibold text-[#C77DFF] uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link href={`/blog/${blog.slug}`}>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#C77DFF] transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>
                    {blog.excerpt && (
                      <p className="text-[#C9D1D9] text-sm line-clamp-3 mb-4 flex-1">{blog.excerpt}</p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                      {date ? (
                        <span className="inline-flex items-center gap-1 text-xs text-white/50">
                          <Calendar className="h-3 w-3" />
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      ) : <span />}
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-[#C77DFF] text-sm font-semibold group-hover:gap-2 transition-all"
                      >
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
