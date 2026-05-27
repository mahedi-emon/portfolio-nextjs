"use client";

import { useState } from "react";
import { Upload, Loader2, X, Plus, ChevronUp, ChevronDown, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadFileViaApi } from "@/lib/cms/mutations";
import type { FieldSchema } from "@/lib/cms/schemas";
import { cn } from "@/lib/utils/cn";

type Props = {
  field: FieldSchema;
  value: string[];
  onChange: (urls: string[]) => void;
};

/**
 * Multi-image upload with thumbnail preview grid.
 *
 * Used for list fields that have storageField=true (projects.galleryImages,
 * achievements.galleryImages). Lets the admin:
 *   - Upload multiple files at once (drag-drop OR file picker)
 *   - Paste URLs manually
 *   - Reorder by ↑/↓ buttons
 *   - Remove individual images
 *   - See live thumbnail of every image in the array
 */
export function GalleryUploadField({ field, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const accept = field.acceptedTypes ?? "image/*";
  const maxMB = field.maxSizeMB ?? 5;
  const bucket = field.storageBucket ?? "gallery";

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    // Validate sizes upfront
    const oversized = list.find((f) => f.size > maxMB * 1024 * 1024);
    if (oversized) {
      toast.error(`"${oversized.name}" too large — max ${maxMB} MB`);
      return;
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of list) {
        // Serialize uploads so the user sees progressive toasts
        // and we don't slam the upload API
        const { url } = await uploadFileViaApi(file, bucket);
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    void handleFiles(e.dataTransfer.files);
  };

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setUrlInput("");
  };

  const removeAt = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const move = (idx: number, direction: "up" | "down") => {
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= value.length) return;
    const next = [...value];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone + file picker */}
      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all",
          dragOver
            ? "border-[#C77DFF] bg-[#C77DFF]/10"
            : "border-white/15 hover:border-[#C77DFF]/50",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              void handleFiles(e.target.files);
              e.target.value = ""; // reset for re-upload of same file
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#C77DFF] animate-spin mb-2" />
              <p className="text-sm text-[#C9D1D9]">Uploading…</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C77DFF]/20 mb-3">
                <Upload className="w-5 h-5 text-[#C77DFF]" />
              </div>
              <p className="text-sm text-[#C9D1D9]">
                <span className="text-[#C77DFF] font-medium">Click to upload</span> or drag and
                drop multiple images
              </p>
              <p className="text-xs text-white/40 mt-1">
                {accept} · up to {maxMB} MB each
              </p>
            </>
          )}
        </div>
      </div>

      {/* URL paste fallback */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="…or paste an image URL"
          className="flex-1 rounded-lg border border-white/10 bg-[#0B1320]/50 px-3 py-2 text-sm text-[#C9D1D9] placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF]"
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={!urlInput.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#C77DFF]/30 bg-[#C77DFF]/10 px-3 py-2 text-xs font-medium text-[#C77DFF] hover:bg-[#C77DFF]/20 disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* Thumbnail grid */}
      {value.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              {value.length} image{value.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Remove all ${value.length} images?`)) onChange([]);
              }}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove all
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {value.map((url, idx) => (
              <div
                key={`${url}-${idx}`}
                className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-[#0B1320]/60"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Gallery image ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Index ribbon */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0B1320]/85 backdrop-blur-sm border border-white/20">
                  <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                </div>
                {/* Hover controls */}
                <div className="absolute inset-0 bg-[#0B1320]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => move(idx, "up")}
                    disabled={idx === 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-[#0B1320]/80 text-white/80 hover:bg-[#C77DFF]/20 hover:text-[#C77DFF] disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, "down")}
                    disabled={idx === value.length - 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-[#0B1320]/80 text-white/80 hover:bg-[#C77DFF]/20 hover:text-[#C77DFF] disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/20 text-red-300 hover:bg-red-500/40 hover:text-white"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center">
          <ImageIcon className="h-5 w-5 text-white/30 mx-auto mb-1" />
          <p className="text-xs text-white/50">No images yet</p>
        </div>
      )}
    </div>
  );
}
