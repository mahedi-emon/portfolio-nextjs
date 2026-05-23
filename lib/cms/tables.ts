/**
 * Database table name constants.
 * Single source of truth — never hardcode strings elsewhere.
 */

export const DB_TABLES = {
  // Singletons
  HERO: "cms_hero",
  ABOUT: "cms_about",
  CONTACT: "cms_contact",
  RESUME_SETTINGS: "cms_resume_settings",

  // Collections
  EDUCATION: "education",
  SKILLS: "skills",
  SERVICES: "services",
  RESUMES: "resumes",
  PROJECTS: "projects",
  PUBLICATIONS: "publications",
  CERTIFICATIONS: "certifications",
  EXPERIENCE: "experience",
  BLOGS: "blogs",
  TESTIMONIALS: "testimonials",
  ACHIEVEMENTS: "achievements",
  CLIENTS: "clients",
  TECH_STACK_CATEGORIES: "tech_stack_categories",
  SOCIAL_LINKS: "social_links",
  CONTACT_MESSAGES: "contact_messages",
} as const;

export type SingletonKey = "hero" | "about" | "contact" | "resumeSettings";

export type CollectionKey =
  | "education"
  | "skills"
  | "services"
  | "resumes"
  | "projects"
  | "publications"
  | "certifications"
  | "experience"
  | "blogs"
  | "testimonials"
  | "achievements"
  | "clients"
  | "techStackCategories"
  | "contactMessages"
  | "portfolio";

export const singletonToTable: Record<SingletonKey, string> = {
  hero: DB_TABLES.HERO,
  about: DB_TABLES.ABOUT,
  contact: DB_TABLES.CONTACT,
  resumeSettings: DB_TABLES.RESUME_SETTINGS,
};

export const collectionToTable: Record<CollectionKey, string> = {
  education: DB_TABLES.EDUCATION,
  skills: DB_TABLES.SKILLS,
  services: DB_TABLES.SERVICES,
  resumes: DB_TABLES.RESUMES,
  projects: DB_TABLES.PROJECTS,
  publications: DB_TABLES.PUBLICATIONS,
  certifications: DB_TABLES.CERTIFICATIONS,
  experience: DB_TABLES.EXPERIENCE,
  blogs: DB_TABLES.BLOGS,
  testimonials: DB_TABLES.TESTIMONIALS,
  achievements: DB_TABLES.ACHIEVEMENTS,
  clients: DB_TABLES.CLIENTS,
  techStackCategories: DB_TABLES.TECH_STACK_CATEGORIES,
  contactMessages: DB_TABLES.CONTACT_MESSAGES,
  portfolio: DB_TABLES.PROJECTS, // alias
};
