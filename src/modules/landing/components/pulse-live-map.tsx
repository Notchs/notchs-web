"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { mapConfig } from "@/config/map";
import { GlassGroup } from "@/shared/components/glass/glass-group";
import { MinusIcon, PlusIcon } from "@/shared/components/icons";
import { MapMarker } from "@/shared/components/map/map-marker";
import { cn } from "@/shared/lib/cn";
import { Map as MapLibreMap } from "@/shared/lib/maplibre";

import { mapDots, saturdayContent } from "../content";
import { MAP_IMAGE, imageToLngLat } from "../lib/map-image";
import type { MapStop } from "../lib/map-stops";
import { stopPinClass } from "./stop-pin";

/** How long the map takes to fly to a stop; the same as the still map. */
const FLY_MS = 1400;
/** The card sits this far above its pin's centre: half the big pin + a gap. */
const CARD_LIFT = 36;
/** Room to pan past the outermost place or the still map's edge, degrees. */
const PAN_MARGIN = { lng: 0.08, lat: 0.06 };

type LngLat = [number, number];

/**
 * How far people can pan: the still map's area and every stop, with a margin,
 * so the city stays in view and a café on the outskirts is still reachable.
 */
function panLimit(stops: MapStop[]): [LngLat, LngLat] {
  const lngs = [
    MAP_IMAGE.west,
    MAP_IMAGE.east,
    ...stops.map((s) => s.lngLat[0]),
  ];
  const lats = [
    MAP_IMAGE.south,
    MAP_IMAGE.north,
    ...stops.map((s) => s.lngLat[1]),
  ];
  return [
    [Math.min(...lngs) - PAN_MARGIN.lng, Math.min(...lats) - PAN_MARGIN.lat],
    [Math.max(...lngs) + PAN_MARGIN.lng, Math.max(...lats) + PAN_MARGIN.lat],
  ];
}

/**
 * The view for a stop, from the frame's own CSS: --cy is where the focused
 * pin sits (in cqh), --zoom how far the still image is scaled, so the live
 * map frames each stop like the still one.
 */
function viewFor(element: HTMLElement, at: LngLat) {
  const style = getComputedStyle(element);
  const height = element.clientHeight;
  const focusY = (parseFloat(style.getPropertyValue("--cy")) / 100) * height;
  const scale = parseFloat(style.getPropertyValue("--zoom")) || 1;
  return {
    center: at,
    // MapLibre draws 512 px per tile, i.e. 512 * 2^zoom px around the world.
    zoom: Math.log2(
      (MAP_IMAGE.width * scale * 360) /
        ((MAP_IMAGE.east - MAP_IMAGE.west) * 512),
    ),
    offset: [0, (focusY || height / 2) - height / 2] as LngLat,
  };
}

/**
 * The live MapLibre version of the City Pulse map. It sits over the still
 * map and only shows once it has loaded; until then, or if it never loads,
 * the still map does the job. People can drag and zoom it. Tapping a stop
 * grows its card out of the pin; tapping the pin again, or anywhere else on
 * the map, shrinks it back into the pin.
 */
