"use client";

import { useMemo, useState } from "react";
import { Save, Loader2, Check, X, Plus, AlertCircle } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { ImageUploadField } from "./ImageUploadField";
import { detectSocialPlatform, formatPlatformLabel } from "@/lib/utils/detectSocialPlatform";
import { iconMap } from "@/lib/utils/iconMap";
import { computeReadTime } from "@/lib/utils/sanitizeHtml";
import type { FieldSchema } from "@/lib/cms/schemas";

type Props = {
  fields: FieldSchema[];
  initial?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  /** When true, auto-compute readTime from `content` (for blogs) */
  autoComputeReadTime?: boolean;
  /** When true, auto-fill `slug` from `title` while slug is untouched */
  autoSlug?: boolean;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type SocialLinkItem = { url: string; platform?: string; iconKey?: string };

function getNested(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function setNested(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  const next = { ...obj };
  let cursor = next as Record<string, unknown>;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      cursor[key] = value;
      return;
    }
    const existing = cursor[key];
    cursor[key] =
      typeof existing === "object" && existing !== null
        ? { ...(existing as Record<string, unknown>) }
        : {};
    cursor = cursor[key] as Record<string, unknown>;
  });
  return next;
}

function buildInitial(fields: FieldSchema[], initial?: Record<string, unknown>) {
  let base: Record<string, unknown> = {};
  for (const field of fields) {
    const nested = initial ? getNested(initial, field.name) : undefined;
    if (initial && nested !== undefined) {
      base = setNested(base, field.name, nested);
      continue;
    }
    switch (field.type) {
      case "checkbox":
        base = setNested(base, field.name, false);
        break;
      case "number":
        base = setNested(base, field.name, 0);
        break;
      case "list":
      case "socialLinks":
        base = setNested(base, field.name, []);
        break;
      default:
        base = setNested(
          base,
          field.name,
          field.name === "status" ? "draft" : field.name === "orderIndex" ? 0 : "",
        );
    }
  }
  return base;
}

const isEmpty = (v: unknown) =>
  v === null ||
  v === undefined ||
  (typeof v === "string" && v.trim().length === 0) ||
  (Array.isArray(v) && v.length === 0);

function validate(
  fields: FieldSchema[],
  values: Record<string, unknown>,
): Record<string, string> {
  const errs: Record<string, string> = {};
  for (const f of fields) {
    const v = getNested(values, f.name);
    if (f.required && isEmpty(v)) {
      errs[f.name] = "Required";
      continue;
    }
    if (!isEmpty(v)) {
      const isUrl = f.type === "url" || (f.name.toLowerCase().includes("url") && f.type !== "socialLinks");
      if (isUrl) {
        const ok = Array.isArray(v)
          ? v.every((x) => z.string().url().safeParse(String(x)).success)
          : z.string().url().safeParse(String(v)).success;
        if (!ok) errs[f.name] = "Invalid URL";
      }
    }
  }
  return errs;
}

