/**
 * Next.js 16 proxy (formerly known as middleware).
 *
 * Runs ONLY on admin routes — public pages do not pay the auth overhead.
 * - Refreshes the Supabase auth session (rotates expiring tokens)
 * - Guards admin dashboard routes — redirects to login if unauthenticated
 */

import { updateSupabaseSession } from "@/lib/supabase/proxy";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  // Only run on admin paths. Public pages (/, /about, /blog, etc.) skip
  // the auth round-trip entirely — massive perf win.
  matcher: ["/mhe-control-center/:path*"],
};
