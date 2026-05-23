/**
 * Default fallback values used when a Supabase row is missing or fetch fails.
 * Keeps the UI rendering even with an empty DB.
 */

export const defaultHero = {
  fullName: "",
  headline: "",
  subheadline: "",
  heroImageUrl: "",
  ctaPrimaryLabel: "View Portfolio",
  ctaPrimaryHref: "/portfolio",
  ctaSecondaryLabel: "Contact",
  ctaSecondaryHref: "/contact",
};

export const defaultAbout = {
  fullName: "",
  tagline: "",
  title: "About Me",
  bio: "",
  profileImageUrl: "",
  currentRole: "",
  researchInterest: "",
  highlights: [] as string[],
};

export const defaultContact = {
  pageIntroText: "",
  hireMeLabel: "Hire Me",
  contactInfo: { email: "", phone: "", location: "" },
  socialLinks: [] as Array<{ url: string; platform: string; iconKey: string }>,
};

export const defaultResumeSettings = {
  activeResumeId: null as string | null,
};
