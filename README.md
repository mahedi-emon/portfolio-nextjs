# 🚀 Portfolio Website + Admin CMS

Modern portfolio with an integrated admin CMS — **Next.js 16 App Router + TypeScript + Tailwind v4 + Supabase**, deployed on **Vercel**.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)

- 🌐 Live: [mahedihasanemon.site](https://mahedihasanemon.site/)
- 👨‍💻 Author: **Mahedi Hasan Emon** — Full-Stack Developer

---

## ⚡ Performance — Production Grade

Every public route is **static or SSG**, served from Vercel CDN edge with near-zero server work.

| Route | Type | What it means |
|---|---|---|
| `/` `/about` `/blog` `/contact` `/portfolio` `/publications` `/services` | **○ Static** | Pre-rendered at deploy, served from CDN |
| `/blog/[slug]` `/portfolio/[slug]` | **● SSG** | Every published slug pre-built at deploy time |
| `/sitemap.xml` `/robots.txt` | **○ Static** | Built once |
| `/api/*` `/mhe-control-center/*` | **ƒ Dynamic** | Auth-bound APIs and admin panel only |

### Optimizations layered
1. **`unstable_cache` on every public query** — multiple visitors in the same revalidation window share one Supabase round-trip (cross-request data cache).
2. **`generateStaticParams`** on slug pages — every existing blog post + project is HTML-baked at build time.
3. **Slim column lists** — list queries skip heavy `content` / `description` HTML; detail pages fetch `*`.
4. **`revalidate: 300`** on public pages + **`revalidateTag('cms')`** triggered by admin save = instant content updates, no stale serving.
5. **`next/image`** with AVIF/WebP + responsive `sizes` + lazy load — images ~70% smaller, quality preserved (88-92).
6. **`optimizePackageImports`** for `lucide-react` + `sonner` — tree-shaken icon imports cut hundreds of KB.
7. **HTTP Cache-Control** — `immutable` 1-year for `/_next/static/*`, `stale-while-revalidate` for `/_next/image*`.
8. **Router Cache `staleTimes`** — back/forward navigation reuses prefetched segments for 30-300 s.
9. **All images in real Supabase Storage** (not base64 in DB) — page payload dropped from **45 MB → 167 KB**.

### Measured speeds (Vercel production estimate)

| Visitor scenario | TTFB |
|---|---|
| Any public page, cached | **30-60 ms** (CDN edge HTML) |
| First visitor after 5-min stale window | **150-400 ms** (background regen) |
| First visitor after admin save | **400-800 ms** (one fresh Supabase fetch, then cached) |
| Repeat in-session navigation | **0 ms** (Router Cache hit) |

---

## ✨ Features

### Public Site
- **Hero** with spinning conic gradient border, floating orbs, animated stats
- **About** with sticky profile card, skills pills, education with initials, experience timeline, certifications
- **Portfolio** with `Projects | Publications | Achievements` tabs, certificate modal
- **Project / Blog detail** with sanitized rich content, gallery
- **Services**, **Contact** (form posts to `/api/contact`)
- **Testimonials** with avatar / role / company
- **AuroraMesh** canvas particle background, full responsive design
- **GlobalLoader** splash (morphing core + 3 orbiting orbs) on first paint

### Admin Panel (`/mhe-control-center`)
- Supabase Auth (single-admin model), server-side middleware route guard
- Dynamic CMS editor for 16 sections (schema-driven `EntityForm`)
- Real Supabase Storage upload via `/api/admin/upload`
- Sonner toast notifications
- Messages list/detail with reply + delete
- Mobile-responsive sidebar drawer

### SEO
- Per-page `generateMetadata` (unique title / description / OG / Twitter)
- JSON-LD via Server Components — Person, WebSite, BlogPosting, CreativeWork, ProfessionalService, Review, etc.
- Massive keyword bank: Mahedi Hasan Emon + CSE + Full-stack + Django + React + Next.js + ML/AI/NLP/BanglaBERT + DevOps
- Native `sitemap.xml` (includes all slug routes) + `robots.txt`

---

## 🛠️ Tech Stack

| Layer | Stack |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 4 + custom CSS keyframes |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Auth** | `@supabase/ssr` (cookie-bound server + browser) |
| **Caching** | `unstable_cache` (cross-request) + React `cache()` (per-request) |
| **Animation** | Framer Motion + custom keyframes |
| **Icons** | Lucide React + Simple Icons CDN |
| **Validation** | Zod |
| **Sanitization** | DOMPurify |
| **Toasts** | Sonner |
| **Hosting** | Vercel |

---

## 📁 Project Structure

```
.
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root: fonts, metadata, AuroraMesh, Toaster, GlobalLoader
│   ├── globals.css                 # Tailwind v4 + custom keyframes
│   ├── sitemap.ts                  # Dynamic sitemap (includes slug routes)
│   ├── robots.ts                   # Native robots
│   ├── (public)/                   # All public routes — static + SSG
│   │   ├── layout.tsx              # Header + Footer (also static)
│   │   ├── page.tsx                # Home
│   │   ├── about/page.tsx
│   │   ├── portfolio/page.tsx + [slug]/page.tsx       # SSG via generateStaticParams
│   │   ├── services/page.tsx
│   │   ├── blog/page.tsx + [slug]/page.tsx            # SSG via generateStaticParams
│   │   ├── publications/page.tsx
│   │   └── contact/page.tsx
│   ├── mhe-control-center/         # Admin (cookie-bound, never cached)
│   │   ├── login/page.tsx
│   │   ├── auth/callback/page.tsx
│   │   └── (dashboard)/
│   │       ├── dashboard/page.tsx
│   │       ├── cms/[section]/page.tsx                # Dynamic CMS editor
│   │       └── messages/page.tsx + [id]/page.tsx
│   └── api/
│       ├── admin/upload/route.ts                     # Auth-guarded → Supabase Storage
│       ├── admin/revalidate/route.ts                 # revalidatePath + revalidateTag('cms')
│       └── contact/route.ts                          # Public contact insert
├── components/
│   ├── public/                     # Header, Footer, HomePageClient, AboutPageClient, PortfolioPageClient, ServicesPageClient, ContactPageClient
│   ├── admin/                      # AdminLayoutClient, CmsSectionEditor, EntityForm, ImageUploadField, MessageActions
│   ├── common/                     # AuroraMesh, GlobalLoader, ScrollToTop, JsonLd, ResumeViewerModal, CertificateModal
│   └── ui/                         # Toaster
├── lib/
│   ├── supabase/
│   │   ├── server.ts               # cookie-bound server client (admin)
│   │   ├── browser.ts              # browser client (admin mutations)
│   │   ├── proxy.ts                # session refresh + admin guard
│   │   ├── service-role.ts         # SERVER-ONLY service key client
│   │   └── public.ts               # stateless anon client (cacheable, public reads)
│   ├── cms/
│   │   ├── schemas.ts              # 16 section field schemas
│   │   ├── queries.ts              # cache() + unstable_cache wrapped, slim columns
│   │   ├── mutations.ts            # client-side CRUD wrappers
│   │   ├── mappers.ts              # snake_case ↔ camelCase + reserved keyword renames
│   │   └── types.ts                # frontend camelCase interfaces
│   ├── storage/buckets.ts          # bucket helpers
│   ├── seo/                        # keywords, metadata, jsonld
│   └── utils/                      # sanitizeHtml, iconMap, getToolLogoUrl, cn
├── scripts/
│   ├── migrate-base64-to-storage.mjs   # one-time migration (already run)
│   └── fix-encoding.mjs                # UTF-8 mojibake repair
├── proxy.ts                        # Next 16 middleware (Supabase session + admin guard)
├── next.config.ts                  # image domains, headers, package optimization, cache TTL
├── tsconfig.json                   # strict, path alias @/*
└── .env.local                      # NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SUPABASE_SERVICE_KEY
```

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/mahedi-emon/portfolio-nextjs.git
cd portfolio-nextjs

# Install
npm install

# Env vars (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...            # server-only
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Dev
npm run dev                                # http://localhost:3000

# Production
npm run build && npm run start
```

---

## 🗃️ Supabase Schema

17 tables — 4 singletons + 13 collections:

**Singletons:** `cms_hero`, `cms_about`, `cms_contact`, `cms_resume_settings`

**Collections:** `education`, `skills`, `services`, `resumes`, `projects`, `publications`, `certifications`, `experience`, `blogs`, `testimonials`, `achievements`, `clients`, `tech_stack_categories`, `contact_messages`

**Storage buckets:** `images`, `documents`, `resumes`, `gallery`

Reserved-keyword renames in `lib/cms/mappers.ts`:
- `about.current_role` ↔ `current_job_role`
- `experience.role` ↔ `job_role`
- `publications.year` ↔ `publication_year`
- `achievements.year` ↔ `award_year`

---

## 🔧 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server → `http://localhost:3000` |
| `npm run build` | Production build (typecheck + bundle + static prerender) |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `node --env-file=.env.local scripts/migrate-base64-to-storage.mjs` | One-time migration of legacy inline images |

---

## 🌍 Deploy (Vercel)

1. Push to GitHub
2. Import to Vercel — auto-detects Next.js
3. Set env vars in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy → live in ~2 min
5. Point custom domain DNS to Vercel

---

## 👨‍💻 Author

**Mahedi Hasan Emon** — Full-Stack Developer

- 🌐 [mahedihasanemon.site](https://mahedihasanemon.site)
- 🐙 [GitHub](https://github.com/mahedi-emon)
- 💼 [LinkedIn](https://www.linkedin.com/in/mahediemon/)

---

<p align="center">Built with ❤️ using <b>Next.js + Supabase</b></p>
