import type { ComponentProps } from "react";

import { NOTCH_PATH } from "./notch-geometry";

/** The plain "N" mark. Takes its colour from the surrounding text. */
export function NotchGlyph(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d={NOTCH_PATH} />
    </svg>
  );
}
