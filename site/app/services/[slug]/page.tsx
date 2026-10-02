import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyGallery } from "@/components/case-study-gallery";
import { ClosingCta } from "@/components/closing-cta";
import { Eyebrow } from "@/components/eyebrow";
import { Headline } from "@/components/headline";
import { PageHero } from "@/components/page-hero";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { ServiceIcon } from "@/components/service-icon";
import { faqPath, servicePath } from "@/lib/routes";
import { getFaqs, getService, getServices, getSite } from "@/lib/wp/content";

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) {
    return {};
  }
  return { title: service.metaTitle, description: service.metaDescription };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, services, faqs, site] = await Promise.all([
    getService(slug),
    getServices(),
    getFaqs(),
    getSite(),
  ]);
  if (!service) {
    notFound();
  }

  const related = faqs
    .filter((faq) => faq.service === service.slug)
    .slice(0, 6);
  const others = services.filter((item) => item.slug !== service.slug);
  const heroImage = service.images[0];
  const gallery = service.images.slice(1);

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        summary={service.summary}
        image={
          heroImage
            ? { src: heroImage.url, alt: heroImage.alt || service.title }
            : undefined
        }
      />
      {service.features.length ? (
        <Section>
          <Eyebrow>What you get</Eyebrow>
          <Headline className="mt-4 max-w-3xl">The parts of the job.</Headline>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {service.features.map((feature, index) => (
              <li
                key={feature.title}
                className="border border-white/10 bg-charcoal p-6"
              >
                <p className="font-display text-xs tracking-[0.22em] text-yellow">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display mt-3 text-3xl leading-none tracking-tight text-cream uppercase">
                  {feature.title}
                </h2>
                <RichText html={feature.body} className="mt-4" />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {service.body ? (
        <Section className="bg-charcoal">
          <Eyebrow>The detail</Eyebrow>
          <Headline className="mt-4">What the installation covers.</Headline>
          <RichText html={service.body} className="mt-8 max-w-3xl" />
        </Section>
      ) : null}
      {gallery.length ? (
        <Section>
          <Eyebrow>On site</Eyebrow>
          <Headline className="mt-4">From the jobs themselves.</Headline>
          <div className="mt-8">
            <CaseStudyGallery images={gallery} />
          </div>
        </Section>
      ) : null}
      {related.length ? (
        <Section className="bg-charcoal">
          <div className="flex items-end justify-between gap-4">
            <div>
              <Eyebrow>Questions</Eyebrow>
              <Headline className="mt-4">Before you book.</Headline>
            </div>
            <Link
              href="/faq"
              className="shrink-0 font-display text-xs tracking-[0.18em] text-yellow uppercase"
            >
              All FAQs
            </Link>
          </div>
          <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {related.map((faq) => (
              <li key={faq.slug}>
                <Link
                  href={faqPath(faq.slug)}
                  className="flex items-center justify-between gap-4 py-4 text-lg text-cream hover:text-yellow"
                >
                  <span>{faq.title}</span>
                  <span aria-hidden="true" className="font-display text-yellow">
                    +
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {others.length ? (
        <Section>
          <Eyebrow>Other services</Eyebrow>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={servicePath(item.slug)}
                  className="flex items-center justify-between gap-4 border border-white/10 px-4 py-4 hover:border-yellow"
                >
                  <span className="font-display text-xl tracking-tight text-cream uppercase">
                    {item.title}
                  </span>
                  <ServiceIcon
                    slug={item.slug}
                    className="size-5 shrink-0 text-yellow"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      <ClosingCta site={site} />
    </>
  );
}
