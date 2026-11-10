"use client";

import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { adminContent } from "../content";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-card", className)}>
      {children}
    </div>
  );
}

export function AdminButton({
  tone = "plain",
  className,
  ...props
}: React.ComponentProps<"button"> & { tone?: "plain" | "dark" | "danger" }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50",
        tone === "plain" && "border border-line hover:bg-block",
        tone === "dark" && "bg-ink text-paper hover:opacity-90",
        tone === "danger" &&
          "border border-[#ff5b35] text-[#c2410c] hover:bg-[#ff5b35]/10",
        className,
      )}
      {...props}
    />
  );
}

export function Pill({
  children,
  tone = "plain",
}: {
  children: ReactNode;
  tone?: "plain" | "good" | "warn";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tone === "plain" && "bg-block text-muted",
        tone === "good" && "bg-ink text-volt",
        tone === "warn" && "bg-[#ff5b35]/15 text-[#c2410c]",
      )}
    >
      {children}
    </span>
  );
}

/** A table that scrolls sideways on phones instead of squashing. */
export function Table({
  head,
  children,
  empty,
}: {
  head: readonly string[];
  children: ReactNode;
  empty?: boolean;
}) {
  return (
    <Panel className="overflow-x-auto">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="border-b border-line text-xs text-muted uppercase">
          <tr>
            {head.map((label) => (
              <th key={label} scope="col" className="px-4 py-3 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty && (
        <p className="px-4 py-10 text-center text-muted">
          {adminContent.empty}
        </p>
      )}
    </Panel>
  );
}

export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}

export function Pager({
  page,
  pages,
  total,
  onPage,
}: {
  page: number;
  pages: number;
  total: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-sm text-muted">
      <span>{adminContent.totalLabel(total)}</span>
      <span className="flex items-center gap-2">
        <AdminButton disabled={page <= 1} onClick={() => onPage(page - 1)}>
          {adminContent.previous}
        </AdminButton>
        <span className="tabular-nums">
          {page} / {Math.max(pages, 1)}
        </span>
        <AdminButton disabled={page >= pages} onClick={() => onPage(page + 1)}>
          {adminContent.next}
        </AdminButton>
      </span>
    </div>
  );
}

export function LoadState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry: () => void;
}) {
  if (!error) {
    return (
      <p className="py-10 text-center text-muted">{adminContent.loading}</p>
    );
  }
  return (
    <div className="grid justify-items-center gap-3 py-10 text-center">
      <p className="font-semibold">{adminContent.loadFailed}</p>
      <AdminButton onClick={onRetry}>{adminContent.retry}</AdminButton>
    </div>
  );
}

export function SearchBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted">{label}</span>
      <input
        type="search"
        value={value}
        maxLength={60}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-10 rounded-xl border border-line bg-background px-3"
      />
    </label>
  );
}

export function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-10 rounded-xl border border-line bg-background px-3"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export const formatDateTime = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      })
    : adminContent.emptyValue;
