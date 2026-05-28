/**
 * Server-side Supabase client (App Router).
 *
 * Use this in:
 * - Server Components (default)
 * - Route Handlers
 * - Server Actions
 *
 * Reads session from request cookies via @supabase/ssr.
 * Mutations of cookies are no-ops here (handled by middleware).
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — safe to ignore;
            // middleware will refresh the session on the next request.
          }
        },
      },
    },
  );
}
