import { Loader2 } from "lucide-react";

/**
 * Renders instantly when navigating between admin routes, so the user
 * sees feedback while the next route compiles (dev) or fetches (prod).
 *
 * Visible against the dark backdrop — we use bg-white/[0.08] and
 * bg-[#0B1320]/80 with visible borders so the skeleton never looks
 * like a blank page.
 */
export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#0B1320]/80 px-4 py-4">
        <Loader2 className="h-5 w-5 animate-spin text-[#C77DFF]" />
        <span className="text-sm font-medium text-white/70">Loading…</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-white/15 bg-[#0B1320]/80 p-4"
          >
            <div className="h-3 w-20 rounded bg-white/[0.08] mb-3" />
            <div className="h-8 w-12 rounded bg-white/[0.10]" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl border border-white/15 bg-[#0B1320]/80 flex items-center px-4 gap-3"
          >
            <div className="h-3 w-3 rounded-full bg-white/[0.10]" />
            <div className="h-3 flex-1 max-w-[300px] rounded bg-white/[0.08]" />
            <div className="h-6 w-16 rounded-full bg-white/[0.06]" />
          </div>
        ))}
      </div>
    </div>
  );
}
