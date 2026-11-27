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
  offset,
  raised = false,
  passThrough = false,
  children,
}: {
  map: MapLibreMap;
  /** [longitude, latitude] */
  at: [number, number];
  anchor?: PositionAnchor;
  /** Shift from the anchor in px, [x, y]; set once, when the pin appears. */
  offset?: [number, number];
  /** Draws this pin above the others. */
  raised?: boolean;
  /** Clicks go through to the map, e.g. while its content is hidden. */
  passThrough?: boolean;
  children: ReactNode;
}) {
  const [element] = useState(() => document.createElement("div"));
  // MapLibre needs a position before the marker joins the map.
  const [marker] = useState(() =>
    new Marker({ element, anchor, offset }).setLngLat(at),
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

  useEffect(() => {
    if (passThrough) marker.addClassName("pointer-events-none");
    else marker.removeClassName("pointer-events-none");
  }, [marker, passThrough]);

  return createPortal(children, element);
}
