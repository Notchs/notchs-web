import type { CSSProperties } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import { cn } from "@/shared/lib/cn";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import { promotionContent, yourWeekContent } from "../content";
import { venueIcons } from "./icons";
import { Phone } from "./phone";
import { SectionHeading } from "./section-heading";

const { voice, chart, benefits } = yourWeekContent;
const { story } = promotionContent;

/** Bar heights of the voice note's waveform, % of its height. */
const WAVE = [
  30, 55, 40, 80, 60, 95, 45, 70, 35, 85, 55, 100, 40, 65, 30, 75, 50, 90, 35,
  55, 25, 45,
];

function VoiceNote() {
  return (
    <Phone label={voice.label} className="max-w-[300px]">
      <div className="flex h-full flex-col gap-3 bg-[#efeae2] text-[#111b21]">
        <div className="flex items-center gap-2 bg-white px-3 pt-5 pb-2.5 text-sm font-semibold">
          <span className="grid size-7 place-items-center rounded-full bg-ink text-volt">
            <NotchGlyph className="size-3.5" />
          </span>
          {voice.sender}
          <span className="ml-auto text-xs font-normal">{voice.time}</span>
        </div>
        <div className="mx-3 rounded-lg rounded-tl-none bg-white p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 flex-none place-items-center rounded-full bg-[#00796b] text-white">
              <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            </span>
            <span className="flex h-8 flex-1 items-center gap-[2px]">
              {WAVE.map((height, index) => (
                <span
                  key={index}
                  className="venues-wave w-full rounded-full bg-[#00796b]"
                  style={
                    { height: `${height}%`, "--i": index } as CSSProperties
                  }
                />
              ))}
            </span>
          </div>
          <p className="mt-2 text-xs">{voice.length}</p>
          <p className="mt-2 text-sm leading-snug italic">{voice.transcript}</p>
        </div>
        <p className="mx-3 rounded-lg bg-white p-3 text-sm leading-snug">
          🎧 {voice.note}
        </p>
      </div>
    </Phone>
  );
}

function Donut() {
  return (
    <div className="relative mx-auto size-40 flex-none sm:size-44">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          strokeWidth="14"
          className="stroke-stone/60"
        />
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          strokeWidth="14"
          pathLength={chart.visitors}
          strokeDasharray={`${chart.firstTimers} ${chart.visitors}`}
          className="venues-donut stroke-volt"
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <p className="font-display text-4xl leading-none font-extrabold">
          {chart.visitors}
        </p>
        <p className="mt-1 text-xs text-stone-light">{chart.visitorsLabel}</p>
      </div>
    </div>
  );
}

function Legend() {
  const rows = [
    { value: chart.firstTimers, label: chart.firstTimersLabel, dot: "bg-volt" },
    { value: chart.cameBack, label: chart.cameBackLabel, dot: "bg-stone/60" },
    { value: chart.regulars, label: chart.regularsLabel, dot: "bg-paper" },
  ];
  return (
    <ul className="grid flex-1 gap-3">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center gap-3">
          <span className={cn("size-3 flex-none rounded-[4px]", row.dot)} />
          <span className="w-11 font-display text-2xl font-extrabold">
            {row.value}
          </span>
          <span className="text-[.9375rem] text-stone-light">{row.label}</span>
        </li>
      ))}
    </ul>
  );
}

function DayBars() {
  const most = Math.max(...chart.days.map((day) => day.visitors));
  return (
    <ul className="mt-8 grid h-44 grid-cols-7 gap-2 border-b border-paper/20">
      {chart.days.map((day, index) => {
        const busiest = day.name === chart.busiestDay;
        return (
          <li
            key={day.name}
            title={`${day.name}: ${day.visitors}`}
            className="flex flex-col items-center justify-end"
          >
            {busiest && (
              <span className="mb-1 text-xs font-semibold">{day.visitors}</span>
            )}
            <span
              className={cn(
                "venues-grow w-full rounded-t-[4px]",
                busiest ? "bg-volt" : "bg-stone/60",
              )}
              style={
                {
                  height: `${(day.visitors / most) * 85}%`,
                  "--i": index,
                } as CSSProperties
              }
            />
          </li>
        );
      })}
    </ul>
  );
}

