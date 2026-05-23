import Link from "next/link";
import type { Metadata } from "next";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md space-y-6 text-center animate-fade-in">
        <p className="text-9xl font-bold gradient-text">404</p>
        <h1 className="text-3xl font-bold text-white">Page not found</h1>
        <p className="text-[#C9D1D9]/80">
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or never did.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C77DFF]/30 transition-all hover:-translate-y-0.5"
        >
          <Home className="h-4 w-4" />
          Back home
        </Link>
      </div>
    </div>
  );
}
