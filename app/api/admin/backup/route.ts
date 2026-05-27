/**
 * GET /api/admin/backup
 *
 * Auth-gated admin endpoint that returns a JSON dump of every CMS table.
 * Insurance against Supabase shutdown, schema migrations, or accidental
 * deletes. Download once a month, store on Google Drive / GitHub private
 * repo and you can restore the entire site in 10 minutes.
 *
 * Format:
 *   {
 *     meta: { exportedAt, siteUrl, schemaVersion },
 *     singletons: { hero, about, contact, resumeSettings },
 *     collections: { education, skills, services, ... },
 *   }
 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { DB_TABLES, singletonToTable, collectionToTable } from "@/lib/cms/tables";
import { SITE_URL } from "@/lib/seo/keywords";

const SCHEMA_VERSION = "1.0.0";

export async function GET() {
  // 1. Auth check via cookie-bound client (the admin must be logged in)
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Use service role for bulk reads — bypasses RLS
  const service = createSupabaseServiceRoleClient();

  const singletons: Record<string, unknown> = {};
  for (const [key, table] of Object.entries(singletonToTable)) {
    const { data, error } = await service.from(table).select("*").maybeSingle();
    if (error) {
      console.error(`[backup] singleton ${key} failed:`, error.message);
    }
    singletons[key] = data ?? null;
  }

  const collections: Record<string, unknown[]> = {};
  for (const [key, table] of Object.entries(collectionToTable)) {
    if (key === "portfolio") continue; // alias for projects, skip duplicate
    const { data, error } = await service.from(table).select("*");
    if (error) {
      console.error(`[backup] collection ${key} failed:`, error.message);
    }
    collections[key] = (data ?? []) as unknown[];
  }

  // Contact messages too
  const { data: messages } = await service.from(DB_TABLES.CONTACT_MESSAGES).select("*");
  collections.contactMessages = (messages ?? []) as unknown[];

  const payload = {
    meta: {
      exportedAt: new Date().toISOString(),
      siteUrl: SITE_URL,
      schemaVersion: SCHEMA_VERSION,
      exportedBy: user.email ?? user.id,
    },
    singletons,
    collections,
  };

  // Return as downloadable file
  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="portfolio-backup-${today}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
