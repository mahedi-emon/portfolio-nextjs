/**
 * Supabase Auth middleware helper for Next.js App Router.
 *
 * Called from the root `middleware.ts`. Refreshes the user's session on every
 * request and forwards/sets cookies so server components see fresh auth state.
 *
 * Also enforces admin route protection: unauthenticated users hitting any
 * /mhe-control-center/(dashboard)/* path are redirected to the login page
 * with `?next=` set so they bounce back after login.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSupabaseSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Forces a session refresh if needed (rotates expiring access tokens).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin dashboard routes
  const pathname = request.nextUrl.pathname;
  const isAdminDashboard =
    pathname.startsWith("/mhe-control-center/") &&
    !pathname.startsWith("/mhe-control-center/login") &&
    !pathname.startsWith("/mhe-control-center/auth/");

  if (isAdminDashboard && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/mhe-control-center/login";
    loginUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
