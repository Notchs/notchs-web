"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";

import { content } from "../../content";
import type { DiscoverResponse, VenueCategory } from "../../types";
import { Badge } from "../ui/badges";
import { Card, InkCard, Overline, SideGrid } from "../ui/card";
import { SegmentedTabs } from "../ui/controls";
import { UnavailableBox } from "../ui/states";

const copy = content.discover;

export function CityRankingTab({ data }: { data: DiscoverResponse }) {
  const [category, setCategory] = useState<VenueCategory>("Cafe");
  const label =
    copy.rankingCategories.find((item) => item.value === category)?.label ?? "";
  const inCategory = data.venues.filter((venue) => venue.category === category);
  const ranked = inCategory
    .filter((venue) => venue.rank != null)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const mine = ranked.find((venue) => venue.isMine);

  return (
    <>
      <div>
        <SegmentedTabs
          options={copy.rankingCategories}
          value={category}
          onChange={setCategory}
          label={copy.rankingCategoriesLabel}
        />
      </div>
      {ranked.length < data.minimumRankedVenues ? (
        <UnavailableBox
          badge={<Badge tone="line">{copy.insufficient}</Badge>}
          title={copy.notEnoughTitle(label.toLowerCase())}
          body={copy.notEnoughBody(
            data.minimumRankedVenues,
            label.toLowerCase(),
            inCategory.length,
          )}
        />
      ) : (
        <SideGrid>
          <Card className="gap-0 p-0">
            <div className="flex flex-col gap-1 px-4 pt-4 pb-2">
              <h2 className="m-0 text-base font-bold">
                {copy.rankingTitle(label, data.rankingPeriod)}
              </h2>
              <span className="text-[13px] text-muted">
                {copy.rankingBasis}
              </span>
            </div>
            {ranked.map((venue) => {
              const move = venue.rankMove ?? 0;
              return (
                <div
                  key={venue.id}
                  className={cn(
                    "flex items-center gap-3 border-t border-line px-4 py-3",
                    venue.isMine && "bg-block",
                  )}
                >
                  <span className="w-[34px] flex-none text-center font-display text-lg leading-none">
                    {venue.rank}
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block text-[15px]">
                      {venue.name}
                      {venue.isMine && copy.you}
                    </b>
                    <span className="text-xs text-muted">{venue.area}</span>
                  </span>
                  <span
                    className={cn(
                      "font-mono text-xs",
                      move < 0 ? "text-unnotched" : "text-muted",
                    )}
                  >
                    {move > 0 ? `▲ ${move}` : move < 0 ? `▼ ${-move}` : "–"}
                  </span>
                </div>
              );
            })}
          </Card>
          <div className="flex flex-col gap-4">
            {mine && (
              <InkCard>
                <Overline className="text-stone-light">
                  {copy.yourRank(label)}
                </Overline>
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-[64px] leading-[.9] text-volt">
                    #{mine.rank}
                  </span>
                  <span className="text-stone-light">
                    {copy.ofCount(ranked.length)}
                  </span>
                </span>
                <span className="text-sm">
                  {copy.rankUp(mine.rankMove ?? 0, data.myUniqueGuests)}
                </span>
              </InkCard>
            )}
            <Card className="gap-2">
              <b>{copy.howTitle}</b>
              <span className="text-sm leading-normal text-muted">
                {copy.howBody}
              </span>
            </Card>
          </div>
        </SideGrid>
      )}
    </>
  );
}
