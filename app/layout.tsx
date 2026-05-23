import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuroraMesh } from "@/components/common/AuroraMesh";
import { Toaster } from "@/components/ui/Toaster";
import { PAGE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/seo/keywords";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B1320",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Full-Stack Developer & Portfolio`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Mahedi Hasan Emon — Full-Stack Developer specializing in scalable web platforms, React, Next.js, Django, and applied ML/NLP. Explore projects, blog, publications, and services.",
  keywords: PAGE_KEYWORDS.home,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Portfolio",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} — Full-Stack Developer & Portfolio`,
    description:
      "Full-Stack Developer specializing in scalable web platforms, React, Next.js, Django, and applied ML/NLP.",
    images: [{ url: "/favicon.png", width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Full-Stack Developer & Portfolio`,
    description:
      "Full-Stack Developer specializing in scalable web platforms, React, Next.js, Django, and applied ML/NLP.",
    images: ["/favicon.png"],
  },
  verification: {
    google: "jlxjOwW1WGQ6By_J7WrR4gfgktjiUKWfWseV2-U86Ng",
  },
  other: {
    "supabase-preconnect": "https://tgtsxotpwgxowntvqlwi.supabase.co",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Resource hints for Supabase CDN (Hero image preload) */}
        <link
          rel="preconnect"
          href="https://tgtsxotpwgxowntvqlwi.supabase.co"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://tgtsxotpwgxowntvqlwi.supabase.co" />
      </head>
      <body
        className="font-sans antialiased text-[#C9D1D9]"
        style={{ backgroundColor: "#0B1320" }}
      >
        {/* Animated background — persists across all routes */}
        <AuroraMesh variant="dark" />

        {/* Page content sits above the canvas */}
        <div className="relative z-10">{children}</div>

        {/* Toast host */}
        <Toaster />
      </body>
    </html>
  );
}
