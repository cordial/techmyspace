"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { PhoneLink } from "@/components/phone-link";
import type { HomeContent, SiteInfo } from "@/lib/types";

export function Hero({ home, site }: { home: HomeContent; site: SiteInfo }) {
  const reduce = useReducedMotion();
  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-20 md:pt-28 md:pb-28">
      <div className="pointer-events-none absolute -top-20 left-0 h-[28rem] w-[36rem] bg-[radial-gradient(circle,rgba(255,255,0,0.16),transparent_68%)]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 bg-[radial-gradient(circle,rgba(230,120,29,0.2),transparent_70%)]" />
      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col gap-8"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.08 } } }}
      >
        <motion.p variants={item} className="font-display text-xs tracking-[0.22em] text-yellow uppercase">
          {home.heroKicker}
        </motion.p>
        <motion.h1
          variants={item}
          className="font-display max-w-4xl text-5xl leading-[0.92] font-medium tracking-tight text-cream sm:text-6xl md:text-8xl"
        >
          {home.heroTitle} <span className="text-yellow">{home.heroAccent}</span>
        </motion.h1>
        <motion.p variants={item} className="max-w-xl text-lg leading-relaxed text-muted">
          {home.heroSummary}
        </motion.p>
        <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row">
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
        </motion.div>
      </motion.div>
    </section>
  );
}
