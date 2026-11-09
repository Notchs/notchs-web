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

const PAGE_SIZE = 20;
/** The most the API returns in one page. */
const MAX_SIZE = 100;

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
export function NotchsScreen() {
  const { me } = useMe();
  const [size, setSize] = useState(PAGE_SIZE);
  const notches = useLoad(() => getNotches(1, size), String(size));
  const items = notches.data?.items ?? [];
  const total = notches.data?.total ?? 0;

  // The kinds of place in this list, with their colours.
  const kinds = [
    ...new Map(items.map((n) => [n.niche, safeColour(n.colour)])).entries(),
  ];

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

      {items.length < total && size < MAX_SIZE && (
        <button
          type="button"
          onClick={() => setSize((n) => Math.min(n + PAGE_SIZE, MAX_SIZE))}
          disabled={notches.loading}
          className="min-h-12 cursor-pointer rounded-full border-[1.5px] border-foreground font-bold disabled:cursor-default disabled:opacity-60"
        >
          {copy.more}
        </button>
      )}

      <ClaimCard />
    </div>
  );
}
