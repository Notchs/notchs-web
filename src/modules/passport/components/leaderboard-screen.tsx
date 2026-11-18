"use client";

import { useState } from "react";
import Link from "next/link";

import { routes } from "@/config/routes";
import { cn } from "@/shared/lib/cn";

import { leaderboardContent as copy, shellContent } from "../content";
import {
  getLeaderboard,
  getStanding,
  type Leaderboard,
  type LeaderboardRow,
  type Me,
  type MyRank,
  type Period,
  type Standing,
} from "../lib/api";
import { dayMonth, initials } from "../lib/format";
import { useLoad } from "../lib/use-load";
import { useMe } from "./me-context";
import { LoadError, Loading } from "./states";
import { Tabs } from "./ui";
import { VisibilitySwitch } from "./visibility-switch";

const periods: Period[] = ["month", "all"];

/** Where "See me in the list" jumps to. */
const ME_ROW = "me-row";

/** One leaderboard row, ready to draw. */
type Row = LeaderboardRow & { isMe: boolean };

/**
 * Marks my row. The API sends my handle when my name is shown; when it is
 * hidden, my row is the first hidden one with my rank and points.
 */
function markMe(rows: LeaderboardRow[], me: Me, mine: MyRank | null): Row[] {
  let index = rows.findIndex((row) => row.handle === me.handle);
  if (index < 0 && mine) {
    index = rows.findIndex(
      (row) =>
        !row.name && row.rank === mine.rank && row.points === mine.points,
    );
  }
  return rows.map((row, i) => ({ ...row, isMe: i === index }));
}

/** The closest row above me: the points I need for the next rank. */
function nextAbove(rows: Row[], mine: MyRank) {
  const above = rows.filter((row) => !row.isMe && row.points > mine.points);
  return above.length
    ? above.reduce((a, b) => (b.points < a.points ? b : a))
    : null;
}

function displayName(row: Row, me: Me) {
  if (row.isMe) return me.is_public && me.name ? me.name : copy.hidden;
  return row.name ?? copy.hidden;
}

function subLine(row: Row) {
  if (row.isMe) return copy.youShort;
  if (row.handle) return `@${row.handle}`;
  return row.name ? "" : copy.nameHidden;
}

function RowAvatar({
  row,
  me,
  className,
}: {
  row: Row;
  me: Me;
  className?: string;
}) {
  const named = row.isMe ? me.is_public && Boolean(me.name) : !!row.name;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid flex-none place-items-center rounded-full font-bold",
        row.isMe
          ? "bg-ink text-volt"
          : named
            ? "bg-block text-foreground"
            : "bg-block text-muted",
        className,
      )}
    >
      {named ? initials(row.isMe ? me.name : row.name) : "N"}
    </span>
  );
}

