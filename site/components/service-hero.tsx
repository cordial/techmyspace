import { Eyebrow } from "@/components/eyebrow";
import { Headline } from "@/components/headline";
import { HeroDiagram } from "@/components/hero-diagram";
import { MediaFrame } from "@/components/media-frame";
import type { HeroDiagram as HeroDiagramKind, ImageAsset } from "@/lib/types";

export type HeroAction = { href: string; label: string };

export function ServiceHero({
  eyebrow,
  title,
  summary,
  diagram,
  image,
  caption,
  facts,
  actions,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  diagram: HeroDiagramKind | null;
  image?: ImageAsset;
  caption: string;
  facts: string[];
  actions: HeroAction[];
}) {
  const hasFigure = Boolean(diagram || image);

  return (
    <header className="relative overflow-hidden px-4 pt-16 pb-6 md:pt-24 md:pb-10">
      <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,0,0.14),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div
          className={`grid items-center gap-10 ${hasFigure ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}
        >
          <div className="flex flex-col gap-5">
            <Eyebrow>{eyebrow}</Eyebrow>
            <Headline as="h1">{title}</Headline>
            {summary ? (
              <p className="max-w-2xl text-lg leading-relaxed text-muted">
                {summary}
              </p>
            ) : null}
            {actions.length ? (
              <div className="mt-2 flex flex-wrap gap-3">
                {actions.map((action, index) => (
                  <a
                    key={action.href}
                    href={action.href}
                    className={
                      index === 0
                        ? "inline-flex items-center justify-center border-2 border-yellow bg-yellow px-5 py-3 font-display text-sm tracking-[0.14em] text-ink uppercase transition-colors hover:bg-transparent hover:text-yellow"
                        : "inline-flex items-center justify-center border-2 border-cream/40 px-5 py-3 font-display text-sm tracking-[0.14em] text-cream uppercase transition-colors hover:border-yellow hover:bg-yellow hover:text-ink"
                    }
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          {hasFigure ? (
            <figure className="border border-white/10 bg-charcoal p-3">
              {diagram ? (
                <HeroDiagram kind={diagram} />
              ) : image ? (
                <MediaFrame
                  src={image.url}
                  alt={image.alt || title}
                  priority
                  className="aspect-[4/3]"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              ) : null}
              {caption ? (
                <figcaption className="px-1 pt-2 pb-0.5 text-sm text-muted">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
        {facts.length ? (
          <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-y border-white/10 py-4 font-semibold text-muted">
            {facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full bg-yellow ring-2 ring-yellow/25"
                />
                {fact}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </header>
  );
}
