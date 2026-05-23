/**
 * Massive keyword bank for SEO.
 *
 * Strategy: each public page gets a tailored slice — personal + page-relevant
 * categories — so search engines don't see duplicate keyword sets across routes.
 *
 * Owner-requested coverage:
 *   - Mahedi Hasan Emon (all variants)
 *   - CSE (Computer Science) — Bangladesh / Daffodil
 *   - Full-stack / Web Development / Django / React / Next.js
 *   - ML / Deep Learning / NLP / AI / BanglaBERT
 *   - DevOps / Docker / Kubernetes / Cloud
 */

const PERSONAL = [
  "Mahedi Hasan Emon",
  "Mahedi Emon",
  "MH Emon",
  "mahedihasanemon",
  "Mahedi Hasan Emon Bangladesh",
  "Mahedi Hasan Emon portfolio",
  "Mahedi Hasan Emon developer",
  "Mahedi Hasan Emon CSE",
  "Mahedi Hasan Emon Daffodil",
  "Daffodil International University",
  "CSE graduate Bangladesh",
  "computer science engineer Bangladesh",
];

const DEVELOPMENT = [
  "full-stack developer",
  "full-stack engineer",
  "software engineer",
  "software developer",
  "web developer",
  "frontend developer",
  "backend developer",
  "React developer",
  "Next.js developer",
  "TypeScript developer",
  "JavaScript developer",
  "Node.js developer",
  "Django developer",
  "Python developer",
  "REST API developer",
  "GraphQL developer",
  "freelance web developer Bangladesh",
  "hire web developer",
  "hire Django developer",
  "hire React developer",
  "hire full-stack engineer",
  "Tailwind CSS developer",
  "Supabase developer",
  "PostgreSQL developer",
  "scalable web platforms",
  "SaaS developer",
  "MVP development",
];

const ML_AI = [
  "machine learning engineer",
  "deep learning engineer",
  "NLP engineer",
  "AI engineer",
  "applied AI engineer",
  "ML researcher",
  "computer vision",
  "generative AI",
  "LLM engineer",
  "transformer models",
  "BERT",
  "BanglaBERT",
  "Bi-LSTM",
  "PyTorch",
  "TensorFlow",
  "Hugging Face",
  "data scientist Bangladesh",
  "Bangla NLP",
  "document classification",
  "ensemble learning",
  "research to production",
  "Bangla document classification",
  "Hybrid Ensemble Bangla NLP",
];

const DEVOPS = [
  "DevOps engineer",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "GitHub Actions",
  "AWS",
  "Vercel",
  "Netlify",
  "cloud engineer",
  "infrastructure as code",
  "Terraform",
  "Portainer",
  "DigitalOcean",
  "Uptime Kuma",
  "monitoring observability",
  "containerization",
];

const CONCEPTS = [
  "software architecture",
  "system design",
  "microservices",
  "distributed systems",
  "API development",
  "agile development",
  "scrum",
  "code review",
];

/** Combine duplicates removed, comma-joined string suitable for <meta keywords>. */
function build(...slices: string[][]): string {
  const merged = Array.from(new Set(slices.flat()));
  return merged.join(", ");
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahedihasanemon.site";

export const SITE_NAME = "Mahedi Hasan Emon";

export const PAGE_KEYWORDS = {
  home: build(PERSONAL, DEVELOPMENT, ML_AI, DEVOPS, CONCEPTS),
  about: build(PERSONAL, DEVELOPMENT, ML_AI, ["about", "skills", "experience", "education"]),
  portfolio: build(PERSONAL, DEVELOPMENT, ML_AI, ["projects", "case studies", "portfolio"]),
  services: build(PERSONAL, DEVELOPMENT, DEVOPS, ["services", "hire", "freelance", "consulting"]),
  blog: build(PERSONAL, DEVELOPMENT, ML_AI, DEVOPS, ["blog", "tutorials", "articles"]),
  publications: build(PERSONAL, ML_AI, ["research", "publications", "academic", "papers"]),
  testimonials: build(PERSONAL, ["testimonials", "reviews", "clients"]),
  achievements: build(PERSONAL, ML_AI, ["achievements", "awards", "certifications", "recognition"]),
  contact: build(PERSONAL, ["contact", "hire", "inquiry", "collaboration"]),
} as const;

export type PageKey = keyof typeof PAGE_KEYWORDS;

export function keywordsForPage(page: PageKey): string {
  return PAGE_KEYWORDS[page];
}
