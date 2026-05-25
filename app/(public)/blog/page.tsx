import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Quote } from "lucide-react";
import { JsonLd } from "@/components/common/JsonLd";
import { getBlogs } from "@/lib/cms/queries";
import { blogListSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

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

  return (
    <>
      <JsonLd data={blogListSchema(blogs)} />

      <div className="space-y-16 pb-16">
        <section className="text-center pt-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white animate-fade-in">
            Latest{" "}
            <span className="bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] bg-clip-text text-transparent">
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
                  className="group p-6 rounded-3xl bg-[#0B1320]/80 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-[#C77DFF]/[0.05] hover:shadow-xl hover:shadow-[#C77DFF]/[0.12] hover:border-white/[0.12] transition-all duration-600 ease-out hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {blog.coverImageUrl ? (
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="block w-full h-40 rounded-2xl overflow-hidden mb-5 border border-white/10"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.coverImageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#C77DFF]/10 border border-[#C77DFF]/15 flex items-center justify-center mb-5 group-hover:bg-[#C77DFF]/15 group-hover:border-[#C77DFF]/25 transition-all">
                      <Quote className="w-5 h-5 text-[#C77DFF]" />
                    </div>
                  )}

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#C77DFF]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#C77DFF]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#C77DFF] transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  {blog.excerpt && (
                    <p className="text-[#C9D1D9] text-sm line-clamp-3">{blog.excerpt}</p>
                  )}

                  <div className="flex items-center justify-between mt-4 text-xs text-[#C9D1D9]/60">
                    <div className="flex items-center gap-3">
                      {date && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {blog.readTime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {blog.readTime} min
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-[#C77DFF] font-medium group-hover:gap-2 transition-all"
                    >
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
