import { useEffect, type RefObject } from "react";

/** How far, in px of page scroll, one sweep of the light takes. */
const SWEEP_PERIOD = 480;
const DRIFT_PERIOD = 760;
/** Largest tilt towards the pointer, and the extra wobble from fast scrolling. */
const MAX_TILT = 4;
const MAX_WOBBLE = 3;
/** Share of the remaining distance covered each frame: the glass "weight". */
const EASE = 0.12;

/**
 * Drives the reflections of a glass slab from the world around it, as CSS
 * variables on the element:
 *
 * - `--sweep`, `--drift`: px offsets that swing back and forth as the page
 *   scrolls, so light streaks and window reflections slide across the glass.
 * - `--tilt-x`, `--tilt-y`: degrees towards the pointer, plus a wobble from
 *   scroll speed, as if the slab had weight.
 * - `--light-x`, `--light-y`: where the pointer is over the slab, in %.
 *
 * Values ease towards their targets every frame and the loop stops once they
 * settle. Does nothing with reduced motion, so the reflections stay still.
 */
export function useGlassMotion(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    const element = ref.current;
    if (!active || !element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const startY = window.scrollY;
    let lastY = startY;
    let frame = 0;
    const target = {
      sweep: 0,
      drift: 0,
      tiltX: 0,
      tiltY: 0,
      lightX: 30,
      lightY: 0,
      wobble: 0,
    };
    const current = { ...target };

    const tick = () => {
      frame = 0;
      target.wobble *= 0.9;
      let moving = Math.abs(target.wobble) > 0.01;
      for (const key of Object.keys(current) as (keyof typeof current)[]) {
        const gap = target[key] - current[key];
        current[key] += gap * EASE;
        if (Math.abs(gap) > 0.01) moving = true;
      }
      element.style.setProperty("--sweep", `${current.sweep}px`);
      element.style.setProperty("--drift", `${current.drift}px`);
      element.style.setProperty(
        "--tilt-x",
        `${current.tiltX + current.wobble}deg`,
      );
      element.style.setProperty("--tilt-y", `${current.tiltY}deg`);
      element.style.setProperty("--light-x", `${current.lightX}%`);
      element.style.setProperty("--light-y", `${current.lightY}%`);
      if (moving) frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const travelled = y - startY;
      target.sweep = Math.sin(travelled / SWEEP_PERIOD) * 140;
      target.drift = Math.sin(travelled / DRIFT_PERIOD + 1.2) * 70;
      target.wobble = Math.max(
        -MAX_WOBBLE,
        Math.min(MAX_WOBBLE, target.wobble + (y - lastY) * 0.04),
      );
      lastY = y;
      wake();
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = element.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      target.lightX = Math.max(-20, Math.min(120, x * 100));
      target.lightY = Math.max(-20, Math.min(120, y * 100));
      target.tiltY = (Math.max(0, Math.min(1, x)) - 0.5) * 2 * MAX_TILT;
      target.tiltX = -(Math.max(0, Math.min(1, y)) - 0.5) * 2 * MAX_TILT;
      wake();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    wake();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
    };
  }, [ref, active]);
}
