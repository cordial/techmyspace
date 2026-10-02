import type { SiteInfo } from "@/lib/types";

export function PhoneLink({
  site,
  className = "",
}: {
  site: Pick<SiteInfo, "phone" | "phoneTel">;
  className?: string;
}) {
  return (
    <a href={`tel:${site.phoneTel}`} className={className}>
      {site.phone}
    </a>
  );
}
