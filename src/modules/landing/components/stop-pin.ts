import { cn } from "@/shared/lib/cn";

/**
 * A City Pulse pin, the same on the still and the live map. Cafés stand out
 * in Volt; the picked stop is the big one. Kept apart from the live map so
 * the homepage doesn't load MapLibre to draw the still one.
 */
export function stopPinClass(isCafe: boolean, current: boolean) {
  return cn(
    "grid cursor-pointer place-items-center rounded-full border-2 font-mono text-xs transition-[width,height,background-color,color] duration-500 ease-notch",
    current
      ? "size-14 border-ink bg-btn font-semibold text-btn-fg shadow-lg"
      : isCafe
        ? "size-11 border-ink bg-volt font-semibold text-ink hover:bg-paper"
        : "size-11 border-paper bg-ink text-paper hover:bg-graphite",
  );
}
