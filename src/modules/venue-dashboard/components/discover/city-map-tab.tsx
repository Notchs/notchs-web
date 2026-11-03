"use client";

import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/cn";

import { content } from "../../content";
import type { CityVenue, DiscoverResponse } from "../../types";
import { Badge, Stars } from "../ui/badges";
import { Button } from "../ui/button";
import { Card, SideGrid } from "../ui/card";
import { Chip, FilterSelect, SearchField, SegmentedTabs } from "../ui/controls";
import { Icon } from "../ui/icon";
import { CityMapArt } from "./city-map-art";

const copy = content.discover;
const ZOOM_SCALE = 2.2;
const CLUSTER_DISTANCE = 9;

type ViewMode = (typeof copy.views)[number]["value"];
type SortMode = "rank" | "rating" | "distance" | "name";

const initialFilters = {
  search: "",
  categories: [] as string[],
  area: "all",
  minRating: "0",
  price: "any",
  amenities: [] as string[],
};

type Filters = typeof initialFilters;

function toggled(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function filterVenues(venues: CityVenue[], filters: Filters, sort: SortMode) {
  const term = filters.search.trim().toLowerCase();
  const compare: Record<SortMode, (a: CityVenue, b: CityVenue) => number> = {
    rank: (a, b) => (a.rank ?? 99) - (b.rank ?? 99),
    rating: (a, b) => b.rating - a.rating,
    distance: (a, b) => a.distanceKm - b.distanceKm,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return venues
    .filter(
      (venue) =>
        (!term || `${venue.name} ${venue.area}`.toLowerCase().includes(term)) &&
        (!filters.categories.length ||
          filters.categories.includes(venue.category)) &&
        (filters.area === "all" || venue.area === filters.area) &&
        venue.rating >= Number(filters.minRating) &&
        (filters.price === "any" ||
          venue.priceLevel === Number(filters.price)) &&
        filters.amenities.every((item) => venue.amenities.includes(item)),
    )
    .sort((a, b) => compare[sort](a, b) || a.distanceKm - b.distanceKm);
}

export function CityMapTab({
  data,
  onRetry,
}: {
  data: DiscoverResponse;
  onRetry: () => void;
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState<SortMode>("rank");
  const [view, setView] = useState<ViewMode>("split");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState({ zoomed: false, x: 50, y: 50 });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const list = useMemo(
    () => filterVenues(data.venues, filters, sort),
    [data.venues, filters, sort],
  );
  const areas = useMemo(
    () => [...new Set(data.venues.map((venue) => venue.area))].sort(),
    [data.venues],
  );
  const selected = list.find((venue) => venue.id === selectedId);

  const update = (changes: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...changes }));
    setSelectedId(null);
  };
  const reset = () => {
    setFilters(initialFilters);
    setSelectedId(null);
    setZoom({ zoomed: false, x: 50, y: 50 });
  };
  const activeCount =
    filters.categories.length +
    filters.amenities.length +
    Number(filters.area !== "all") +
    Number(filters.minRating !== "0") +
    Number(filters.price !== "any") +
    Number(Boolean(filters.search));

  const filterControls = (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {copy.categories.map((category) => (
          <Chip
            key={category}
            selected={filters.categories.includes(category)}
            onClick={() =>
              update({ categories: toggled(filters.categories, category) })
            }
          >
            {category}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterSelect
          label={copy.areaLabel}
          value={filters.area}
          onChange={(event) => update({ area: event.target.value })}
          options={[
            { value: "all", label: copy.allAreas },
            ...areas.map((area) => ({ value: area, label: area })),
          ]}
        />
        <FilterSelect
          label={copy.ratingLabel}
          value={filters.minRating}
          onChange={(event) => update({ minRating: event.target.value })}
          options={copy.ratingOptions}
        />
        <FilterSelect
          label={copy.priceLabel}
          value={filters.price}
          onChange={(event) => update({ price: event.target.value })}
          options={copy.priceOptions}
        />
        {copy.amenities.map((amenity) => (
          <Chip
            key={amenity}
            selected={filters.amenities.includes(amenity)}
            onClick={() =>
              update({ amenities: toggled(filters.amenities, amenity) })
            }
          >
            {amenity}
          </Chip>
        ))}
      </div>
    </div>
  );

  const venueList = (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <b className="flex-1 text-sm">{copy.count(list.length)}</b>
        <FilterSelect
          label={copy.sortLabel}
          value={sort}
          onChange={(event) => setSort(event.target.value as SortMode)}
          options={copy.sortOptions}
        />
      </div>
      <div className="flex max-h-105 flex-col gap-2 overflow-y-auto">
        {list.length ? (
          list.map((venue) => (
            <button
              key={venue.id}
              type="button"
              aria-pressed={venue.id === selectedId}
              onClick={() => setSelectedId(venue.id)}
              onPointerEnter={() => setHoveredId(venue.id)}
              onPointerLeave={() => setHoveredId(null)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-card p-2.5 text-left hover:border-ink/16",
                venue.isMine && "bg-background",
                venue.id === selectedId &&
                  "shadow-[inset_0_0_0_1.5px_var(--ink)]",
              )}
            >
              <span className="grid size-14 flex-none place-items-center rounded-[10px] bg-block font-display text-base text-muted">
                {venue.name[0]}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <b className="truncate text-sm">
                  {venue.name}
                  {venue.isMine && copy.you}
                </b>
                <span className="text-xs text-muted">
                  {venue.category} · {venue.area} ·{" "}
                  {"₹".repeat(venue.priceLevel)}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Icon name="star" size={12} />
                  {venue.rating} · {copy.km(venue.distanceKm)}
                </span>
              </span>
              {venue.rank && (
                <Badge className="font-mono text-[11px] font-medium">
                  #{venue.rank}
                </Badge>
              )}
            </button>
          ))
        ) : (
          <span className="py-3 text-sm text-muted">{copy.listEmpty}</span>
        )}
      </div>
    </div>
  );

  const showMapError = !data.mapAvailable && view !== "list";

  const map = showMapError ? (
    <div className="relative grid min-h-90 place-items-center overflow-hidden rounded-[14px] border border-line bg-[#e9e6db] p-4">
      <Card className="max-w-90 p-6">
        <Icon name="map" size={28} />
        <b className="text-[17px]">{copy.mapErrorTitle}</b>
        <span className="text-sm text-muted">{copy.mapErrorBody}</span>
        <div className="flex gap-2">
          <Button variant="dark" size="sm" icon="refresh" onClick={onRetry}>
            {content.common.retry}
          </Button>
          <Button size="sm" onClick={() => setView("list")}>
            {copy.showList}
          </Button>
        </div>
      </Card>
    </div>
  ) : (
    <CityMap
      venues={list}
      myVenueId={data.myVenueId}
      selected={selected}
      selectedId={selectedId}
      hoveredId={hoveredId}
      zoom={zoom}
      onZoom={setZoom}
      onSelect={setSelectedId}
      onReset={reset}
    />
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <SearchField
          label={copy.search}
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          className="max-w-80 min-w-30 flex-1"
        />
        <SegmentedTabs
          options={copy.views}
          value={view}
          onChange={setView}
          label={copy.viewsLabel}
        />
        <Button
          size="sm"
          icon="filter"
          className="sm:hidden"
          onClick={() => setSheetOpen(true)}
        >
          {copy.filtersCount(activeCount)}
        </Button>
        {activeCount > 0 && (
          <Button variant="text" size="sm" icon="x" onClick={reset}>
            {copy.reset(activeCount)}
          </Button>
        )}
      </div>
      <div className="max-sm:hidden">{filterControls}</div>

      {view === "split" && (
        <SideGrid>
          {map}
          {venueList}
        </SideGrid>
      )}
      {view === "map" && map}
      {view === "list" && venueList}

      {sheetOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setSheetOpen(false)}
            className="fixed inset-0 z-30 bg-ink/45"
          />
          <div
            role="dialog"
            aria-label={copy.filters}
            className="fixed inset-x-0 bottom-0 z-40 flex max-h-[85%] animate-rise flex-col gap-4 overflow-y-auto rounded-t-[20px] bg-card px-4 py-5 [animation-duration:.26s]"
          >
            <div className="flex items-center">
              <b className="flex-1 text-[17px]">{copy.filters}</b>
              <button
                type="button"
                aria-label={copy.closeFilters}
                onClick={() => setSheetOpen(false)}
                className="grid size-10 cursor-pointer place-items-center rounded-[10px] hover:bg-ink/5"
              >
                <Icon name="x" />
              </button>
            </div>
            {filterControls}
            <div className="flex gap-2">
              <Button size="lg" onClick={reset}>
                {copy.resetPlain}
              </Button>
              <Button
                variant="dark"
                size="lg"
                full
                className="flex-1"
                onClick={() => setSheetOpen(false)}
              >
                {copy.show(list.length)}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

type ZoomState = { zoomed: boolean; x: number; y: number };

function CityMap({
  venues,
  myVenueId,
  selected,
  selectedId,
  hoveredId,
  zoom,
  onZoom,
  onSelect,
  onReset,
}: {
  venues: CityVenue[];
  myVenueId: string;
  selected: CityVenue | undefined;
  selectedId: string | null;
  hoveredId: string | null;
  zoom: ZoomState;
  onZoom: (zoom: ZoomState) => void;
  onSelect: (id: string | null) => void;
  onReset: () => void;
}) {
  const position = (venue: CityVenue): [number, number] =>
    zoom.zoomed
      ? [
          50 + (venue.x - zoom.x) * ZOOM_SCALE,
          50 + (venue.y - zoom.y) * ZOOM_SCALE,
        ]
      : [venue.x, venue.y];

  type Point = { venue: CityVenue; at: [number, number] };
  const groups: Point[][] = [];
  venues
    .map((venue) => ({ venue, at: position(venue) }))
    .filter(({ at }) => at[0] > 3 && at[0] < 97 && at[1] > 8 && at[1] < 98)
    .forEach((point) => {
      const standsAlone =
        point.venue.isMine || point.venue.id === selectedId || zoom.zoomed;
      const group = standsAlone
        ? undefined
        : groups.find(
            ([first]) =>
              !first.venue.isMine &&
              first.venue.id !== selectedId &&
              Math.hypot(
                first.at[0] - point.at[0],
                (first.at[1] - point.at[1]) * 0.7,
              ) < CLUSTER_DISTANCE,
          );
      if (group) group.push(point);
      else groups.push([point]);
    });

  const control =
    "grid size-10 cursor-pointer place-items-center rounded-[10px] bg-card shadow-[0_2px_8px_-2px_rgb(15_15_20/0.25)] hover:bg-block disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="relative h-full min-h-105 overflow-hidden rounded-[14px] border border-line bg-[#e9e6db]">
      <CityMapArt
        transform={
          zoom.zoomed
            ? `translate(${50 - zoom.x * ZOOM_SCALE} ${50 - zoom.y * ZOOM_SCALE}) scale(${ZOOM_SCALE})`
            : undefined
        }
      />
      {groups.map((group) => {
        if (group.length > 1) {
          const average = (read: (point: Point) => number) =>
            group.reduce((total, point) => total + read(point), 0) /
            group.length;
          return (
            <button
              key={group[0].venue.id}
              type="button"
              aria-label={copy.clusterLabel(group.length)}
              onClick={() =>
                onZoom({
                  zoomed: true,
                  x: average((point) => point.venue.x),
                  y: average((point) => point.venue.y),
                })
              }
              style={{
                left: `${average((point) => point.at[0])}%`,
                top: `${average((point) => point.at[1])}%`,
              }}
              className="absolute z-2 grid size-[34px] -translate-x-1/2 -translate-y-full cursor-pointer place-items-center rounded-full bg-graphite text-xs font-semibold text-paper"
            >
              {group.length}
            </button>
          );
        }
        const { venue, at } = group[0];
        const isSelected = venue.id === selectedId;
        return (
          <button
            key={venue.id}
            type="button"
            aria-label={venue.isMine ? copy.pinYours(venue.name) : venue.name}
            aria-pressed={isSelected}
            onClick={() => onSelect(venue.id)}
            style={{ left: `${at[0]}%`, top: `${at[1]}%` }}
            className="absolute z-2 flex -translate-x-1/2 -translate-y-full cursor-pointer flex-col items-center after:h-2 after:w-0.5 after:bg-ink"
          >
            <b
              className={cn(
                "flex items-center gap-1.5 rounded-lg bg-card px-2 py-[5px] text-xs font-semibold whitespace-nowrap shadow-[0_4px_12px_-4px_rgb(15_15_20/0.35)]",
                venue.isMine && "bg-ink text-paper",
                (isSelected || hoveredId === venue.id) &&
                  "shadow-[0_0_0_2px_var(--ink)]",
              )}
            >
              {venue.isMine && <Icon name="star" size={12} />}
              {venue.name}
            </b>
          </button>
        );
      })}

      <div className="absolute top-3 right-3 z-3 flex flex-col gap-1.5">
        <button
          type="button"
          aria-label={copy.zoomIn}
          disabled={zoom.zoomed}
          onClick={() => onZoom({ ...zoom, zoomed: true })}
          className={control}
        >
          <Icon name="plus" size={18} />
        </button>
        <button
          type="button"
          aria-label={copy.zoomOut}
          onClick={() => onZoom({ zoomed: false, x: 50, y: 50 })}
          className={control}
        >
          <Icon name="minus" size={18} />
        </button>
        <button
          type="button"
          aria-label={copy.centre}
          onClick={() => {
            const mine = venues.find((venue) => venue.id === myVenueId);
            onZoom({ zoomed: true, x: mine?.x ?? 46, y: mine?.y ?? 46 });
            onSelect(myVenueId);
          }}
          className={control}
        >
          <Icon name="target" size={18} />
        </button>
      </div>

      {venues.length === 0 && (
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
