"use client";

import { content } from "../../content";
import { useDateRange } from "../../hooks/use-date-range";
import { useSession } from "../../hooks/use-session";
import { Icon } from "../ui/icon";
import { MenuPopover, menuItemStyles } from "./menu-popover";

/** The dashboard's date range and comparison switch. */
export function RangePicker() {
  const { range, setRange, compare, setCompare } = useDateRange();
  const ranges = useSession().data?.ranges ?? [];
  const current = ranges.find((option) => option.key === range);

  return (
    <MenuPopover
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={content.shell.rangeLabel(current?.label ?? "")}
          onClick={toggle}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] bg-card px-2.5 text-sm font-semibold whitespace-nowrap shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)] sm:px-3"
        >
          <Icon name="calendar" size={16} />
          <span className="hidden sm:inline">{current?.label}</span>
          <small className="hidden font-normal text-muted wide:inline">
            {compare
              ? content.shell.versusPrevious
              : content.shell.noComparison}
          </small>
          <Icon name="chevD" size={14} />
        </button>
      )}
    >
      {(close) => (
        <>
          {ranges.map((option) => (
            <button
              key={option.key}
              type="button"
              role="menuitemradio"
              aria-checked={option.key === range}
              onClick={() => {
                setRange(option.key);
                close();
              }}
              className={menuItemStyles}
            >
              {option.label}
              {option.key === range && (
                <Icon name="check" size={16} className="ml-auto" />
              )}
            </button>
          ))}
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={compare}
            onClick={() => setCompare(!compare)}
            className={menuItemStyles}
          >
            <Icon name="layers" size={16} />
            {content.shell.compare}
            {compare && <Icon name="check" size={16} className="ml-auto" />}
          </button>
          <span className="flex items-center gap-2.5 p-2.5 text-sm text-muted">
            <Icon name="calendar" size={16} />
            {content.shell.customRange}
          </span>
        </>
      )}
    </MenuPopover>
  );
}
