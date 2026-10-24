import type { ComponentProps } from "react";

/** Carved Check v1: square ends, short arm at 60°. Shown wherever "verified" is. */
export function VerifiedIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="square"
      aria-hidden="true"
      {...props}
    >
      <path d="M4.5 12.5l4.5 6.5 10.5-14" />
    </svg>
  );
}
