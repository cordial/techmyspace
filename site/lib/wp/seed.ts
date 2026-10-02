import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { routeForPage } from "@/lib/routes";
import type {
  CaseStudy,
  Content,
  ContentPage,
  Faq,
  HomeContent,
  ImageAsset,
  PageKind,
  Service,
  SiteInfo,
  Testimonial,
} from "@/lib/types";

type SeedImage = { url?: string; alt?: string };

type SeedFile = {
  site: SiteInfo;
  home: HomeContent & { legacyPaths?: string[] };
  services: Array<Service & { legacyPaths?: string[] }>;
  caseStudies: Array<CaseStudy & { legacyPaths?: string[] }>;
  faqs: Array<Faq & { legacyPaths?: string[]; metaTitle?: string; metaDescription?: string }>;
  testimonials: Testimonial[];
  pages: Array<{
    slug: string;
    kind: PageKind;
    path: string;
    title: string;
    heroKicker?: string;
    summary?: string;
    body?: string;
    images?: SeedImage[];
    metaTitle?: string;
    metaDescription?: string;
  }>;
};

function images(value: SeedImage[] | undefined): ImageAsset[] {
  return (value ?? [])
    .filter((image): image is { url: string; alt?: string } => Boolean(image.url))
    .map((image) => ({ url: image.url, alt: image.alt ?? "" }));
}

export function loadSeed(): Content {
  const path = resolve(process.cwd(), "../wordpress/themes/techmyspace/seed/content.json");
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));

  if (!parsed || typeof parsed !== "object" || !("services" in parsed)) {
    throw new Error("Seed file is missing services.");
  }

  const seed = parsed as SeedFile;

  const pages: ContentPage[] = seed.pages.flatMap((page) => {
    const route = routeForPage(page.slug);
    if (!route) {
      return [];
    }

    return [
      {
        slug: page.slug,
        kind: route.kind,
        path: route.path,
        title: page.title,
        heroKicker: page.heroKicker ?? "Tech My Space",
        summary: page.summary ?? "",
        body: page.body ?? "",
        images: images(page.images),
        metaTitle: page.metaTitle || page.title,
        metaDescription: page.metaDescription || page.summary || "",
      },
    ];
  });

  return {
    site: seed.site,
    home: seed.home,
    services: seed.services
      .map((service) => ({
        slug: service.slug,
        title: service.title,
        summary: service.summary,
        body: service.body,
        features: service.features ?? [],
        images: images(service.images),
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
        menuOrder: service.menuOrder,
      }))
      .sort((a, b) => a.menuOrder - b.menuOrder),
    caseStudies: seed.caseStudies
      .map((study) => ({
        slug: study.slug,
        title: study.title,
        location: study.location,
        summary: study.summary,
        body: study.body,
        pullQuote: study.pullQuote,
        images: images(study.images),
        metaTitle: study.metaTitle,
        metaDescription: study.metaDescription,
        menuOrder: study.menuOrder,
      }))
      .sort((a, b) => a.menuOrder - b.menuOrder),
    faqs: seed.faqs.map((faq) => ({
      slug: faq.slug,
      title: faq.title,
      answer: faq.answer,
      service: faq.service,
      metaTitle: faq.metaTitle || faq.title,
      metaDescription: faq.metaDescription || "",
    })),
    testimonials: seed.testimonials,
    pages,
  };
}
