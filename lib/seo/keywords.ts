/**
 * Massive keyword bank for SEO.
 *
 * Strategy: each public page gets a tailored slice — personal + page-relevant
 * categories — so search engines don't see duplicate keyword sets across routes.
 *
 * Owner-requested coverage:
 *   - Mahedi Hasan Emon (all variants + alternate spellings)
 *   - CSE (Computer Science) — Bangladesh / Daffodil
 *   - Full-stack / Web Development / Django / React / Next.js / any software dev field
 *   - ML / Deep Learning / NLP / AI / BanglaBERT
 *   - DevOps / Docker / Kubernetes / Cloud
 */

// ─────────────────────────────────────────────────────────────
// PERSONAL — name variants, spellings, location, education
// ─────────────────────────────────────────────────────────────
const PERSONAL = [
  // Primary name
  "Mahedi Hasan Emon",
  "Mahedi Emon",
  "Hasan Emon",
  "MH Emon",
  "M H Emon",
  "Md Mahedi Hasan Emon",
  "Md. Mahedi Hasan Emon",
  "Mohammad Mahedi Hasan Emon",
  "mahedihasanemon",
  "mahedi hasan emon",
  // Common alternate spellings (people misspell — capture them)
  "Mehedi Hasan Emon",
  "Mahidi Hasan Emon",
  "Mahadi Hasan Emon",
  "Mahedi Hassan Emon",
  // Portfolio / branded queries
  "Mahedi Hasan Emon portfolio",
  "Mahedi Hasan Emon developer",
  "Mahedi Hasan Emon website",
  "Mahedi Hasan Emon GitHub",
  "Mahedi Hasan Emon LinkedIn",
  "Mahedi Hasan Emon resume",
  "Mahedi Hasan Emon CV",
  "Mahedi Hasan Emon CSE",
  "Mahedi Hasan Emon Daffodil",
  "Mahedi Hasan Emon Bangladesh",
  "Mahedi Hasan Emon Dhaka",
  "Mahedi Hasan Emon software engineer",
  "Mahedi Hasan Emon full stack",
  "Mahedi Hasan Emon ML engineer",
  // Education / location
  "Daffodil International University",
  "Daffodil University CSE",
  "DIU CSE",
  "DIU Bangladesh",
  "CSE graduate Bangladesh",
  "CSE student Bangladesh",
  "Computer Science Engineering Bangladesh",
  "Computer Science graduate Bangladesh",
  "BSc CSE Bangladesh",
  "B.Sc. in CSE",
  "software engineer Bangladesh",
  "software developer Bangladesh",
  "Dhaka software engineer",
  "Bangladesh tech talent",
];

// ─────────────────────────────────────────────────────────────
// SOFTWARE DEVELOPMENT — every flavor of role + framework
// ─────────────────────────────────────────────────────────────
const DEVELOPMENT = [
  // Roles
  "full-stack developer",
  "full-stack engineer",
  "full stack web developer",
  "software engineer",
  "software developer",
  "web developer",
  "frontend developer",
  "front-end developer",
  "backend developer",
  "back-end developer",
  "application developer",
  "product engineer",
  "senior developer",
  "junior developer",
  "freelance developer",
  "remote developer",
  "contract developer",

  // JavaScript / TypeScript ecosystem
  "JavaScript developer",
  "TypeScript developer",
  "React developer",
  "React.js developer",
  "Next.js developer",
  "Next.js 16 developer",
  "Next.js App Router",
  "Server Components developer",
  "Node.js developer",
  "Express developer",
  "Nest.js developer",
  "Vite developer",
  "Vue developer",
  "Svelte developer",
  "Astro developer",
  "Remix developer",
  "Tailwind CSS developer",
  "Tailwind v4 developer",
  "CSS developer",
  "HTML5 developer",
  "ShadCN developer",
  "Framer Motion developer",
  "Zustand developer",
  "React Query developer",
  "Redux developer",

  // Python / Django ecosystem
  "Python developer",
  "Python engineer",
  "Django developer",
  "Django REST framework",
  "DRF developer",
  "FastAPI developer",
  "Flask developer",
  "Pyramid developer",
  "Celery developer",

  // PHP / Java / others
  "PHP developer",
  "Laravel developer",
  "Java developer",
  "Spring Boot developer",
  "C++ developer",
  "Go developer",
  "Rust developer",

  // Mobile + cross-platform
  "React Native developer",
  "Expo developer",
  "mobile app developer",
  "cross-platform developer",

  // APIs + protocols
  "REST API developer",
  "GraphQL developer",
  "tRPC developer",
  "WebSocket developer",
  "API integration",
  "third-party API developer",
  "Stripe integration developer",

  // Databases + ORMs
  "PostgreSQL developer",
  "MySQL developer",
  "MongoDB developer",
  "Redis developer",
  "SQLite developer",
  "Prisma developer",
  "Drizzle developer",
  "SQLAlchemy developer",
  "Supabase developer",
  "Firebase developer",

  // Build / dev tools
  "Git developer",
  "Webpack developer",
  "Turbopack developer",
  "ESLint",
  "Prettier",

  // Hire-intent searches
  "hire web developer",
  "hire full-stack developer",
  "hire Django developer",
  "hire React developer",
  "hire Next.js developer",
  "hire TypeScript developer",
  "hire Python developer",
  "hire Node.js developer",
  "hire freelance developer Bangladesh",
  "freelance web developer Bangladesh",
  "freelance Next.js developer",
  "freelance Django developer",
  "hire software engineer for startup",
  "outsource web development Bangladesh",

  // Product / business framing
  "SaaS developer",
  "SaaS engineer",
  "MVP development",
  "startup developer",
  "early-stage engineer",
  "scalable web platforms",
  "production-ready web apps",
  "headless CMS developer",
  "Sanity developer",
  "Strapi developer",
  "Contentful developer",
  "e-commerce developer",
  "Shopify developer",
];

