import { useEffect, useState, type RefObject } from "react";

import { INK_GROUND_ATTRIBUTE } from "./ink-ground";

/** Share of the bar's width an Ink panel must cover before the bar adapts. */
const MIN_COVER = 0.5;

/**
 * True while an Ink panel (`data-ground="ink"`) covers most of the bar's
 * middle line, so a light glass bar can switch to dark glass over it and
 * stay readable, as Liquid Glass adapts to the content beneath.
 */
export function useInkGround(ref: RefObject<HTMLElement | null>) {
  const [onInk, setOnInk] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const bar = ref.current?.getBoundingClientRect();
      if (!bar) return;
      const lineY = bar.top + bar.height / 2;
      let covered = 0;
      document
        .querySelectorAll(`[${INK_GROUND_ATTRIBUTE}="ink"]`)
        .forEach((panel) => {
          const box = panel.getBoundingClientRect();
          if (box.top > lineY || box.bottom < lineY) return;
          covered +=
            Math.min(box.right, bar.right) - Math.max(box.left, bar.left);
        });
      setOnInk(covered / bar.width >= MIN_COVER);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [ref]);

  return onInk;
}
