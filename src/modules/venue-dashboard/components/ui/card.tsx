import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-[14px] border border-line bg-card p-6",
        className,
      )}
      {...props}
    />
  );
}

/** Always-Ink panel for charts and proof cards. */
export function InkCard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-[14px] bg-ink p-6 text-paper",
        className,
      )}
      {...props}
    />
  );
}

export function SectionHead({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="m-0 text-base font-semibold">{title}</h2>
      {children}
    </div>
  );
}

export function Overline({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-[13px] leading-none font-semibold tracking-[.08em] text-muted uppercase",
        className,
      )}
      {...props}
    />
  );
}

/** Large heading inside a panel. Unbounded, as for all display type. */
export function PanelTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "m-0 font-display text-2xl leading-[1.15] tracking-[-.02em]",
        className,
      )}
      {...props}
    />
  );
}

const gridColumns = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 wide:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 wide:grid-cols-5",
} as const;

export function Grid({
  columns,
  className,
  ...props
}: ComponentProps<"div"> & { columns: keyof typeof gridColumns }) {
  return (
    <div
      className={cn("grid gap-4", gridColumns[columns], className)}
      {...props}
    />
  );
}

/** Main column plus a side column; stacks on smaller screens. */
export function SideGrid({
  side = "right",
  width = "320px",
  className,
  ...props
}: ComponentProps<"div"> & {
  side?: "left" | "right";
  width?: "320px" | "400px";
}) {
  const columns = {
    "right-320px": "wide:grid-cols-[minmax(0,1fr)_320px]",
    "right-400px": "wide:grid-cols-[minmax(0,1fr)_400px]",
    "left-320px": "wide:grid-cols-[320px_minmax(0,1fr)]",
    "left-400px": "wide:grid-cols-[400px_minmax(0,1fr)]",
  } as const;
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5",
        columns[`${side}-${width}`],
        className,
      )}
      {...props}
    />
  );
}
