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

export type CardItem = Feature & {
  /** Site path or #anchor. The whole card becomes a link when set. */
  link?: string;
};

export type PropertyType = Feature & {
  tabLabel: string;
  profiles: string;
};

export type VenueGuideItem = Feature & {
  /** Empty means the venue gets no jump button. */
  navLabel: string;
  profiles: string;
  /** Empty means the default "Property profiles". */
  profilesLabel?: string;
  image?: ImageAsset;
  imageCaption: string;
};

type SectionCopy = {
  heading: string;
  intro: string;
};

export type ServiceSection = SectionCopy &
  (
    | { layout: "cards"; items: CardItem[] }
    | { layout: "propertyTabs"; items: PropertyType[] }
    | { layout: "steps"; items: Feature[] }
    | { layout: "accordion"; items: Feature[] }
    | { layout: "checklist"; items: Feature[] }
    | { layout: "venueGuide"; items: VenueGuideItem[] }
  );

export type SectionLayout = ServiceSection["layout"];

export const HERO_DIAGRAMS = ["alarms", "cctv", "wifi"] as const;

export type HeroDiagram = (typeof HERO_DIAGRAMS)[number];

export function isHeroDiagram(value: string): value is HeroDiagram {
  return (HERO_DIAGRAMS as readonly string[]).includes(value);
}

export type ServiceQuestion = {
  question: string;
  answer: string;
};

export type Service = {
  slug: string;
  title: string;
  heroTitle: string;
  summary: string;
  heroDiagram: HeroDiagram | null;
  heroImage: ImageAsset | null;
  heroCaption: string;
  heroButtonLabel: string;
  facts: string[];
  sections: ServiceSection[];
  body: string;
  features: Feature[];
  questions: ServiceQuestion[];
  surveyHeading: string;
  surveyBody: string;
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
