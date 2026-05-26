# Professional Portfolio — Lifetime Playbook

A long-term strategy guide for **mahedihasanemon.site** — what to publish, what to track, and what to evolve so that this portfolio keeps working for you for 5+ years.

> **Author**: Mahedi Hasan Emon
> **Stack**: Next.js 16 + Supabase + Vercel
> **Status**: Production — `https://mahedihasanemon.site`

---

## 1. The "Why" — what a great portfolio actually does

A portfolio is **not** a CV. A CV says *"here is what I did."* A portfolio says *"here is who I am, here is what I think, here is what I can build for you."*

Three audiences will read it. Design every page for one of them:

| Audience | What they search for | What convinces them |
|---|---|---|
| **Recruiter / Hiring manager** | "{role} {city/remote}", "Django + React", "Full-stack engineer Bangladesh" | Clear role, recent dates, named tech stack, working links to deployed work |
| **Potential client** | "hire web developer", "build me a {X}", "freelance Next.js" | Case studies with measurable outcomes, testimonials, response time, easy contact |
| **Peer / Researcher** | "BanglaBERT", "NLP Bangladesh", your name + paper title | Publications, GitHub commit graph, blog posts with depth, open-source contributions |

**Rule of thumb**: every page should answer one of these searches in the first scroll. If a recruiter has to scroll to find what you do, they leave.

---

## 2. Content rituals — what to publish and when

The biggest lie about portfolios is that you build them once. The truth: **a portfolio that stops updating dies.** Search engines de-prioritize stale domains. Visitors leave when "Recent work — 2024" sits at the top in 2026.

### Weekly (15-30 min)
- Add at least one entry somewhere — a new tool to your tech stack, a tweak to a project description, an updated certification date.
- Check `/api/admin/messages` — reply to anything new within 24h. Slow responses kill freelance leads.

### Monthly
- **Ship one blog post.** Even short (500-800 words). Topics that work:
  - "How I solved X in Django this week"
  - "Five things I learned building Y"
  - "Comparing A vs B for {specific task}"
  - Write-up of a small open-source contribution
