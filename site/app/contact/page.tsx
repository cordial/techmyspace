import type { Metadata } from "next";

import { ClosingCta } from "@/components/closing-cta";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { PhoneLink } from "@/components/phone-link";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { getPage, getServices, getSite } from "@/lib/wp/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("contact");
  return {
    title: page?.metaTitle ?? "Contact",
    description: page?.metaDescription,
  };
}

export default async function ContactPage() {
  const [page, site, services] = await Promise.all([
    getPage("contact"),
    getSite(),
    getServices(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Arrange a free visit in and around Stockport."
        summary={page?.summary}
      />
      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-display text-xs tracking-[0.18em] text-yellow uppercase">
              Call
            </p>
            <PhoneLink
              site={site}
              className="mt-2 block font-display text-4xl tracking-tight text-cream md:text-5xl"
            />
            <p className="mt-4 max-w-sm text-muted">
              The fastest way to book. If you would rather write, the form comes
              through once email is configured.
            </p>
            {page?.body ? <RichText html={page.body} className="mt-8" /> : null}
          </div>
          <ContactForm services={services} />
        </div>
      </Section>
      <ClosingCta site={site} />
    </>
  );
}
