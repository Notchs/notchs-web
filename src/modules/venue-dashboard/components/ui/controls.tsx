"use client";

import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { Icon } from "./icon";

export function Chip({
  selected,
  count,
  children,
  className,
  ...props
}: ComponentProps<"button"> & {
  selected: boolean;
  count?: number;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg bg-card px-2.5 text-[13px] font-medium shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)] transition-colors duration-150 hover:bg-block",
        selected && "bg-ink font-semibold text-paper shadow-none hover:bg-ink",
        className,
      )}
      {...props}
    >
      {children}
      {count != null && (
        <span className="font-mono text-[11px] opacity-60">{count}</span>
      )}
    </button>
  );
}

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-block p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "h-9 cursor-pointer rounded-[9px] px-3.5 text-sm font-semibold whitespace-nowrap text-muted transition-colors duration-150",
            option.value === value &&
              "bg-card text-ink shadow-[0_1px_0_rgb(15_15_20/0.16)]",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function SearchField({
  className,
  label,
  ...props
}: Omit<ComponentProps<"input">, "type"> & { label: string }) {
  return (
    <label
      className={cn(
        "flex h-10 min-w-0 items-center gap-2 rounded-[10px] bg-card px-3 shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)] focus-within:shadow-[inset_0_0_0_2px_var(--ink)]",
        className,
      )}
    >
      <Icon name="search" size={16} />
      <input
        type="search"
        aria-label={label}
        placeholder={label}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        {...props}
      />
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-10 flex-none cursor-pointer rounded-xl bg-ink/30 transition-colors duration-150 after:absolute after:top-[3px] after:left-[3px] after:size-[18px] after:rounded-full after:bg-white after:transition-transform after:duration-150 after:ease-notch",
        checked && "bg-ink after:translate-x-4",
      )}
    />
  );
}

const inputStyles =
  "h-[46px] w-full rounded-[10px] bg-card px-3.5 text-[15px] shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)] outline-none focus:shadow-[inset_0_0_0_2px_var(--ink)] disabled:opacity-60 aria-invalid:shadow-[inset_0_0_0_2px_var(--unnotched)]";

type FieldShell = {
  label: string;
  error?: string;
  hint?: string;
  aside?: string;
};

function Field({
  label,
  error,
  hint,
  aside,
  children,
}: FieldShell & { children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="flex justify-between gap-2 text-sm font-semibold">
        {label}
        {aside && <small className="font-normal text-muted">{aside}</small>}
      </span>
      {children}
      {error ? (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-unnotched">
          <Icon name="alert" size={14} />
          {error}
        </span>
      ) : (
        hint && <span className="text-[13px] text-muted">{hint}</span>
      )}
    </label>
  );
}

export function TextField({
  label,
  error,
  hint,
  aside,
  className,
  ...props
}: FieldShell & ComponentProps<"input">) {
  return (
    <Field label={label} error={error} hint={hint} aside={aside}>
      <input
        aria-invalid={error ? true : undefined}
        className={cn(inputStyles, className)}
        {...props}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  error,
  hint,
  aside,
  ...props
}: FieldShell & ComponentProps<"textarea">) {
  return (
    <Field label={label} error={error} hint={hint} aside={aside}>
      <textarea
        aria-invalid={error ? true : undefined}
        className={cn(inputStyles, "h-auto min-h-22 py-3 leading-normal")}
        {...props}
      />
    </Field>
  );
}

export function SelectField({
  label,
  options,
  ...props
}: { label: string; options: readonly string[] } & ComponentProps<"select">) {
  return (
    <Field label={label}>
      <select className={inputStyles} {...props}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </Field>
  );
}

/** Compact filter dropdown without a visible label. */
export function FilterSelect({
  label,
  options,
  className,
  ...props
}: {
  label: string;
  options: readonly { value: string; label: string }[];
} & ComponentProps<"select">) {
  return (
    <select
      aria-label={label}
      className={cn(
        "h-9 cursor-pointer rounded-[10px] bg-card px-2.5 text-[13px] shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)] outline-none focus:shadow-[inset_0_0_0_2px_var(--ink)]",
        className,
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
