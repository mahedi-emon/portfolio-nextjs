/**
 * Stateless Supabase client for public read-only queries.
 *
 * Does NOT bind cookies — this is critical for `unstable_cache` to work,
 * since cached functions can't access per-request state. Uses the anon key
 * so Row Level Security still applies (no risk of leaking draft content
 * even if a query forgets a status filter).
 *
 * Use this ONLY for public, read-only data. For authenticated reads (admin
 * panel) use `createSupabaseServerClient` from "./server" so the session
 * cookie is respected.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY for public Supabase client",
  );
}

export const supabasePublic = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: { headers: { "x-cache-source": "public" } },
});
