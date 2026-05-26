import { Loader2 } from "lucide-react";

/**
 * Renders instantly when navigating between admin routes, so the user
 * sees feedback while the next route compiles (dev) or fetches (prod).
 */
export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-[#C77DFF]" />
        <div className="h-8 w-48 rounded-lg bg-white/5" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl border border-white/10 bg-[#0B1320]/60 backdrop-blur-sm"
          />
        ))}
      </div>
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-14 rounded-xl border border-white/10 bg-[#0B1320]/60"
          />
        ))}
      </div>
    </div>
  );
}
