import { NotchGlyph } from "@/shared/components/brand/notch-glyph";

import { safeColour } from "../lib/format";

/** The place's colour as a square with the Notchs mark. */
export function NotchTile({ colour }: { colour: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-11 flex-none place-items-center rounded-[14px] text-white"
      style={{ backgroundColor: safeColour(colour) }}
    >
      <NotchGlyph className="size-5" />
    </span>
  );
}
