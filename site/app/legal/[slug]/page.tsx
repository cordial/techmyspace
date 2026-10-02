import { notFound } from "next/navigation";

import {
  contentPageMetadata,
  renderContentPage,
} from "@/lib/content-page-route";

const LEGAL_SLUGS = ["general", "sales", "website"];

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return contentPageMetadata(slug);
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!LEGAL_SLUGS.includes(slug)) {
    notFound();
  }
  return renderContentPage(slug);
}
