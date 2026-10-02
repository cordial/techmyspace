"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import type { Testimonial } from "@/lib/types";

export function ReviewCarousel({
  reviews,
  compact = true,
}: {
  reviews: Testimonial[];
  compact?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  function scrollByCard(direction: -1 | 1) {
    const node = scroller.current;
    if (!node) {
      return;
    }
    const card = node.querySelector<HTMLElement>("[data-review]");
    const amount = (card?.offsetWidth ?? 320) + 16;
    node.scrollBy({
      left: direction * amount,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <div>
      <div className="mb-6 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Previous review"
          onClick={() => scrollByCard(-1)}
          className="inline-flex size-11 items-center justify-center border border-white/15 text-cream hover:border-yellow hover:text-yellow"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next review"
          onClick={() => scrollByCard(1)}
          className="inline-flex size-11 items-center justify-center border border-white/15 text-cream hover:border-yellow hover:text-yellow"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review) => (
          <figure
            key={review.slug}
            data-review
            className="flex w-[min(100%,26rem)] shrink-0 snap-start flex-col border border-white/10 bg-charcoal p-6 md:w-[28rem] md:p-8"
          >
            <blockquote
              className={`font-display text-2xl leading-tight tracking-tight text-cream whitespace-pre-line ${compact ? "line-clamp-6" : ""}`}
            >
              {review.quote}
            </blockquote>
            <figcaption className="mt-6 text-sm text-muted">
              <span className="text-cream">{review.author}</span>
              {review.location
                ? ` · ${review.location.replace(/\.$/, "")}`
                : ""}
              {review.serviceLabel ? (
                <span className="mt-1 block text-yellow">
                  {review.serviceLabel}
                </span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
