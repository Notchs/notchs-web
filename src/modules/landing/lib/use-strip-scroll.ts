import { useEffect, type RefObject } from "react";

/**
 * Keeps the active item of a sideways-scrolling list in view, so an auto-
 * advancing strip on phones never runs off screen. Scrolls only the list,
 * never the page, and does nothing once the list is not scrollable (desktop).
 */
export function useStripScroll(
  listRef: RefObject<HTMLElement | null>,
  active: number,
) {
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[active];
    if (!list || !item || list.scrollWidth <= list.clientWidth) return;

    const listBox = list.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    const offset =
      itemBox.left < listBox.left
        ? itemBox.left - listBox.left
        : Math.max(0, itemBox.right - listBox.right);
    if (offset === 0) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    list.scrollBy({ left: offset, behavior: reduced ? "auto" : "smooth" });
  }, [listRef, active]);
}
