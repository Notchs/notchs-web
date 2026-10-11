import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type HeroSectionProps = {
  /** Small uppercase label above the title. */
  kicker: string;
  title: ReactNode;
  description: string;
  descriptionClassName?: string;
  /** Content below the description, such as a call to action. */
  children?: ReactNode;
  /** Artwork shown beside the text, or above it on small screens. */
  mark: ReactNode;
  markClassName?: string;
};

/** Two-column hero used by the landing and status pages. */
export function HeroSection({
  kicker,
  title,
  description,
  descriptionClassName,
  children,
  mark,
  markClassName,
}: HeroSectionProps) {
  return (
    <main className="grid content-center gap-10 px-gutter pt-6 pb-14 split:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] split:items-center split:gap-16 split:pt-8 split:pb-18">
      <div>
        <p className="mb-7 flex animate-fade-in items-center gap-3.5 text-xs font-semibold tracking-[.14em] text-muted uppercase [animation-delay:50ms] before:h-px before:w-8 before:bg-current">
          {kicker}
        </p>
        <h1 className="animate-fade-in font-display text-[clamp(2.5rem,1rem+6.4vw,6.75rem)] leading-[.94] font-extrabold tracking-[-.035em] [animation-delay:150ms]">
          {title}
        </h1>
        <p
          className={cn(
            "mt-7 max-w-[30ch] animate-fade-in text-[clamp(1.125rem,1rem+.5vw,1.5rem)] leading-[1.35] text-muted [animation-delay:300ms]",
            descriptionClassName,
          )}
        >
          {description}
        </p>
        {children}
      </div>
      <div
        className={cn(
          "-order-1 aspect-square w-22 split:order-none split:w-[min(100%,380px)] split:justify-self-end",
          markClassName,
        )}
      >
        {mark}
      </div>
    </main>
  );
}
