"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ADMIN_DASHBOARD_PATH } from "@/lib/constants";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? ADMIN_DASHBOARD_PATH;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createSupabaseBrowserClient();

  // If already authenticated, redirect away
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(next);
    });
  }, [router, next, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Email and password required");
      return;
    }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        const msg = friendlyAuthError(signInError.message);
        setError(msg);
        toast.error(msg);
        return;
      }
      toast.success("Welcome back!");
      router.push(next);
      router.refresh();
    } catch (err) {
      // Browser extensions (1Password, MetaMask, etc.) sometimes wrap
      // window.fetch and throw TypeError. Surface a friendly message instead
      // of leaking the raw extension stack trace into the UI.
      const raw = err instanceof Error ? err.message : "Network error";
      const isFetchFail = raw.toLowerCase().includes("failed to fetch");
      const msg = isFetchFail
        ? "Cannot reach the server. If you have 1Password or a wallet extension, try disabling it on localhost or use incognito."
        : "Sign-in failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-[#0B1320]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C77DFF]/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9D4EDD]/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] shadow-xl shadow-[#C77DFF]/30 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-white/60">Sign in to your admin dashboard</p>
        </div>

        <div className="rounded-3xl bg-[#0B1320]/80 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#C9D1D9] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl bg-[#0B1320]/60 border border-white/10 px-4 py-3 pl-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#C77DFF] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#C9D1D9] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-[#0B1320]/60 border border-white/10 px-4 py-3 pl-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#C77DFF] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C77DFF] to-[#9D4EDD] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#C77DFF]/30 hover:shadow-xl hover:shadow-[#C77DFF]/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/60 text-sm">
              Back to{" "}
              <Link href="/" className="text-[#C77DFF] hover:text-[#9D4EDD] font-medium">
                Portfolio
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function friendlyAuthError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid_grant"))
    return "Invalid email or password";
  if (m.includes("email not confirmed")) return "Please verify your email";
  if (m.includes("too many")) return "Too many attempts — try again in a moment";
  return "Sign-in failed. Please try again.";
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
