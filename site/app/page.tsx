import type { Metadata } from "next";
import Link from "next/link";

import { ClosingCta } from "@/components/closing-cta";
import { Eyebrow } from "@/components/eyebrow";
import { Headline } from "@/components/headline";
import { Hero } from "@/components/hero";
import { JobMosaic } from "@/components/job-mosaic";
import { Reveal } from "@/components/reveal";
import { ReviewCarousel } from "@/components/review-carousel";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { servicePath } from "@/lib/routes";
import { getContent } from "@/lib/wp/content";

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getContent();
  return {
    title: { absolute: home.metaTitle },
    description: home.metaDescription,
  };
}

export default async function HomePage() {
  const { site, home, services, testimonials } = await getContent();
  const jobs = services.flatMap((service) => {
    const image = service.images[0];
    if (!image) {
      return [];
    }

    return [
      {
        url: image.url,
        alt: image.alt,
        href: servicePath(service.slug),
        service: service.title,
      },
    ];
  });

  return (
    <>
      <Hero home={home} site={site} />
      <Section className="border-y border-white/10 py-10 md:py-12">
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["10+ years", "Installing in Stockport"],
            ["6 trades", "One local team"],
            ["SK & M", "Postcodes we cover"],
            ["5 stars", "Trustpilot reviews"],
          ].map(([value, label]) => (
            <div key={value}>
              <dt className="font-display text-3xl tracking-tight text-yellow md:text-4xl">
                {value}
              </dt>
              <dd className="mt-1 text-sm text-muted">{label}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section id="services">
        <Reveal>
          <Eyebrow>Our services</Eyebrow>
          <Headline className="mt-4 max-w-3xl">
            Click through the work we actually do.
          </Headline>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} />
          ))}
        </div>
      </Section>
      <Section className="bg-charcoal">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>About TMS</Eyebrow>
            <Headline as="h2" className="mt-4">
              {home.introTitle}
            </Headline>
          </Reveal>
          <Reveal delay={0.08}>
            <RichText html={home.intro} />
            <Link
              href="/about"
              className="mt-6 inline-flex font-display text-sm tracking-[0.16em] text-yellow uppercase"
            >
              More about us
            </Link>
          </Reveal>
        </div>
      </Section>
      <Section>
        <Reveal>
          <Eyebrow>Real jobs</Eyebrow>
          <Headline className="mt-4 max-w-3xl">
            Taken on site, not from a studio.
          </Headline>
        </Reveal>
        <JobMosaic jobs={jobs} />
      </Section>
      <Section className="bg-charcoal">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Eyebrow>Areas</Eyebrow>
            <Headline className="mt-4">
              Usually within 10 miles of Stockport.
            </Headline>
            <p className="mt-6 max-w-xl leading-relaxed text-muted">
              {home.areasBody}
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {home.areas.map((area) => (
                <li
                  key={area}
                  className="border border-white/15 px-3 py-1.5 text-sm text-cream"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-yellow/30 p-6 md:p-8">
            <Eyebrow>Awards</Eyebrow>
            <ul className="mt-6 space-y-4">
              {home.awards.map((award) => (
                <li
                  key={award}
                  className="font-display text-4xl tracking-tight text-cream"
                >
                  {award}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section>
        <Reveal>
          <Eyebrow>Customers</Eyebrow>
          <Headline className="mt-4">What the jobs felt like.</Headline>
        </Reveal>
        <div className="mt-8">
          <ReviewCarousel reviews={testimonials} />
        </div>
      </Section>
      <ClosingCta site={site} />
    </>
  );
}
