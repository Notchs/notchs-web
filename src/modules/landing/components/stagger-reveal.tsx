"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

/**
 * Reveals its cards once, when its top reaches about 78% of the screen.
 * The server HTML shows the cards; they are hidden only once this script
 * runs, so without JavaScript (or with reduced motion) they simply show.
 */
export function StaggerReveal({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    element.dataset.reveal = "hidden";
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // One frame later, so the hidden state has painted and the cards
        // transition up instead of jumping.
        frame = requestAnimationFrame(() => {
          element.dataset.reveal = "shown";
        });
      },
      { rootMargin: "0px 0px -22% 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={cn("group/reveal", className)}>
      {children}
    </div>
  );
}
