"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";

import { leaderboardContent as copy, shellContent } from "../content";
import {
  getLeaderboard,
  getStanding,
  type Period,
  type Standing,
} from "../lib/api";
import { dayMonth } from "../lib/format";
import { useLoad } from "../lib/use-load";
import { useMe } from "./me-context";
import { LoadError, Loading } from "./states";

const periods: Period[] = ["month", "all"];

function Board({ cityId, period }: { cityId: string; period: Period }) {
  const board = useLoad(() => getLeaderboard(cityId, period), period);
  const rows = board.data?.rows;

  if (board.error) return <LoadError onRetry={board.reload} />;
  if (!rows) return <Loading />;
  if (rows.length === 0) return <p className="text-muted">{copy.empty}</p>;

  return (
    <ol className="flex flex-col divide-y divide-line rounded-[20px] border border-line bg-card">
      {rows.map((row, i) => (
        <li
          key={`${row.rank}-${row.handle ?? i}`}
          className="flex items-center gap-4 px-4 py-3"
        >
          <span className="w-10 font-display font-extrabold">#{row.rank}</span>
          <span className="min-w-0 grow truncate font-semibold">
            {row.name ?? copy.hidden}
          </span>
          <span className="font-display font-extrabold">
            {row.points}
            <span className="sr-only"> {copy.pointsLabel}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** The home city's leaderboard, this month or all time, with my own row on top. */
export function LeaderboardScreen() {
  const { me } = useMe();
  const [period, setPeriod] = useState<Period>("month");
  const standing = useLoad(getStanding, me.is_public ? "shown" : "hidden");
  const mine = standing.data?.[period === "month" ? "month" : "all_time"];

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <h1 className="font-display text-[2rem] font-extrabold tracking-[-.03em] md:text-5xl">
        {me.city?.name ?? shellContent.nav.leaderboard}
      </h1>

      {!me.city ? (
        <p className="text-muted">{copy.noCity}</p>
      ) : (
        <>
          <div
            role="tablist"
            aria-label={copy.periods.label}
            className="grid grid-cols-2 gap-1 rounded-full bg-block p-1"
          >
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={period === p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "min-h-11 cursor-pointer rounded-full text-sm font-bold",
                  period === p && "bg-card",
                )}
              >
                {copy.periods[p]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3.5 rounded-[20px] bg-panel p-4 text-paper">
            <span className="rounded-xl bg-volt px-3 py-2 font-display text-lg font-extrabold text-ink">
              {mine ? `#${mine.rank}` : "–"}
            </span>
            <span className="flex min-w-0 grow flex-col gap-0.5">
              <span className="font-bold">{copy.you(me.name)}</span>
              <span className="text-sm text-paper/75">
                {mine ? copy.seenAs(me.name, me.is_public) : copy.unranked}
              </span>
            </span>
            {mine && (
              <span className="font-display font-extrabold">
                {mine.points}
                <span className="sr-only"> {copy.pointsLabel}</span>
              </span>
            )}
          </div>

          {standing.data && <DecayNote standing={standing.data} />}

          <Board cityId={me.city.id} period={period} />
        </>
      )}

      <p className="text-[.8125rem] leading-normal text-muted">{copy.rules}</p>
    </div>
  );
}

/** Rank decay: how much of my points count for rank, and when that drops. */
function DecayNote({ standing }: { standing: Standing }) {
  const percent = standing.rank_points_percent;
  const drops = standing.rank_drops_on;
  // An API without rank decay sends neither field.
  if (typeof percent !== "number" || (percent === 100 && !drops)) return null;
  const day = drops ? dayMonth(drops) : null;
  return (
    <p
      role="status"
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        percent < 100
          ? "border-[#ff5b35] text-foreground"
          : "border-line text-muted",
      )}
    >
      {percent < 100 ? copy.decaying(percent, day) : day && copy.dropsOn(day)}
    </p>
  );
}
