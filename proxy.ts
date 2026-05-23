/**
 * Next.js 16 proxy (formerly known as middleware).
 *
 * Runs on every matched request:
 * - Refreshes the Supabase auth session (rotates expiring tokens)
 * - Guards admin dashboard routes — redirects to login if unauthenticated
 */

import { updateSupabaseSession } from "@/lib/supabase/proxy";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
