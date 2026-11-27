import { useEffect, type RefObject } from "react";

/**
 * Keeps the active item of a scrolling list in view, so an auto-advancing
 * list never runs off screen: sideways on phones, up and down when a long
 * list scrolls inside a fixed height on wide screens. Scrolls only the list,
 * never the page, and does nothing while the list fits.
 */
export function useStripScroll(
  listRef: RefObject<HTMLElement | null>,
  active: number,
) {
  useEffect(() => {
    const list = listRef.current;
    const item = list?.children[active];
    if (!list || !item) return;

    const listBox = list.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    const overflow = (start: number, end: number, from: number, to: number) =>
      start < from ? start - from : Math.max(0, end - to);
    const left =
      list.scrollWidth > list.clientWidth
        ? overflow(itemBox.left, itemBox.right, listBox.left, listBox.right)
        : 0;
    const top =
      list.scrollHeight > list.clientHeight
        ? overflow(itemBox.top, itemBox.bottom, listBox.top, listBox.bottom)
        : 0;
    if (left === 0 && top === 0) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    list.scrollBy({ left, top, behavior: reduced ? "auto" : "smooth" });
  }, [listRef, active]);
}
