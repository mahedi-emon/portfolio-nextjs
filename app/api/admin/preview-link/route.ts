/**
 * GET /api/admin/preview-link?type=blog&id=abc
 *
 * Returns the signed preview URL for an unpublished item. Admin-only.
 * The token is generated server-side (PREVIEW_SECRET is server-only) and
 * sent back so the client can copy it to clipboard.
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidType, signPreviewToken } from "@/lib/preview/token";
import { SITE_URL } from "@/lib/seo/keywords";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type");
  const id = request.nextUrl.searchParams.get("id");
  if (!type || !id || !isValidType(type)) {
    return NextResponse.json({ error: "Invalid type or id" }, { status: 400 });
  }

  const token = signPreviewToken(type, id);
  const url = `${SITE_URL}/preview/${type}/${id}?t=${token}`;

  return NextResponse.json({ url, token });
}
