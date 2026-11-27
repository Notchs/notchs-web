"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { mapConfig } from "@/config/map";
import { GlassGroup } from "@/shared/components/glass/glass-group";
import { MinusIcon, PlusIcon } from "@/shared/components/icons";
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
/** How far people can pan: Ahmedabad with a margin, not the whole world. */
const PAN_LIMIT: [[number, number], [number, number]] = [
  [IMAGE.west - 0.08, IMAGE.south - 0.06],
  [IMAGE.east + 0.08, IMAGE.north + 0.06],
];
/** How long the map takes to fly to a stop; the same as the still map. */
const FLY_MS = 1400;
/** The card sits this far above its pin's centre: half the big pin + a gap. */
const CARD_LIFT = 36;

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
 * still map does the job. People can drag and zoom it. Tapping a stop grows
 * its venue card out of the pin; tapping anywhere else on the map shrinks it
 * back into the pin.
 */
export function SaturdayLiveMap({
  active,
  open,
  card,
  onChoose,
  onClose,
  onExplore,
  onReady,
}: {
  active: number;
  /** Whether the active stop's card is showing. */
  open: boolean;
  /** The venue card for the active stop, shown above its pin. */
  card: ReactNode;
  onChoose: (index: number) => void;
  /** A tap on the map itself, away from the pins and the card. */
  onClose: () => void;
  /** Someone moved the map themselves: stop the tour. */
  onExplore: () => void;
  onReady: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const activeRef = useRef(active);
  const callbacks = useRef({ onClose, onExplore, onReady });
  useEffect(() => {
    callbacks.current = { onClose, onExplore, onReady };
  }, [onClose, onExplore, onReady]);

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
        minZoom: 10,
        maxZoom: 17,
        maxBounds: PAN_LIMIT,
        // The page keeps scrolling: Ctrl/⌘ + scroll zooms, and on phones
        // two fingers move the map while one finger scrolls the page.
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        attributionControl: false,
        locale: { "Map.Title": saturdayContent.mapAlt },
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
      instance.easeTo({
        ...viewFor(element, activeRef.current),
        duration: 0,
      });
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

  useEffect(() => {
    activeRef.current = active;
    if (!map) return;
    map.easeTo({ ...viewFor(map.getContainer(), active), duration: FLY_MS });
  }, [map, active]);

  const stop = saturdayStops[active];
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
          const current = open && index === active;
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
      {map && (
        // Last, so it sits above every pin. Each stop gets its own card
        // (new key), which grows out of the pin as it appears.
        <MapMarker
          key={`card-${active}`}
          map={map}
          at={toLngLat(stop.x, stop.y)}
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
