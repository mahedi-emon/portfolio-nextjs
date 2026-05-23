"use client";

import { useState } from "react";
import { Upload, Link as LinkIcon, FileText, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadFileViaApi } from "@/lib/cms/mutations";
import type { FieldSchema } from "@/lib/cms/schemas";
import { cn } from "@/lib/utils/cn";

type Props = {
  field: FieldSchema;
  value: string;
  onChange: (url: string) => void;
};

export function ImageUploadField({ field, value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const accept = field.acceptedTypes ?? (field.type === "image" ? "image/*" : "*");
  const maxMB = field.maxSizeMB ?? (field.type === "image" ? 5 : 10);
  const bucket = field.storageBucket ?? "images";

  const handleFile = async (file: File) => {
    // Validate size
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`File too large — max ${maxMB} MB`);
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadFileViaApi(file, bucket);
      onChange(url);
      toast.success("Uploaded");
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
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setUrlMode((v) => !v)}
          className="text-xs text-white/50 hover:text-[#C77DFF] inline-flex items-center gap-1"
        >
          {urlMode ? (
            <>
              <Upload className="w-3 h-3" /> Upload file
            </>
          ) : (
            <>
              <LinkIcon className="w-3 h-3" /> Use URL
            </>
          )}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {urlMode ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/file"
          className="w-full rounded-xl border border-white/10 bg-[#0B1320]/50 px-4 py-3 text-sm text-[#C9D1D9] focus:outline-none focus:ring-2 focus:ring-[#C77DFF]/30 focus:border-[#C77DFF]"
        />
      ) : (
        <div
          className={cn(
            "relative rounded-xl border-2 border-dashed transition-all",
            dragOver ? "border-[#C77DFF] bg-[#C77DFF]/10" : "border-white/15 hover:border-[#C77DFF]/50",
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
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center p-6 text-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-[#C77DFF] animate-spin" />
            ) : value ? (
              field.type === "image" ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={value}
                  alt="preview"
                  className="h-24 w-24 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-[#0B1320]/60 border border-white/10 p-3">
                  <FileText className="w-8 h-8 text-[#C77DFF]" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#C9D1D9] truncate max-w-[200px]">
                      {value.split("/").pop() ?? "File"}
                    </p>
                    <p className="text-xs text-white/40">Click to replace</p>
                  </div>
                </div>
              )
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C77DFF]/20 mb-3">
                  <Upload className="w-5 h-5 text-[#C77DFF]" />
                </div>
                <p className="text-sm text-[#C9D1D9]">
                  <span className="text-[#C77DFF] font-medium">Click to upload</span> or drag and
                  drop
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {accept} up to {maxMB} MB
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
