import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Headline } from "@/components/headline";
import { MediaFrame } from "@/components/media-frame";
import { PropertyTabs } from "@/components/property-tabs";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import type {
  CardItem,
  Feature,
  ServiceSection,
  VenueGuideItem,
} from "@/lib/types";

export const PROPERTY_TABS_ID = "venues";

function SectionHeading({
  heading,
  intro,
}: {
  heading: string;
  intro: string;
}) {
  return (
    <>
      {heading ? (
        <Headline size="md" className="max-w-3xl">
          {heading}
        </Headline>
      ) : null}
      {intro ? (
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
          {intro}
        </p>
      ) : null}
    </>
  );
}

/** Stretches over the whole card, so the card is one link without nesting the body inside an anchor. */
function CardLink({ href, children }: { href: string; children: ReactNode }) {
  const className =
    "flex items-start justify-between gap-3 after:absolute after:inset-0 focus-visible:outline-none";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
        <ArrowUpRight
          aria-hidden="true"
          className="mt-1 size-5 shrink-0 text-yellow"
        />
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
      <ArrowDown
        aria-hidden="true"
        className="mt-1 size-5 shrink-0 text-yellow"
      />
    </a>
  );
}

function CardGrid({ items }: { items: CardItem[] }) {
  return (
    <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-4">
      {items.map((item) => (
        <li
          key={item.title}
          className={`border border-t-4 border-white/10 border-t-yellow bg-charcoal p-6 ${
            item.link
              ? "group relative transition-colors focus-within:border-yellow hover:border-yellow"
              : ""
          }`}
        >
          <h3 className="font-display text-2xl leading-tight font-medium tracking-tight text-cream group-hover:text-yellow">
            {item.link ? (
              <CardLink href={item.link}>{item.title}</CardLink>
            ) : (
              item.title
            )}
          </h3>
          <RichText html={item.body} className="richtext-flush mt-3" />
        </li>
      ))}
    </ul>
  );
}

function StepList({ items }: { items: Feature[] }) {
  return (
    <ol className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-6">
      {items.map((item, index) => (
        <li key={item.title} className="border-l-4 border-yellow py-1 pl-4">
          <p
            aria-hidden="true"
            className="font-display text-4xl leading-none font-semibold text-yellow"
          >
            {index + 1}
          </p>
          <h3 className="font-display mt-2 text-2xl leading-tight font-medium tracking-tight text-cream">
            {item.title}
          </h3>
          <RichText html={item.body} className="richtext-flush mt-2" />
        </li>
      ))}
    </ol>
  );
}

export function Accordion({ items }: { items: Feature[] }) {
  return (
    <div className="mt-8 flex flex-col gap-2.5">
      {items.map((item) => (
        <details
          key={item.title}
          className="group border border-white/10 bg-charcoal"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-semibold text-cream hover:text-yellow [&::-webkit-details-marker]:hidden">
            <span>{item.title}</span>
            <span
              aria-hidden="true"
              className="font-display text-2xl leading-none text-yellow"
            >
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <RichText
            html={item.body}
            className="richtext-flush max-w-3xl px-5 pb-5"
          />
        </details>
      ))}
    </div>
  );
}

