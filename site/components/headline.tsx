import type { ReactNode } from "react";

type HeadlineSize = "md" | "lg" | "xl";

const SIZE_CLASSES: Record<HeadlineSize, string> = {
  md: "text-3xl sm:text-4xl md:text-5xl",
  lg: "text-4xl sm:text-5xl md:text-6xl",
  xl: "text-5xl sm:text-6xl md:text-7xl",
};

export function Headline({
  as = "h2",
  size = "lg",
  accent,
  children,
  className = "",
}: {
  as?: "h1" | "h2" | "h3";
  size?: HeadlineSize;
  accent?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const Tag = as;

  return (
    <Tag
      className={`font-display leading-[0.95] font-medium tracking-tight text-balance text-cream ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
      {accent ? <span className="mt-2 block text-yellow">{accent}</span> : null}
    </Tag>
  );
}
