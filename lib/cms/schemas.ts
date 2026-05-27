/**
 * CMS Schema Definitions
 *
 * Schema-driven admin UI: the EntityForm renders inputs based on these schemas.
 *
 * Schema additions vs the old portfolio:
 *   - services: + imageUrl (NEW)
 *   - testimonials: + avatarUrl, role, company (NEW)
 *   - achievements: + galleryImages (NEW)
 *   - blogs.readTime: auto-computed client-side (no schema change)
 */

import type { StorageBucket } from "@/lib/storage/buckets";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "date"
  | "list"
  | "image"
  | "url"
  | "file"
  | "socialLinks"
  | "select";

export type FieldSchema = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  htmlContent?: boolean;
  storageField?: boolean;
  storageBucket?: StorageBucket;
  acceptedTypes?: string;
  maxSizeMB?: number;
};

export type SectionSchema = {
  key: string;
  title: string;
  kind: "singleton" | "collection";
  fields: FieldSchema[];
  tableName?: string;
};

export const sectionSchemas: Record<string, SectionSchema> = {
  hero: {
    key: "hero",
    title: "Hero",
    kind: "singleton",
    tableName: "cms_hero",
    fields: [
      { name: "fullName", label: "Full Name", required: true },
      { name: "headline", label: "Headline", required: true },
      { name: "subheadline", label: "Subheadline", type: "textarea" },
      {
        name: "heroImageUrl",
        label: "Hero Image",
        type: "image",
        placeholder: "Upload a professional photo for the hero section",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 5,
      },
      { name: "ctaPrimaryLabel", label: "Primary Button Label" },
      { name: "ctaPrimaryHref", label: "Primary Button Link" },
      { name: "ctaSecondaryLabel", label: "Secondary Button Label" },
      { name: "ctaSecondaryHref", label: "Secondary Button Link" },
    ],
  },
  about: {
    key: "about",
    title: "About",
    kind: "singleton",
    tableName: "cms_about",
    fields: [
      { name: "fullName", label: "Full Name", required: true },
      { name: "tagline", label: "Tagline", type: "textarea" },
      { name: "title", label: "Title", required: true },
      { name: "bio", label: "Bio", type: "textarea", required: true, htmlContent: true },
      {
        name: "profileImageUrl",
        label: "Profile Image",
        type: "image",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 5,
      },
      { name: "currentRole", label: "Current Role" },
      { name: "researchInterest", label: "Research Interest" },
    ],
  },
  contact: {
    key: "contact",
    title: "Contact",
    kind: "singleton",
    tableName: "cms_contact",
    fields: [
      { name: "pageIntroText", label: "Contact Page Intro", type: "textarea" },
      { name: "contactInfo.email", label: "Email", required: true },
      { name: "contactInfo.phone", label: "Phone" },
      { name: "contactInfo.location", label: "Location" },
      { name: "socialLinks", label: "Social Links", type: "socialLinks" },
      { name: "hireMeLabel", label: "Hire Me Label" },
    ],
  },
  resumeSettings: {
    key: "resumeSettings",
    title: "Resume Settings",
    kind: "singleton",
    tableName: "cms_resume_settings",
    fields: [{ name: "activeResumeId", label: "Active Resume ID" }],
  },
  education: {
    key: "education",
    title: "Education",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "institution", label: "Institution", required: true },
      { name: "degree", label: "Degree", required: true },
      { name: "field", label: "Field of Study", required: true },
      { name: "grade", label: "Grade (Optional)" },
      { name: "activities", label: "Activities & Societies (Optional)", type: "textarea" },
      { name: "description", label: "Description (Optional)", type: "textarea" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date (or expected)", type: "date" },
    ],
  },
  skills: {
    key: "skills",
    title: "Skills",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "name", label: "Skill Name", required: true },
      { name: "level", label: "Level", type: "number" },
    ],
  },
  services: {
    key: "services",
    title: "Services",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "title", label: "Title", required: true },
      { name: "summary", label: "Summary", type: "textarea" },
      // NEW: image field for service cards
      {
        name: "imageUrl",
        label: "Service Image",
        type: "image",
        placeholder: "Cover image for this service",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 3,
      },
    ],
  },
  resumes: {
    key: "resumes",
    title: "Resumes",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "title", label: "Title", required: true },
      {
        name: "fileUrl",
        label: "Resume File",
        type: "file",
        required: true,
        storageField: true,
        storageBucket: "resumes",
        acceptedTypes: ".pdf,.doc,.docx",
        maxSizeMB: 10,
      },
      { name: "uploadedAt", label: "Uploaded At", type: "date" },
    ],
  },
  projects: {
    key: "projects",
    title: "Projects",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "slug", label: "Slug", required: true },
      { name: "title", label: "Title", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "description", label: "Description", type: "textarea", htmlContent: true },
      {
        name: "coverImageUrl",
        label: "Cover Image",
        type: "image",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 5,
      },
      {
        name: "galleryImages",
        label: "Gallery Images (comma separated)",
        type: "list",
        storageField: true,
        storageBucket: "gallery",
      },
      { name: "githubUrl", label: "GitHub URL" },
      { name: "liveDemoUrl", label: "Live Demo URL" },
      { name: "techStack", label: "Tech Stack (comma separated)", type: "list" },
      { name: "featured", label: "Featured", type: "checkbox" },
    ],
  },
  publications: {
    key: "publications",
    title: "Publications",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "slug", label: "Slug", required: true },
      { name: "title", label: "Title", required: true },
      { name: "authors", label: "Authors (comma separated)", type: "list", required: true },
      { name: "venue", label: "Venue", required: true },
      { name: "year", label: "Year", required: true },
      { name: "abstract", label: "Abstract", type: "textarea" },
      { name: "paperUrl", label: "Paper URL" },
      {
        name: "pdfUrl",
        label: "PDF File",
        type: "file",
        storageField: true,
        storageBucket: "documents",
        acceptedTypes: ".pdf",
        maxSizeMB: 20,
      },
      {
        name: "coverImageUrl",
        label: "Cover Image",
        type: "image",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 5,
      },
      { name: "citation", label: "Citation", type: "textarea" },
    ],
  },
  certifications: {
    key: "certifications",
    title: "Certifications",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "certificateTitle", label: "Certificate Title", required: true },
      { name: "issuer", label: "Issuer", required: true },
      { name: "issueDate", label: "Issue Date", type: "date", required: true },
      { name: "expiryDate", label: "Expiry Date", type: "date" },
      { name: "credentialId", label: "Credential ID" },
      { name: "credentialUrl", label: "Credential URL" },
      {
        name: "certificateImageUrl",
        label: "Certificate Image",
        type: "image",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 5,
      },
      {
        name: "certificateFileUrl",
        label: "Certificate File",
        type: "file",
        storageField: true,
        storageBucket: "documents",
        acceptedTypes: ".pdf,.png,.jpg,.jpeg",
        maxSizeMB: 10,
      },
    ],
  },
  experience: {
    key: "experience",
    title: "Experience",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "company", label: "Company", required: true },
      { name: "role", label: "Role", required: true },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "description", label: "Description", type: "textarea", htmlContent: true },
    ],
  },
  blogs: {
    key: "blogs",
    title: "Blogs",
    kind: "collection",
    fields: [
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["draft", "scheduled", "published", "archived"],
        required: true,
        placeholder: "scheduled → cron auto-publishes when Published Date passes",
      },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "title", label: "Title", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      // IMPORTANT: Blog content is user-generated HTML - MUST be sanitized before display
      { name: "content", label: "Content", type: "textarea", htmlContent: true },
      {
        name: "coverImageUrl",
        label: "Cover Image",
        type: "image",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 5,
      },
      { name: "author", label: "Author" },
      {
        name: "publishedDate",
        label: "Published / Scheduled Date",
        type: "date",
        placeholder: "If status=scheduled, post goes live at midnight UTC on this date",
      },
      // readTime is auto-computed from content word count on save
      { name: "readTime", label: "Read Time (auto)", type: "number" },
      { name: "tags", label: "Tags (comma separated)", type: "list" },
    ],
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "author", label: "Author Name", required: true },
      // NEW: avatar, role, company
      {
        name: "avatarUrl",
        label: "Avatar Image",
        type: "image",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 2,
      },
      { name: "role", label: "Role / Title", placeholder: "e.g., Senior Engineer" },
      { name: "company", label: "Company", placeholder: "e.g., Acme Inc." },
      { name: "quote", label: "Quote", type: "textarea", required: true },
    ],
  },
  achievements: {
    key: "achievements",
    title: "Achievements",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "title", label: "Title", required: true },
      { name: "issuer", label: "Issuer", required: true },
      { name: "year", label: "Year", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      {
        name: "certificateImageUrl",
        label: "Cover Image",
        type: "image",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 5,
      },
      {
        name: "certificateFileUrl",
        label: "Certificate File",
        type: "file",
        storageField: true,
        storageBucket: "documents",
        acceptedTypes: ".pdf,.png,.jpg,.jpeg",
        maxSizeMB: 10,
      },
      // NEW: multi-image gallery for achievements
      {
        name: "galleryImages",
        label: "Gallery Images (comma separated URLs)",
        type: "list",
        storageField: true,
        storageBucket: "gallery",
      },
      { name: "externalLink", label: "External Link" },
    ],
  },
  clients: {
    key: "clients",
    title: "Clients",
    kind: "collection",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "featured", label: "Featured Client", type: "checkbox" },
      { name: "name", label: "Company Name", required: true },
      {
        name: "industry",
        label: "Industry",
        type: "select",
        options: [
          "Technology",
          "Healthcare",
          "Finance",
          "Education",
          "E-commerce",
          "Media",
          "Government",
          "Non-profit",
          "Startup",
          "Enterprise",
          "Other",
        ],
      },
      {
        name: "logoUrl",
        label: "Company Logo",
        type: "image",
        storageField: true,
        storageBucket: "images",
        acceptedTypes: "image/*",
        maxSizeMB: 2,
      },
      {
        name: "websiteUrl",
        label: "Website URL",
        type: "url",
        placeholder: "https://example.com",
      },
      { name: "description", label: "Project Description", type: "textarea" },
      { name: "projectDuration", label: "Project Duration" },
    ],
  },
  techStackCategories: {
    key: "techStackCategories",
    title: "Tech Stack Categories",
    kind: "collection",
    tableName: "tech_stack_categories",
    fields: [
      { name: "status", label: "Status", required: true },
      { name: "orderIndex", label: "Order Index", type: "number" },
      { name: "categoryName", label: "Category Name", required: true },
    ],
  },
};

export const sectionList = Object.values(sectionSchemas);

export function getSchema(key: string): SectionSchema | undefined {
  return sectionSchemas[key];
}

export function getHtmlFields(schema: SectionSchema): FieldSchema[] {
  return schema.fields.filter((field) => field.htmlContent);
}

export function getStorageFields(schema: SectionSchema): FieldSchema[] {
  return schema.fields.filter((field) => field.storageField);
}

export function hasSluggableField(schema: SectionSchema): boolean {
  return schema.fields.some((field) => field.name === "slug");
}
