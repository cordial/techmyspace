import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { routeForPage } from "@/lib/routes";
import { withCanonical } from "@/lib/seo";
import { getPage } from "@/lib/wp/content";

export async function contentPageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug);
  const route = routeForPage(slug);
  if (!page || !route) {
    return {};
  }
  return withCanonical(route.path, {
    title: page.metaTitle,
    description: page.metaDescription,
  });
}

export async function renderContentPage(slug: string) {
  return <ContentPage slug={slug} />;
}
