<div align="center">

# Mahedi Hasan Emon — Portfolio

A modern, content-driven portfolio site with an integrated headless CMS.
Built for performance, SEO, and a decade of low-friction content updates.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

**[mahedihasanemon.site](https://mahedihasanemon.site/)**

</div>

---

## Overview

A personal portfolio for showcasing software engineering work, research
publications, and writing — backed by a custom admin panel so every piece
of content is editable from the browser, without touching the codebase.

The public site is statically rendered for instant page loads; the editor
runs server-side over an authenticated session.

---

## Features

### For visitors
- Animated hero with profile, stats, and call-to-action
- About section — bio, skills, education, experience, certifications
- Portfolio with filterable tabs across projects, publications, and awards
- Project detail pages with full case studies and image galleries
- Long-form blog with rich content and reading time
- Services overview with image-led cards
- Public testimonials with avatars and ratings
- Native sitemap, robots.txt, and per-page Open Graph / Twitter / JSON-LD
- Fully responsive across mobile, tablet, and desktop

### For the owner (admin panel)
- Single-admin authentication via Supabase
- Schema-driven editor covering every content type
- Drag-and-drop image upload with live preview and gallery support
- Auto-generated slugs and read time, plus drag-to-reorder lists
- Save / update / delete with toast notifications and confirm dialogs
- One-click full-site JSON backup export
- HMAC-signed preview links for sharing drafts privately
- Scheduled publishing for blog posts via Vercel Cron
- Mobile-friendly layout with a slide-out sidebar drawer

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 with custom keyframe animations |
| UI motion | Framer Motion |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Validation | Zod |
| Sanitization | DOMPurify |
| Notifications | Sonner |
| Icons | Lucide React |
| Hosting | Vercel |

---

## Project Layout

```
.
├── app/                 Next.js App Router
│   ├── (public)/        Public marketing pages
│   ├── api/             Route handlers (contact form, admin endpoints)
│   └── ...              Sitemap, robots, root layout
├── components/
│   ├── public/          Hero, sections, cards, carousel
│   ├── admin/           Editor, form fields, layout
│   └── common/          Background canvas, modals, brand icons
├── lib/
│   ├── cms/             Schema, queries, server actions, mappers
│   ├── supabase/        Cookie-bound + browser + service-role clients
│   ├── seo/             Metadata, keywords, JSON-LD
│   ├── preview/         HMAC token signing for draft previews
│   └── utils/           Sanitization, formatters, helpers
└── public/              Static assets
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project with Auth + Storage enabled

### Install

```bash
git clone https://github.com/mahedi-emon/portfolio-nextjs.git
cd portfolio-nextjs
npm install
```

### Configure environment

Create a `.env.local` from the template:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public reads) |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `PREVIEW_SECRET` | Random string for signing draft preview tokens |
| `CRON_SECRET` | Random string for protecting scheduled-publish cron |

### Run

```bash
npm run dev      # local development on http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

---

## Deployment

The project is configured for deployment on Vercel:

1. Push the repository to GitHub.
2. Import the project on Vercel — the framework is auto-detected.
3. Set the environment variables listed above in the Vercel project settings.
4. Deploy. Subsequent pushes to `main` deploy automatically.

For custom domains, follow Vercel's domain-attachment flow and update
`NEXT_PUBLIC_SITE_URL` to match.

---

## License

This project is provided as-is for portfolio reference. The codebase is
not licensed for commercial reuse without permission. The site content
(text, images, project case studies) is © Mahedi Hasan Emon.

---

## Author

**Mahedi Hasan Emon** — Full-Stack Developer

- Website: [mahedihasanemon.site](https://mahedihasanemon.site)
- GitHub: [@mahedi-emon](https://github.com/mahedi-emon)
- LinkedIn: [in/mahediemon](https://www.linkedin.com/in/mahediemon/)

---

<div align="center">

<sub>Built with Next.js and Supabase.</sub>

</div>
