/**
 * HMAC-signed preview tokens.
 *
 * Lets the admin share a unique URL like /preview/blog/some-slug?t=abc...
 * that renders draft content. The token is a SHA-256 HMAC of (type:id)
 * keyed by PREVIEW_SECRET, so the URL is unguessable and tamper-proof.
 *
 * No DB changes, no token storage — pure crypto verification.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export type PreviewType = "blog" | "project" | "publication" | "achievement";

const PREVIEW_TYPES: PreviewType[] = ["blog", "project", "publication", "achievement"];

function getSecret(): string {
  const s = process.env.PREVIEW_SECRET;
  if (!s) {
    // Fall back to SUPABASE_SERVICE_KEY so the feature still works if the
    // admin forgets to set PREVIEW_SECRET. Tokens rotate when keys rotate.
    const fallback = process.env.SUPABASE_SERVICE_KEY;
    if (!fallback) {
      throw new Error("Missing PREVIEW_SECRET (and SUPABASE_SERVICE_KEY fallback)");
    }
    return fallback;
  }
  return s;
}

export function signPreviewToken(type: PreviewType, id: string): string {
  const payload = `${type}:${id}`;
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function verifyPreviewToken(
  type: PreviewType,
  id: string,
  token: string | null | undefined,
): boolean {
  if (!token || typeof token !== "string") return false;
  if (!isValidType(type)) return false;
  const expected = signPreviewToken(type, id);
  try {
    const a = Buffer.from(expected, "base64url");
    const b = Buffer.from(token, "base64url");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isValidType(t: string): t is PreviewType {
  return (PREVIEW_TYPES as string[]).includes(t);
}
