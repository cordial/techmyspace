import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClosingCta } from "@/components/closing-cta";
import { PageHero } from "@/components/page-hero";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { servicePath } from "@/lib/routes";
import { getFaq, getFaqs, getService, getSite } from "@/lib/wp/content";

export async function generateStaticParams() {
  const faqs = await getFaqs();
  return faqs.map((faq) => ({ slug: faq.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const faq = await getFaq(slug);
  if (!faq) {
    return {};
  }
  return { title: faq.metaTitle, description: faq.metaDescription };
}

export default async function FaqDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faq = await getFaq(slug);
  if (!faq) {
    notFound();
  }

  const [service, site] = await Promise.all([
    getService(faq.service),
    getSite(),
  ]);

  return (
    <>
      <PageHero eyebrow={service?.title ?? "FAQ"} title={faq.title} />
      <Section className="pt-0">
        <RichText html={faq.answer} className="max-w-3xl" />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/faq"
            className="font-display text-sm tracking-[0.16em] text-yellow uppercase"
          >
            All FAQs
          </Link>
          {service ? (
            <Link
              href={servicePath(service.slug)}
              className="font-display text-sm tracking-[0.16em] text-cream uppercase"
            >
              {service.title}
            </Link>
          ) : null}
        </div>
      </Section>
      <ClosingCta site={site} />
    </>
  );
}
