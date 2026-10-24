import { useEffect, useState } from "react";

/** Top of the band that decides the section, as a share of the screen. */
const BAND = 0.3;

/**
 * Which of the given in-page sections the reader is in: the last one whose
 * top has passed the upper part of the screen, or null above the first one
 * (the hero). Ids are element ids, without "#".
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => !!element);
    if (!sections.length) return;

    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        // Document order, so the lower of two neighbours wins.
        const current = sections.filter(({ id }) => inBand.has(id)).at(-1);
        if (current) return setActive(current.id);
        // In a gap between sections keep the last one, unless above them all.
        const aboveAll =
          sections[0].getBoundingClientRect().top > window.innerHeight * BAND;
        if (aboveAll) setActive(null);
      },
      // A band across the upper part of the screen, just under the header.
      { rootMargin: `-${BAND * 100}% 0px -${(0.9 - BAND) * 100}% 0px` },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
