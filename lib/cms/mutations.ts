"use client";

/**
 * Client-side CMS mutators — now thin wrappers around server actions in
 * `lib/cms/actions.ts`. The server action does the actual write with the
 * service-role client (bypasses RLS) and inline-revalidates the affected
 * paths, all in one round-trip. No more separate /api/admin/revalidate fetch.
 *
 * Why keep this module: callers (EntityForm, CmsSectionEditor, etc.) wrap
 * these in `toast.promise()` for streaming UX. Keeping the same function
 * names means zero call-site changes.
 */

import {
  createCollectionItemAction,
  deleteCollectionItemAction,
  updateCollectionItemAction,
  updateSingletonAction,
} from "@/lib/cms/actions";
import type { CollectionKey, SingletonKey } from "@/lib/cms/tables";

export async function updateSingletonRow(
  key: SingletonKey,
  values: Record<string, unknown>,
): Promise<void> {
  await updateSingletonAction(key, values);
}

export async function createCollectionItem(
  key: CollectionKey,
  values: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return createCollectionItemAction(key, values);
}

export async function updateCollectionItem(
  key: CollectionKey,
  id: string,
  values: Record<string, unknown>,
): Promise<void> {
  await updateCollectionItemAction(key, id, values);
}

export async function deleteCollectionItem(
  key: CollectionKey,
  id: string,
): Promise<void> {
  await deleteCollectionItemAction(key, id);
}

/**
 * File upload still goes through /api/admin/upload (multipart route handler).
 * Server actions don't yet handle File well in all browsers.
 */
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
