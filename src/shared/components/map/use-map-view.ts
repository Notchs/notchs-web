"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { Map as MapLibreMap } from "@/shared/lib/maplibre";

/**
 * Changes whenever the map stops moving or resizes, so anything drawn from
 * the view (e.g. which pins cluster) can follow it. "" until there is a map.
 */
export function useMapView(map: MapLibreMap | null) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      map?.on("moveend", onChange);
      map?.on("resize", onChange);
      return () => {
        map?.off("moveend", onChange);
        map?.off("resize", onChange);
      };
    },
    [map],
  );
  return useSyncExternalStore(
    subscribe,
    () => (map ? `${map.getZoom()}:${map.getCenter().toArray()}` : ""),
    () => "",
  );
}
