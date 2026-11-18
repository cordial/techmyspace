import type { MetadataRoute } from "next";

import { caseStudyPath, servicePath } from "@/lib/routes";
import { getSiteUrl } from "@/lib/seo";
import { getContent } from "@/lib/wp/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const paths = [
    ...new Set([
      "/",
      "/services",
      "/case-studies",
      "/faq",
      ...content.services.map((service) => servicePath(service.slug)),
      ...content.caseStudies.map((study) => caseStudyPath(study.slug)),
      ...content.pages.map((page) => page.path),
    ]),
  ];

  return paths.map((path) => ({ url: new URL(path, getSiteUrl()).toString() }));
}