export function PulseLiveMap({
  stops,
  dots,
  mapAlt,
  active,
  open,
  card,
  pinFace,
  onChoose,
  onClose,
  onExplore,
  onReady,
}: {
  stops: MapStop[];
  /** Show the decorative dots (example map only). */
  dots: boolean;
  mapAlt: string;
  active: number;
  /** Whether the active stop's card is showing. */
  open: boolean;
  /** The card for the active stop, shown above its pin. */
  card: ReactNode;
  /** What a pin shows: its time, its rank or a cup. */
  pinFace: (stop: MapStop) => ReactNode;
  onChoose: (index: number) => void;
  /** A tap on the map itself, away from the pins and the card. */
  onClose: () => void;
  /** Someone moved the map themselves: stop the tour. */
  onExplore: () => void;
  onReady: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const activeAt = useRef(stops[active].lngLat);
  const setup = useRef({ stops, mapAlt });
  const callbacks = useRef({ onClose, onExplore, onReady });
  useEffect(() => {
    callbacks.current = { onClose, onExplore, onReady };
  }, [onClose, onExplore, onReady]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let instance: MapLibreMap;
    try {
      const { center, zoom } = viewFor(element, activeAt.current);
      instance = new MapLibreMap({
        container: element,
        style: mapConfig.style,
        center,
        zoom,
        minZoom: 10,
        maxZoom: 17,
        maxBounds: panLimit(setup.current.stops),
        // The page keeps scrolling: Ctrl/⌘ + scroll zooms, and on phones
        // two fingers move the map while one finger scrolls the page.
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        attributionControl: false,
        locale: { "Map.Title": setup.current.mapAlt },
      });
    } catch {
      // No WebGL: the still map stays.
      return;
    }
    instance.touchZoomRotate.disableRotation();
    instance.keyboard.disableRotation();

    let explored = false;
    const explore = () => {
      explored = true;
      callbacks.current.onExplore();
    };
    instance.on("dragstart", explore);
    instance.on("zoomstart", (event) => {
      // Only a person's zoom, not the fly to a stop or the zoom buttons.
      if (event.originalEvent) explore();
    });
    // A tap on the map itself closes the card. Taps on a pin or the card
    // land on their own elements, and a drag never counts as a click.
    instance.on("click", (event) => {
      if (event.originalEvent.target === instance.getCanvas()) {
        callbacks.current.onClose();
      }
    });

    const place = () =>
      instance.easeTo({ ...viewFor(element, activeAt.current), duration: 0 });
    // Keep the stop framed when the page resizes, unless someone moved away.
    instance.on("resize", () => {
      if (!explored) place();
    });
    instance.once("load", () => {
      place();
      setMap(instance);
      callbacks.current.onReady();
    });
    return () => instance.remove();
  }, []);

  const stop = stops[active];
  const [lng, lat] = stop.lngLat;
  useEffect(() => {
    activeAt.current = [lng, lat];
    if (!map) return;
    map.easeTo({
      ...viewFor(map.getContainer(), [lng, lat]),
      duration: FLY_MS,
    });
  }, [map, lng, lat]);

  const zoomButton =
    "grid size-11 cursor-pointer place-items-center rounded-full text-ink hover:bg-ink/8";

  return (
    <div
      aria-hidden={!map || undefined}
      className={cn(
        "absolute inset-0 isolate transition-opacity duration-700 ease-notch motion-reduce:transition-none",
        map ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Inline, to beat MapLibre's own font rule, so the card and pins
          keep the page's type. */}
      <div ref={container} className="size-full" style={{ font: "inherit" }} />
      {map &&
        dots &&
        mapDots.map(([x, y]) => (
          <MapMarker
            key={`${x}-${y}`}
            map={map}
            at={imageToLngLat(x, y)}
            anchor="center"
          >
            <span
              aria-hidden="true"
              className="block size-3 rounded-full border-2 border-paper bg-ink/45"
            />
          </MapMarker>
        ))}
      {map &&
        stops.map((item, index) => {
          const current = open && index === active;
          return (
            <MapMarker
              key={item.key}
              map={map}
              at={item.lngLat}
              anchor="center"
              raised={current}
            >
              <button
                type="button"
                aria-label={item.label}
                aria-expanded={current}
                // Tapping the open stop's pin again closes its card.
                onClick={() => (current ? onClose() : onChoose(index))}
                className={stopPinClass(item.isCafe, current)}
              >
                {pinFace(item)}
              </button>
            </MapMarker>
          );
        })}
      {map && (
        // Last, so it sits above every pin. Each stop gets its own card
        // (new key), which grows out of the pin as it appears.
        <MapMarker
          key={`card-${stop.key}`}
          map={map}
          at={stop.lngLat}
          anchor="bottom"
          offset={[0, -CARD_LIFT]}
          raised
          passThrough={!open}
        >
          <div
            inert={!open}
            aria-hidden={!open || undefined}
            onKeyDown={(event) => {
              if (event.key === "Escape") onClose();
            }}
            // Grows from and shrinks into the pin's centre, below the card.
            style={{ transformOrigin: `50% calc(100% + ${CARD_LIFT}px)` }}
            className={cn(
              "w-[min(17rem,calc(100vw-4rem))] transition-[scale,opacity] duration-300 ease-notch motion-reduce:transition-opacity starting:scale-25 starting:opacity-0",
              open ? "scale-100 opacity-100" : "scale-25 opacity-0",
            )}
          >
            {card}
          </div>
        </MapMarker>
      )}

      {map && (
        <GlassGroup
          radius={999}
          // Bottom left, clear of the card (top) and the credit (bottom right;
          // full width on phones, so the buttons sit above it there).
          className="absolute bottom-10 left-3 z-10 flex flex-col rounded-full glass-light sm:bottom-3"
        >
          <button
            type="button"
            aria-label={saturdayContent.zoomIn}
            onClick={() => {
              onExplore();
              map.zoomIn();
            }}
            className={zoomButton}
          >
            <PlusIcon className="size-5" />
          </button>
          <button
            type="button"
            aria-label={saturdayContent.zoomOut}
            onClick={() => {
              onExplore();
              map.zoomOut();
            }}
            className={zoomButton}
          >
            <MinusIcon className="size-5" />
          </button>
        </GlassGroup>
      )}
    </div>
  );
}
