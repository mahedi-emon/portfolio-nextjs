import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "app/(public)/about/page.tsx",
  "app/(public)/blog/page.tsx",
  "app/(public)/layout.tsx",
  "app/(public)/page.tsx",
  "app/(public)/portfolio/page.tsx",
  "app/(public)/services/page.tsx",
  "app/(public)/contact/page.tsx",
  "app/(public)/publications/page.tsx",
];

// Mojibake → real char (UTF-8 bytes decoded as Windows-1252 then re-encoded UTF-8)
const fixes = [
  ["â€”", "—"], // em-dash
  ["â€“", "–"], // en-dash
  ["â€™", "’"], // right single quote
  ["â€œ", "“"], // left double quote
  ["â€", "”"], // right double quote
  ["â€¦", "…"], // ellipsis
  ["Â·", "·"], // middle dot
];

for (const f of files) {
  const path = join(root, f);
  let content;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  let touched = false;
  for (const [bad, good] of fixes) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      touched = true;
    }
  }
  if (touched) {
    writeFileSync(path, content, "utf8");
    console.log(`fixed: ${f}`);
  } else {
    console.log(`clean: ${f}`);
  }
}

// Also bump slug pages revalidate
const slugFiles = ["app/(public)/blog/[slug]/page.tsx", "app/(public)/portfolio/[slug]/page.tsx"];
for (const f of slugFiles) {
  const path = join(root, f);
  let content;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  if (content.includes("export const revalidate = 60")) {
    content = content.replace("export const revalidate = 60", "export const revalidate = 300");
    writeFileSync(path, content, "utf8");
    console.log(`bumped revalidate: ${f}`);
  }
}
