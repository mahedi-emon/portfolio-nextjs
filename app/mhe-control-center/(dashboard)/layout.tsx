import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAbout, getHero } from "@/lib/cms/queries";
import { ADMIN_LOGIN_PATH } from "@/lib/constants";

/**
 * Auth-guarded admin shell.
 * Middleware (`proxy.ts`) already redirects unauthenticated users, but
 * we double-check here to defend against any matcher-bypass edge case.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  // proxy.ts already validated the session and redirected if missing.
  // getSession() reads from the cookie store — no network round-trip,
  // ~10ms vs ~150ms for getUser(). Significantly snappier nav between
  // admin pages. getUser() is reserved for write endpoints where we
  // need to re-verify the JWT.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect(ADMIN_LOGIN_PATH);

  const [hero, about] = await Promise.all([getHero(), getAbout()]);
  const siteName = about?.fullName || hero?.fullName || "Admin";

  return (
    <AdminLayoutClient
      userEmail={session.user.email ?? null}
      siteName={siteName}
      avatarUrl={about?.profileImageUrl ?? null}
    >
      {children}
    </AdminLayoutClient>
  );
}
