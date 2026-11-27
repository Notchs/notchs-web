"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { mapConfig } from "@/config/map";
import { MapMarker } from "@/shared/components/map/map-marker";
import { useMapView } from "@/shared/components/map/use-map-view";
import { cn } from "@/shared/lib/cn";
import {
  AttributionControl,
  LngLatBounds,
  Map as MapLibreMap,
} from "@/shared/lib/maplibre";

import { content } from "../../content";
import type { CityVenue } from "../../types";
import { Badge, Stars } from "../ui/badges";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Icon } from "../ui/icon";

const copy = content.discover;

/** Pins closer than this on screen (px) join a cluster. */
const CLUSTER_GAP = { x: 96, y: 34 };
/** From this zoom on every pin stands alone, so a cluster tap always splits it. */
const CLUSTER_UNTIL_ZOOM = 16;
/** How close "Centre on my venue" and list picks zoom in. */
const FOCUS_ZOOM = 15;

type LngLat = [number, number];
type Group = { key: string; venues: CityVenue[]; at: LngLat };

const lngLat = (venue: CityVenue): LngLat => [venue.longitude, venue.latitude];

/**
 * Pins that would overlap on screen at the current view join one cluster.
 * Your venue and the selected one always stand alone.
 */
function groupVenues(
  map: MapLibreMap,
  venues: CityVenue[],
  selectedId: string | null,
): Group[] {
  const clustering = map.getZoom() < CLUSTER_UNTIL_ZOOM;
  const groups: { venues: CityVenue[]; x: number; y: number }[] = [];
  for (const venue of venues) {
    const point = map.project(lngLat(venue));
    const standsAlone = !clustering || venue.isMine || venue.id === selectedId;
    const group = standsAlone
      ? undefined
      : groups.find(
          ({ venues: [first], x, y }) =>
            !first.isMine &&
            first.id !== selectedId &&
            Math.abs(x - point.x) < CLUSTER_GAP.x &&
            Math.abs(y - point.y) < CLUSTER_GAP.y,
        );
    if (group) group.venues.push(venue);
    else groups.push({ venues: [venue], x: point.x, y: point.y });
  }
  return groups.map(({ venues: members }) => {
    const average = (read: (venue: CityVenue) => number) =>
      members.reduce((total, venue) => total + read(venue), 0) / members.length;
    return {
      key: members.length > 1 ? `cluster-${members[0].id}` : members[0].id,
      venues: members,
      at: [average((v) => v.longitude), average((v) => v.latitude)],
    };
  });
}

/**
 * Room for pin labels, which sit above and either side of their point;
 * smaller on a phone so the venues don't end up tiny.
 */
function fitPadding(map: MapLibreMap) {
  const { clientWidth: width, clientHeight: height } = map.getContainer();
  const side = Math.min(80, width * 0.12);
  return {
    top: Math.min(96, height * 0.2),
    bottom: 40,
    left: side,
    right: side,
  };
}

function boundsOf(venues: CityVenue[]) {
  return venues.reduce(
    (bounds, venue) => bounds.extend(lngLat(venue)),
    new LngLatBounds(lngLat(venues[0]), lngLat(venues[0])),
  );
}

