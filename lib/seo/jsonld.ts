/**
 * Schema.org JSON-LD builders.
 *
 * Each function returns one or more schema objects ready to feed into
 * <JsonLd data={...} /> from a Server Component.
 */

import type { About, Blog, Hero, Project, Publication, Service, Testimonial } from "@/lib/cms/types";
import { SITE_NAME, SITE_URL } from "./keywords";

const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`;

function personSchema(about?: About, hero?: Hero, socialUrls?: string[]) {
  const name = about?.fullName || hero?.fullName || SITE_NAME;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name,
    givenName: "Mahedi Hasan",
    familyName: "Emon",
    alternateName: ["Mahedi Emon", "MH Emon"],
    url: SITE_URL,
    image: about?.profileImageUrl || hero?.heroImageUrl || DEFAULT_IMAGE,
    jobTitle: about?.currentRole || "Full-Stack Developer",
    description:
      about?.tagline ||
      hero?.subheadline ||
      "Full-Stack Developer specializing in scalable web platforms, React, Next.js, Django, and applied ML/NLP.",
    nationality: { "@type": "Country", name: "Bangladesh" },
    knowsAbout: [
      "Web Development",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Django",
      "Python",
      "Full-Stack Development",
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "DevOps",
      "Software Engineering",
    ],
    sameAs: socialUrls ?? [],
  };
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: `${SITE_NAME} — Portfolio`,
    url: SITE_URL,
    description:
      "Official portfolio website of Mahedi Hasan Emon — Full-Stack Developer building scalable web platforms.",
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-US",
  };
}

export function homePageSchemas(args: {
  hero?: Hero;
  about?: About;
  socialUrls?: string[];
}) {
  return [
    personSchema(args.about, args.hero, args.socialUrls),
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      name: `${SITE_NAME} — Portfolio`,
      url: SITE_URL,
      mainEntity: { "@id": `${SITE_URL}/#person` },
      description: `Official portfolio website of ${SITE_NAME} — Full-Stack Developer.`,
    },
    websiteSchema(),
  ];
}

export function aboutPageSchemas(args: { about?: About; socialUrls?: string[] }) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#aboutpage`,
      name: `About ${SITE_NAME}`,
      url: `${SITE_URL}/about`,
      description:
        "Skills, experience, education, and certifications of Mahedi Hasan Emon — Full-Stack Software Engineer.",
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    personSchema(args.about, undefined, args.socialUrls),
  ];
}

export function portfolioPageSchemas(projects: Project[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/portfolio#collectionpage`,
      name: `Portfolio — ${SITE_NAME}`,
      url: `${SITE_URL}/portfolio`,
      description:
        "Curated collection of projects, case studies, and open-source work by Mahedi Hasan Emon.",
      author: { "@id": `${SITE_URL}/#person` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: projects.slice(0, 20).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          url: `${SITE_URL}/portfolio/${p.slug}`,
        })),
      },
    },
  ];
}

export function projectDetailSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/portfolio/${project.slug}#work`,
    name: project.title,
    url: `${SITE_URL}/portfolio/${project.slug}`,
    description: project.summary,
    image: project.coverImageUrl || DEFAULT_IMAGE,
    author: { "@id": `${SITE_URL}/#person` },
    keywords: (project.techStack ?? []).join(", "),
    ...(project.githubUrl && { codeRepository: project.githubUrl }),
    ...(project.liveDemoUrl && { url: project.liveDemoUrl }),
  };
}

export function blogListSchema(blogs: Blog[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: `Blog — ${SITE_NAME}`,
    url: `${SITE_URL}/blog`,
    description:
      "Articles, tutorials, and insights on web development, React, Next.js, Django, and ML/NLP.",
    author: { "@id": `${SITE_URL}/#person` },
    blogPost: blogs.slice(0, 20).map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      url: `${SITE_URL}/blog/${b.slug}`,
      datePublished: b.publishedDate ?? b.createdAt,
      image: b.coverImageUrl || DEFAULT_IMAGE,
    })),
  };
}

export function blogPostSchema(blog: Blog) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${blog.slug}#post`,
    headline: blog.title,
    url: `${SITE_URL}/blog/${blog.slug}`,
    description: blog.excerpt ?? "",
    image: blog.coverImageUrl || DEFAULT_IMAGE,
    datePublished: blog.publishedDate ?? blog.createdAt,
    dateModified: blog.updatedAt,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: (blog.tags ?? []).join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${blog.slug}` },
  };
}

export function servicesPageSchema(services: Service[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/services#service`,
      name: `Web Development Services — ${SITE_NAME}`,
      url: `${SITE_URL}/services`,
      description:
        "Professional web development services including full-stack development, UI/UX design, custom software, API development, and cloud deployment.",
      provider: { "@id": `${SITE_URL}/#person` },
      areaServed: "Worldwide",
      serviceType: "Web Development",
    },
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      "@id": `${SITE_URL}/services#offers`,
      name: "Service Offerings",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.summary ?? "",
        },
      })),
    },
  ];
}

export function publicationsPageSchema(publications: Publication[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/publications#collectionpage`,
    name: `Publications — ${SITE_NAME}`,
    url: `${SITE_URL}/publications`,
    description: "Research publications and academic papers by Mahedi Hasan Emon.",
    author: { "@id": `${SITE_URL}/#person` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: publications.map((pub, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "ScholarlyArticle",
          name: pub.title,
          author: pub.authors,
          datePublished: pub.year,
          publisher: pub.venue,
          url: pub.paperUrl ?? `${SITE_URL}/publications`,
        },
      })),
    },
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#contactpage`,
    name: `Contact ${SITE_NAME}`,
    url: `${SITE_URL}/contact`,
    description: `Get in touch with ${SITE_NAME} for web development projects, freelance work, or collaboration opportunities.`,
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}

export function testimonialsPageSchema(testimonials: Testimonial[]) {
  if (testimonials.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/testimonials#list`,
    name: `Client Testimonials — ${SITE_NAME}`,
    url: `${SITE_URL}/testimonials`,
    itemListElement: testimonials.map((t, i) => ({
      "@type": "Review",
      position: i + 1,
      author: { "@type": "Person", name: t.author },
      reviewBody: t.quote,
      itemReviewed: { "@id": `${SITE_URL}/#person` },
    })),
  };
}
