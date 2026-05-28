/**
 * Browser-side Supabase client.
 *
 * Use this in Client Components ('use client') for:
 * - Auth state subscription (admin layout)
 * - Real-time subscriptions (if/when needed)
 * - Direct mutations from admin forms
 *
 * Reads cookies via @supabase/ssr so server and browser stay in sync.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
