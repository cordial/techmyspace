import { PhoneLink } from "@/components/phone-link";
import { Reveal } from "@/components/reveal";
import type { SiteInfo } from "@/lib/types";
import Link from "next/link";

export function ClosingCta({ site }: { site: SiteInfo }) {
  return (
    <section className="px-4 py-20 md:py-28">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-8 border border-yellow/40 bg-charcoal px-6 py-10 md:flex-row md:items-end md:justify-between md:px-10 md:py-14">
        <div className="max-w-xl">
          <p className="font-display text-xs tracking-[0.22em] text-yellow uppercase">Free consultation</p>
          <h2 className="font-display mt-3 text-4xl leading-none tracking-tight text-cream md:text-6xl">
            Stay connected, secure, and ahead of the job.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <PhoneLink
            site={site}
            className="inline-flex items-center justify-center bg-yellow px-5 py-3 font-display text-sm tracking-[0.14em] text-ink uppercase"
          />
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-cream/30 px-5 py-3 font-display text-sm tracking-[0.14em] text-cream uppercase hover:border-yellow hover:text-yellow"
          >
            Arrange a visit
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
