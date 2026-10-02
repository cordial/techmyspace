import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClosingCta } from "@/components/closing-cta";
import { Eyebrow } from "@/components/eyebrow";
import { Headline } from "@/components/headline";
import { MediaFrame } from "@/components/media-frame";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ReviewCarousel } from "@/components/review-carousel";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { aboutCopyFrom } from "@/lib/about";
import { caseStudyPath } from "@/lib/routes";
import {
  getCaseStudies,
  getPage,
  getSite,
  getTestimonials,
} from "@/lib/wp/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about");
  if (!page) {
    return {};
  }
  return { title: page.metaTitle, description: page.metaDescription };
}

export default async function AboutPage() {
  const [page, site, testimonials, studies] = await Promise.all([
    getPage("about"),
    getSite(),
    getTestimonials(),
    getCaseStudies(),
  ]);

  if (!page) {
    notFound();
  }

  const copy = aboutCopyFrom(page.body, page.summary);
  const portrait = page.images.find((image) => !image.url.includes("/bg2."));
  const hasStructure = copy.pillars.length > 0 || copy.steps.length > 0;

  return (
    <>
      <PageHero
        eyebrow="About"
        title="One team for the home and small office."
        summary={page.summary}
      />
      <Section className="border-y border-white/10 py-10 md:py-12">
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["10+ years", "In and around Stockport"],
            ["6 trades", "One visit, not sixteen"],
            ["Evenings", "And weekends when you need them"],
            ["Guaranteed", "Insured, without cut corners"],
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
      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <Eyebrow>Dave Jepson</Eyebrow>
            <Headline className="mt-4">Built as a one stop shop.</Headline>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              {copy.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              href="/team/dave"
              className="mt-6 inline-flex font-display text-sm tracking-[0.16em] text-yellow uppercase"
            >
              About Dave
            </Link>
          </Reveal>
          {portrait ? (
            <Reveal delay={0.08}>
              <MediaFrame
                src={portrait.url}
                alt={portrait.alt || "Tech My Space at work"}
                className="aspect-[4/5]"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </Reveal>
          ) : null}
        </div>
      </Section>
      {copy.pillars.length ? (
        <Section className="bg-charcoal">
          <Eyebrow>How we work</Eyebrow>
          <Headline className="mt-4 max-w-3xl">
            Knowledge, flexibility, satisfaction.
          </Headline>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.pillars.map((pillar, index) => (
              <li key={pillar.title} className="border border-white/10 p-6">
                <p className="font-display text-xs tracking-[0.22em] text-yellow">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-3 text-3xl tracking-tight text-cream uppercase">
                  {pillar.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {copy.guarantees.length ? (
        <Section>
          <Eyebrow>Our guarantee</Eyebrow>
          <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {copy.guarantees.map((item) => (
              <li
                key={`${item.title}-${item.body.slice(0, 24)}`}
                className="grid gap-3 py-6 md:grid-cols-[12rem_1fr] md:items-baseline"
              >
                <h3 className="font-display text-2xl tracking-tight text-yellow uppercase">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      {copy.steps.length ? (
        <Section className="bg-charcoal">
          <Eyebrow>The process</Eyebrow>
          <Headline className="mt-4">From the brief to the follow-up.</Headline>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {copy.steps.map((step, index) => (
              <li key={step.title} className="border border-white/10 p-5">
                <p className="font-display text-xs tracking-[0.22em] text-yellow">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-3 text-2xl tracking-tight text-cream uppercase">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
      {hasStructure ? null : (
        <Section>
          <RichText html={page.body} className="max-w-3xl" />
        </Section>
      )}
      <Section>
        <Eyebrow>Customers</Eyebrow>
        <Headline className="mt-4">What the jobs felt like.</Headline>
        <div className="mt-8">
          <ReviewCarousel reviews={testimonials} />
        </div>
      </Section>
      {studies.length ? (
        <Section className="pt-0">
          <Eyebrow>Work</Eyebrow>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {studies.map((study) => {
              const image = study.images[0];
              return (
                <li key={study.slug}>
                  <Link
                    href={caseStudyPath(study.slug)}
                    className="group relative block h-64 overflow-hidden"
                  >
                    {image ? (
                      <MediaFrame
                        src={image.url}
                        alt={image.alt || study.title}
                        className="h-full"
                        imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(min-width: 768px) 33vw, 100vw"
                      />
                    ) : (
                      <div className="h-full bg-charcoal" />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-5 font-display text-2xl leading-none tracking-tight text-cream uppercase">
                      {study.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}
      <ClosingCta site={site} />
    </>
  );
}
