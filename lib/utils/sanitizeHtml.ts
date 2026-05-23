/**
 * HTML Sanitization Utility
 *
 * Provides safe HTML rendering for user-generated content using DOMPurify.
 *
 * USAGE:
 *   import { sanitizeHtml, stripHtml } from "@/lib/utils/sanitizeHtml";
 *
 *   // For rendering HTML safely:
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
 *
 *   // For plain text extraction:
 *   <p>{stripHtml(content)}</p>
 */

import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s", "mark", "small", "sub", "sup",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "a",
  "code", "pre", "kbd",
  "blockquote", "q", "cite",
  "hr",
  "span", "div",
  "img", "figure", "figcaption",
];

const ALLOWED_ATTRS = [
  "href", "target", "rel", "class", "id",
  "title", "alt", "aria-label", "aria-hidden",
  "src", "width", "height", "loading",
];

const ALLOWED_PROTOCOLS = ["http", "https", "mailto", "tel"];

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  const trimmed = html.trim();
  if (!trimmed) return "";

  // SSR fallback - strip all HTML when document is not available
  if (typeof window === "undefined") {
    return stripHtml(trimmed);
  }

  return DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRS,
    ALLOWED_URI_REGEXP: new RegExp(`^(?:${ALLOWED_PROTOCOLS.join("|")}):`, "i"),
    KEEP_CONTENT: true,
  });
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";

  if (typeof document === "undefined") {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  const temp = document.createElement("div");
  temp.innerHTML = html;
  return (temp.textContent || temp.innerText || "").trim();
}

export function truncateHtml(html: string | null | undefined, maxLength: number): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.7) {
    return truncated.slice(0, lastSpace).trim() + "...";
  }

  return truncated.trim() + "...";
}

export function containsHtml(str: string | null | undefined): boolean {
  if (!str) return false;
  return /<[a-z][\s\S]*>/i.test(str);
}

/**
 * Auto-compute read time in minutes from HTML/text content.
 * Uses 200 words-per-minute as the average reading speed.
 */
export function computeReadTime(content: string | null | undefined): number {
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export const SANITIZE_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTRS,
  ALLOWED_PROTOCOLS,
} as const;