// ─────────────────────────────────────────────────────────────
// ML / AI / DEEP LEARNING / NLP
// ─────────────────────────────────────────────────────────────
const ML_AI = [
  // Roles
  "machine learning engineer",
  "ML engineer",
  "deep learning engineer",
  "DL engineer",
  "AI engineer",
  "applied AI engineer",
  "applied ML engineer",
  "NLP engineer",
  "natural language processing engineer",
  "computer vision engineer",
  "AI researcher",
  "ML researcher",
  "data scientist",
  "data scientist Bangladesh",
  "data engineer",
  "ML researcher Bangladesh",
  "AI engineer Bangladesh",

  // Domains
  "machine learning",
  "deep learning",
  "supervised learning",
  "unsupervised learning",
  "reinforcement learning",
  "natural language processing",
  "computer vision",
  "speech recognition",
  "generative AI",
  "generative models",
  "large language models",
  "LLM engineer",
  "LLM developer",
  "LLM fine-tuning",
  "RAG developer",
  "retrieval augmented generation",
  "prompt engineering",
  "vector search",
  "embeddings",
  "semantic search",

  // Models / architectures
  "transformer models",
  "BERT",
  "BanglaBERT",
  "GPT",
  "T5",
  "RoBERTa",
  "DistilBERT",
  "XLM-R",
  "mBERT",
  "ELECTRA",
  "Bi-LSTM",
  "LSTM",
  "GRU",
  "CNN",
  "ResNet",
  "U-Net",
  "YOLO",
  "VAE",
  "GAN",
  "diffusion models",
  "attention mechanism",
  "ensemble learning",
  "stacking ensemble",
  "voting classifier",
  "gradient boosting",
  "XGBoost",
  "LightGBM",
  "CatBoost",

  // Frameworks / libraries
  "PyTorch",
  "TensorFlow",
  "Keras",
  "Hugging Face",
  "Hugging Face Transformers",
  "scikit-learn",
  "sklearn",
  "spaCy",
  "NLTK",
  "Gensim",
  "OpenCV",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Plotly",
  "Jupyter Notebook",
  "Google Colab",
  "Weights & Biases",
  "MLflow",
  "DVC",

  // Bangla NLP — your specialty
  "Bangla NLP",
  "Bengali NLP",
  "Bangla text classification",
  "Bangla document classification",
  "Bangla sentiment analysis",
  "Bangla language model",
  "Bangla BERT",
  "low-resource NLP",
  "Hybrid Ensemble Bangla NLP",
  "Bangla deep learning",

  // Real-world / outcome keywords
  "document classification",
  "text classification",
  "sentiment analysis",
  "named entity recognition",
  "NER",
  "image classification",
  "object detection",
  "research to production",
  "research-to-production ML",
  "ML model deployment",
  "model serving",
  "ONNX runtime",
];

// ─────────────────────────────────────────────────────────────
// DEVOPS / CLOUD / INFRA
// ─────────────────────────────────────────────────────────────
const DEVOPS = [
  // Roles
  "DevOps engineer",
  "SRE",
  "site reliability engineer",
  "cloud engineer",
  "infrastructure engineer",
  "platform engineer",

  // Containers / orchestration
  "Docker",
  "Docker Compose",
  "Dockerfile",
  "containerization",
  "Kubernetes",
  "k8s",
  "Helm charts",
  "Podman",
  "container orchestration",

  // CI/CD
  "CI/CD",
  "continuous integration",
  "continuous deployment",
  "GitHub Actions",
  "GitLab CI",
  "Jenkins",
  "CircleCI",
  "Bitbucket Pipelines",
  "ArgoCD",
  "Tekton",

  // Cloud providers
  "AWS",
  "Amazon Web Services",
  "AWS Lambda",
  "AWS ECS",
  "AWS EKS",
  "AWS S3",
  "AWS RDS",
  "GCP",
  "Google Cloud Platform",
  "Azure",
  "DigitalOcean",
  "Hetzner",
  "Linode",
  "Cloudflare",
  "Cloudflare Workers",
  "Cloudflare Pages",
  "Vercel",
  "Vercel deployment",
  "Netlify",
  "Railway",
  "Render",
  "Fly.io",

  // Infra-as-code
  "Terraform",
  "Pulumi",
  "Ansible",
  "infrastructure as code",
  "IaC",

  // Monitoring / observability
  "Prometheus",
  "Grafana",
  "Datadog",
  "Sentry",
  "Uptime Kuma",
  "BetterStack",
  "monitoring observability",
  "log aggregation",
  "Loki",
  "ELK stack",
  "OpenTelemetry",

  // Networking / web
  "Nginx",
  "Caddy",
  "Apache",
  "reverse proxy",
  "load balancer",
  "CDN",
  "edge computing",
  "Portainer",
  "Linux server administration",
  "Ubuntu server",
  "Bash scripting",
];

