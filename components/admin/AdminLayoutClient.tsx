"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Home as HomeIcon,
  Users,
  Mail,
  GraduationCap,
  Layers,
  Briefcase,
  BadgeCheck,
  Sparkles,
  FolderKanban,
  SquareStack,
  BookOpen,
  PenLine,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ADMIN_LOGIN_PATH, ADMIN_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

type Props = {
  userEmail: string | null;
  siteName: string;
  avatarUrl?: string | null;
  children: React.ReactNode;
};

const NAV = [
  {
    title: "Overview",
    items: [
      { href: `${ADMIN_PATH}/dashboard`, icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: `${ADMIN_PATH}/cms/hero`, icon: HomeIcon, label: "Hero" },
      { href: `${ADMIN_PATH}/cms/about`, icon: Users, label: "About" },
      { href: `${ADMIN_PATH}/cms/contact`, icon: Mail, label: "Contact" },
    ],
  },
  {
    title: "Profile",
    items: [
      { href: `${ADMIN_PATH}/cms/education`, icon: GraduationCap, label: "Education" },
      { href: `${ADMIN_PATH}/cms/skills`, icon: Layers, label: "Core Skills" },
      { href: `${ADMIN_PATH}/cms/experience`, icon: Briefcase, label: "Experience" },
      { href: `${ADMIN_PATH}/cms/certifications`, icon: BadgeCheck, label: "Certifications" },
      { href: `${ADMIN_PATH}/cms/techStackCategories`, icon: Sparkles, label: "Tech Stack" },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { href: `${ADMIN_PATH}/cms/projects`, icon: SquareStack, label: "Projects" },
      { href: `${ADMIN_PATH}/cms/publications`, icon: BookOpen, label: "Publications" },
      { href: `${ADMIN_PATH}/cms/achievements`, icon: BadgeCheck, label: "Achievements" },
    ],
  },
  {
    title: "Engagement",
    items: [
      { href: `${ADMIN_PATH}/cms/services`, icon: PenLine, label: "Services" },
      { href: `${ADMIN_PATH}/cms/blogs`, icon: FileText, label: "Blogs" },
      { href: `${ADMIN_PATH}/cms/testimonials`, icon: MessageSquare, label: "Testimonials" },
      { href: `${ADMIN_PATH}/cms/clients`, icon: FolderKanban, label: "Clients" },
    ],
  },
  {
    title: "System",
    items: [
      { href: `${ADMIN_PATH}/cms/resumes`, icon: FileText, label: "Resumes" },
      { href: `${ADMIN_PATH}/messages`, icon: MessageSquare, label: "Messages" },
    ],
  },
];

export function AdminLayoutClient({ userEmail, siteName, avatarUrl, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const supabase = createSupabaseBrowserClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push(ADMIN_LOGIN_PATH);
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-[#0B1320]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full border-r border-white/10 bg-gradient-to-b from-[#0B1320] via-[#0B1320] to-[#0B1320]/90 transition-all duration-300",
          collapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
          <div className={cn("flex items-center gap-3", collapsed && "hidden")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] shadow-lg shadow-[#C77DFF]/30">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Admin Panel</div>
              <div className="text-xs text-[#C77DFF]">{siteName}</div>
            </div>
          </div>
          <button
            type="button"
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0B1320]/60 text-white/60 hover:bg-white/5 hover:text-white hover:border-[#C77DFF]/50 transition-all"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/60 hover:bg-[#C77DFF]/20 hover:text-white"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="h-[calc(100%-5rem)] overflow-y-auto px-3 py-6 space-y-6">
          {NAV.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <div className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-[#C77DFF]">
                  {section.title}
                </div>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive(item.href)
                          ? "bg-gradient-to-r from-[#C77DFF]/20 to-[#9D4EDD]/20 border border-[#C77DFF]/30 text-white"
                          : "text-white/60 hover:text-white hover:bg-white/5",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-transform",
                          !collapsed && "group-hover:scale-110",
                        )}
                      />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className={cn("relative z-10 transition-all duration-300", collapsed ? "lg:ml-20" : "lg:ml-72")}>
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#0B1320]/90 backdrop-blur-xl px-4 sm:px-6">
          <button
            type="button"
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-[#C9D1D9] hover:bg-white/5"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0B1320]/60 px-3 py-2 hover:bg-white/5 transition-colors"
            >
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-lg border-2 border-[#C77DFF]/30 object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C77DFF] to-[#9D4EDD] text-sm font-bold text-[#0B1320]">
                  {(siteName || "A").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white">{siteName}</div>
                <div className="text-xs text-white/60 truncate max-w-[180px]">
                  {userEmail ?? "Admin"}
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-white/60 transition-transform",
                  menuOpen && "rotate-180",
                )}
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-[#0B1320]/95 shadow-xl backdrop-blur-xl">
                <div className="p-4 border-b border-white/10">
                  <div className="text-sm font-medium text-white">{siteName}</div>
                  <div className="text-xs text-white/60">Administrator</div>
                </div>
                <div className="py-2">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#C9D1D9] hover:bg-white/5 hover:text-white"
                  >
                    <HomeIcon className="h-4 w-4" />
                    View Site
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#C77DFF] hover:bg-[#C77DFF]/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="relative z-10 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-5rem)]">{children}</main>
      </div>
    </div>
  );
}
