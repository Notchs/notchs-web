"use client";

import { useEffect, useRef, useState } from "react";

import { mapConfig } from "@/config/map";
import { MapMarker } from "@/shared/components/map/map-marker";
import { cn } from "@/shared/lib/cn";
import { Map as MapLibreMap } from "@/shared/lib/maplibre";

import {
  mapDots,
  saturdayContent,
  saturdayStops,
  venueByKind,
} from "../content";
import { stopPinClass } from "./stop-pin";

/**
 * The area the still map image (assets/ahmedabad-map.webp, 1280 px wide)
 * covers. Stops and dots keep their % positions on that image, so the live
 * map puts them in exactly the same places.
 */
const IMAGE = {
  width: 1280,
  west: 72.419,
  east: 72.6433,
  north: 23.1196,
  south: 22.9592,
};
/** How long the map takes to fly to a stop; the same as the still map. */
const FLY_MS = 1400;

const toLngLat = (x: number, y: number): [number, number] => [
  IMAGE.west + ((IMAGE.east - IMAGE.west) * x) / 100,
  IMAGE.north - ((IMAGE.north - IMAGE.south) * y) / 100,
];

/**
 * The view for a stop, from the frame's own CSS: --cy is where the focused
 * pin sits (in cqh), --zoom how far the still image is scaled.
 */
function viewFor(element: HTMLElement, index: number) {
  const style = getComputedStyle(element);
  const height = element.clientHeight;
  const focusY = (parseFloat(style.getPropertyValue("--cy")) / 100) * height;
  const scale = parseFloat(style.getPropertyValue("--zoom")) || 1;
  const stop = saturdayStops[index];
  return {
    center: toLngLat(stop.x, stop.y),
    // MapLibre draws 512 px per tile, i.e. 512 * 2^zoom px around the world.
    zoom: Math.log2(
      (IMAGE.width * scale * 360) / ((IMAGE.east - IMAGE.west) * 512),
    ),
    offset: [0, (focusY || height / 2) - height / 2] as [number, number],
  };
}

/**
 * The live MapLibre version of the Saturday map. It sits over the still map
 * and only shows once it has loaded; until then, or if it never loads, the
 * still map does the job. It moves only when a stop is picked, like the still
 * one, so the venue card always sits above its pin.
 */
export function SaturdayLiveMap({
  active,
  onChoose,
  onReady,
}: {
  active: number;
  onChoose: (index: number) => void;
  onReady: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const activeRef = useRef(active);
  const readyRef = useRef(onReady);
  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let instance: MapLibreMap;
    try {
      const { center, zoom } = viewFor(element, activeRef.current);
      instance = new MapLibreMap({
        container: element,
        style: mapConfig.style,
        center,
        zoom,
        interactive: false,
        attributionControl: false,
        locale: { "Map.Title": saturdayContent.mapAlt },
      });
    } catch {
      // No WebGL: the still map stays.
      return;
    }
    const place = () =>
      instance.easeTo({
        ...viewFor(element, activeRef.current),
        duration: 0,
      });
    instance.on("resize", place);
    instance.once("load", () => {
      place();
      setMap(instance);
      readyRef.current();
    });
    return () => instance.remove();
  }, []);

  useEffect(() => {
    activeRef.current = active;
    if (!map) return;
    map.easeTo({ ...viewFor(map.getContainer(), active), duration: FLY_MS });
  }, [map, active]);

  return (
    <div
      aria-hidden={!map || undefined}
      className={cn(
        "absolute inset-0 isolate transition-opacity duration-700 ease-notch motion-reduce:transition-none",
        map ? "opacity-100" : "opacity-0",
      )}
    >
      <div ref={container} className="size-full" />
      {map &&
        mapDots.map(([x, y]) => (
          <MapMarker
            key={`${x}-${y}`}
            map={map}
            at={toLngLat(x, y)}
            anchor="center"
          >
            <span
              aria-hidden="true"
              className="block size-3 rounded-full border-2 border-paper bg-ink/45"
            />
          </MapMarker>
        ))}
      {map &&
        saturdayStops.map((item, index) => {
          const current = index === active;
          return (
            <MapMarker
              key={item.time}
              map={map}
              at={toLngLat(item.x, item.y)}
              anchor="center"
              raised={current}
            >
              <button
                type="button"
                aria-label={`${venueByKind(item.kind).label}, ${item.area}, ${item.time}`}
                onClick={() => onChoose(index)}
                className={stopPinClass(item.kind, current)}
              >
                {item.time}
              </button>
            </MapMarker>
          );
        })}
    </div>
  );
}
