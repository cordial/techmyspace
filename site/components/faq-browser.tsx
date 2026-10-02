"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";

import { RichText } from "@/components/rich-text";
import { ServiceIcon } from "@/components/service-icon";
import { faqPath, servicePath } from "@/lib/routes";

export type FaqGroup = {
  slug: string;
  title: string;
  faqs: {
    slug: string;
    title: string;
    answer: string;
  }[];
};

const SHORT_LABELS: Record<string, string> = {
  alarms: "Alarms",
  cctv: "CCTV",
  security: "Security",
  "structured-cabling": "Cabling",
  communication: "Comms",
  av: "AV",
};

function labelFor(slug: string, title: string): string {
  return SHORT_LABELS[slug] ?? title;
}

export function FaqBrowser({ groups }: { groups: FaqGroup[] }) {
  const reduce = useReducedMotion();
  const [service, setService] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return groups
      .filter((group) => service === "all" || group.slug === service)
      .map((group) => ({
        ...group,
        faqs: needle
          ? group.faqs.filter((faq) => faq.title.toLowerCase().includes(needle))
          : group.faqs,
      }))
      .filter((group) => group.faqs.length > 0);
  }, [groups, query, service]);

  const total = groups.reduce((count, group) => count + group.faqs.length, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 border border-white/10 bg-charcoal p-4 md:p-5">
        <label className="grid gap-2 text-sm text-muted">
          Search questions
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpenSlug(null);
            }}
            placeholder="Cost, wireless, false alarms…"
            className="border border-white/15 bg-ink px-3 py-3 text-cream placeholder:text-muted/70"
          />
        </label>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter by service"
        >
          <FilterChip
            active={service === "all"}
            onClick={() => {
              setService("all");
              setOpenSlug(null);
            }}
          >
            All {total}
          </FilterChip>
          {groups.map((group) => (
            <FilterChip
              key={group.slug}
              active={service === group.slug}
              onClick={() => {
                setService(group.slug);
                setOpenSlug(null);
              }}
            >
              {labelFor(group.slug, group.title)} {group.faqs.length}
            </FilterChip>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-muted">No questions match that search.</p>
      ) : (
        <div className="mt-10 space-y-12">
          {visible.map((group) => (
            <section key={group.slug} id={group.slug}>
              <div className="flex items-end justify-between gap-4">
                <h2 className="flex items-center gap-3 font-display text-3xl tracking-tight text-cream uppercase md:text-4xl">
                  <ServiceIcon
                    slug={group.slug}
                    className="size-6 text-yellow"
                  />
                  {labelFor(group.slug, group.title)}
                </h2>
                <Link
                  href={servicePath(group.slug)}
                  className="shrink-0 font-display text-xs tracking-[0.18em] text-yellow uppercase"
                >
                  Service
                </Link>
              </div>
              <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
                {group.faqs.map((faq) => {
                  const open = openSlug === faq.slug;
                  return (
                    <li key={faq.slug}>
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenSlug(open ? null : faq.slug)}
                        className="flex w-full items-start justify-between gap-4 py-4 text-left"
                      >
                        <span
                          className={`text-lg ${open ? "text-yellow" : "text-cream"}`}
                        >
                          {faq.title}
                        </span>
                        <span
                          className="font-display mt-1 text-yellow"
                          aria-hidden="true"
                        >
                          {open ? "–" : "+"}
                        </span>
                      </button>
                      <div
                        className={`grid ${reduce ? "" : "transition-[grid-template-rows] duration-300"} ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-5">
                            <RichText html={faq.answer} className="max-w-3xl" />
                            <Link
                              href={faqPath(faq.slug)}
                              className="mt-4 inline-flex font-display text-xs tracking-[0.18em] text-yellow uppercase"
                            >
                              Open this answer
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-3 py-2 font-display text-xs tracking-[0.16em] uppercase ${
        active
          ? "bg-yellow text-ink"
          : "border border-white/15 text-cream hover:border-yellow"
      }`}
    >
      {children}
    </button>
  );
}
