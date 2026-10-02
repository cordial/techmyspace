"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PhoneLink } from "@/components/phone-link";
import { TmsLogo } from "@/components/tms-logo";
import { servicePath } from "@/lib/routes";
import type { Service, SiteInfo } from "@/lib/types";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Work" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({
  site,
  services,
}: {
  site: SiteInfo;
  services: Pick<Service, "slug" | "title">[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          aria-label="Tech My Space home"
          className="flex items-center gap-2.5"
          onClick={() => go("/")}
        >
          <TmsLogo className="h-9 w-auto" />
          <span className="hidden font-display text-sm tracking-[0.16em] text-cream uppercase sm:inline">
            Tech My Space
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm tracking-[0.14em] text-cream uppercase hover:text-yellow"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <PhoneLink
            site={site}
            className="hidden bg-yellow px-3 py-2 font-display text-sm tracking-[0.12em] text-ink uppercase sm:inline-flex"
          />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center border border-white/15 text-cream lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-ink px-4 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  go(link.href);
                }}
                className="font-display text-2xl tracking-tight text-cream"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ul className="mt-6 grid grid-cols-2 gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={servicePath(service.slug)}
                  onClick={(event) => {
                    event.preventDefault();
                    go(servicePath(service.slug));
                  }}
                  className="block text-sm text-muted hover:text-yellow"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
          <PhoneLink
            site={site}
            className="mt-6 inline-flex bg-yellow px-4 py-3 font-display tracking-[0.12em] text-ink uppercase"
          />
        </div>
      ) : null}
    </header>
  );
}