export function CityMap({
  venues,
  myVenueId,
  selected,
  selectedId,
  hoveredId,
  onSelect,
  onReset,
  onFail,
}: {
  venues: CityVenue[];
  myVenueId: string;
  selected: CityVenue | undefined;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onReset: () => void;
  /** The map couldn't start (no WebGL, or the tiles didn't load). */
  onFail: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const view = useMapView(map);

  // The first venues decide the opening view; later filtering keeps it.
  const firstVenues = useRef(venues);
  const failed = useRef(onFail);
  useEffect(() => {
    failed.current = onFail;
  }, [onFail]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let instance: MapLibreMap;
    try {
      instance = new MapLibreMap({
        container: element,
        style: mapConfig.style,
        center: mapConfig.city.center,
        zoom: mapConfig.city.zoom,
        minZoom: mapConfig.minZoom,
        maxZoom: mapConfig.maxZoom,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        locale: { "Map.Title": copy.mapLabel },
      });
    } catch {
      // No WebGL in this browser.
      failed.current();
      return;
    }
    instance.touchZoomRotate.disableRotation();
    instance.keyboard.disableRotation();
    instance.addControl(
      new AttributionControl({ compact: true }),
      "bottom-right",
    );

    // A tile that fails is fine; a map whose style never loads is not.
    let styleLoaded = false;
    instance.once("style.load", () => {
      styleLoaded = true;
    });
    instance.on("error", () => {
      if (!styleLoaded) failed.current();
    });
    instance.once("load", () => {
      const start = firstVenues.current;
      if (start.length) {
        instance.fitBounds(boundsOf(start), {
          padding: fitPadding(instance),
          maxZoom: FOCUS_ZOOM - 1,
          duration: 0,
        });
      }
      setMap(instance);
    });
    return () => instance.remove();
  }, []);

  // A picked venue moves into the top half of the map, clear of its card.
  useEffect(() => {
    if (!map || !selected) return;
    const at = lngLat(selected);
    const { x, y } = map.project(at);
    const { clientWidth: width, clientHeight: height } = map.getContainer();
    const inClearView = x > 0 && x < width && y > 60 && y < height / 2;
    if (!inClearView) map.easeTo({ center: at, offset: [0, -height / 5] });
  }, [map, selected]);

  const groups = useMemo(
    () => (map && view ? groupVenues(map, venues, selectedId) : []),
    [map, view, venues, selectedId],
  );

  const zoom = map && view ? map.getZoom() : 0;

  const control =
    "grid size-10 cursor-pointer place-items-center rounded-[10px] bg-card shadow-[0_2px_8px_-2px_rgb(15_15_20/0.25)] hover:bg-block disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="relative h-full min-h-105 overflow-hidden rounded-[14px] border border-line bg-block">
      <div className="absolute inset-0">
        {/* Inline, to beat MapLibre's own font rule, so pins keep the
            dashboard's type. */}
        <div
          ref={container}
          className="size-full"
          style={{ font: "inherit" }}
        />
      </div>

      {!map && (
        <span className="absolute inset-0 grid place-items-center text-sm text-muted">
          {copy.mapLoading}
        </span>
      )}

      {map &&
        groups.map((group) => {
          if (group.venues.length > 1) {
            const hasCafe = group.venues.some(
              (venue) => venue.category === "Cafe",
            );
            return (
              <MapMarker key={group.key} map={map} at={group.at} raised={false}>
                <button
                  type="button"
                  aria-label={copy.clusterLabel(group.venues.length)}
                  onClick={() =>
                    map.fitBounds(boundsOf(group.venues), {
                      padding: fitPadding(map),
                      maxZoom: CLUSTER_UNTIL_ZOOM,
                    })
                  }
                  className={cn(
                    "grid size-8.5 cursor-pointer place-items-center rounded-full bg-graphite text-xs font-semibold text-paper shadow-[0_4px_12px_-4px_rgb(15_15_20/0.45)]",
                    hasCafe && "shadow-[0_0_0_3px_var(--volt)]",
                  )}
                >
                  {group.venues.length}
                </button>
              </MapMarker>
            );
          }
          const [venue] = group.venues;
          const isSelected = venue.id === selectedId;
          const isHovered = venue.id === hoveredId;
          const isCafe = venue.category === "Cafe";
          return (
            <MapMarker
              key={group.key}
              map={map}
              at={group.at}
              raised={venue.isMine || isSelected || isHovered}
            >
              <button
                type="button"
                aria-label={
                  venue.isMine ? copy.pinYours(venue.name) : venue.name
                }
                aria-pressed={isSelected}
                onClick={() => onSelect(venue.id)}
                className="flex cursor-pointer flex-col items-center after:h-2 after:w-0.5 after:bg-ink"
              >
                <b
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg bg-card px-2 py-1.25 text-xs font-semibold whitespace-nowrap text-ink shadow-[0_4px_12px_-4px_rgb(15_15_20/0.35)]",
                    isCafe && "bg-volt",
                    venue.isMine && "bg-ink text-paper",
                    (isSelected || isHovered) &&
                      "shadow-[0_0_0_2px_var(--ink)]",
                  )}
                >
                  {venue.isMine && <Icon name="star" size={12} />}
                  {venue.name}
                </b>
              </button>
            </MapMarker>
          );
        })}

      <div
        role="group"
        aria-label={copy.legendLabel}
        className="absolute top-3 left-3 z-3 flex gap-3 rounded-lg bg-card/90 px-2.5 py-1.5 text-xs font-semibold shadow-[0_2px_8px_-2px_rgb(15_15_20/0.25)]"
      >
        <span className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-full bg-volt shadow-[inset_0_0_0_1px_rgb(15_15_20/0.3)]" />
          {copy.legendCafes}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-full bg-card shadow-[inset_0_0_0_1px_rgb(15_15_20/0.3)]" />
          {copy.legendOthers}
        </span>
      </div>

      <div className="absolute top-3 right-3 z-3 flex flex-col gap-1.5">
        <button
          type="button"
          aria-label={copy.zoomIn}
          disabled={!map || zoom >= mapConfig.maxZoom}
          onClick={() => map?.zoomIn()}
          className={control}
        >
          <Icon name="plus" size={18} />
        </button>
        <button
          type="button"
          aria-label={copy.zoomOut}
          disabled={!map || zoom <= mapConfig.minZoom}
          onClick={() => map?.zoomOut()}
          className={control}
        >
          <Icon name="minus" size={18} />
        </button>
        <button
          type="button"
          aria-label={copy.centre}
          disabled={!map}
          onClick={() => {
            const mine = venues.find((venue) => venue.id === myVenueId);
            if (mine) map?.flyTo({ center: lngLat(mine), zoom: FOCUS_ZOOM });
            onSelect(myVenueId);
          }}
          className={control}
        >
          <Icon name="target" size={18} />
        </button>
      </div>

      {map && venues.length === 0 && (
        <Card className="absolute top-1/2 left-1/2 z-4 w-[min(280px,90%)] -translate-x-1/2 -translate-y-1/2 gap-2 p-4">
          <b>{copy.noVenuesTitle}</b>
          <span className="text-[13px] text-muted">{copy.noVenuesBody}</span>
          <Button variant="dark" size="sm" onClick={onReset}>
            {copy.resetFilters}
          </Button>
        </Card>
      )}

      {selected && (
        <Card className="absolute bottom-7 left-3 z-4 w-[min(300px,calc(100%-24px))] animate-pop gap-2 p-3.5 shadow-[0_12px_30px_-12px_rgb(15_15_20/0.35)]">
          <div className="flex items-center gap-2">
            <b className="flex-1">{selected.name}</b>
            <button
              type="button"
              aria-label={copy.closePreview}
              onClick={() => onSelect(null)}
              className="grid size-7 cursor-pointer place-items-center rounded-lg hover:bg-ink/5"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
          <span className="text-[13px] text-muted">
            {selected.category} · {selected.area} ·{" "}
            {"₹".repeat(selected.priceLevel)} ·{" "}
            {selected.isMine
              ? copy.yourVenue
              : copy.fromYou(selected.distanceKm)}
          </span>
          <span className="flex items-center gap-2 text-[13px]">
            <Stars value={selected.rating} size={12} />
            <b>{selected.rating}</b>
            {selected.rank && (
              <Badge className="font-mono text-[11px] font-medium">
                {copy.rankBadge(selected.rank)}
              </Badge>
            )}
          </span>
          {selected.amenities.length > 0 && (
            <span className="flex flex-wrap gap-1">
              {selected.amenities.map((amenity) => (
                <Badge key={amenity}>{amenity}</Badge>
              ))}
            </span>
          )}
          <span className="text-xs text-muted">
            {selected.isMine ? copy.pinNoteMine : copy.pinNoteOther}
          </span>
        </Card>
      )}

      <span className="absolute bottom-2 left-2.5 z-3 rounded bg-white/75 px-1.5 py-0.5 font-mono text-[10px] text-muted uppercase">
        {copy.mapAttribution}
      </span>
    </div>
  );
}