export function EntityForm({
  fields,
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  autoComputeReadTime,
  autoSlug,
}: Props) {
  const initialValues = useMemo(() => buildInitial(fields, initial), [fields, initial]);
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // Slug is "untouched" until the user types in it manually — then we stop
  // auto-filling so we don't clobber their edit.
  const [slugTouched, setSlugTouched] = useState<boolean>(
    Boolean(initial && String((initial as Record<string, unknown>).slug ?? "").trim()),
  );

  const change = (name: string, val: unknown) => {
    setValues((prev) => {
      let next = setNested(prev, name, val);
      // Auto-slug: when title changes and slug field hasn't been edited yet,
      // mirror title -> slug. Only for schemas that include a `slug` field.
      if (autoSlug && name === "title" && !slugTouched) {
        next = setNested(next, "slug", slugify(String(val ?? "")));
      }
      return next;
    });
    if (name === "slug") setSlugTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let toSubmit = values;

    if (autoComputeReadTime) {
      const content = String(getNested(values, "content") ?? "");
      toSubmit = setNested(values, "readTime", computeReadTime(content));
    }

    const errs = validate(fields, toSubmit);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
      await onSubmit(toSubmit);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => {
          const wide =
            field.type === "textarea" ||
            field.type === "socialLinks" ||
            field.name === "pageIntroText" ||
            field.type === "image" ||
            field.type === "file";
          const v = getNested(values, field.name);
          const err = errors[field.name];

          return (
            <div key={field.name} className={`space-y-1.5 ${wide ? "md:col-span-2" : ""}`}>
              <label className="flex items-center gap-1 text-sm font-medium text-[#C9D1D9]">
                {field.label}
                {field.required && <span className="text-[#C77DFF]">*</span>}
              </label>

              {field.type === "image" || field.type === "file" ? (
                <ImageUploadField
                  field={field}
                  value={String(v ?? "")}
                  onChange={(url) => change(field.name, url)}
                />
              ) : field.type === "select" ? (
                <select
                  value={String(v ?? "")}
                  onChange={(e) => change(field.name, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF]"
                >
                  <option value="">Select…</option>
                  {field.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={String(v ?? "")}
                  onChange={(e) => change(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.htmlContent ? 10 : 5}
                  className="w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF] resize-y"
                />
              ) : field.type === "checkbox" ? (
                <label className="inline-flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={Boolean(v)}
                    onChange={(e) => change(field.name, e.target.checked)}
                    className="h-5 w-5 rounded text-[#C77DFF]"
                  />
                  <span className="text-sm text-[#C9D1D9]">Enable</span>
                </label>
              ) : field.type === "list" ? (
                <input
                  type="text"
                  placeholder="Comma-separated values"
                  value={Array.isArray(v) ? (v as unknown[]).join(", ") : ""}
                  onChange={(e) =>
                    change(
                      field.name,
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF]"
                />
              ) : field.type === "socialLinks" ? (
                <SocialLinksEditor
                  value={Array.isArray(v) ? (v as SocialLinkItem[]) : []}
                  onChange={(next) => change(field.name, next)}
                />
              ) : field.type === "number" ? (
                <input
                  type="number"
                  value={Number(v ?? 0)}
                  onChange={(e) => change(field.name, Number(e.target.value))}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF]"
                />
              ) : field.type === "date" ? (
                <input
                  type="date"
                  value={String(v ?? "")}
                  onChange={(e) => change(field.name, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF] [&::-webkit-calendar-picker-indicator]:invert"
                />
              ) : (
                <input
                  type={field.type ?? "text"}
                  value={String(v ?? "")}
                  onChange={(e) => change(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF]"
                />
              )}

              {err && (
                <p className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  {err}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-white/10">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#C77DFF]/20 hover:shadow-lg hover:shadow-[#C77DFF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {submitLabel}
            </>
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-[#C9D1D9] hover:bg-white/5"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function SocialLinksEditor({
  value,
  onChange,
}: {
  value: SocialLinkItem[];
  onChange: (v: SocialLinkItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      {value.map((link, i) => {
        const detected = detectSocialPlatform(String(link.url ?? ""));
        const platformKey = (link.platform ?? detected.platform) as string;
        const iconKey = (link.iconKey ?? detected.iconKey) as string;
        const Icon = iconMap[iconKey] ?? iconMap.custom;
        const label = formatPlatformLabel(platformKey, detected.label);
        return (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 p-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#C77DFF]/15">
              <Icon className="h-4 w-4 text-[#C77DFF]" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#C77DFF]/80">
                {label}
              </p>
              <input
                value={String(link.url ?? "")}
                onChange={(e) => {
                  const url = e.target.value;
                  const det = detectSocialPlatform(url);
                  const next = [...value];
                  next[i] = { url, platform: det.platform, iconKey: det.iconKey };
                  onChange(next);
                }}
                placeholder="https://"
                className="w-full rounded-lg border border-white/10 bg-[#0B1320]/50 px-3 py-2 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const next = [...value];
                next.splice(i, 1);
                onChange(next);
              }}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
              aria-label="Remove"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() =>
          onChange([...value, { url: "", platform: "custom", iconKey: "custom" }])
        }
        className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-medium text-[#C9D1D9] hover:bg-white/[0.06]"
      >
        <Plus className="w-4 h-4" />
        Add social link
      </button>
    </div>
  );
}
