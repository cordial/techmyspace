import Link from "next/link";

import { PhoneLink } from "@/components/phone-link";
import { servicePath } from "@/lib/routes";
import { getContent } from "@/lib/wp/content";

export async function SiteFooter() {
  const { site, services, pages } = await getContent();
  const legal = pages.filter((page) => page.kind === "legal");

  return (
    <footer className="border-t border-white/10 bg-charcoal">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-3xl tracking-tight text-yellow">TMS</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{site.tagline}</p>
          <PhoneLink site={site} className="mt-4 inline-block font-display text-lg tracking-wide text-cream" />
        </div>
        <div>
          <p className="font-display text-xs tracking-[0.18em] text-yellow uppercase">Services</p>
          <ul className="mt-4 space-y-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={servicePath(service.slug)} className="text-sm text-cream hover:text-yellow">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-display text-xs tracking-[0.18em] text-yellow uppercase">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="text-cream hover:text-yellow">About</Link></li>
            <li><Link href="/customers" className="text-cream hover:text-yellow">Customers</Link></li>
            <li><Link href="/case-studies" className="text-cream hover:text-yellow">Case studies</Link></li>
            <li><Link href="/offers" className="text-cream hover:text-yellow">Special offers</Link></li>
            <li><Link href="/glossary" className="text-cream hover:text-yellow">Glossary</Link></li>
            <li><Link href="/team/dave" className="text-cream hover:text-yellow">Dave Jepson</Link></li>
            <li><Link href="/faq" className="text-cream hover:text-yellow">FAQ</Link></li>
            <li><Link href="/galleries/cctv" className="text-cream hover:text-yellow">CCTV gallery</Link></li>
            <li><Link href="/galleries/alarms" className="text-cream hover:text-yellow">Alarm gallery</Link></li>
            <li><Link href="/contact" className="text-cream hover:text-yellow">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-xs tracking-[0.18em] text-yellow uppercase">Legal</p>
          <ul className="mt-4 space-y-2">
            {legal.map((page) => (
              <li key={page.slug}>
                <Link href={page.path} className="text-sm text-cream hover:text-yellow">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs tracking-wide text-muted">
        © {new Date().getFullYear()} Tech My Space Ltd
      </div>
    </footer>
  );
}
