import { useId } from "react";

import { NOTCH_PATH } from "@/shared/components/brand/notch-geometry";

/** The logo grid. All the shapes below are drawn in these units. */
export const LOGO_GRID = 24;

/**
 * The official logo without its two cuts. It comes from the logo's own path, so
 * the corners can never differ from the logo.
 */
export const LOGO_OUTLINE = NOTCH_PATH.replace("H8.75L18 16.02V0", "").replace(
  "H15.25L6 7.98V24",
  "",
);

/** The official N with square outer corners; LOGO_OUTLINE rounds them. */
export const N_POLYGON =
  "0,0 8.75,0 18,16.02 18,0 24,0 24,24 15.25,24 6,7.98 6,24 0,24";
export const TOP_NOTCH = "8.75,0 18,0 18,16.02";
export const BOTTOM_NOTCH = "6,7.98 6,24 15.25,24";

/**
 * The same notches as drawn in a mask: they run 1 unit past the logo's edge, on
 * the same slanted line, so no faint line of Volt survives along that edge.
 */
export const TOP_NOTCH_CUT = "8.173,-1 18,-1 18,16.02";
export const BOTTOM_NOTCH_CUT = "6,7.98 6,25 15.827,25";

/** An id for one loader on the page, the same on the server and the client. */
export function useLoaderId(name: string) {
  return `${name}-${useId()}`;
}
