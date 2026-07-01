import type { NextConfig } from "next";

const SUPABASE_HOSTNAME = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://tgtsxotpwgxowntvqlwi.supabase.co",
    ).hostname;
  } catch {
    return "tgtsxotpwgxowntvqlwi.supabase.co";
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Skip source maps on production browser bundle (smaller, faster)
  productionBrowserSourceMaps: false,
  // Compression handled by Vercel edge — disable Node-level gzip to save CPU
  compress: true,

  // ─── Image optimization ────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_HOSTNAME,
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
    ],
    // Modern formats only — smallest payload
    formats: ["image/avif", "image/webp"],
    // Cache transformed images aggressively at the edge
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    // Sizes we actually render — cuts the variant matrix Vercel generates
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Next 16 requires explicit quality whitelist for non-default values
    qualities: [70, 75, 88, 90, 92],
  },

  // ─── Tree-shake heavy icon packages + tune router cache ────────────────
  experimental: {
    // Only import the icons you actually use (cuts 100s of KB from lucide-react)
    optimizePackageImports: ["lucide-react", "sonner"],
    // Client-side Router Cache: how long to reuse a prefetched/visited segment
    // before refetching. Defaults are too aggressive at 0/300s — bump both.
    staleTimes: {
      dynamic: 30, // dynamic routes — refresh after 30s of inactivity
      static: 300, // static / ISR routes — keep for 5 min
    },
  },

  // ─── Headers ───────────────────────────────────────────────────────────
  async headers() {
    return [
      // Security headers on every route
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
          },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      // Static asset chunks — already content-hashed, cache forever
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Optimized next/image output — long cache, browser still revalidates on demand
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=2592000",
          },
        ],
      },
      // Public static files (favicon, og images)
      {
        source: "/favicon.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
