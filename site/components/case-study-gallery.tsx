"use client";

import { motion, useReducedMotion } from "framer-motion";

import { MediaFrame } from "@/components/media-frame";
import type { ImageAsset } from "@/lib/types";

function caption(alt: string): string {
  const label = alt.trim();
  if (label.length < 3 || label.length > 42) {
    return "";
  }
  return label;
}

function Tile({
  image,
  index,
  className,
  reduce,
}: {
  image: ImageAsset;
  index: number;
  className: string;
  reduce: boolean | null;
}) {
  const label = caption(image.alt);

  return (
    <motion.div
      className={`relative min-w-0 overflow-hidden ${className}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.55,
        delay: reduce ? 0 : Math.min(index, 5) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="group absolute inset-0">
        <MediaFrame
          src={image.url}
          alt={image.alt}
          className="h-full"
          imageClassName={
            reduce
              ? ""
              : "transition-transform duration-700 ease-out group-hover:scale-105"
          }
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-2 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-display text-xs tracking-[0.22em] text-yellow">
            {String(index + 1).padStart(2, "0")}
          </span>
          {label ? (
            <span className="font-display text-lg leading-none tracking-tight text-cream uppercase">
              {label}
            </span>
          ) : null}
        </span>
      </div>
    </motion.div>
  );
}

export function CaseStudyGallery({ images }: { images: ImageAsset[] }) {
  const reduce = useReducedMotion();

  if (!images.length) {
    return null;
  }

  if (images.length === 1) {
    return (
      <Tile
        image={images[0]}
        index={0}
        className="aspect-[16/9]"
        reduce={reduce}
      />
    );
  }

  const [first, second, ...rest] = images;

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
        <Tile
          image={first}
          index={0}
          className="aspect-[16/9] sm:col-span-2"
          reduce={reduce}
        />
        <Tile
          image={second}
          index={1}
          className="aspect-[16/9] sm:aspect-auto sm:h-full"
          reduce={reduce}
        />
      </div>
      {rest.length ? (
        <ul className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-3">
          {rest.map((image, index) => (
            <li key={image.url} className="min-w-0">
              <Tile
                image={image}
                index={index + 2}
                className="aspect-[4/3]"
                reduce={reduce}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
