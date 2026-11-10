"use client";

import { venueRoutes } from "@/config/routes";

import { content, pageTitles } from "../../content";
import { useFoundingVenue } from "../../hooks/use-venue-data";
import { VenuePage } from "../shell/venue-page";
import { PanelTitle, Overline } from "../ui/card";
import { Icon } from "../ui/icon";
import { QueryBoundary } from "../ui/query-boundary";
import { ShareablePanel } from "./shareable-panel";
import { VisitsTabs } from "./visits-tabs";

const copy = content.visits.founding;

export function FoundingVenueScreen() {
  const query = useFoundingVenue();
  return (
    <VenuePage example title={pageTitles.visits} scenarioPage="visits">
      <VisitsTabs current={venueRoutes.foundingVenue} />
      <QueryBoundary query={query}>
        {(venue) => (
          <ShareablePanel
            filename="notchs-founding-venue.png"
            shareTitle={copy.badge}
            shareBody={`${venue.venueName} · ${copy.badge} #${venue.number}`}
            intro={
              <>
                <PanelTitle className="text-[28px] leading-[1.1]">
                  {copy.title}
                </PanelTitle>
                <p className="m-0 text-muted">{copy.body}</p>
              </>
            }
            art={
              <div className="flex aspect-[4/5] w-85 max-w-full flex-col justify-between bg-ink p-7 text-paper notch notch-lg">
                <Overline className="text-stone-light">
                  {venue.pilotLabel}
                </Overline>
                <div className="flex flex-col gap-3">
                  <Overline className="text-[15px] text-paper">
                    {copy.badge}
                  </Overline>
                  <span className="flex items-baseline gap-3">
                    <span className="font-display text-[96px] leading-[.9] text-volt">
                      #{venue.number}
                    </span>
                    <span className="text-xl text-stone-light">
                      {copy.of(venue.total)}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <b className="font-display text-2xl">{venue.venueName}</b>
                  <span className="text-sm text-stone-light">
                    {copy.joined(venue.area, venue.joinedOn)}
                  </span>
                </div>
                <span className="flex items-center gap-2 border-t border-paper/10 pt-3.5 font-mono text-xs text-stone-light uppercase">
                  <Icon name="shield" size={14} />
                  {copy.verified}
                </span>
              </div>
            }
          />
        )}
      </QueryBoundary>
    </VenuePage>
  );
}
