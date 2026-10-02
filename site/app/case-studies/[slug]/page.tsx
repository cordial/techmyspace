import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyGallery } from "@/components/case-study-gallery";
import { CaseStudyHero } from "@/components/case-study-hero";
import { ClosingCta } from "@/components/closing-cta";
import { MediaFrame } from "@/components/media-frame";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { caseStudyPath } from "@/lib/routes";
import type { CaseStudy } from "@/lib/types";
import { getCaseStudies, getCaseStudy, getSite } from "@/lib/wp/content";

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) {
    return {};
  }
  return { title: study.metaTitle, description: study.metaDescription };
}

function articleBody(html: string): string {
  const cut = html.search(/<h2>CONTACT INFO<\/h2>/i);
  return cut === -1 ? html : html.slice(0, cut);
}

function quoteFor(study: CaseStudy): string {
  const quote = study.pullQuote.trim();
  if (quote.length < 40 || quote.length > 180 || /^below is\b/i.test(quote)) {
    return "";
  }
  if (study.summary.includes(quote)) {
    return "";
  }
  return quote;
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [study, studies, site] = await Promise.all([
    getCaseStudy(slug),
    getCaseStudies(),
    getSite(),
  ]);
  if (!study) {
    notFound();
  }

  const index = studies.findIndex((item) => item.slug === study.slug);
  const others = studies.filter((item) => item.slug !== study.slug);
  const hero = study.images[0];
  const gallery = study.images.slice(1);
  const quote = quoteFor(study);

  return (
    <>
      <CaseStudyHero
        title={study.title}
        eyebrow={study.location || "Case study"}
        summary={study.summary}
        imageUrl={hero?.url}
        imageAlt={hero?.alt || study.title}
      />
      {quote ? (
        <section className="border-y border-white/10 px-4 py-14 md:py-20">
          <blockquote className="mx-auto max-w-4xl font-display text-3xl leading-tight tracking-tight text-cream md:text-5xl">
            {quote}
          </blockquote>
        </section>
      ) : null}
      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <RichText html={articleBody(study.body)} className="max-w-3xl" />
          <aside className="border border-white/10 bg-charcoal p-5 lg:sticky lg:top-24">
            <p className="font-display text-xs tracking-[0.22em] text-yellow uppercase">
              The job
            </p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-muted">Project</dt>
                <dd className="mt-1 text-cream">
                  {String(index + 1).padStart(2, "0")} of {studies.length}
                </dd>
              </div>
              {study.location ? (
                <div>
                  <dt className="text-muted">Location</dt>
                  <dd className="mt-1 text-cream">{study.location}</dd>
                </div>
              ) : null}
            </dl>
            <Link
              href="/case-studies"
              className="mt-6 inline-flex font-display text-xs tracking-[0.18em] text-yellow uppercase"
            >
              All work
            </Link>
          </aside>
        </div>
      </Section>
      {gallery.length ? (
        <Section className="bg-charcoal pt-0 md:pt-0">
          <p className="font-display text-xs tracking-[0.22em] text-yellow uppercase">
            On site
          </p>
          <h2 className="font-display mt-3 text-4xl tracking-tight text-cream uppercase md:text-5xl">
            The rest of the job
          </h2>
          <div className="mt-8">
            <CaseStudyGallery images={gallery} />
          </div>
        </Section>
      ) : null}
      {others.length ? (
        <Section>
          <p className="font-display text-xs tracking-[0.22em] text-yellow uppercase">
            More work
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {others.map((item) => {
              const image = item.images[0];
              return (
                <li key={item.slug}>
                  <Link
                    href={caseStudyPath(item.slug)}
                    className="group relative block h-64 overflow-hidden"
                  >
                    {image ? (
                      <MediaFrame
                        src={image.url}
                        alt={image.alt || item.title}
                        className="h-full"
                        imageClassName="transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    ) : (
                      <div className="h-full bg-charcoal" />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-5">
                      <span className="block font-display text-xs tracking-[0.2em] text-yellow uppercase">
                        {item.location || "Case study"}
                      </span>
                      <span className="mt-2 block font-display text-2xl leading-none tracking-tight text-cream uppercase">
                        {item.title}
                      </span>
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
