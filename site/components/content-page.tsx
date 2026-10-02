import Link from "next/link";
import { notFound } from "next/navigation";

import { ClosingCta } from "@/components/closing-cta";
import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/page-hero";
import { ReviewCarousel } from "@/components/review-carousel";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import type { PageKind } from "@/lib/types";
import { getPage, getSite, getTestimonials } from "@/lib/wp/content";

export async function ContentPage({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) {
    notFound();
  }

  const site = await getSite();
  const testimonials = slug === "customers" ? await getTestimonials() : [];

  return (
    <>
      <PageHero
        eyebrow={page.heroKicker}
        title={page.title}
        summary={page.summary}
      />
      <Section className="pt-0">
        <PageBody kind={page.kind} body={page.body} />
        {testimonials.length ? (
          <div className="mt-12">
            <ReviewCarousel reviews={testimonials} compact={false} />
          </div>
        ) : null}
        {page.images.length ? (
          <div className="mt-12">
            <Gallery images={page.images} />
          </div>
        ) : null}
        {page.kind === "legal" ? (
          <p className="mt-10 text-sm text-muted">
            <Link href="/legal/general" className="text-yellow">
              General terms
            </Link>
            {" · "}
            <Link href="/legal/sales" className="text-yellow">
              Sales terms
            </Link>
            {" · "}
            <Link href="/legal/website" className="text-yellow">
              Website terms
            </Link>
          </p>
        ) : null}
      </Section>
      <ClosingCta site={site} />
    </>
  );
}

function PageBody({ kind, body }: { kind: PageKind; body: string }) {
  switch (kind) {
    case "gallery":
      return body ? <RichText html={body} className="mb-8 max-w-3xl" /> : null;
    case "legal":
    case "page":
    case "team":
      return <RichText html={body} className="max-w-3xl" />;
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}
