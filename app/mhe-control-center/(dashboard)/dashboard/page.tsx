import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { ADMIN_PATH } from "@/lib/constants";

export default async function DashboardPage() {
  // Service-role: dashboard layout already guards auth. Bypasses RLS so
  // counts never come back as 0 due to a missing read policy.
  const supabase = createSupabaseServiceRoleClient();

  // Fan-out counts via parallel head selects
  const [
    { count: projectsTotal },
    { count: projectsPublished },
    { count: blogsTotal },
    { count: techStackCount },
    { count: unreadMessages },
    { count: testimonialsCount },
    { count: achievementsCount },
    { count: servicesCount },
    recentMessagesQuery,
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("blogs").select("id", { count: "exact", head: true }),
    supabase.from("tech_stack_categories").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
    supabase.from("achievements").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id, name, subject, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const recentMessages = recentMessagesQuery.data ?? [];

  const stats = [
    {
      label: "Projects",
      value: projectsTotal ?? 0,
      sub: `${projectsPublished ?? 0} published`,
      icon: FolderKanban,
      href: `${ADMIN_PATH}/cms/projects`,
      from: "from-[#C77DFF]",
      to: "to-[#9D4EDD]",
    },
    {
      label: "Blog Posts",
      value: blogsTotal ?? 0,
      sub: "Articles & tutorials",
      icon: FileText,
      href: `${ADMIN_PATH}/cms/blogs`,
      from: "from-cyan-500",
      to: "to-blue-600",
    },
    {
      label: "Tech Stack",
      value: techStackCount ?? 0,
      sub: "Categories",
      icon: Sparkles,
      href: `${ADMIN_PATH}/cms/techStackCategories`,
      from: "from-amber-500",
      to: "to-orange-600",
    },
    {
      label: "Unread Messages",
      value: unreadMessages ?? 0,
      sub: "New inquiries",
      icon: MessageSquare,
      href: `${ADMIN_PATH}/messages`,
      from: "from-emerald-500",
      to: "to-teal-600",
    },
    {
      label: "Services",
      value: servicesCount ?? 0,
      sub: "Offered",
      icon: Plus,
      href: `${ADMIN_PATH}/cms/services`,
      from: "from-pink-500",
      to: "to-rose-500",
    },
    {
      label: "Testimonials",
      value: testimonialsCount ?? 0,
      sub: "Client reviews",
      icon: CheckCircle2,
      href: `${ADMIN_PATH}/cms/testimonials`,
      from: "from-indigo-500",
      to: "to-purple-600",
    },
    {
      label: "Achievements",
      value: achievementsCount ?? 0,
      sub: "Recognitions",
      icon: Sparkles,
      href: `${ADMIN_PATH}/cms/achievements`,
      from: "from-yellow-500",
      to: "to-orange-500",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/60">Quick overview of your portfolio content.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1320]/60 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[#C77DFF]/40 hover:shadow-xl hover:shadow-[#C77DFF]/15"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  {s.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-white">{s.value}</p>
                <p className="mt-1 text-xs text-white/40">{s.sub}</p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.from} ${s.to} text-white shadow-lg`}
              >
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <ArrowUpRight className="absolute right-3 bottom-3 h-4 w-4 text-white/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C77DFF]" />
          </Link>
        ))}
      </div>

      {/* Recent messages */}
      <section className="rounded-2xl border border-white/10 bg-[#0B1320]/60 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Messages</h2>
          <Link
            href={`${ADMIN_PATH}/messages`}
            className="text-xs font-semibold text-[#C77DFF] hover:underline"
          >
            View all
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <p className="text-sm text-white/50">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {recentMessages.map((m) => (
              <li key={m.id}>
                <Link
                  href={`${ADMIN_PATH}/messages/${m.id}`}
                  className="flex items-center justify-between gap-3 py-3 hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{m.subject}</p>
                    <p className="truncate text-xs text-white/60">
                      from {m.name} ·{" "}
                      {new Date(m.created_at as string).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {m.status === "new" ? (
                    <span className="rounded-full bg-[#C77DFF]/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#C77DFF]">
                      New
                    </span>
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-white/30" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Quick actions */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          href={`${ADMIN_PATH}/cms/projects`}
          className="group flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 p-4 hover:border-[#C77DFF]/40"
        >
          <Plus className="h-5 w-5 text-[#C77DFF]" />
          <div>
            <p className="text-sm font-semibold text-white">New project</p>
            <p className="text-xs text-white/50">Add a portfolio entry</p>
          </div>
        </Link>
        <Link
          href={`${ADMIN_PATH}/cms/blogs`}
          className="group flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 p-4 hover:border-[#C77DFF]/40"
        >
          <Plus className="h-5 w-5 text-[#C77DFF]" />
          <div>
            <p className="text-sm font-semibold text-white">New blog post</p>
            <p className="text-xs text-white/50">Publish an article</p>
          </div>
        </Link>
        <Link
          href={`${ADMIN_PATH}/cms/hero`}
          className="group flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 p-4 hover:border-[#C77DFF]/40"
        >
          <Clock className="h-5 w-5 text-[#C77DFF]" />
          <div>
            <p className="text-sm font-semibold text-white">Update hero</p>
            <p className="text-xs text-white/50">Tagline, CTA, photo</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
