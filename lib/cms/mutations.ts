"use client";

/**
 * Client-side CMS mutators. Use these from admin Client Components.
 *
 * Pattern: each function wraps Supabase mutation + path revalidation in
 * a single call. Toast notifications are the caller's responsibility
 * (so callers can wrap with toast.promise() for streaming feedback).
 */

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  type DbRow,
  applySpecialMappingsToDb,
  mapFrontendToRow,
  mapRowToFrontend,
  applySpecialMappingsFromDb,
} from "@/lib/cms/mappers";
import {
  type CollectionKey,
  type SingletonKey,
  collectionToTable,
  singletonToTable,
} from "@/lib/cms/tables";

function serialize(values: Record<string, unknown>, tableKey: string): DbRow {
  return applySpecialMappingsToDb(tableKey, mapFrontendToRow(values));
}

function deserialize(row: DbRow, tableKey: string) {
  return applySpecialMappingsFromDb(tableKey, mapRowToFrontend(row));
}

async function revalidate(paths: string[]) {
  try {
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // best-effort — cache will catch up on next ISR cycle anyway
  }
}

const SECTION_PATHS: Record<string, string[]> = {
  hero: ["/", "/about"],
  about: ["/", "/about"],
  contact: ["/", "/contact"],
  resumeSettings: ["/", "/about"],
  education: ["/about"],
  skills: ["/about"],
  services: ["/", "/services"],
  projects: ["/", "/portfolio"],
  publications: ["/publications"],
  certifications: ["/about"],
  experience: ["/about"],
  blogs: ["/", "/blog"],
  testimonials: ["/", "/testimonials"],
  achievements: ["/", "/achievements"],
  clients: ["/"],
  techStackCategories: ["/"],
  resumes: ["/about"],
};

export async function updateSingletonRow(
  key: SingletonKey,
  values: Record<string, unknown>,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const table = singletonToTable[key];
  let dbValues = serialize(values, key);

  // Flatten contactInfo nested → email/phone/location columns
  if (key === "contact" && values.contactInfo) {
    const ci = values.contactInfo as Record<string, string>;
    dbValues = {
      ...dbValues,
      email: ci.email ?? "",
      phone: ci.phone ?? null,
      location: ci.location ?? null,
    };
    delete dbValues.contact_info;
  }

  dbValues.updated_at = new Date().toISOString();

  const { error } = await supabase.from(table).update(dbValues).not("id", "is", null);
  if (error) throw new Error(error.message);

  await revalidate(SECTION_PATHS[key] ?? []);
}

export async function createCollectionItem(
  key: CollectionKey,
  values: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const supabase = createSupabaseBrowserClient();
  const table = collectionToTable[key];
  const dbValues = serialize(values, key);
  delete dbValues.id;
  delete dbValues.created_at;

  const { data, error } = await supabase.from(table).insert(dbValues).select().single();
  if (error) throw new Error(error.message);

  await revalidate(SECTION_PATHS[key] ?? []);
  return deserialize(data as DbRow, key);
}

export async function updateCollectionItem(
  key: CollectionKey,
  id: string,
  values: Record<string, unknown>,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const table = collectionToTable[key];
  const dbValues = serialize(values, key);
  dbValues.updated_at = new Date().toISOString();

  const { error } = await supabase.from(table).update(dbValues).eq("id", id);
  if (error) throw new Error(error.message);

  await revalidate(SECTION_PATHS[key] ?? []);
}

export async function deleteCollectionItem(
  key: CollectionKey,
  id: string,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  const table = collectionToTable[key];

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);

  await revalidate(SECTION_PATHS[key] ?? []);
}

export async function uploadFileViaApi(
  file: File,
  bucket: string,
): Promise<{ url: string; path: string }> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("bucket", bucket);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Upload failed");
  return data;
}