function Checklist({
  heading,
  intro,
  items,
}: {
  heading: string;
  intro: string;
  items: Feature[];
}) {
  return (
    <div className="border border-l-4 border-white/10 border-l-yellow bg-charcoal p-6 md:p-10">
      <SectionHeading heading={heading} intro={intro} />
      <ul className="mt-8 grid gap-x-10 gap-y-5 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span
              aria-hidden="true"
              className="font-display text-xl leading-none font-semibold text-yellow"
            >
              ✓
            </span>
            <div>
              <p className="font-semibold text-cream">{item.title}</p>
              <RichText html={item.body} className="richtext-flush mt-1" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Venues without a button label are anchored by their title, so cards can still link to them. */
function venueAnchor(item: VenueGuideItem): string {
  const slug = (item.navLabel || item.title)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `venue-${slug}`;
}

function VenueGuide({ items }: { items: VenueGuideItem[] }) {
  const buttons = items.filter((item) => item.navLabel);
  // Five buttons in four columns would leave one alone on a second row.
  const buttonColumns =
    buttons.length === 5 ? "md:grid-cols-3 lg:grid-cols-5" : "md:grid-cols-4";

  return (
    <>
      {buttons.length ? (
        <ul className={`mt-8 grid grid-cols-2 gap-3 ${buttonColumns}`}>
          {buttons.map((item) => (
            <li key={item.navLabel}>
              <a
                href={`#${venueAnchor(item)}`}
                className="flex h-full items-center justify-center border border-white/10 bg-charcoal px-3 py-5 text-center font-display text-lg leading-tight tracking-tight text-cream uppercase transition-colors hover:border-yellow hover:text-yellow"
              >
                {item.navLabel}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <div className={buttons.length ? "mt-12" : ""}>
        {items.map((item, index) => {
          const imageFirst = index % 2 === 1;
          return (
            <article
              key={item.title}
              id={venueAnchor(item)}
              className="grid scroll-mt-24 items-center gap-8 border-t border-white/10 py-12 md:grid-cols-2 md:gap-12"
            >
              <div
                className={
                  item.image
                    ? imageFirst
                      ? "md:order-2"
                      : ""
                    : "md:col-span-2 md:max-w-3xl"
                }
              >
                <h3 className="font-display text-3xl leading-tight font-medium tracking-tight text-cream md:text-4xl">
                  {item.title}
                </h3>
                <RichText html={item.body} className="richtext-flush mt-4" />
                {item.profiles ? (
                  <p className="mt-6 border-l-4 border-yellow bg-charcoal px-4 py-3 text-sm leading-relaxed text-muted">
                    <strong className="text-cream">
                      {item.profilesLabel || "Property profiles"}:
                    </strong>{" "}
                    {item.profiles}
                  </p>
                ) : null}
              </div>
              {item.image ? (
                <figure className={imageFirst ? "md:order-1" : ""}>
                  <MediaFrame
                    src={item.image.url}
                    alt={item.image.alt}
                    className="aspect-[4/3] border border-white/10"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  {item.imageCaption ? (
                    <figcaption className="mt-3 text-sm leading-relaxed text-muted">
                      {item.imageCaption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}
            </article>
          );
        })}
      </div>
    </>
  );
}

function SectionBody({ section }: { section: ServiceSection }) {
  switch (section.layout) {
    case "cards":
      return (
        <>
          <SectionHeading heading={section.heading} intro={section.intro} />
          <CardGrid items={section.items} />
        </>
      );
    case "propertyTabs":
      return (
        <>
          <SectionHeading heading={section.heading} intro={section.intro} />
          <PropertyTabs items={section.items} />
        </>
      );
    case "steps":
      return (
        <>
          <SectionHeading heading={section.heading} intro={section.intro} />
          <StepList items={section.items} />
        </>
      );
    case "accordion":
      return (
        <>
          <SectionHeading heading={section.heading} intro={section.intro} />
          <Accordion items={section.items} />
        </>
      );
    case "checklist":
      return (
        <Checklist
          heading={section.heading}
          intro={section.intro}
          items={section.items}
        />
      );
    case "venueGuide":
      return (
        <>
          <SectionHeading heading={section.heading} intro={section.intro} />
          <VenueGuide items={section.items} />
        </>
      );
    default: {
      const unhandled: never = section;
      throw new Error(`Unhandled section layout: ${JSON.stringify(unhandled)}`);
    }
  }
}

export function ServiceSections({ sections }: { sections: ServiceSection[] }) {
  const tabsIndex = sections.findIndex(
    (section) => section.layout === "propertyTabs",
  );

  return (
    <>
      {sections.map((section, index) => (
        <Section
          key={`${section.layout}-${section.heading}-${index}`}
          id={
            index === tabsIndex
              ? PROPERTY_TABS_ID
              : section.layout === "venueGuide"
                ? "venue-guide"
                : undefined
          }
          spacing="tight"
        >
          <SectionBody section={section} />
        </Section>
      ))}
    </>
  );
}
