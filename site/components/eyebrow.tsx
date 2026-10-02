import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-xs font-medium tracking-[0.22em] text-yellow uppercase">
      {children}
    </p>
  );
}
