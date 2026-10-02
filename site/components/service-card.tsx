"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { MediaFrame } from "@/components/media-frame";
import { ServiceIcon } from "@/components/service-icon";
import { servicePath } from "@/lib/routes";
import type { Service } from "@/lib/types";

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const reduce = useReducedMotion();
  const image = service.images[0];

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.25 }}
      className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-charcoal"
    >
      <Link href={servicePath(service.slug)} className="flex h-full flex-col">
        {image ? (
          <MediaFrame
            src={image.url}
            alt={image.alt || service.title}
            className="aspect-[16/10]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="aspect-[16/10] bg-ink" />
        )}
        <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
          <div className="flex items-center justify-between text-yellow">
            <span className="font-display text-sm tracking-[0.18em]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <ServiceIcon slug={service.slug} />
          </div>
          <h3 className="font-display text-3xl leading-none tracking-tight text-cream">{service.title}</h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">{service.summary}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 font-display text-sm tracking-[0.16em] text-yellow uppercase">
            View service
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
