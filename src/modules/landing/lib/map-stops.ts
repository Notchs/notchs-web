import type { StaticImageData } from "next/image";

import { placeMapContent, saturdayStops, venueByKind } from "../content";
import type { PlaceMap } from "./place-map";
import { imageToLngLat, lngLatToImage } from "./map-image";

/** One place on the City Pulse map: an example stop or a real café. */
export type MapStop = {
  key: string;
  /** [longitude, latitude] on the live map. */
  lngLat: [number, number];
  /** % across and down the still map image (may fall outside it). */
  x: number;
  y: number;
  isCafe: boolean;
  /** Short text in the pin and beside the name in the list ("10:30", "3"). */
  tag: string;
  /** In the list: the name and the line under it. */
  title: string;
  area: string;
  /** For screen readers: what the pin is. */
  label: string;
  card: {
    title: string;
    subtitle: string;
    /** Pill on the card: the time, the rank or "New on Notchs". */
    badge: string | null;
    image: StaticImageData | null;
    note: string | null;
  };
};

/** The example Saturday tour, shown until real places are live. */
export const saturdayMapStops: MapStop[] = saturdayStops.map((stop) => {
  const venue = venueByKind(stop.kind);
  return {
    key: stop.time,
    lngLat: imageToLngLat(stop.x, stop.y),
    x: stop.x,
    y: stop.y,
    isCafe: stop.kind === "cafe",
    tag: stop.time,
    title: venue.label,
    area: stop.area,
    label: `${venue.label}, ${stop.area}, ${stop.time}`,
    card: {
      title: venue.example,
      subtitle: `${venue.label} · ${stop.area}`,
      badge: stop.time,
      image: venue.image.src,
      note: null,
    },
  };
});

/**
 * Real places from the API. Cafés are highlighted and carry their rank while
 * ranks show; other places get their initial on the pin and no rank.
 */
export function placeMapStops({ places, cityName, showRanks }: PlaceMap) {
  const copy = placeMapContent;
  return places.map((place): MapStop => {
    const area = place.area ?? cityName;
    const kind = copy.kind(place.category);
    const rank = showRanks ? place.rank : null;
    return {
      key: place.code,
      lngLat: place.lngLat,
      ...lngLatToImage(place.lngLat),
      isCafe: place.isCafe,
      // A café without a rank shows a cup instead (see PinFace).
      tag: rank
        ? String(rank)
        : place.isCafe
          ? ""
          : place.name.charAt(0).toUpperCase(),
      title: place.name,
      area,
      label: copy.pinLabel(place.name, kind, area, rank),
      card: {
        title: place.name,
        subtitle: `${kind} · ${area}`,
        badge:
          !showRanks || !place.isCafe
            ? null
            : rank
              ? `#${rank}`
              : copy.newPlace,
        image: null,
        note: rank ? copy.rankNote(rank, cityName) : null,
      },
    };
  });
}
