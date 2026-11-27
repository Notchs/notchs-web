import type { StaticImageData } from "next/image";

import { cafeMapContent, saturdayStops, venueByKind } from "../content";
import type { CafeMap } from "./cafe-map";
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

/** The example Saturday tour, shown until real cafés are live. */
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

/** Real cafés from the API, with their rank only while ranks show. */
export function cafeMapStops({ cafes, cityName, showRanks }: CafeMap) {
  const copy = cafeMapContent;
  return cafes.map((cafe): MapStop => {
    const area = cafe.area ?? cityName;
    const rank = showRanks ? cafe.rank : null;
    return {
      key: cafe.code,
      lngLat: cafe.lngLat,
      ...lngLatToImage(cafe.lngLat),
      isCafe: true,
      tag: rank ? String(rank) : "",
      title: cafe.name,
      area,
      label: rank
        ? copy.pinLabel(cafe.name, area, rank)
        : `${cafe.name}, ${area}`,
      card: {
        title: cafe.name,
        subtitle: `${copy.cafe} · ${area}`,
        badge: !showRanks ? null : rank ? `#${rank}` : copy.newPlace,
        image: null,
        note: rank ? copy.rankNote(rank, cityName) : null,
      },
    };
  });
}
