/**
 * Section links ("#faq", "?city=…#city-pulse") work as-is on the landing page.
 * On other pages they need the homepage path in front, e.g. "/#faq".
 */
export function withBase(href: string, base: string) {
  return base && (href.startsWith("#") || href.startsWith("?"))
    ? `${base}${href}`
    : href;
}
