import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

import { content } from "../../content";
import { Icon } from "./icon";

const badgeTones = {
  soft: "bg-block text-ink",
  ink: "bg-ink text-paper",
  line: "bg-transparent shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)]",
  warn: "bg-unnotched/8 text-unnotched",
} as const;

export type BadgeTone = keyof typeof badgeTones;

export function Badge({
  tone = "soft",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-xs font-semibold whitespace-nowrap",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function ExampleTag({ children }: { children?: string }) {
  return (
    <span className="rounded px-1.5 py-0.5 font-mono text-[10px] tracking-[.08em] text-muted uppercase shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)]">
      {children ?? content.common.example}
    </span>
  );
}

export function Delta({ value, unit = "%" }: { value: number; unit?: string }) {
  return (
    <span
      className={cn(
        "rounded-md bg-block px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-ink",
        value < 0 && "bg-unnotched/8 text-unnotched",
      )}
    >
      {value > 0 ? "+" : ""}
      {value}
      {unit}
    </span>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span
      role="img"
      aria-label={content.common.starsLabel(value)}
      className="inline-flex gap-px"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={size}
          filled
          className={star <= Math.round(value) ? "text-ink" : "text-ink/16"}
        />
      ))}
    </span>
  );
}

export function Meter({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded bg-block">
      <i
        className="block h-full rounded bg-ink transition-[width] duration-300 ease-notch"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function ValueMeter({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex justify-between text-sm">
        <span>{label}</span>
        <b className="font-mono font-medium">{value}</b>
      </span>
      <Meter percent={percent} />
    </div>
  );
}

export function InfoTip({ text }: { text: string }) {
  return (
    <span
      tabIndex={0}
      role="note"
      aria-label={text}
      className="group/tip relative inline-grid size-4 cursor-help place-items-center rounded-full text-muted"
    >
      <Icon name="info" size={14} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-[calc(100%+8px)] z-20 hidden w-max max-w-60 rounded-lg bg-ink px-2.5 py-2 text-left text-xs leading-[1.45] font-normal tracking-normal text-paper normal-case group-hover/tip:block group-focus-visible/tip:block"
      >
        {text}
      </span>
    </span>
  );
}

export function KeyValues({
  items,
}: {
  items: { label: string; value: string; mono?: boolean }[];
}) {
  return (
    <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-sm">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-muted">{item.label}</dt>
          <dd
            className={cn(
              "m-0 text-right",
              item.mono ? "font-mono font-medium" : "font-semibold",
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
