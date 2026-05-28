/**
 * SERVICE-ROLE Supabase client. SERVER-ONLY.
 *
 * NEVER import this from anywhere under app/ unless inside a Route Handler
 * or Server Action. It carries the service role JWT, which grants full
 * admin access to the database — exposing it to the client bundle would
 * be a critical security breach.
 *
 * Use cases:
 * - /api/admin/upload — server-side Storage upload bypassing client RLS
 * - /api/contact — insert into contact_messages from anon users
 * - scripts/migrate-base64-to-storage.ts — one-time data migration
 */

import { createClient } from "@supabase/supabase-js";

import "server-only";

export function createSupabaseServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_KEY or NEXT_PUBLIC_SUPABASE_URL — required for service-role client",
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
