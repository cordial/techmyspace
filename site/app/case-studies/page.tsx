import type { Metadata } from "next";
import Link from "next/link";

import { ClosingCta } from "@/components/closing-cta";
import { MediaFrame } from "@/components/media-frame";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { caseStudyPath } from "@/lib/routes";
import { getCaseStudies, getSite } from "@/lib/wp/content";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Real Tech My Space jobs: alarms, networks, phones and audio visual.",
};

export default async function CaseStudiesPage() {
  const [studies, site] = await Promise.all([getCaseStudies(), getSite()]);

  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Jobs with more than one trade in them."
        summary="Domestic and small commercial projects where cabling, alarms, phones and AV had to land together."
      />
      <Section className="pt-0">
        <ul className="grid gap-6">
          {studies.map((study) => {
            const image = study.images[0];
            return (
              <li key={study.slug} className="grid overflow-hidden border border-white/10 bg-charcoal md:grid-cols-[1.1fr_1fr]">
                {image ? (
                  <MediaFrame src={image.url} alt={image.alt || study.title} className="aspect-[16/10] md:aspect-auto md:min-h-72" />
                ) : (
                  <div className="min-h-48 bg-ink" />
                )}
                <div className="flex flex-col gap-4 p-6 md:p-8">
                  {study.location ? <p className="font-display text-xs tracking-[0.18em] text-yellow uppercase">{study.location}</p> : null}
                  <h2 className="font-display text-4xl leading-none tracking-tight text-cream">{study.title}</h2>
                  <p className="leading-relaxed text-muted">{study.summary}</p>
                  <Link href={caseStudyPath(study.slug)} className="mt-auto font-display text-sm tracking-[0.16em] text-yellow uppercase">
                    Read the job
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
      <ClosingCta site={site} />
    </>
  );
}
