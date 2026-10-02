import { Cable, Cctv, LockKeyhole, Phone, Shield, Speaker } from "lucide-react";

import { isServiceSlug, type ServiceSlug } from "@/lib/types";

export function ServiceIcon({
  slug,
  className = "size-5",
}: {
  slug: string;
  className?: string;
}) {
  if (!isServiceSlug(slug)) {
    return <Shield className={className} aria-hidden="true" />;
  }

  return iconFor(slug, className);
}

function iconFor(slug: ServiceSlug, className: string) {
  switch (slug) {
    case "alarms":
      return <Shield className={className} aria-hidden="true" />;
    case "cctv":
      return <Cctv className={className} aria-hidden="true" />;
    case "security":
      return <LockKeyhole className={className} aria-hidden="true" />;
    case "structured-cabling":
      return <Cable className={className} aria-hidden="true" />;
    case "communication":
      return <Phone className={className} aria-hidden="true" />;
    case "av":
      return <Speaker className={className} aria-hidden="true" />;
    default: {
      const exhaustive: never = slug;
      return exhaustive;
    }
  }
}
