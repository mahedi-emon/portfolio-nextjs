"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ADMIN_DASHBOARD_PATH, ADMIN_LOGIN_PATH } from "@/lib/constants";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace(ADMIN_DASHBOARD_PATH);
      else router.replace(ADMIN_LOGIN_PATH);
    }, 800);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1320]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#C77DFF]" />
        <p className="text-sm text-white/60">Completing sign-in…</p>
      </div>
    </div>
  );
}
