/**
 * POST /api/admin/revalidate
 * Body: { paths: string[] }
 *
 * Triggers on-demand ISR revalidation after the admin saves CMS data.
 * Auth-guarded so only the admin can flush the cache.
 */

import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { paths?: string[] };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const paths = body.paths ?? ["/"];
  for (const p of paths) revalidatePath(p);

  return NextResponse.json({ ok: true, revalidated: { paths } });
}
