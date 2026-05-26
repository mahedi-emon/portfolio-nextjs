"use server";

/**
 * Server actions for admin CMS mutations.
 *
 * Why server actions instead of client-side Supabase calls:
 *   1. Service-role bypasses RLS — admin writes never fail due to missing
 *      policies on a new table.
 *   2. Auth check happens server-side (cookie-bound). No JWT shipped to
 *      browser for the write path.
 *   3. One round-trip instead of two (mutation + revalidate fetch) —
 *      revalidate happens inline on the server.
 *   4. Faster: no client→supabase→client→/api/revalidate→server chain.
 *
 * Every mutation re-verifies the caller is authenticated. The (dashboard)
 * route group's layout already guards auth, but defense-in-depth: never
 * trust the call site.
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
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
  testimonials: ["/"],
  achievements: ["/"],
  clients: ["/"],
  techStackCategories: ["/"],
  resumes: ["/about"],
};

async function requireAdmin(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
}

function serialize(values: Record<string, unknown>, tableKey: string): DbRow {
  return applySpecialMappingsToDb(tableKey, mapFrontendToRow(values));
}

function deserialize(row: DbRow, tableKey: string) {
  return applySpecialMappingsFromDb(tableKey, mapRowToFrontend(row));
}

function invalidate(key: string) {
  const paths = SECTION_PATHS[key] ?? [];
  for (const p of paths) revalidatePath(p);
  revalidateTag("cms", "max");
  revalidateTag(`cms:${key}`, "max");
}

/* ─────────────────────────────────────────────────────────────
 * Singletons
 * ───────────────────────────────────────────────────────────── */
export async function updateSingletonAction(
  key: SingletonKey,
  values: Record<string, unknown>,
): Promise<void> {
  await requireAdmin();

  const supabase = createSupabaseServiceRoleClient();
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

  invalidate(key);
}

/* ─────────────────────────────────────────────────────────────
 * Collections
 * ───────────────────────────────────────────────────────────── */
export async function createCollectionItemAction(
  key: CollectionKey,
  values: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  await requireAdmin();

  const supabase = createSupabaseServiceRoleClient();
  const table = collectionToTable[key];
  const dbValues = serialize(values, key);
  delete dbValues.id;
  delete dbValues.created_at;

  const { data, error } = await supabase.from(table).insert(dbValues).select().single();
  if (error) throw new Error(error.message);

  invalidate(key);
  return deserialize(data as DbRow, key);
}

export async function updateCollectionItemAction(
  key: CollectionKey,
  id: string,
  values: Record<string, unknown>,
): Promise<void> {
  await requireAdmin();

  const supabase = createSupabaseServiceRoleClient();
  const table = collectionToTable[key];
  const dbValues = serialize(values, key);
  dbValues.updated_at = new Date().toISOString();

  const { error } = await supabase.from(table).update(dbValues).eq("id", id);
  if (error) throw new Error(error.message);

  invalidate(key);
}

export async function deleteCollectionItemAction(
  key: CollectionKey,
  id: string,
): Promise<void> {
  await requireAdmin();

  const supabase = createSupabaseServiceRoleClient();
  const table = collectionToTable[key];

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);

  invalidate(key);
}
