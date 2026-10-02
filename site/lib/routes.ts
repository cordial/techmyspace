import type { PageKind } from "@/lib/types";

const PAGE_ROUTES: Record<string, { kind: PageKind; path: string }> = {
  about: { kind: "page", path: "/about" },
  contact: { kind: "page", path: "/contact" },
  customers: { kind: "page", path: "/customers" },
  offers: { kind: "page", path: "/offers" },
  glossary: { kind: "page", path: "/glossary" },
  dave: { kind: "team", path: "/team/dave" },
  "gallery-cctv": { kind: "gallery", path: "/galleries/cctv" },
  "gallery-alarms": { kind: "gallery", path: "/galleries/alarms" },
  general: { kind: "legal", path: "/legal/general" },
  sales: { kind: "legal", path: "/legal/sales" },
  website: { kind: "legal", path: "/legal/website" },
};

export function routeForPage(slug: string): { kind: PageKind; path: string } | null {
  if (slug === "home") {
    return null;
  }

  return PAGE_ROUTES[slug] ?? { kind: "page", path: `/${slug}` };
}

export function servicePath(slug: string): string {
  return `/services/${slug}`;
}

export function caseStudyPath(slug: string): string {
  return `/case-studies/${slug}`;
}

export function faqPath(slug: string): string {
  return `/faq/${slug}`;
}
