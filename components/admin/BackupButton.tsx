"use client";

import { useState } from "react";
import { Download, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

/**
 * One-click full-site backup.
 *
 * Hits /api/admin/backup, downloads the response as a dated JSON file.
 * The endpoint dumps every CMS singleton + collection + contact messages.
 * Suggested cadence: monthly, store on Google Drive / Dropbox / private repo.
 */
export function BackupButton() {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/backup", { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const today = new Date().toISOString().slice(0, 10);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-backup-${today}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Backup failed";
      toast.error(`Backup failed: ${msg}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 p-4 text-left hover:border-[#C77DFF]/40 disabled:opacity-60"
    >
      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin text-[#C77DFF]" />
      ) : (
        <Download className="h-5 w-5 text-[#C77DFF]" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">
          {busy ? "Preparing backup…" : "Download backup"}
        </p>
        <p className="text-xs text-white/50">
          All content as JSON — save monthly
        </p>
      </div>
      <ShieldCheck className="h-4 w-4 text-emerald-400/60" />
    </button>
  );
}
