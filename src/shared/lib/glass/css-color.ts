/** A colour as 0–1 channels plus alpha, ready for a shader. */
export type Rgba = [number, number, number, number];

const cache = new Map<string, Rgba>();
let parser: CanvasRenderingContext2D | null = null;

/**
 * Parses any CSS colour (`#fff`, `rgb(15 15 20 / 0.06)`, named…) to 0–1
 * channels. A 2D context normalises it; results are cached because themes
 * only use a handful of colours.
 */
export function parseCssColor(value: string, fallback: Rgba): Rgba {
  const key = value.trim();
  if (!key) return fallback;
  const known = cache.get(key);
  if (known) return known;

  parser ??= document.createElement("canvas").getContext("2d");
  if (!parser) return fallback;
  parser.fillStyle = "#000";
  parser.fillStyle = key;
  const normal = String(parser.fillStyle);

  let rgba: Rgba | null = null;
  const hex = /^#([0-9a-f]{6})$/i.exec(normal);
  if (hex) {
    const n = parseInt(hex[1], 16);
    rgba = [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
  } else {
    const parts = /rgba?\(([^)]+)\)/.exec(normal)?.[1].split(/[\s,/]+/);
    if (parts && parts.length >= 3) {
      const [r, g, b, a = "1"] = parts.filter(Boolean).map(Number).map(String);
      rgba = [Number(r) / 255, Number(g) / 255, Number(b) / 255, Number(a)];
    }
  }
  if (!rgba || rgba.some(Number.isNaN)) return fallback;
  cache.set(key, rgba);
  return rgba;
}

/** Reads a custom property on `element` as a colour. */
export function cssVarColor(
  element: Element,
  name: string,
  fallback: Rgba,
): Rgba {
  return parseCssColor(
    getComputedStyle(element).getPropertyValue(name),
    fallback,
  );
}

/** Relative luminance (0 black – 1 white), to tell light glass from dark. */
export function luminance([r, g, b]: Rgba) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
