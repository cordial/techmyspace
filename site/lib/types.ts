export const SERVICE_SLUGS = [
  "alarms",
  "cctv",
  "security",
  "structured-cabling",
  "communication",
  "av",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export function isServiceSlug(slug: string): slug is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(slug);
}

export type ImageAsset = {
  url: string;
  alt: string;
};

export type Feature = {
  title: string;
  body: string;
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  features: Feature[];
  images: ImageAsset[];
  metaTitle: string;
  metaDescription: string;
  menuOrder: number;
};

export type CaseStudy = {
  slug: string;
  title: string;
  location: string;
  summary: string;
  body: string;
  pullQuote: string;
  images: ImageAsset[];
  metaTitle: string;
  metaDescription: string;
  menuOrder: number;
};

export type Faq = {
  slug: string;
  title: string;
  answer: string;
  service: string;
  metaTitle: string;
  metaDescription: string;
};

export type Testimonial = {
  slug: string;
  title: string;
  quote: string;
  author: string;
  location: string;
  serviceLabel: string;
};

export type PageKind = "page" | "gallery" | "legal" | "team";

export type ContentPage = {
  slug: string;
  kind: PageKind;
  path: string;
  title: string;
  heroKicker: string;
  summary: string;
  body: string;
  images: ImageAsset[];
  metaTitle: string;
  metaDescription: string;
};

export type HomeContent = {
  title: string;
  heroKicker: string;
  heroTitle: string;
  heroAccent: string;
  heroSummary: string;
  introTitle: string;
  intro: string;
  areas: string[];
  areasBody: string;
  awards: string[];
  metaTitle: string;
  metaDescription: string;
};

export type SiteInfo = {
  name: string;
  phone: string;
  phoneTel: string;
  tagline: string;
};

export type Content = {
  site: SiteInfo;
  home: HomeContent;
  services: Service[];
  caseStudies: CaseStudy[];
  faqs: Faq[];
  testimonials: Testimonial[];
  pages: ContentPage[];
};
