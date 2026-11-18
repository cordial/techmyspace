"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

import { RichText } from "@/components/rich-text";
import type { PropertyType } from "@/lib/types";

export function PropertyTabs({ items }: { items: PropertyType[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    const targets: Partial<Record<string, number>> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) {
      return;
    }
    event.preventDefault();
    setActive(target);
    tabs.current[target]?.focus();
  }

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="Property types" className="flex flex-wrap gap-2">
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.tabLabel}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`border-2 px-4 py-2.5 font-display text-sm tracking-[0.12em] uppercase transition-colors ${
                selected
                  ? "border-yellow bg-yellow text-ink"
                  : "border-white/20 bg-ink text-cream hover:border-yellow"
              }`}
            >
              {item.tabLabel}
            </button>
          );
        })}
      </div>
      {items.map((item, index) => (
        <div
          key={item.tabLabel}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== active}
          tabIndex={0}
          className="mt-5 border border-white/10 bg-charcoal p-6 md:p-8"
        >
          <h3 className="font-display text-3xl leading-tight font-medium tracking-tight text-cream">
            {item.title}
          </h3>
          <RichText html={item.body} className="richtext-flush mt-4 max-w-3xl" />
          {item.profiles ? (
            <p className="mt-6 max-w-3xl border-t border-white/10 pt-4 text-sm leading-relaxed text-muted">
              {item.profiles}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
