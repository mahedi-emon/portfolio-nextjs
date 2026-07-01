import type { MetadataRoute } from "next";
import { getBlogSitemapData, getProjectSitemapData } from "@/lib/cms/queries";
import { SITE_URL } from "@/lib/seo/keywords";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, blogs] = await Promise.all([
    getProjectSitemapData().catch(() => []),
    getBlogSitemapData().catch(() => []),
  ]);

  // Find the latest update date of any project or blog post
  let latestUpdate = new Date("2026-05-25"); // Fallback initial site update date
  
  projects.forEach((p) => {
    const d = new Date(p.updatedAt);
    if (d > latestUpdate) latestUpdate = d;
  });

  blogs.forEach((b) => {
    const d = new Date(b.updatedAt);
    if (d > latestUpdate) latestUpdate = d;
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: latestUpdate, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: latestUpdate, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/portfolio`, lastModified: latestUpdate, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: latestUpdate, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/blog`, lastModified: latestUpdate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/publications`, lastModified: latestUpdate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: latestUpdate, changeFrequency: "yearly", priority: 0.8 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((proj) => ({
    url: `${SITE_URL}/portfolio/${encodeURIComponent(proj.slug.trim())}`,
    lastModified: new Date(proj.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${SITE_URL}/blog/${encodeURIComponent(post.slug.trim())}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}

