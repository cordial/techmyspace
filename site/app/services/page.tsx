import type { Metadata } from "next";

import { ClosingCta } from "@/components/closing-cta";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { getServices, getSite } from "@/lib/wp/content";

export const metadata: Metadata = {
  title: "Services",
  description: "CCTV, alarms, security, structured cabling, communications and audio visual in Stockport.",
};

export default async function ServicesPage() {
  const [services, site] = await Promise.all([getServices(), getSite()]);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Six trades, one Stockport team."
        summary="Alarms, CCTV, access, cabling, communications and AV, designed to work together."
      />
      <Section className="pt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.slug} service={service} index={index} />
          ))}
        </div>
      </Section>
      <ClosingCta site={site} />
    </>
  );
}
