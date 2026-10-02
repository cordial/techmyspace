import type { ReactNode } from "react";

import { Eyebrow } from "@/components/eyebrow";
import { Headline } from "@/components/headline";
import { MediaFrame } from "@/components/media-frame";

export function PageHero({
  eyebrow,
  title,
  summary,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  summary?: string;
  image?: { src: string; alt: string };
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden px-4 pt-16 pb-14 md:pt-28 md:pb-20">
      {image ? (
        <div className="pointer-events-none absolute inset-0">
          <MediaFrame
            src={image.src}
            alt=""
            priority
            className="h-full opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/55" />
        </div>
      ) : (
        <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,0,0.14),transparent_70%)]" />
      )}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-5">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Headline as="h1" size="lg">
          {title}
        </Headline>
        {summary ? (
          <p
            className={`max-w-2xl text-lg leading-relaxed ${image ? "text-cream/80" : "text-muted"}`}
          >
            {summary}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
