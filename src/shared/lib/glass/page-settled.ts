let settled: Promise<void> | undefined;

/**
 * Resolves once the page has loaded and the browser has a quiet moment. Glass
 * work (compiling shaders, uploading photos, building lens maps) waits for
 * this so it never competes with the first paint; CSS glass shows until then.
 */
export function pageSettled() {
  settled ??= new Promise((resolve) => {
    const idle = () => {
      if ("requestIdleCallback" in window)
        window.requestIdleCallback(() => resolve(), { timeout: 2000 });
      else setTimeout(resolve, 500);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
  return settled;
}
