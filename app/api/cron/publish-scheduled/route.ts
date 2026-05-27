/**
 * Vercel Cron — runs hourly via vercel.json.
 *
 * Finds blogs with status='scheduled' and published_date <= NOW(), then
 * flips them to status='published'. Reuses the existing published_date
 * column as the "publish at" timestamp — no schema migration needed.
 *
 * Workflow for the admin:
 *   1. Write a blog post in admin
 *   2. Set status = "scheduled"
 *   3. Set Published Date to a future timestamp (e.g. next Monday 9am)
 *   4. Save
 *   5. This cron picks it up automatically when the date passes
 *
 * Auth: Vercel injects an Authorization: Bearer <CRON_SECRET> header
 * on cron requests. We verify it to reject unauthenticated callers.
 */

import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { DB_TABLES } from "@/lib/cms/tables";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // 1. Verify the request came from Vercel Cron (or a local test with the secret)
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = createSupabaseServiceRoleClient();
  const now = new Date().toISOString();

  // 2. Find ready-to-publish blogs
  const { data: due, error: fetchError } = await supabase
    .from(DB_TABLES.BLOGS)
    .select("id, title, slug, published_date")
    .eq("status", "scheduled")
    .lte("published_date", now);

  if (fetchError) {
    console.error("[cron/publish-scheduled] fetch failed:", fetchError.message);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const ready = due ?? [];
  if (ready.length === 0) {
    return NextResponse.json({ ok: true, published: 0, checkedAt: now });
  }

  // 3. Bulk flip to published
  const ids = ready.map((r) => r.id as string);
  const { error: updateError } = await supabase
    .from(DB_TABLES.BLOGS)
    .update({ status: "published", updated_at: now })
    .in("id", ids);

  if (updateError) {
    console.error("[cron/publish-scheduled] update failed:", updateError.message);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 4. Invalidate caches so the new posts appear immediately on the public site
  revalidateTag("cms", "max");
  revalidateTag("cms:blogs", "max");
  revalidatePath("/");
  revalidatePath("/blog");
  for (const item of ready) {
    const slug = (item as unknown as { slug?: string }).slug;
    if (slug) revalidatePath(`/blog/${slug}`);
  }

  console.info(
    `[cron/publish-scheduled] published ${ready.length} blog(s):`,
    ready.map((r) => r.title).join(", "),
  );

  return NextResponse.json({
    ok: true,
    published: ready.length,
    titles: ready.map((r) => r.title),
    checkedAt: now,
  });
}
