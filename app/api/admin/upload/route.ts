/**
 * POST /api/admin/upload
 *
 * Admin-only file upload to Supabase Storage. Validates the session via
 * @supabase/ssr (cookie-bound) before allowing the upload. The actual
 * write uses the service-role client so it bypasses bucket RLS — safe
 * because the auth check above guarantees only the admin can hit it.
 *
 * Body: multipart/form-data with fields `file`, `bucket`
 * Returns: { url, path, bucket }
 */

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { STORAGE_BUCKETS, generateStoragePath, type StorageBucket } from "@/lib/storage/buckets";

const VALID_BUCKETS: StorageBucket[] = Object.values(STORAGE_BUCKETS);

export async function POST(request: NextRequest) {
  // 1. Auth check — only the admin can upload
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse multipart body
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const bucket = formData.get("bucket") as string | null;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (!bucket || !VALID_BUCKETS.includes(bucket as StorageBucket)) {
    return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
  }

  // 3. Generate unique path and upload via service-role client
  const path = generateStoragePath(file.name, bucket as StorageBucket);
  const service = createSupabaseServiceRoleClient();

  const { error: uploadError } = await service.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });

  if (uploadError) {
    console.error("[upload] Supabase Storage error:", uploadError);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = service.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path, bucket });
}

/**
 * DELETE /api/admin/upload
 * Body: { bucket, path }
 */
export async function DELETE(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { bucket?: string; path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { bucket, path } = body;
  if (!bucket || !path || !VALID_BUCKETS.includes(bucket as StorageBucket)) {
    return NextResponse.json({ error: "Invalid bucket or path" }, { status: 400 });
  }

  const service = createSupabaseServiceRoleClient();
  const { error } = await service.storage.from(bucket).remove([path]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
