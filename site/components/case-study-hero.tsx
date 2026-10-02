"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { MediaFrame } from "@/components/media-frame";

export function CaseStudyHero({
  title,
  eyebrow,
  summary,
  imageUrl,
  imageAlt,
}: {
  title: string;
  eyebrow: string;
  summary: string;
  imageUrl?: string;
  imageAlt: string;
}) {
  const reduce = useReducedMotion();
  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <header className="relative min-h-[78vh] overflow-hidden">
      <div className="absolute inset-0">
        {imageUrl ? (
          <MediaFrame
            src={imageUrl}
            alt={imageAlt}
            priority
            className="h-full"
            imageClassName={reduce ? "" : "scale-105"}
            sizes="100vw"
          />
        ) : (
          <div className="h-full bg-charcoal" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
      <motion.div
        className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end gap-5 px-4 pt-28 pb-12 md:pb-16"
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
        }}
      >
        <motion.div variants={item}>
          <Link
            href="/case-studies"
            className="font-display text-xs tracking-[0.22em] text-yellow uppercase"
          >
            All work
          </Link>
        </motion.div>
        <motion.p
          variants={item}
          className="font-display text-xs tracking-[0.22em] text-cream uppercase"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          variants={item}
          className="font-display max-w-4xl text-5xl leading-[0.92] font-medium tracking-tight text-cream uppercase sm:text-6xl md:text-7xl"
        >
          {title}
        </motion.h1>
        {summary ? (
          <motion.p
            variants={item}
            className="max-w-2xl text-lg leading-relaxed text-cream/80 line-clamp-3"
          >
            {summary}
          </motion.p>
        ) : null}
      </motion.div>
    </header>
  );
}
