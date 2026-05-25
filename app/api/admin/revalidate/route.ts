/**
 * POST /api/admin/revalidate
 * Body: { paths?: string[], tags?: string[] }
 *
 * Triggers cache invalidation after admin saves CMS data. Two layers:
 *   - revalidatePath: flushes the page-level ISR cache so the next request
 *     re-renders the page server-side.
 *   - revalidateTag('cms'): nukes every unstable_cache entry under the "cms"
 *     tag (shared by all public CMS queries) so the next Supabase fetch
 *     pulls fresh data.
 *
 * Auth-guarded — admin session required.
 */

import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { paths?: string[]; tags?: string[] };
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  // Default: invalidate everything under "cms" + revalidate home page ISR.
  const paths = body.paths ?? ["/"];
  const tagsToInvalidate = body.tags ?? ["cms"];

  for (const p of paths) revalidatePath(p);
  for (const t of tagsToInvalidate) {
    // Next 16 signature: revalidateTag(tag, profile). "max" forces immediate flush.
    revalidateTag(t, "max");
  }

  return NextResponse.json({ ok: true, revalidated: { paths, tags: tagsToInvalidate } });
}
