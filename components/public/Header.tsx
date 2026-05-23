"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, X, ArrowUp } from "lucide-react";

type Props = {
  siteName: string;
};

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/#skills", label: "Skills", isAnchor: true },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Header({ siteName }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  }, []);

  // Hash scroll on home
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined" && window.location.hash) {
      const elementId = window.location.hash.replace("#", "");
      const t = setTimeout(() => scrollToElement(elementId), 100);
      return () => clearTimeout(t);
    }
  }, [pathname, scrollToElement]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNavClick = (e: React.MouseEvent, targetPath: string) => {
    if (pathname === targetPath) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAnchorClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const elementId = hash.replace("/#", "");
    if (pathname === "/") {
      scrollToElement(elementId);
    } else {
      router.push(`/${hash.replace("/", "")}`);
    }
  };

  const isActive = (to: string, end?: boolean) =>
    end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-[#0B1320]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="flex items-center min-w-0 sm:min-w-[280px]">
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "/")}
              className="group flex items-center gap-3 text-xl font-bold tracking-tight"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#C77DFF] text-[#0B1320] shadow-lg shadow-[#C77DFF]/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[#C77DFF]/50">
                <span className="text-lg font-bold">{siteName.charAt(0)}</span>
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
              </div>
              <span
                className="sm:block text-white font-semibold overflow-hidden whitespace-nowrap inline-block max-w-0 animate-typewriter-fixed"
                style={{ verticalAlign: "bottom" }}
              >
                {siteName}
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link, index) =>
              link.isAnchor ? (
                <button
                  key={link.to}
                  type="button"
                  onClick={(e) => handleAnchorClick(e, link.to)}
                  className="relative px-4 py-2 text-sm font-medium text-[#C9D1D9] transition-all duration-300 hover:text-white group animate-fade-in rounded-lg hover:bg-white/[0.06]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-0 rounded-lg bg-[#C77DFF]/0 transition-all duration-300 group-hover:bg-[#C77DFF]/[0.08] group-hover:shadow-[inset_0_0_12px_rgba(199,125,255,0.15)]" />
                </button>
              ) : (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={(e) => handleNavClick(e, link.to)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group animate-fade-in rounded-lg ${
                    isActive(link.to, link.end)
                      ? "text-white bg-white/[0.08]"
                      : "text-[#C9D1D9] hover:text-white hover:bg-white/[0.06]"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span
                    className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                      isActive(link.to, link.end)
                        ? "bg-[#C77DFF]/[0.12] shadow-[inset_0_0_12px_rgba(199,125,255,0.2)]"
                        : "bg-[#C77DFF]/0 group-hover:bg-[#C77DFF]/[0.08] group-hover:shadow-[inset_0_0_12px_rgba(199,125,255,0.15)]"
                    }`}
                  />
                </Link>
              ),
            )}
          </nav>

          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-transparent text-white transition-all duration-300 hover:border-[#C77DFF]/50 hover:bg-[#C77DFF]/10 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          className={`lg:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav
            className={`relative mx-4 sm:mx-6 mt-4 flex flex-col rounded-2xl bg-[#0B1320]/95 backdrop-blur-xl border border-white/10 p-4 max-h-[calc(100vh-120px)] overflow-y-auto transition-all duration-300 ${
              isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
          >
            {NAV_LINKS.map((link, index) =>
              link.isAnchor ? (
                <button
                  key={link.to}
                  type="button"
                  onClick={(e) => handleAnchorClick(e, link.to)}
                  className="relative rounded-xl px-4 py-3 text-left text-sm font-medium text-[#C9D1D9] transition-all duration-300 hover:text-white group overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute inset-0 rounded-xl bg-[#C77DFF]/0 transition-all duration-300 group-hover:bg-[#C77DFF]/[0.1]" />
                </button>
              ) : (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={(e) => handleNavClick(e, link.to)}
                  className={`relative rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 group overflow-hidden ${
                    isActive(link.to, link.end)
                      ? "bg-[#C77DFF]/[0.15] text-white"
                      : "text-[#C9D1D9] hover:text-white"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10">{link.label}</span>
                  {!isActive(link.to, link.end) && (
                    <span className="absolute inset-0 rounded-xl bg-[#C77DFF]/0 transition-all duration-300 group-hover:bg-[#C77DFF]/[0.1]" />
                  )}
                </Link>
              ),
            )}
          </nav>
        </div>
      </header>

      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#C77DFF] text-[#0B1320] shadow-lg shadow-[#C77DFF]/30 transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-[#C77DFF]/50 ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}
