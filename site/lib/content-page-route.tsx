import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { getPage } from "@/lib/wp/content";

export async function contentPageMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug);
  if (!page) {
    return {};
  }
  return { title: page.metaTitle, description: page.metaDescription };
}

export async function renderContentPage(slug: string) {
  return <ContentPage slug={slug} />;
}
