import type { MetadataRoute } from "next";

import { caseStudyPath, faqPath, servicePath } from "@/lib/routes";
import { getContent } from "@/lib/wp/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paths = [
    "/",
    "/services",
    "/case-studies",
    "/faq",
    "/contact",
    ...content.services.map((service) => servicePath(service.slug)),
    ...content.caseStudies.map((study) => caseStudyPath(study.slug)),
    ...content.faqs.map((faq) => faqPath(faq.slug)),
    ...content.pages.map((page) => page.path),
  ];

  return paths.map((path) => ({ url: new URL(path, base).toString() }));
}
