"use client";

import { venueRoutes } from "@/config/routes";

import { content, pageTitles } from "../../content";
import { useNotchCard } from "../../hooks/use-venue-data";
import { formatNumber } from "../../lib/format";
import { VenuePage } from "../shell/venue-page";
import { Overline, PanelTitle } from "../ui/card";
import { QueryBoundary } from "../ui/query-boundary";
import { EmptyState } from "../ui/states";
import { ShareablePanel } from "./shareable-panel";
import { VisitsTabs } from "./visits-tabs";

const copy = content.visits.card;

export function NotchCardScreen() {
  const query = useNotchCard();
  return (
    <VenuePage example title={pageTitles.visits} scenarioPage="visits">
      <VisitsTabs current={venueRoutes.notchCard} />
      <QueryBoundary query={query}>
        {(card) =>
          card.ready ? (
            <ShareablePanel
              filename={`notchs-${card.monthName.toLowerCase()}-card.png`}
              shareTitle={copy.cardTitle(card.venueName, card.monthName)}
              shareBody={copy.shareText(
                card.venueName,
                card.monthName,
                card.visitors,
              )}
              intro={
                <>
                  <Overline>{copy.overlineNew(card.issuedOn)}</Overline>
                  <PanelTitle className="text-[28px] leading-[1.1]">
                    {copy.title(card.monthName)}
                  </PanelTitle>
                  <p className="m-0 text-muted">{copy.body}</p>
                </>
              }
              footer={
                <>
                  <div className="h-px bg-line" />
                  <Overline>{copy.past}</Overline>
                  <span className="text-[15px] text-muted">
                    {card.nextCardNote}
                  </span>
                </>
              }
              art={
                <div className="flex aspect-[4/5] w-85 max-w-full flex-none flex-col justify-between bg-ink p-7 text-paper notch notch-lg">
                  <div className="flex flex-col gap-2">
                    <Overline className="text-stone-light">
                      {card.monthLabel}
                    </Overline>
                    <b className="font-display text-2xl leading-[1.1]">
                      {copy.cardTitle(card.venueName, card.monthName)}
                    </b>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-display text-[80px] leading-[.9] text-volt">
                      {formatNumber(card.visitors)}
                    </span>
                    <span className="text-xl font-semibold">
                      {copy.visitors(card.newPercent)}
                    </span>
                    <span className="text-sm text-stone-light">
                      {copy.everyVisit}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 border-t border-paper/10 pt-3.5 font-mono text-xs text-stone-light uppercase">
                    <span>{card.location}</span>
                    <span className="lowercase">{copy.site}</span>
                  </div>
                </div>
              }
            />
          ) : (
            <EmptyState
              icon="calendar"
              title={copy.notReadyTitle(card.firstCardOn)}
              body={copy.notReadyBody}
            />
          )
        }
      </QueryBoundary>
    </VenuePage>
  );
}
