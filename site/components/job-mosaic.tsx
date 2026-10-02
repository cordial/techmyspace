"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { MediaFrame } from "@/components/media-frame";

export type JobTile = {
  url: string;
  alt: string;
  href: string;
  service: string;
};

const tileSpan = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "",
  "",
  "sm:col-span-2",
];

export function JobMosaic({ jobs }: { jobs: JobTile[] }) {
  const reduce = useReducedMotion();

  return (
    <ul className="mt-10 grid gap-3 sm:grid-cols-2 sm:auto-rows-[15rem] lg:grid-cols-4">
      {jobs.map((job, index) => (
        <motion.li
          key={job.href}
          className={`min-h-64 ${tileSpan[index] ?? ""}`}
          initial={reduce ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{
            duration: 0.6,
            delay: reduce ? 0 : index * 0.07,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Link
            href={job.href}
            className="group relative block h-full overflow-hidden"
          >
            <MediaFrame
              src={job.url}
              alt={job.alt || job.service}
              className="h-full"
              imageClassName={
                reduce
                  ? ""
                  : "transition-transform duration-700 ease-out group-hover:scale-110"
              }
              sizes={
                index === 0
                  ? "(min-width: 1024px) 50vw, 100vw"
                  : "(min-width: 1024px) 25vw, 50vw"
              }
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent transition-opacity duration-500 group-hover:from-ink/95" />
            <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 md:p-5">
              <span className="font-display text-xs tracking-[0.22em] text-yellow">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-2xl leading-none tracking-tight text-cream uppercase md:text-3xl">
                {job.service}
              </span>
              <span className="h-0.5 w-8 bg-yellow transition-all duration-500 group-hover:w-16" />
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
