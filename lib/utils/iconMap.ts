/**
 * Social platform icon map.
 *
 * NOTE: lucide-react v1+ removed brand icons (Linkedin, Github, Twitter, etc.)
 * due to trademark concerns. We map every platform to a thematic generic icon
 * here; for brand-accurate logos use `getToolLogoUrl()` instead, which returns
 * a Simple Icons CDN URL.
 */

import {
  BookOpen,
  GraduationCap,
  Briefcase,
  BarChart,
  Code,
  Globe,
  Mail,
  MessageCircle,
  Send,
  Video,
  Image as ImageIcon,
  Music,
  Hash,
  Link,
  Coffee,
  Gamepad2,
  Pin,
  Smartphone,
  Palette,
  ShoppingBag,
  Camera,
  Users,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  // Professional
  linkedin: Briefcase,
  github: Code,
  gitlab: Code,
  bitbucket: Code,
  stackoverflow: Code,
  kafka: Code,
  medium: BookOpen,
  devto: Code,
  hashnode: BookOpen,
  codepen: Code,
  codesandbox: Code,
  leetcode: Code,
  hackerrank: Code,
  kaggle: BarChart,
  researchgate: GraduationCap,
  google_scholar: GraduationCap,
  upwork: Briefcase,
  fiverr: Briefcase,
  freelancer: Briefcase,

  // Social
  twitter: MessageCircle,
  facebook: Users,
  instagram: Camera,
  youtube: Video,
  tiktok: Video,
  snapchat: Camera,
  pinterest: Pin,
  reddit: MessageCircle,
  discord: Gamepad2,
  twitch: Video,
  whatsapp: MessageCircle,
  telegram: Send,
  signal: Smartphone,
  slack: Hash,
  skype: MessageCircle,
  wechat: MessageCircle,
  line: MessageCircle,
  threads: Hash,
  bluesky: MessageSquare,
  mastodon: Hash,
  tumblr: BookOpen,
  vk: Globe,
  weibo: Globe,

  // Creative
  dribbble: Palette,
  behance: Palette,
  vimeo: Video,
  soundcloud: Music,
  spotify: Music,
  applemusic: Music,
  flickr: ImageIcon,
  "500px": ImageIcon,
  unsplash: ImageIcon,
  deviantart: Palette,
  artstation: Palette,
  producthunt: ShoppingBag,
  patreon: Coffee,
  kofi: Coffee,
  buymeacoffee: Coffee,

  // Other
  website: Globe,
  email: Mail,
  custom: Link,
};
