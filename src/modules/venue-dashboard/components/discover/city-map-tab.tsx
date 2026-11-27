"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/cn";

import { content } from "../../content";
import type { CityVenue, DiscoverResponse } from "../../types";
import { Badge } from "../ui/badges";
import { Button } from "../ui/button";
import { Card, SideGrid } from "../ui/card";
import { Chip, FilterSelect, SearchField, SegmentedTabs } from "../ui/controls";
import { Icon } from "../ui/icon";

const copy = content.discover;

/** MapLibre is large and browser-only: load it only when the map shows. */
const CityMap = dynamic(() => import("./city-map").then((m) => m.CityMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-105 place-items-center rounded-[14px] border border-line bg-block text-sm text-muted">
      {copy.mapLoading}
    </div>
  ),
});

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
  const [mapFailed, setMapFailed] = useState(false);
  /** Changes on Retry, so a failed map starts again from scratch. */
  const [mapAttempt, setMapAttempt] = useState(0);
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
  };
  const retryMap = () => {
    setMapFailed(false);
    setMapAttempt((attempt) => attempt + 1);
    onRetry();
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

  const showMapError = (!data.mapAvailable || mapFailed) && view !== "list";

  const map = showMapError ? (
    <div className="relative grid min-h-90 place-items-center overflow-hidden rounded-[14px] border border-line bg-[#e9e6db] p-4">
      <Card className="max-w-90 p-6">
        <Icon name="map" size={28} />
        <b className="text-[17px]">{copy.mapErrorTitle}</b>
        <span className="text-sm text-muted">{copy.mapErrorBody}</span>
        <div className="flex gap-2">
          <Button variant="dark" size="sm" icon="refresh" onClick={retryMap}>
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
      key={mapAttempt}
      venues={list}
      myVenueId={data.myVenueId}
      selected={selected}
      selectedId={selectedId}
      hoveredId={hoveredId}
      onSelect={setSelectedId}
      onReset={reset}
      onFail={() => setMapFailed(true)}
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
