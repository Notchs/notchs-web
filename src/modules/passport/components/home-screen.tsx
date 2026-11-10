"use client";

import Link from "next/link";

import { routes } from "@/config/routes";
import { ArrowRightIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

import { homeContent as copy, notchRowContent } from "../content";
import { getNotches, getReward, getStanding, type Reward } from "../lib/api";
import {
  dayMonth,
  firstName,
  monthYear,
  nicheLabel,
  notchNumber,
  ordinal,
} from "../lib/format";
import { useLoad } from "../lib/use-load";
import { useMe } from "./me-context";
import { NotchTile } from "./notch-tile";
import { LoadError, Loading } from "./states";
import { VisibilitySwitch } from "./visibility-switch";

const RECENT = 3;

function Totals() {
  const { me } = useMe();
  const standing = useLoad(getStanding);
  const month = standing.data?.month;
  const city = me.city?.name;
  const totals = [
    { label: copy.totals.notchs, value: me.totals.notches },
    { label: copy.totals.places, value: me.totals.places },
    { label: copy.totals.points, value: me.totals.points, accent: true },
  ];

  return (
    <section
      aria-label={copy.totals.label}
      className="flex flex-col gap-6 rounded-[28px] bg-panel px-6 pt-9 pb-6 text-paper notch notch-lg md:px-8"
    >
      <dl className="grid grid-cols-3 gap-4">
        {totals.map((item) => (
          <div key={item.label} className="flex flex-col-reverse gap-1.5">
            <dt className="text-sm text-paper/75 md:text-[.9375rem]">
              {item.label}
            </dt>
            <dd
              className={cn(
                "font-display text-[2.125rem] leading-none font-extrabold md:text-[3.5rem]",
                item.accent && "text-volt",
              )}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="h-px bg-paper/15" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        {month && city ? (
          <p className="flex items-center gap-3 text-[.9375rem] md:text-[1.0625rem]">
            <span className="rounded-2xl bg-volt px-3.5 py-2 font-display text-xl font-extrabold text-ink md:text-[1.75rem]">
              #{month.rank}
            </span>
            {copy.rank(city)}
          </p>
        ) : (
          <p className="max-w-[34ch] text-[.9375rem] text-paper/75">
            {standing.loading ? " " : copy.unranked}
          </p>
        )}
        <Link
          href={routes.passportLeaderboard}
          className="group flex min-h-11 items-center gap-2 rounded-full border border-paper/30 px-5 text-[.9375rem] font-semibold"
        >
          {copy.seeLeaderboard}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}

function RewardCard({ reward }: { reward: Reward }) {
  const done = Math.min(reward.new_cafes, reward.needed);
  return (
    <section
      aria-labelledby="reward-title"
      className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-6"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-[.14em] text-muted uppercase">
          {copy.reward.kicker}
        </span>
        <h2
          id="reward-title"
          className="font-display text-[1.375rem] font-extrabold tracking-[-.02em] md:text-[1.75rem]"
        >
          {copy.reward.title(reward.value_rupees)}
        </h2>
        <p className="text-[.9375rem] text-muted">
          {copy.reward.rule(reward.needed)}
        </p>
      </div>
      <div
        role="img"
        aria-label={copy.reward.progressLabel(done, reward.needed)}
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${reward.needed}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: reward.needed }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 rounded-full",
              i < done ? "bg-[#2f5bd3]" : "bg-block",
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-[.9375rem]">
        <span className="font-bold">
          {copy.reward.progress(done, reward.needed)}
        </span>
        <span className="text-muted">
          {reward.eligible
            ? copy.reward.unlocked
            : copy.reward.toGo(reward.needed - done)}
        </span>
      </div>
    </section>
  );
}

function Reward() {
  const reward = useLoad(getReward);
  if (reward.data) return <RewardCard reward={reward.data} />;
  if (reward.error) return <LoadError onRetry={reward.reload} />;
  return <Loading className="min-h-48 py-6 text-muted" />;
}

function Recent() {
  const notches = useLoad(() => getNotches(1, RECENT));
  const items = notches.data?.items;

  return (
    <section aria-labelledby="recent-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 id="recent-title" className="text-lg font-bold">
          {copy.recent.title}
        </h2>
        <Link
          href={routes.passportNotchs}
          className="flex min-h-11 items-center text-[.9375rem] font-semibold"
        >
          {copy.recent.seeAll}
        </Link>
      </div>
      {notches.error ? (
        <LoadError onRetry={notches.reload} />
      ) : !items ? (
        <Loading />
      ) : items.length === 0 ? (
        <p className="text-muted">{copy.recent.empty}</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((notch) => (
            <li key={notch.notch_no}>
              <Link
                href={routes.passportNotchs}
                className="flex items-center gap-4 rounded-[20px] border border-line bg-card px-4 py-3.5"
              >
                <NotchTile colour={notch.colour} />
                <span className="flex min-w-0 grow flex-col gap-0.5">
                  <span className="font-bold">{notch.venue_name}</span>
                  <span className="text-sm text-muted">
                    {notchRowContent.meta(
                      nicheLabel(notch.niche),
                      notchNumber(notch.notch_no),
                      ordinal(notch.visit_no_at_venue),
                      dayMonth(notch.visit_date),
                    )}
                  </span>
                </span>
                <span className="font-display font-extrabold">
                  +{notch.points}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Passport home: totals, rank, this month's reward and the latest Notchs. */
export function HomeScreen() {
  const { me } = useMe();
  const details = [
    `@${me.handle}`,
    me.city?.name,
    copy.memberSince(monthYear(me.member_since)),
    me.founding_member_no ? copy.foundingMember(me.founding_member_no) : null,
  ].filter(Boolean);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-6">
        <section className="flex flex-col gap-3">
          <p className="flex items-center gap-3.5 text-xs font-semibold tracking-[.18em] text-muted uppercase before:h-px before:w-8 before:bg-current">
            {copy.kicker}
          </p>
          <h1 className="font-display text-[2.5rem] leading-[1.02] font-extrabold tracking-[-.03em] md:text-[4.5rem]">
            {copy.hello(firstName(me.name))}
          </h1>
          <p className="text-[.9375rem] text-muted md:text-[1.0625rem]">
            {details.join(" · ")}
          </p>
        </section>
        <Totals />
        <VisibilitySwitch />
      </div>
      <div className="flex min-w-0 flex-col gap-6">
        <Reward />
        <Recent />
        <section className="flex flex-col gap-2 rounded-3xl border-[1.5px] border-dashed border-line p-6">
          <h2 className="font-bold">{copy.next.title}</h2>
          <p className="text-[.9375rem] leading-normal text-muted">
            {copy.next.body}
          </p>
        </section>
      </div>
    </div>
  );
}
