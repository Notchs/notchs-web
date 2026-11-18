"use client";

import { useState } from "react";

import { notchsContent as copy } from "../content";
import { getNotches, type Notch } from "../lib/api";
import {
  fullDate,
  nicheLabel,
  notchNumber,
  ordinal,
  safeColour,
} from "../lib/format";
import { useLoad } from "../lib/use-load";
import { ClaimCard } from "./claim-card";
import { useMe } from "./me-context";
import { NotchTile } from "./notch-tile";
import { LoadError, Loading } from "./states";
import { PillButton, Tabs } from "./ui";
import { NotchsByLocation, PlacesByKind } from "./visit-groups";

/** Notchs per page; "Show more" loads the next page. */
const PAGE_SIZE = 20;

type View = "all" | "places" | "locations";
const views: View[] = ["all", "places", "locations"];

function NotchCard({ notch }: { notch: Notch }) {
  const facts = [
    { label: copy.notch, value: notchNumber(notch.notch_no) },
    { label: copy.visitHere, value: ordinal(notch.visit_no_at_venue) },
    { label: copy.points, value: String(notch.points) },
  ];
  return (
    <article className="flex flex-col gap-3 rounded-[20px] border border-line bg-card p-4">
      <div className="flex items-center gap-3.5">
        <NotchTile colour={notch.colour} />
        <div className="flex min-w-0 grow flex-col gap-0.5">
          <h2 className="font-bold">{notch.venue_name}</h2>
          <p className="text-sm text-muted">
            {[
              nicheLabel(notch.niche),
              notch.venue_area,
              fullDate(notch.visit_date),
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <span className="font-display font-extrabold">+{notch.points}</span>
      </div>
      <div className="h-px bg-line" />
      <dl className="grid grid-cols-3 gap-2 text-sm">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col-reverse gap-0.5">
            <dt className="text-muted">{fact.label}</dt>
            <dd className="font-bold">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

/** Every Notch, newest first, each in its place's colour. */
function AllNotchs() {
  const [pageCount, setPageCount] = useState(1);
  const notches = useLoad(
    () =>
      Promise.all(
        Array.from({ length: pageCount }, (_, i) =>
          getNotches(i + 1, PAGE_SIZE),
        ),
      ).then((pages) => ({
        items: pages.flatMap((page) => page.items),
        total: pages[0]?.total ?? 0,
      })),
    String(pageCount),
  );
  const items = notches.data?.items ?? [];
  const total = notches.data?.total ?? 0;

  // The kinds of place in this list, with their colours.
  const kinds = [
    ...new Map(items.map((n) => [n.niche, safeColour(n.colour)])).entries(),
  ];

  return (
    <>
      {kinds.length > 1 && (
        <ul aria-label={copy.colours} className="flex flex-wrap gap-2">
          {kinds.map(([niche, colour]) => (
            <li
              key={niche}
              className="flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1.5 text-[.8125rem]"
            >
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: colour }}
              />
              {nicheLabel(niche)}
            </li>
          ))}
        </ul>
      )}

      {notches.error ? (
        <LoadError onRetry={notches.reload} />
      ) : !notches.data ? (
        <Loading />
      ) : items.length === 0 ? (
        <p className="text-muted">{copy.empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((notch) => (
            <li key={notch.notch_no}>
              <NotchCard notch={notch} />
            </li>
          ))}
        </ul>
      )}

      {items.length < total && (
        <PillButton
          onClick={() => setPageCount((n) => n + 1)}
          disabled={notches.loading}
        >
          {copy.more}
        </PillButton>
      )}
    </>
  );
}

/** My Notchs: every Notch, or my places by kind, or my Notchs by location. */
export function NotchsScreen() {
  const { me } = useMe();
  const [view, setView] = useState<View>("all");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[2rem] font-extrabold tracking-[-.03em] md:text-5xl">
          {copy.title}
        </h1>
        <p className="text-sm text-muted">
          {copy.summary(me.totals.notches, me.totals.places)}
        </p>
      </div>

      <Tabs
        label={copy.views.label}
        options={views.map((value) => ({ value, label: copy.views[value] }))}
        value={view}
        onChange={setView}
      />

      {view === "all" && <AllNotchs />}
      {view === "places" && <PlacesByKind />}
      {view === "locations" && <NotchsByLocation />}

      <ClaimCard />
    </div>
  );
}
