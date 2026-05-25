/**
 * One-time migration: base64 data URLs in DB → Supabase Storage
 *
 * Reads every table+column that holds an image URL, finds any value that
 * starts with `data:`, uploads the bytes to the appropriate Storage bucket,
 * and updates the row with the resulting public URL.
 *
 * Idempotent — skips rows whose URLs are already http(s).
 *
 * Run:
 *   node --env-file=.env.local scripts/migrate-base64-to-storage.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Per-table column map → bucket name + whether it's a JSONB array of URLs.
 */
const PLAN = [
  { table: "cms_hero", cols: ["hero_image_url"], bucket: "images" },
  { table: "cms_about", cols: ["profile_image_url"], bucket: "images" },
  { table: "services", cols: ["image_url"], bucket: "images" },
  { table: "projects", cols: ["cover_image_url"], bucket: "images" },
  { table: "projects", cols: ["gallery_images"], bucket: "gallery", isArray: true },
  { table: "publications", cols: ["cover_image_url"], bucket: "images" },
  { table: "publications", cols: ["pdf_url"], bucket: "documents" },
  { table: "certifications", cols: ["certificate_image_url"], bucket: "images" },
  { table: "certifications", cols: ["certificate_file_url"], bucket: "documents" },
  { table: "blogs", cols: ["cover_image_url"], bucket: "images" },
  { table: "testimonials", cols: ["avatar_url"], bucket: "images" },
  { table: "achievements", cols: ["certificate_image_url"], bucket: "images" },
  { table: "achievements", cols: ["certificate_file_url"], bucket: "documents" },
  { table: "achievements", cols: ["gallery_images"], bucket: "gallery", isArray: true },
  { table: "clients", cols: ["logo_url"], bucket: "images" },
  { table: "resumes", cols: ["file_url"], bucket: "resumes" },
];

const MIME_EXT = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

function decodeDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;,]+)(?:;base64)?,(.+)$/);
  if (!match) return null;
  const [, mime, payload] = match;
  const isBase64 = dataUrl.includes(";base64,");
  const buffer = isBase64
    ? Buffer.from(payload, "base64")
    : Buffer.from(decodeURIComponent(payload), "utf-8");
  return { buffer, mime, ext: MIME_EXT[mime] || "bin" };
}

async function uploadBase64(dataUrl, bucket) {
  const decoded = decodeDataUrl(dataUrl);
  if (!decoded) return null;
  const { buffer, mime, ext } = decoded;
  const name = `migrated-${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const path = `${bucket}/${name}`;

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: mime,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error(`  ❌ upload failed: ${error.message}`);
    return null;
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}

let totalRows = 0;
let totalMigrated = 0;
let totalSkipped = 0;
let totalFailed = 0;

for (const { table, cols, bucket, isArray } of PLAN) {
  console.log(`\n▶ ${table}.${cols.join(",")} → ${bucket}${isArray ? " [jsonb array]" : ""}`);

  const { data: rows, error } = await supabase.from(table).select(`id, ${cols.join(",")}`);
  if (error) {
    console.error(`  ❌ fetch failed: ${error.message}`);
    continue;
  }
  if (!rows || rows.length === 0) {
    console.log("  ∙ (no rows)");
    continue;
  }

  for (const row of rows) {
    totalRows++;
    const updates = {};
    let touched = false;

    for (const col of cols) {
      const value = row[col];
      if (!value) continue;

      if (isArray) {
        const arr = Array.isArray(value) ? value : [];
        const next = [];
        let arrTouched = false;
        for (const item of arr) {
          if (typeof item === "string" && item.startsWith("data:")) {
            const url = await uploadBase64(item, bucket);
            if (url) {
              next.push(url);
              arrTouched = true;
              totalMigrated++;
            } else {
              next.push(item);
              totalFailed++;
            }
          } else {
            next.push(item);
            if (typeof item === "string" && item.startsWith("http")) totalSkipped++;
          }
        }
        if (arrTouched) {
          updates[col] = next;
          touched = true;
        }
      } else if (typeof value === "string") {
        if (value.startsWith("data:")) {
          const url = await uploadBase64(value, bucket);
          if (url) {
            updates[col] = url;
            touched = true;
            totalMigrated++;
          } else {
            totalFailed++;
          }
        } else if (value.startsWith("http")) {
          totalSkipped++;
        }
      }
    }

    if (touched) {
      const { error: updateError } = await supabase.from(table).update(updates).eq("id", row.id);
      if (updateError) {
        console.error(`  ❌ ${row.id} update failed: ${updateError.message}`);
        totalFailed++;
      } else {
        console.log(`  ✓ ${row.id} migrated ${Object.keys(updates).join(", ")}`);
      }
    }
  }
}

console.log("\n═══════════════════════════════════════");
console.log(`  Rows scanned:   ${totalRows}`);
console.log(`  Migrated:       ${totalMigrated}`);
console.log(`  Already HTTP:   ${totalSkipped}`);
console.log(`  Failed:         ${totalFailed}`);
console.log("═══════════════════════════════════════");

if (totalFailed > 0) process.exit(1);
process.exit(0);
