import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User as UserIcon } from "lucide-react";
import { JsonLd } from "@/components/common/JsonLd";
import { getBlogBySlug } from "@/lib/cms/queries";
import { blogPostSchema } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanitizeHtml, stripHtml, truncateHtml } from "@/lib/utils/sanitizeHtml";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog)
    return buildMetadata({
      page: "blog",
      title: "Post not found",
      description: "",
      path: `/blog/${slug}`,
      noindex: true,
    });

  const description =
    blog.excerpt?.trim() || truncateHtml(stripHtml(blog.content), 160) || blog.title;

  return buildMetadata({
    page: "blog",
    title: blog.title,
    description,
    path: `/blog/${slug}`,
    image: blog.coverImageUrl || undefined,
    type: "article",
    publishedTime: blog.publishedDate ?? blog.createdAt,
    modifiedTime: blog.updatedAt,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const date = blog.publishedDate ? new Date(blog.publishedDate) : null;

  return (
    <>
      <JsonLd data={blogPostSchema(blog)} />

      <article className="mx-auto max-w-3xl space-y-8 pb-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#C9D1D9] hover:text-[#C77DFF] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All articles
        </Link>

        <header className="space-y-5">
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#C77DFF]/10 px-3 py-1 text-xs font-medium text-[#C77DFF]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-lg leading-relaxed text-[#C9D1D9]">{blog.excerpt}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#C9D1D9]/60">
            {blog.author && (
              <span className="inline-flex items-center gap-1.5">
                <UserIcon className="h-4 w-4 text-[#C77DFF]" />
                {blog.author}
              </span>
            )}
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#C77DFF]" />
                {date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            )}
            {blog.readTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#C77DFF]" />
                {blog.readTime} min read
              </span>
            )}
          </div>
        </header>

        {blog.coverImageUrl && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.coverImageUrl} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {blog.content && (
          <div
            className="prose prose-invert max-w-none text-base leading-relaxed text-[#C9D1D9] [&_a]:text-[#C77DFF] [&_a:hover]:underline [&>p]:mb-5 [&>h2]:mt-10 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h3]:mt-8 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-white [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-[#C77DFF] [&>blockquote]:pl-4 [&>blockquote]:italic [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/40 [&_pre]:p-4 [&_img]:rounded-xl"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
          />
        )}
      </article>
    </>
  );
}