function WeekPanel() {
  const dayTotals = chart.days
    .map((day) => `${day.name} ${day.visitors}`)
    .join(", ");
  return (
    <div
      {...INK_GROUND}
      className="rounded-3xl bg-ink p-6 tone-ink text-paper surface-ink sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl font-extrabold tracking-[-.02em]">
          {chart.title}
        </h3>
        <p className="text-xs font-semibold tracking-[.14em] text-stone-light uppercase">
          {chart.range}
        </p>
      </div>
      <div
        role="img"
        aria-label={`Example chart with sample numbers: ${chart.visitors} visitors, ${chart.firstTimers} first-timers, ${chart.cameBack} came back, ${chart.regulars} new Regulars. By day: ${dayTotals}.`}
      >
        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <Donut />
          <Legend />
        </div>
        <DayBars />
        <div className="mt-2 grid grid-cols-7 gap-2 text-center text-xs text-stone-light">
          {chart.days.map((day) => (
            <span key={day.name}>{day.day}</span>
          ))}
        </div>
      </div>
      <p className="mt-5 text-[.9375rem] text-stone-light">
        {chart.busiestLabel}{" "}
        <strong className="font-semibold text-volt">{chart.busiest}</strong> ·{" "}
        {chart.slowest}
      </p>
    </div>
  );
}

function Benefits() {
  return (
    <GlassGroup self={false} merge={16} className="mt-6 reveal">
      <div role="list" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((item) => {
          const Icon = venueIcons[item.icon];
          return (
            <GlassShape
              key={item.title}
              role="listitem"
              radius={16}
              className="p-5 pt-6"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-ink text-volt">
                <Icon className="size-5.5" />
              </span>
              <h3 className="mt-4 font-display text-lg leading-tight font-extrabold tracking-[-.02em]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-base leading-relaxed text-muted">
                {item.body}
              </p>
            </GlassShape>
          );
        })}
      </div>
    </GlassGroup>
  );
}

function Promotion() {
  return (
    <div
      {...INK_GROUND}
      className="mt-6 grid reveal items-center gap-8 rounded-3xl bg-ink p-6 tone-ink text-paper surface-ink sm:p-10 lg:grid-cols-[1fr_minmax(0,340px)] lg:gap-16 lg:p-14"
    >
      <SectionHeading
        kicker={promotionContent.kicker}
        title={promotionContent.title}
        description={promotionContent.body}
        onInk
      />
      <div className="venues-float rounded-2xl border border-line bg-graphite p-4">
        <p className="flex items-center justify-between gap-3 text-sm text-stone-light">
          {story.author}
          <span className="text-xs font-semibold tracking-[.14em] text-paper uppercase">
            {story.example}
          </span>
        </p>
        <div className="mt-16 rounded-xl bg-ink p-4 notch">
          <p className="mt-2 text-xs font-semibold tracking-[.1em] text-stone-light uppercase">
            {story.title}
          </p>
          <p className="mt-1 font-display text-4xl font-extrabold text-volt">
            {story.count}
          </p>
          <p className="mt-1 text-sm text-stone-light">{story.line}</p>
        </div>
      </div>
    </div>
  );
}

/** Pitch page two: the Monday voice note, the week's numbers and the benefits. */
export function YourWeek() {
  return (
    <>
      <div className="mb-10 flex reveal flex-wrap items-end justify-between gap-4">
        <SectionHeading
          kicker={yourWeekContent.kicker}
          title={yourWeekContent.title}
        />
        <p className="text-xs font-semibold tracking-[.14em] text-unnotched uppercase">
          {yourWeekContent.example}
        </p>
      </div>
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
        <div className="reveal">
          <VoiceNote />
        </div>
        <div className="reveal">
          <WeekPanel />
        </div>
      </div>
      <Benefits />
      <Promotion />
    </>
  );
}
