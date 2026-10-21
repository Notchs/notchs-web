import { domToCanvas } from "modern-screenshot";

/**
 * A picture of the whole page for WebGL glass to refract (Liquid Glass level
 * 4 over regular content). `scale` maps page px to picture px.
 */
export type PageSnapshot = {
  page: HTMLCanvasElement;
  /** A tiny, softened copy for the frosted middle of the glass. */
  frost: HTMLCanvasElement;
  width: number;
  height: number;
  scale: number;
  takenAt: number;
};

/** Mark anything the glass should not see in the snapshot (itself, overlays). */
export const SNAPSHOT_IGNORE_ATTRIBUTE = "data-snapshot-ignore";

/** Longest side of the picture: inside the texture limit of most GPUs. */
const MAX_SIDE = 8192;
const MAX_SCALE = 1;
/** A snapshot younger than this is reused instead of taking another. */
const FRESH_MS = 4000;
/** The frost copy is this many times smaller than the page. */
const FROST_DOWNSCALE = 14;

let cached: PageSnapshot | null = null;
let pending: Promise<PageSnapshot | null> | null = null;

/**
 * Skips what must not appear in the glass: marked nodes, dev overlays, and
 * images that have not loaded (lazy ones far down the page), which would
 * otherwise hold the snapshot until they time out. Those show as their
 * placeholder colour, softened by the frosted glass.
 */
function keep(node: Node) {
  if (!(node instanceof Element)) return true;
  if (node.hasAttribute(SNAPSHOT_IGNORE_ATTRIBUTE)) return false;
  if (node instanceof HTMLImageElement)
    return node.complete && node.naturalWidth > 0;
  return !node.tagName.includes("-PORTAL");
}

/**
 * Scroll-driven reveals run on their own timeline inside the snapshot, so
 * pin everything to its final, visible state.
 */
function settle(node: Node) {
  if (!(node instanceof HTMLElement)) return;
  node.style.animation = "none";
  if (node.classList.contains("reveal")) {
    node.style.opacity = "1";
    node.style.transform = "none";
  }
}

/**
 * Glass is never part of what glass bends (no ghost of its own content),
 * but it keeps its place: it is hidden, not removed, so nothing reflows.
 */
function hideGlass(root: Node) {
  if (!(root instanceof Element)) return;
  root
    .querySelectorAll<HTMLElement>("[data-glass], [data-glass] *")
    .forEach((element) => {
      element.style.visibility = "hidden";
    });
}

/** Shrinks the page picture into a soft, low-detail copy. */
function frostCopy(page: HTMLCanvasElement) {
  const frost = document.createElement("canvas");
  frost.width = Math.max(1, Math.round(page.width / FROST_DOWNSCALE));
  frost.height = Math.max(1, Math.round(page.height / FROST_DOWNSCALE));
  const context = frost.getContext("2d");
  if (context) {
    context.imageSmoothingQuality = "high";
    context.drawImage(page, 0, 0, frost.width, frost.height);
  }
  return frost;
}

async function capture(): Promise<PageSnapshot | null> {
  const root = document.body;
  const width = document.documentElement.clientWidth;
  const height = root.scrollHeight;
  const scale = Math.min(MAX_SCALE, MAX_SIDE / Math.max(width, height));
  try {
    const page = await domToCanvas(root, {
      scale,
      width,
      height,
      backgroundColor: getComputedStyle(root).backgroundColor,
      filter: keep,
      onCloneEachNode: settle,
      onCloneNode: hideGlass,
      // Also how long it waits for images still loading; loaded ones come
      // straight from the cache, so keep it short.
      timeout: 500,
      // Safari and Firefox redraw each image after a pause; keep it short.
      drawImageInterval: 0,
    });
    return {
      page,
      frost: frostCopy(page),
      width,
      height,
      scale,
      takenAt: performance.now(),
    };
  } catch {
    return null;
  }
}

/**
 * The current page snapshot: reused while fresh and the same size, shared
 * with any capture already running, otherwise taken now.
 */
export function getPageSnapshot(): Promise<PageSnapshot | null> {
  if (cached && hasFreshPageSnapshot()) return Promise.resolve(cached);
  pending ??= capture().then((snapshot) => {
    cached = snapshot;
    pending = null;
    return snapshot;
  });
  return pending;
}

/** Forgets the cached snapshot, so the next request takes a new one. */
export function invalidatePageSnapshot() {
  cached = null;
}

/** True when a snapshot can be used right away, without waiting. */
export function hasFreshPageSnapshot() {
  return (
    !!cached &&
    cached.width === document.documentElement.clientWidth &&
    performance.now() - cached.takenAt < FRESH_MS
  );
}

/** Starts a snapshot early (e.g. on hover) so the glass is ready on open. */
export function prewarmPageSnapshot() {
  void getPageSnapshot();
}
