/**
 * Supabase Storage bucket configuration.
 */

export const STORAGE_BUCKETS = {
  IMAGES: "images",
  RESUMES: "resumes",
  DOCUMENTS: "documents",
  GALLERY: "gallery",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/**
 * Determine the appropriate bucket for a field based on its name.
 */
export function getBucketForField(fieldName: string): StorageBucket {
  const lower = fieldName.toLowerCase();

  if (lower.includes("resume") || lower.includes("cv")) return STORAGE_BUCKETS.RESUMES;
  if (lower.includes("certificate") || lower.includes("document") || lower.includes("file"))
    return STORAGE_BUCKETS.DOCUMENTS;
  if (lower.includes("gallery")) return STORAGE_BUCKETS.GALLERY;

  return STORAGE_BUCKETS.IMAGES;
}

/**
 * Generate a unique storage path for a file upload.
 */
export function generateStoragePath(filename: string, bucket: StorageBucket): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
  return `${bucket}/${timestamp}-${random}-${sanitized}`;
}

/**
 * Extract storage path from a public Supabase URL.
 * Pattern: /storage/v1/object/public/{bucket}/{filepath}
 */
export function extractPathFromUrl(url: string, bucket: StorageBucket): string | null {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(new RegExp(`/${bucket}/(.+)$`));
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function isStorageUrl(url: string): boolean {
  return url.includes(".supabase.co/storage/");
}

export function isDataUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:");
}

export function isHttpUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
