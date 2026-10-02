import type { ReactNode } from "react";

export function Headline({
  as = "h2",
  size = "lg",
  accent,
  children,
  className = "",
}: {
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "xl";
  accent?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const Tag = as;
  const sizeClass =
    size === "xl"
      ? "text-5xl sm:text-6xl md:text-7xl"
      : "text-4xl sm:text-5xl md:text-6xl";

  return (
    <Tag
      className={`font-display leading-[0.95] font-medium tracking-tight text-balance text-cream ${sizeClass} ${className}`}
    >
      {children}
      {accent ? <span className="mt-2 block text-yellow">{accent}</span> : null}
    </Tag>
  );
}
