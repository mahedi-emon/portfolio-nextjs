/**
 * Frontend (camelCase) CMS types.
 * These describe what the UI consumes after mappers run on DB rows.
 */

export interface Hero {
  id?: string;
  fullName: string;
  headline: string;
  subheadline: string | null;
  heroImageUrl: string | null;
  ctaPrimaryLabel: string | null;
  ctaPrimaryHref: string | null;
  ctaSecondaryLabel: string | null;
  ctaSecondaryHref: string | null;
}

export interface About {
  id?: string;
  fullName: string;
  tagline: string | null;
  title: string;
  bio: string;
  profileImageUrl: string | null;
  currentRole: string | null;
  researchInterest: string | null;
  highlights: string[];
}

export interface SocialLink {
  url: string;
  platform: string;
  iconKey: string;
}

export interface Contact {
  id?: string;
  pageIntroText: string | null;
  hireMeLabel: string | null;
  contactInfo: {
    email: string;
    phone: string | null;
    location: string | null;
  };
  socialLinks: SocialLink[];
}

export interface ResumeSettings {
  activeResumeId: string | null;
}

export interface PublishableBase {
  id: string;
  status: "draft" | "published" | "archived";
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SluggableBase extends PublishableBase {
  slug: string;
}

export interface Education extends PublishableBase {
  institution: string;
  degree: string;
  field: string;
  grade: string | null;
  activities: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface Skill extends PublishableBase {
  name: string;
  level: number;
}

export interface Service extends PublishableBase {
  title: string;
  summary: string | null;
  imageUrl: string | null; // NEW
}

export interface Resume {
  id: string;
  status: "active" | "inactive";
  title: string;
  fileUrl: string;
  uploadedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project extends SluggableBase {
  title: string;
  summary: string;
  description: string | null;
  coverImageUrl: string | null;
  galleryImages: string[];
  githubUrl: string | null;
  liveDemoUrl: string | null;
  techStack: string[];
  featured: boolean;
}

export interface Publication extends SluggableBase {
  title: string;
  authors: string[];
  venue: string;
  year: string;
  abstract: string | null;
  paperUrl: string | null;
  pdfUrl: string | null;
  coverImageUrl: string | null;
  citation: string | null;
}

export interface Certification extends PublishableBase {
  certificateTitle: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  certificateImageUrl: string | null;
  certificateFileUrl: string | null;
}

export interface Experience extends PublishableBase {
  company: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface Blog extends SluggableBase {
  title: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  author: string | null;
  publishedDate: string | null;
  readTime: number | null;
  tags: string[];
}

export interface Testimonial extends PublishableBase {
  author: string;
  quote: string;
  avatarUrl: string | null; // NEW
  role: string | null; // NEW
  company: string | null; // NEW
}

export interface Achievement extends PublishableBase {
  title: string;
  issuer: string;
  year: string;
  description: string;
  certificateImageUrl: string | null;
  certificateFileUrl: string | null;
  galleryImages: string[]; // NEW
  externalLink: string | null;
}

export interface Client extends PublishableBase {
  featured: boolean;
  name: string;
  industry: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  projectDuration: string | null;
}

export interface TechStackTool {
  id: string;
  name: string;
  logoUrl: string | null;
  proficiencyLevel: number;
}

export interface TechStackCategory extends PublishableBase {
  categoryName: string;
  tools: TechStackTool[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "archived";
  handledBy: string | null;
  handledAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}