/** My rank, points and how far the next rank is. */
function StandingCard({
  me,
  city,
  period,
  mine,
  next,
  inList,
  emptyMonth,
}: {
  me: Me;
  city: string;
  period: Period;
  mine: MyRank | null;
  next: Row | null;
  inList: boolean;
  emptyMonth: boolean;
}) {
  const seenAs = copy.seenAs(me.name, me.is_public);
  const sub = mine
    ? inList
      ? seenAs
      : copy.belowTop(seenAs)
    : emptyMonth
      ? copy.nobodyYet
      : copy.unranked;

  return (
    <section
      aria-label={copy.standingLabel}
      className="flex flex-col gap-3.5 rounded-[20px] bg-panel p-4 text-paper sm:gap-4.5 sm:rounded-3xl sm:p-5.5"
    >
      <div className="hidden items-center justify-between gap-3 text-[.8125rem] text-paper/75 sm:flex">
        <span className="font-semibold tracking-[.14em] uppercase">
          {copy.standingPeriod(period, city)}
        </span>
        <span className="truncate">
          {copy.you(me.is_public ? me.name : null)}
        </span>
      </div>

      <div className="flex items-center gap-3.5 sm:items-end sm:justify-between">
        <span className="min-w-7 rounded-xl bg-volt px-3 py-2 text-center font-display text-lg font-extrabold text-ink sm:rounded-2xl sm:px-4 sm:py-3 sm:text-[2.5rem] sm:leading-none">
          {mine ? `#${mine.rank}` : "–"}
        </span>
        <span className="flex min-w-0 grow flex-col gap-0.5 sm:hidden">
          <span className="font-bold">
            {copy.you(me.is_public ? me.name : null)}
          </span>
          <span className="text-[.8125rem] text-paper/75">{sub}</span>
        </span>
        {mine && (
          <span className="flex flex-col items-end">
            <span className="font-display text-lg font-extrabold sm:text-[2rem] sm:leading-none">
              {mine.points}
            </span>
            <span className="text-[.6875rem] text-paper/75 sm:text-[.8125rem]">
              {copy.pointsLabel}
            </span>
          </span>
        )}
      </div>

      <p className="hidden text-sm leading-[1.45] text-paper/75 sm:block">
        {sub}
      </p>

      {mine && next && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[.8125rem] sm:text-sm">
            <span className="font-semibold">
              {copy.toNext(next.points - mine.points, next.rank)}
            </span>
            <span className="text-paper/75">
              {copy.nextPoints(next.points)}
            </span>
          </div>
          <div
            role="img"
            aria-label={copy.toNext(next.points - mine.points, next.rank)}
            className="h-2 overflow-hidden rounded-full bg-paper/15"
          >
            <div
              className="h-2 rounded-full bg-volt"
              style={{
                width: `${Math.round((mine.points / next.points) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {inList && (
        <a
          href={`#${ME_ROW}`}
          className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-bold text-volt"
        >
          {copy.seeMe}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            aria-hidden="true"
            className="size-4"
          >
            <path d="M12 5v14M6 13l6 6 6-6" className="sm:hidden" />
            <path d="M5 12h14M13 6l6 6-6 6" className="hidden sm:block" />
          </svg>
        </a>
      )}
    </section>
  );
}

/** The top three as a podium: 2nd, 1st, 3rd. */
function Podium({ rows, me }: { rows: Row[]; me: Me }) {
  const places = [
    { row: rows[1], height: "h-20 sm:h-26" },
    { row: rows[0], height: "h-26 sm:h-33", first: true },
    { row: rows[2], height: "h-16 sm:h-21" },
  ];
  return (
    <ol
      aria-label={copy.podium}
      className="grid grid-cols-3 items-end gap-2 sm:gap-3.5 sm:pt-2"
    >
      {places.map(({ row, height, first }) => (
        <li
          key={row.rank + (row.handle ?? "") + (first ? "1" : "")}
          id={row.isMe ? ME_ROW : undefined}
          className="flex min-w-0 scroll-mt-28 flex-col items-center gap-2 sm:gap-2.5"
        >
          <RowAvatar
            row={row}
            me={me}
            className="size-12 text-[.9375rem] sm:size-16 sm:text-xl"
          />
          <span className="flex max-w-full flex-col items-center">
            <span className="max-w-full truncate text-[.8125rem] font-bold sm:text-[.9375rem]">
              {row.isMe ? copy.youShort : displayName(row, me)}
            </span>
            {!row.isMe && subLine(row) && (
              <span className="hidden max-w-full truncate text-[.8125rem] text-muted sm:block">
                {subLine(row)}
              </span>
            )}
          </span>
          <div
            className={cn(
              "flex w-full flex-col items-center gap-0.5 rounded-t-[14px] rounded-b-md pt-3 sm:gap-1 sm:rounded-t-[18px] sm:rounded-b-lg sm:pt-4",
              height,
              first ? "bg-volt text-ink" : "bg-panel text-paper",
            )}
          >
            <span className="font-display text-xl font-extrabold sm:text-[1.75rem]">
              #{row.rank}
            </span>
            <span className="text-xs font-semibold sm:text-sm">
              {copy.podiumPoints(row.points)}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Everyone after the podium (or everyone, under three people). */
function RankList({ rows, me }: { rows: Row[]; me: Me }) {
  const columns = "sm:grid sm:grid-cols-[64px_minmax(0,1fr)_96px] sm:gap-3";
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-card sm:rounded-3xl">
      <div
        aria-hidden="true"
        className={cn(
          "hidden border-b border-line px-5 py-3 text-xs font-bold tracking-[.12em] text-muted uppercase",
          columns,
        )}
      >
        <span>{copy.columns.rank}</span>
        <span>{copy.columns.name}</span>
        <span className="text-right">{copy.columns.points}</span>
      </div>
      <ol className="divide-y divide-line">
        {rows.map((row, i) => (
          <li
            key={`${row.rank}-${row.handle ?? i}`}
            id={row.isMe ? ME_ROW : undefined}
            className={cn(
              "flex min-h-14 scroll-mt-28 items-center gap-3 px-3.5 py-2.5 sm:min-h-15 sm:px-5",
              columns,
              row.isMe && "bg-volt text-ink",
            )}
          >
            <span className="w-9 font-display text-sm font-extrabold sm:w-auto sm:text-base">
              #{row.rank}
            </span>
            <span className="flex min-w-0 grow items-center gap-3">
              <RowAvatar
                row={row}
                me={me}
                className="size-9 text-[.8125rem] sm:size-9.5"
              />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[.9375rem] font-semibold">
                  {displayName(row, me)}
                </span>
                {subLine(row) && (
                  <span
                    className={cn(
                      "text-xs",
                      row.isMe ? "text-ink" : "text-muted",
                    )}
                  >
                    {subLine(row)}
                  </span>
                )}
              </span>
            </span>
            <span className="font-display text-[.9375rem] font-extrabold sm:text-right sm:text-base">
              {row.points}
              <span className="sr-only"> {copy.pointsLabel}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function HowRanking({ className }: { className?: string }) {
  return (
    <details className={cn("rounded-2xl border border-line px-4", className)}>
      <summary className="flex min-h-12 cursor-pointer items-center text-sm font-bold">
        {copy.howTitle}
      </summary>
      <p className="mb-3.5 text-[.8125rem] leading-[1.55] text-muted">
        {copy.rules}
      </p>
    </details>
  );
}

function Board({
  board,
  rows,
  me,
  city,
  period,
}: {
  board: Leaderboard;
  rows: Row[];
  me: Me;
  city: string;
  period: Period;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-1.5 rounded-[20px] border border-dashed border-line px-5 py-6 text-center sm:gap-2 sm:rounded-3xl sm:py-12">
        <p className="font-bold sm:text-lg">{copy.empty}</p>
        {period === "month" && (
          <p className="text-sm text-muted sm:text-[.9375rem]">
            {copy.firstOfMonth}
          </p>
        )}
      </div>
    );
  }
  const podium = rows.length >= 3;
  return (
    <>
      {podium && <Podium rows={rows} me={me} />}
      <RankList rows={podium ? rows.slice(3) : rows} me={me} />
      <p className="text-center text-[.8125rem] text-muted sm:text-left">
        {copy.count(board.total_ranked.toLocaleString("en-IN"), city, period)}
      </p>
    </>
  );
}

/** The home city's leaderboard: my rank on the left, the top 50 on the right. */
export function LeaderboardScreen() {
  const { me } = useMe();
  const [period, setPeriod] = useState<Period>("month");
  const city = me.city;
  const standing = useLoad(getStanding, me.is_public ? "shown" : "hidden");
  const board = useLoad<Leaderboard | null>(
    () => (city ? getLeaderboard(city.id, period) : Promise.resolve(null)),
    `${city?.id}|${period}`,
  );
  const mine =
    standing.data?.[period === "month" ? "month" : "all_time"] ?? null;
  const rows = board.data ? markMe(board.data.rows, me, mine) : [];
  const inList = rows.some((row) => row.isMe);
  const next = mine && inList ? nextAbove(rows, mine) : null;

  return (
    <div className="flex flex-col gap-4 sm:gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2.5">
          <p className="hidden items-center gap-3 text-xs font-semibold tracking-[.18em] text-muted uppercase before:h-px before:w-8 before:bg-current sm:flex">
            {copy.kicker}
          </p>
          <h1 className="font-display text-[2rem] leading-[1.05] font-extrabold tracking-[-.03em] sm:text-5xl sm:leading-none">
            {city?.name ?? shellContent.nav.leaderboard}
          </h1>
        </div>
        {city && (
          <div className="sm:w-75 sm:max-w-full">
            <Tabs
              label={copy.periods.label}
              options={periods.map((p) => ({
                value: p,
                label: copy.periods[p],
              }))}
              value={period}
              onChange={setPeriod}
            />
          </div>
        )}
      </div>

      {!city ? (
        <div className="flex max-w-140 flex-col gap-3.5 rounded-[20px] border border-line bg-card p-5 sm:p-6">
          <p className="leading-normal sm:text-[1.0625rem]">{copy.noCity}</p>
          <Link
            href={routes.passportProfile}
            className="inline-flex min-h-11 items-center self-start rounded-full bg-btn px-5 text-[.9375rem] font-bold text-btn-fg"
          >
            {copy.goProfile}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-7">
          <div className="flex min-w-0 flex-col gap-4 sm:max-w-100 sm:flex-[1_1_320px]">
            {board.data || board.error ? (
              <StandingCard
                me={me}
                city={city.name}
                period={period}
                mine={mine}
                next={next}
                inList={inList}
                emptyMonth={period === "month" && rows.length === 0}
              />
            ) : (
              <Loading />
            )}
            {standing.data && <DecayNote standing={standing.data} />}
            <VisibilitySwitch className="rounded-[20px] px-4 py-3.5 sm:p-4" />
            <HowRanking className="hidden sm:block" />
          </div>

          <div className="flex min-w-0 flex-col gap-4 sm:flex-[999_1_560px]">
            {board.error ? (
              <LoadError onRetry={board.reload} />
            ) : !board.data ? (
              <Loading />
            ) : (
              <Board
                board={board.data}
                rows={rows}
                me={me}
                city={city.name}
                period={period}
              />
            )}
            <HowRanking className="sm:hidden" />
          </div>
        </div>
      )}
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
        "rounded-2xl border px-4 py-3 text-sm leading-normal sm:py-3.5",
        percent < 100
          ? "border-[#ff5b35] text-foreground"
          : "border-line text-muted",
      )}
    >
      {percent < 100 ? copy.decaying(percent, day) : day && copy.dropsOn(day)}
    </p>
  );
}
