import type { Metadata } from "next";

import { ClosingCta } from "@/components/closing-cta";
import { FaqBrowser } from "@/components/faq-browser";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { getFaqs, getServices, getSite } from "@/lib/wp/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers on CCTV, alarms, access control and audio visual from Tech My Space.",
};

export default async function FaqPage() {
  const [faqs, services, site] = await Promise.all([
    getFaqs(),
    getServices(),
    getSite(),
  ]);
  const groups = services
    .map((service) => ({
      service,
      faqs: faqs.filter((faq) => faq.service === service.slug),
    }))
    .filter((group) => group.faqs.length > 0);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Straight answers before you book."
        summary="The questions we get asked about alarms, cameras, access and AV."
      />
      <Section className="pt-0">
        <FaqBrowser
          groups={groups.map((group) => ({
            slug: group.service.slug,
            title: group.service.title,
            faqs: group.faqs.map((faq) => ({
              slug: faq.slug,
              title: faq.title,
              answer: faq.answer,
            })),
          }))}
        />
      </Section>
      <ClosingCta site={site} />
    </>
  );
}
