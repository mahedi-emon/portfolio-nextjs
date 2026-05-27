"use client";

import { useState } from "react";
import { Eye, Loader2, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import type { PreviewType } from "@/lib/preview/token";

type Props = {
  type: PreviewType;
  id: string;
};

/**
 * Inline button for the edit form. Fetches a signed preview URL from the
 * admin API and either copies it to clipboard or opens it in a new tab.
 */
export function PreviewLinkButton({ type, id }: Props) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchUrl = async (): Promise<string | null> => {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/preview-link?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed");
      return String(data.url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed";
      toast.error(`Preview link: ${msg}`);
      return null;
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    const url = await fetchUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Preview URL copied to clipboard");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard refused (insecure context). Fallback: open in new tab so
      // the user can copy from the address bar.
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpen = async () => {
    const url = await fetchUrl();
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleOpen}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0B1320]/60 px-3 py-2 text-xs font-medium text-[#C9D1D9] hover:bg-white/5 hover:border-[#C77DFF]/40 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
        Open preview
      </button>
      <button
        type="button"
        onClick={handleCopy}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-xl border border-[#C77DFF]/30 bg-[#C77DFF]/10 px-3 py-2 text-xs font-semibold text-[#C77DFF] hover:bg-[#C77DFF]/20 disabled:opacity-50"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy share link"}
      </button>
    </div>
  );
}
