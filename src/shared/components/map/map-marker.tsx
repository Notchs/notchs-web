"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import {
  Marker,
  type Map as MapLibreMap,
  type PositionAnchor,
} from "@/shared/lib/maplibre";

/**
 * A React-rendered pin, placed by MapLibre so it moves with the map. Only for
 * components that are loaded lazily, like the maps that use it.
 */
export function MapMarker({
  map,
  at,
  anchor = "bottom",
  raised = false,
  children,
}: {
  map: MapLibreMap;
  /** [longitude, latitude] */
  at: [number, number];
  anchor?: PositionAnchor;
  /** Draws this pin above the others. */
  raised?: boolean;
  children: ReactNode;
}) {
  const [element] = useState(() => document.createElement("div"));
  // MapLibre needs a position before the marker joins the map.
  const [marker] = useState(() =>
    new Marker({ element, anchor }).setLngLat(at),
  );
  const [lng, lat] = at;

  useEffect(() => {
    marker.addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, marker]);

  useEffect(() => {
    marker.setLngLat([lng, lat]);
  }, [marker, lng, lat]);

  useEffect(() => {
    if (raised) marker.addClassName("z-2");
    else marker.removeClassName("z-2");
  }, [marker, raised]);

  return createPortal(children, element);
}
