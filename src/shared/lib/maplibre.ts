/*
 * MapLibre, ready to use: its styles plus the address of its web worker.
 * Import maps from here, never from "maplibre-gl" directly, and only from
 * components loaded lazily (next/dynamic), so pages don't carry it upfront.
 */
import "maplibre-gl/dist/maplibre-gl.css";

import { setWorkerUrl } from "maplibre-gl";

/*
 * MapLibre finds its worker next to its own file, but the bundler hides that
 * address (it becomes a file:// URL). This literal `new URL` makes the bundler
 * serve the worker from /_next/static and hands MapLibre that address.
 */
setWorkerUrl(
  new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href,
);

export * from "maplibre-gl";
