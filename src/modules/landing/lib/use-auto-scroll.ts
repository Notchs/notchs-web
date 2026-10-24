import { useEffect, type RefObject } from "react";

/** How fast the row moves on its own, px per second. */
const SPEED = 40;
/** After a swipe, drag or wheel, wait this long before moving again. */
const RESUME_MS = 1500;
/** A mouse drag shorter than this is still a click. */
const DRAG_PX = 6;

/**
 * Moves a horizontal scroller slowly to the left, forever. Its content is
 * three identical copies side by side; it starts at the middle one and,
 * whenever it drifts a whole copy away, jumps back by one copy, which looks
 * the same. People can swipe, drag (mouse) or scroll it either way at any
 * time: it stops while they do and carries on from there a moment later.
 * Also waits while a card has keyboard focus, off screen, and with reduced
 * motion (then it is just a row to swipe).
 */
export function useAutoScroll(scrollerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const copyWidth = () => scroller.scrollWidth / 3;
    let position = copyWidth();
    scroller.scrollLeft = position;

    let lastSet = scroller.scrollLeft;
    let lastTouch = -Infinity;
    let holding = false;
    let focused = false;
    let visible = false;
    let frame = 0;
    let lastTime = 0;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // `position` is exact; the browser rounds scrollLeft to whole pixels, so
    // it is only read back after someone else moved the row.
    let movedByUser = false;
    const touched = () => {
      lastTouch = performance.now();
      movedByUser = true;
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      // Capped, so a long pause (a busy phone) never makes the row jump.
      const dt = lastTime ? Math.min(time - lastTime, 250) : 0;
      lastTime = time;
      const idle = !holding && time - lastTouch > RESUME_MS;
      if (!idle) return;
      if (movedByUser) {
        position = scroller.scrollLeft;
        movedByUser = false;
      }
      // Back into the middle copy; it looks the same, so nobody sees it.
      const width = copyWidth();
      if (position < width * 0.5) position += width;
      else if (position > width * 1.5) position -= width;
      if (!focused && !reducedMotion.matches) {
        position += (SPEED * dt) / 1000;
      }
      scroller.scrollLeft = position;
      lastSet = scroller.scrollLeft;
    };

    const start = () => {
      if (frame) return;
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Only runs while on screen.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    observer.observe(scroller);

    // A scroll we didn't make (a swipe and its momentum, a trackpad).
    const onScroll = () => {
      if (Math.abs(scroller.scrollLeft - lastSet) > 2) touched();
    };

    // Mouse: drag the row; a real drag doesn't click the card under it.
    let dragStart: { x: number; scroll: number } | null = null;
    let dragged = false;
    const onPointerDown = (event: PointerEvent) => {
      holding = true;
      touched();
      dragged = false;
      if (event.pointerType === "mouse" && event.button === 0)
        dragStart = { x: event.clientX, scroll: scroller.scrollLeft };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragStart) return;
      const dx = event.clientX - dragStart.x;
      if (Math.abs(dx) > DRAG_PX) dragged = true;
      if (dragged) {
        scroller.scrollLeft = dragStart.scroll - dx;
        lastSet = scroller.scrollLeft;
        touched();
      }
    };
    const onPointerUp = () => {
      holding = false;
      dragStart = null;
      touched();
    };
    const onClick = (event: MouseEvent) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    };
    // Keyboard users shouldn't chase a moving card.
    const onFocusIn = (event: FocusEvent) => {
      focused = (event.target as Element).matches(":focus-visible");
    };
    const onFocusOut = () => {
      focused = false;
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("wheel", touched, { passive: true });
    scroller.addEventListener("touchstart", touched, { passive: true });
    scroller.addEventListener("pointerdown", onPointerDown);
    scroller.addEventListener("focusin", onFocusIn);
    scroller.addEventListener("focusout", onFocusOut);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    scroller.addEventListener("click", onClick, true);

    return () => {
      stop();
      observer.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("wheel", touched);
      scroller.removeEventListener("touchstart", touched);
      scroller.removeEventListener("pointerdown", onPointerDown);
      scroller.removeEventListener("focusin", onFocusIn);
      scroller.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      scroller.removeEventListener("click", onClick, true);
    };
  }, [scrollerRef]);
}