// ─────────────────────────────────────────────────────────────
// CS CONCEPTS / WORKFLOW
// ─────────────────────────────────────────────────────────────
const CONCEPTS = [
  "software architecture",
  "system design",
  "high-level design",
  "low-level design",
  "microservices",
  "monolith to microservices",
  "distributed systems",
  "event-driven architecture",
  "message queues",
  "RabbitMQ",
  "Apache Kafka",
  "API development",
  "API design",
  "OpenAPI",
  "Swagger",
  "agile development",
  "Scrum",
  "Kanban",
  "TDD",
  "test-driven development",
  "BDD",
  "code review",
  "pair programming",
  "Git workflow",
  "trunk-based development",
  "feature flags",
  "performance optimization",
  "web performance",
  "Core Web Vitals",
  "Lighthouse score",
  "accessibility",
  "WCAG 2.2",
  "a11y",
  "responsive design",
  "mobile-first design",
  "progressive web app",
  "PWA",
  "SEO optimization",
  "technical SEO",
  "schema.org",
  "JSON-LD",
  "Web Vitals",
  "OAuth",
  "JWT",
  "authentication",
  "authorization",
  "RBAC",
  "row-level security",
  "RLS",
  "security best practices",
  "OWASP",
  "encryption",
  "HTTPS",
  "data structures and algorithms",
  "DSA",
  "LeetCode",
  "competitive programming",
];

/** Combine duplicates removed, comma-joined string suitable for <meta keywords>. */
function build(...slices: string[][]): string {
  const merged = Array.from(new Set(slices.flat()));
  return merged.join(", ");
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mahedihasanemon.site";

export const SITE_NAME = "Mahedi Hasan Emon";

/** Convenience export — every page gets PERSONAL keywords (name discovery) */
export const ALL_KEYWORDS_RAW = {
  PERSONAL,
  DEVELOPMENT,
  ML_AI,
  DEVOPS,
  CONCEPTS,
} as const;

export const PAGE_KEYWORDS = {
  home: build(PERSONAL, DEVELOPMENT, ML_AI, DEVOPS, CONCEPTS),
  about: build(PERSONAL, DEVELOPMENT, ML_AI, DEVOPS, [
    "about Mahedi Hasan Emon",
    "skills",
    "experience",
    "education",
    "biography",
    "resume",
    "CV",
    "professional background",
  ]),
  portfolio: build(PERSONAL, DEVELOPMENT, ML_AI, [
    "projects",
    "project portfolio",
    "case studies",
    "open source projects",
    "GitHub portfolio",
    "side projects",
    "client work",
  ]),
  services: build(PERSONAL, DEVELOPMENT, DEVOPS, [
    "services",
    "consulting services",
    "freelance services",
    "hire developer",
    "custom software development",
    "web development services",
    "API integration services",
    "deployment services",
    "technical consulting",
  ]),
  blog: build(PERSONAL, DEVELOPMENT, ML_AI, DEVOPS, [
    "blog",
    "developer blog",
    "tech blog",
    "tutorials",
    "programming articles",
    "Next.js tutorials",
    "Django tutorials",
    "ML tutorials",
    "DevOps articles",
    "how to guides",
  ]),
  publications: build(PERSONAL, ML_AI, [
    "research publications",
    "academic papers",
    "research papers",
    "scholarly articles",
    "conference papers",
    "journal articles",
    "Google Scholar",
    "research portfolio",
  ]),
  testimonials: build(PERSONAL, DEVELOPMENT, [
    "testimonials",
    "client reviews",
    "client feedback",
    "developer reviews",
    "work testimonials",
  ]),
  achievements: build(PERSONAL, ML_AI, DEVELOPMENT, [
    "achievements",
    "awards",
    "honors",
    "recognition",
    "professional certifications",
    "competition winner",
    "hackathon winner",
    "scholarship recipient",
  ]),
  contact: build(PERSONAL, DEVELOPMENT, [
    "contact",
    "hire me",
    "get in touch",
    "collaboration",
    "project inquiry",
    "freelance inquiry",
    "consultation request",
    "email Mahedi Hasan Emon",
  ]),
} as const;

export type PageKey = keyof typeof PAGE_KEYWORDS;

export function keywordsForPage(page: PageKey): string {
  return PAGE_KEYWORDS[page];
}