- Refresh the Hero subheadline or stats numbers.
- Sit with [Google Search Console](https://search.google.com/search-console) for 10 min — see what queries brought people in, and write next month's blog on the gap (e.g. if "django jwt tutorial" is in the impressions but no clicks, write that post).

### Quarterly
- Add 1-2 new projects to portfolio (even if they are side projects). 12 projects/year = a serious-looking portfolio in 3 years.
- Update the resume PDF (upload via admin → it auto-serves).
- Re-photograph the hero image if your appearance has changed materially.
- Audit your "Featured" project flags — only the 4 most impressive should be featured.

### Annually
- Walk through the entire site as if you're a stranger. What feels dated? What gets ignored? Cut what isn't earning its place.
- Refresh the keyword bank in `lib/seo/keywords.ts` based on what you actually want to be found for *next year* (not just what you did last year).
- Renew domain + check Vercel/Supabase billing.

---

## 3. The 5 highest-impact things to do NEXT (this month)

In rough order of return-on-effort:

1. **Add 3-5 testimonials.** Even from professors, classmates on group projects, or freelance clients. Ask them to use your full name + a specific outcome ("Mahedi shipped our auth flow in 4 days"). One-line testimonials with avatar + role + company are now fully supported by the admin panel.

2. **Write a project case study, not a project description.** For each Featured project, expand the `description` field into: **Problem → Constraints → My approach → What broke → Measurable result.** A reader who finishes one case study will hire you. A reader who skims a bullet list will not.

3. **Add real cover images for every project, blog, service, achievement.** Even a screenshot with a subtle gradient overlay beats a blank card. The new card designs lean heavily on the cover image — without one, the card falls back to a placeholder that signals "incomplete." Use [Carbon.now.sh](https://carbon.now.sh) for code screenshots, [Excalidraw](https://excalidraw.com) for architecture diagrams.

4. **Set up Google Search Console + Bing Webmaster Tools.** Submit the sitemap (already auto-generated at `/sitemap.xml`). Without GSC you are flying blind on SEO.

5. **Connect a domain-verified email** (`hi@mahedihasanemon.site` via Cloudflare/Zoho free tier). A Gmail address on a professional portfolio drops your perceived seniority by half.

---

## 4. SEO strategy — already strong, here's how to keep it that way

What is already wired in this site (don't break it):
- Per-page `generateMetadata` — every route has unique title/description/OG/Twitter
- JSON-LD via Server Components on every page (Person, WebSite, BlogPosting, CreativeWork, ProfessionalService)
- Native `sitemap.xml` includes every published blog + project slug
- All public pages are statically pre-rendered (`○` Static or `●` SSG) — Google loves fast pages
- Massive keyword bank in `lib/seo/keywords.ts` spanning full-stack, ML, DevOps, your name

What to add over time:

### High-intent long-tail posts (the cheat code)
Forget "JavaScript tutorial" — too competitive. Write for tail queries:

- "How to deploy Django + Next.js together on a single Vercel project"
- "BanglaBERT fine-tuning for document classification"
- "Supabase Storage RLS policies for admin-only writes"

These rank in weeks, not months, and bring qualified visitors.

### Internal linking
Every blog post should link to at least one project. Every project should link to at least one blog post that goes deeper. This is the single biggest lever for SEO most people ignore.

### External signal building (slow but compounds)
- Cross-post one blog/month to dev.to or Hashnode with a canonical link back to your site.
- Answer one Stack Overflow / Reddit question per week in your specialty area; if relevant, link to your post.
- Get listed on 2-3 niche directories per quarter (Bangladesh dev directories, Awesome-Django lists, etc.).

---

## 5. The 10 features that would set this site apart

These are forward-looking enhancements — none are required, but each one adds a memorable touch:

1. **Reading-mode TOC** on blog posts (sticky right-side `<h2>` outline). Long posts become navigable, average time-on-page doubles.
2. **Dynamic OG images** via `@vercel/og` — auto-composed share cards with title + cover + your branding for every blog/project. Massive boost to social CTR.
3. **"Now" page** (`/now`) — a single-paragraph page that says what you're working on this month. Updated monthly. Surprisingly memorable, low effort.
4. **Newsletter signup** (Buttondown or Resend) — even 50 subscribers is a tribe. Email them when you ship something.
5. **GitHub activity widget** on `/about` showing your contribution graph live. Signals "I code every day" without saying it.
6. **Dark/light theme toggle** (currently dark-only) — purely optional, but some recruiters explicitly screen for accessibility considerations.
7. **i18n EN ↔ BN** — would 4× your local audience and is a non-trivial differentiator in Bangladesh-based talent searches.
8. **Public uptime page** at `/status` — pings your own APIs, displays a green dot. Conveys engineering rigor for ~10 lines of code.
9. **Project filtering on `/portfolio`** by tech stack — visitors searching for "Next.js developer" can self-select to relevant work.
10. **Speaking / Press kit** — a single `/press` page with downloadable headshot, bio variants (50/100/200 words), and logo. Future speaking opportunities thank you.

---

## 6. Things to NEVER do (it hurts more than helps)

- **Don't list every tech you've ever touched.** Listing 47 tools signals "junior, eager to please." Listing 12 deep specialties signals "senior, opinionated, hire-able."
- **Don't put hobbies above projects.** Visitors don't care about your love for football until they care about your work.
- **Don't write "passionate developer" or "team player".** These phrases are invisible — replaced by *"shipped 12 production projects in the last 3 years"*.
- **Don't auto-play sound, video, or background music.** Ever.
- **Don't add a chatbot widget.** They almost always degrade UX on a personal site.
- **Don't gate the resume PDF behind a form.** Recruiters bounce. The resume should be one click.
- **Don't fake testimonials.** People can smell it, and one fake one taints the rest.
- **Don't let any project card sit without a description, image, or live link.** Better to delete it than leave it half-finished.

---

## 7. Operational hygiene — the boring stuff that prevents disaster

### Backups
- Supabase free tier does not auto-backup. Once a quarter, run:
  ```bash
  supabase db dump --db-url "postgresql://..." > backup-$(date +%F).sql
  ```
- Store backups in Google Drive or a private GitHub repo.

### Domain & DNS
- Set domain expiry calendar reminder **30 days before expiry** (not 1 day — registrar emails get lost in spam).
- Use Cloudflare for DNS (free, fast, easy SSL) — already protects against most DDoS for free.

### Vercel + Supabase free-tier limits to watch
- **Vercel**: 100 GB bandwidth/month — well within reach unless something goes viral. Set a budget alert.
- **Supabase**: 500 MB database + 1 GB storage. Already image-migrated to Supabase Storage so the DB stays small; periodically delete archived/draft items if they accumulate.
- **Supabase auto-pauses** inactive projects after 7 days idle on free tier. Use a Vercel cron (`/api/keep-alive` → SELECT 1) to keep it warm.

### Monitoring (zero-cost setup)
- Vercel Analytics (free tier) — enables basic page-view tracking.
- [BetterStack Uptime](https://betterstack.com/uptime) free plan — pings every 5 min, emails you if site is down.
- Google Search Console weekly digest emails — set up to land in your inbox.

### Security
- Never commit `.env.local`. Already in `.gitignore` — verify after every PR.
- Supabase **service key** must NEVER appear in client-side code or in any `NEXT_PUBLIC_*` env var.
- Rotate Supabase anon + service keys every 12 months.
- Admin panel path (`/mhe-control-center`) is obscured but not secret — security is enforced by Supabase Auth + RLS, not the path. Don't rely on path-hiding alone.

---

## 8. Measuring success — the only 4 metrics that matter

Most analytics dashboards are noise. Track these four (Vercel Analytics + Google Search Console give them all for free):

1. **Direct + Organic visits per month** — the trend, not the absolute number. If it's flat or down for 3 months running, you have a content velocity problem.
2. **Contact form submissions per month** — the only conversion that matters. Goal: 1-3/month sustainably from organic traffic.
3. **Search queries you rank top-10 for in Search Console** — should grow steadily as you publish. Set a goal of +5 ranking queries each quarter.
4. **Time on page for blog posts** — under 90s means the content is too thin or the topic missed intent. Over 3 min on long posts means you're earning attention.

Ignore: bounce rate (mostly meaningless), social shares (vanity), page views per session (also vanity for a portfolio).

---

## 9. When to redesign (and when NOT to)

A portfolio redesign is the most common form of productive procrastination. Resist.

**Don't redesign if:**
- You're bored of the design (visitors aren't — they see it once).
- A new framework version dropped (you don't need it).
- You saw a cool portfolio on Twitter (yours is fine).

**Do redesign if:**
- Your role has fundamentally changed (e.g. went from full-stack → AI research) and the homepage no longer tells the right story.
- The site no longer feels representative of your current taste (every 3-4 years is normal).
- A measurable issue exists — Core Web Vitals dropped, mobile usability score below 95, contact form broken.

When you do redesign, **preserve URLs and slugs** so existing SEO doesn't reset. Use 301 redirects in `next.config.ts` for any path change.

---

## 10. Final checklist — "Is my portfolio doing its job?"

Print this and re-read every 6 months. If you can answer YES to all 10, your portfolio is in the top 10% of personal developer sites.

- [ ] My full name appears in the `<h1>` of the homepage, in `<title>` tags, and in JSON-LD `Person` schema.
- [ ] A recruiter can determine my current role and tech specialty in under 3 seconds.
- [ ] Every "Featured" project has a cover image, summary, tech stack, and a live link OR detailed case study.
- [ ] My resume is downloadable in one click — no form, no email gate.
- [ ] Contact form works (test it monthly by submitting yourself), and I respond to all real messages within 24h.
- [ ] I've published at least one blog post in the last 60 days.
- [ ] Google Search Console shows my site is indexed and ranking for at least 20 queries containing my name + tech stack.
- [ ] Mobile Lighthouse scores: Performance ≥ 90, Accessibility ≥ 95, SEO = 100.
- [ ] There is no broken link, no `Lorem ipsum`, no "Coming soon" anywhere visible.
- [ ] I would not be embarrassed if my dream employer landed on this site tomorrow with no warning.

---

## Resources to bookmark

- **Search Console** — https://search.google.com/search-console
- **PageSpeed Insights** — https://pagespeed.web.dev (use weekly during content sprints)
- **Rich Results Test** — https://search.google.com/test/rich-results (validate JSON-LD after schema changes)
- **Schema.org reference** — https://schema.org (when adding new structured data types)
- **Refactoring UI book** — best $150 for design polish if you ever do redesign
- **"Hire Yourself First" by Adam Wathan** — for the freelance-mindset shift

---

> Built with care. Maintain with discipline. The portfolio is never done — and that's the point.
