import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

import { content } from "../../content";
import { Button } from "./button";
import { Icon } from "./icon";

export function TableWrap({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("relative overflow-x-auto", className)} {...props} />
  );
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <table
      className={cn(
        "w-full min-w-140 border-collapse text-[15px] [&_tbody_tr:last-child_td]:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

const headStyles =
  "h-10 border-b border-line px-4 text-left text-xs font-semibold tracking-[.06em] whitespace-nowrap text-muted uppercase";

export function Th({ className, ...props }: ComponentProps<"th">) {
  return <th scope="col" className={cn(headStyles, className)} {...props} />;
}

export function SortableTh({
  label,
  active,
  ascending,
  onSort,
  className,
}: {
  label: string;
  active: boolean;
  ascending: boolean;
  onSort: () => void;
  className?: string;
}) {
  return (
    <th
      scope="col"
      aria-sort={active ? (ascending ? "ascending" : "descending") : undefined}
      className={cn(headStyles, className)}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 tracking-[inherit] uppercase",
          active && "text-ink",
        )}
      >
        {label}
        <Icon
          name={active ? "chevD" : "sort"}
          size={12}
          className={cn(active && ascending && "rotate-180")}
        />
      </button>
    </th>
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn("h-[52px] border-b border-line px-4", className)}
      {...props}
    />
  );
}

/** A table row that opens details by click or keyboard. */
export function ClickableRow({
  selected,
  onOpen,
  className,
  ...props
}: ComponentProps<"tr"> & { selected: boolean; onOpen: () => void }) {
  return (
    <tr
      tabIndex={0}
      aria-selected={selected}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "cursor-pointer hover:[&>td]:bg-ink/5",
        selected && "[&>td]:bg-block",
        className,
      )}
      {...props}
    />
  );
}

export function Pager({
  page,
  pageCount,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const { pager } = content.common;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-[13px] text-muted">
      <span>
        {total
          ? pager.range(
              page * pageSize + 1,
              Math.min(total, (page + 1) * pageSize),
              total,
            )
          : pager.none}
      </span>
      <span className="flex items-center gap-1.5">
        <Button
          size="sm"
          aria-label={pager.previous}
          disabled={page <= 0}
          onClick={() => onPage(page - 1)}
        >
          <Icon name="chevL" size={16} />
        </Button>
        <span className="px-1.5 font-mono">
          {page + 1} / {pageCount}
        </span>
        <Button
          size="sm"
          aria-label={pager.next}
          disabled={page >= pageCount - 1}
          onClick={() => onPage(page + 1)}
        >
          <Icon name="chevR" size={16} />
        </Button>
      </span>
    </div>
  );
}
