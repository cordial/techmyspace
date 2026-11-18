import type { ReactNode } from "react";

type SectionSpacing = "default" | "tight";

const SPACING_CLASSES: Record<SectionSpacing, string> = {
  default: "py-20 md:py-28",
  tight: "py-10 md:py-14",
};

export function Section({
  id,
  children,
  spacing = "default",
  className = "",
}: {
  id?: string;
  children: ReactNode;
  spacing?: SectionSpacing;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 px-4 ${SPACING_CLASSES[spacing]} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
