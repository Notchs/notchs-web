import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type PhoneProps = {
  /** What the screen shows, for screen readers. Starts with "Example". */
  label: string;
  className?: string;
  children: ReactNode;
};

/** A phone drawn in Ink, holding an example screen. */
export function Phone({ label, className, children }: PhoneProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "mx-auto w-full max-w-[260px] rounded-[2.25rem] bg-ink p-2.5 surface-ink",
        className,
      )}
    >
      <div className="relative aspect-9/17 overflow-hidden rounded-[1.75rem]">
        {children}
      </div>
    </div>
  );
}
