# 🚀 Portfolio Website + Admin CMS

Modern portfolio website with an integrated admin CMS. **Next.js 16 App Router + TypeScript + Tailwind v4 + Supabase**, deployed on **Vercel**.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)

- 🌐 Live site: [mahedihasanemon.site](https://mahedihasanemon.site/)
- 👨‍💻 Author: **Mahedi Hasan Emon** — Full-Stack Developer

---

## ✨ Features

### Public Site (SSR + ISR)
- **Hero** with dynamic spinning gradient border, floating orbs, animated stats
- **About** with profile + skills + experience + education + certifications
- **Portfolio** + project detail (`/portfolio/[slug]`) with gallery
- **Services** with image-or-icon cards
- **Blog** + post (`/blog/[slug]`) with sanitized rich content
- **Publications**, **Testimonials**, **Achievements** dedicated pages
- **Contact** form (server-side anon insert into Supabase)
- AuroraMesh canvas particle background, full responsive design

### Admin Panel (`/mhe-control-center`)
- Supabase Auth (single-admin model)
- Server-side middleware route guard
- Dynamic CMS editor for 16 sections — schema-driven `EntityForm`
- Real Supabase Storage upload via `/api/admin/upload` (no more base64)
- Toast notifications via `sonner`
- Messages list/detail with reply + delete
- Mobile-responsive sidebar drawer

### SEO
- Per-page `generateMetadata` (unique title / description / OG / Twitter)
- JSON-LD via Server Components (Person, WebSite, BlogPosting, etc.)
- Massive keyword bank covering Mahedi Hasan Emon + CSE + Full-stack + Django + React + Next.js + ML/AI/NLP/BanglaBERT + DevOps
- Native `sitemap.xml` + `robots.txt`
- ISR (`revalidate: 60`) on every public route

---

## 🛠️ Tech Stack

| Layer | Stack |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 4 + custom CSS animations |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Auth** | `@supabase/ssr` (cookie-bound, server + browser) |
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
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root: fonts, metadata, AuroraMesh, Toaster
│   ├── (public)/                 # Public site (SSR + ISR)
│   │   ├── layout.tsx            # Header + Footer
│   │   ├── page.tsx              # Home
│   │   ├── about/page.tsx
│   │   ├── portfolio/page.tsx + [slug]/page.tsx
│   │   ├── services/page.tsx
│   │   ├── blog/page.tsx + [slug]/page.tsx
│   │   ├── publications/page.tsx
│   │   ├── contact/page.tsx
│   │   └── ...
│   ├── mhe-control-center/       # Admin panel (auth-guarded)
│   │   ├── login/page.tsx
│   │   ├── auth/callback/page.tsx
│   │   └── (dashboard)/
│   │       ├── dashboard/page.tsx
│   │       ├── cms/[section]/page.tsx   # Dynamic CMS editor
│   │       └── messages/page.tsx + [id]/page.tsx
│   └── api/
│       ├── admin/upload/route.ts        # Auth-guarded → Supabase Storage
│       ├── admin/revalidate/route.ts    # ISR cache flush
│       └── contact/route.ts             # Public contact insert
├── components/
│   ├── public/                   # Header, Footer, HomePageClient, ServicesPageClient, ContactPageClient
│   ├── admin/                    # AdminLayoutClient, CmsSectionEditor, EntityForm, ImageUploadField
│   ├── common/                   # AuroraMesh, ScrollToTop, JsonLd, modals
│   └── ui/                       # Toaster
├── lib/
│   ├── supabase/                 # server, browser, proxy, service-role clients
│   ├── cms/                      # schemas, queries, mutations, mappers, types
│   ├── storage/                  # bucket helpers
│   ├── seo/                      # keywords, metadata, jsonld
│   └── utils/                    # sanitizeHtml, iconMap, getToolLogoUrl, cn
├── scripts/
│   └── migrate-base64-to-storage.mjs   # One-time migration of legacy inline images
├── proxy.ts                      # Next 16 middleware: Supabase session + admin route guard
├── next.config.ts
├── tsconfig.json
└── .env.local                    # NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SUPABASE_SERVICE_KEY
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/mahedi-emon/portfolio-nextjs.git
cd portfolio-nextjs

# 2. Install
npm install

# 3. Env vars (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...            # server-only
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 4. Dev
npm run dev                                # http://localhost:3000

# 5. Production build
npm run build && npm run start
```

---

## 🗃️ Supabase Schema

17 tables — 4 singletons + 13 collections:

**Singletons:** `cms_hero`, `cms_about`, `cms_contact`, `cms_resume_settings`

**Collections:** `education`, `skills`, `services`, `resumes`, `projects`, `publications`, `certifications`, `experience`, `blogs`, `testimonials`, `achievements`, `clients`, `tech_stack_categories`, `contact_messages`

**Storage buckets:** `images`, `documents`, `resumes`, `gallery`

Reserved-keyword renames handled by `lib/cms/mappers.ts`:
- `about.current_role` ↔ `current_job_role`
- `experience.role` ↔ `job_role`
- `publications.year` ↔ `publication_year`
- `achievements.year` ↔ `award_year`

---

## 🔧 Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start Next.js dev server on `http://localhost:3000` |
| `npm run build` | Production build (typecheck + bundle) |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `node --env-file=.env.local scripts/migrate-base64-to-storage.mjs` | One-time migration: legacy inline base64 → real Supabase Storage |

---

## 🌍 Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel — auto-detects Next.js
3. Add env vars in Vercel UI:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy

---

## 👨‍💻 Author

**Mahedi Hasan Emon** — Full-Stack Developer

- 🌐 [mahedihasanemon.site](https://mahedihasanemon.site)
- 🐙 [GitHub](https://github.com/mahedi-emon)
- 💼 [LinkedIn](https://www.linkedin.com/in/mahediemon/)

---

<p align="center">Built with ❤️ using <b>Next.js + Supabase</b></p>
