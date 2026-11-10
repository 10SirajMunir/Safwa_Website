import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  id?: string;
  children?: ReactNode;
}

export function SectionHeading({ eyebrow, title, id, children }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow text-gold-700">{eyebrow}</p>}
      <h2 id={id} className="mt-2 text-[2rem] text-maroon-800 sm:text-[2.5rem]">
        {title}
      </h2>
      {children && <div className="mt-3 text-muted">{children}</div>}
    </div>
  );
}
