/**
 * generateMetadata helpers — produces page-level <head> tags including
 * unique title/description/keywords/OG/Twitter/canonical per route.
 */

import type { Metadata } from "next";
import { PAGE_KEYWORDS, SITE_NAME, SITE_URL, type PageKey } from "./keywords";

type BuildMetadataArgs = {
  page: PageKey;
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

export function buildMetadata({
  page,
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex,
}: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/favicon.png`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: PAGE_KEYWORDS[page],
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: type === "profile" ? "profile" : type,
      siteName: SITE_NAME,
      url,
      title: fullTitle,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
