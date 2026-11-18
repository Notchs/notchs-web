"use client";

import { useId, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

/** Text inputs, selects and date fields in the passport. */
export const fieldClass =
  "min-h-12 min-w-0 rounded-xl border border-line bg-background px-3 text-[.9375rem] text-foreground";

/** A card with a heading: every block on the profile page. */
export function Section({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col gap-3 rounded-[20px] border border-line bg-card p-4 sm:p-6",
        className,
      )}
    >
      <h2 id={titleId} className="font-display text-lg font-extrabold">
        {title}
      </h2>
      {description && (
        <p className="text-[.9375rem] text-muted">{description}</p>
      )}
      {children}
    </section>
  );
}

const pillVariants = {
  outline: "border-[1.5px] border-foreground",
  solid: "bg-foreground text-background",
  quiet: "px-3 text-muted underline underline-offset-[3px]",
} as const;

/** The passport's round button: outlined, solid or a quiet text button. */
export function PillButton({
  variant = "outline",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof pillVariants }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 font-bold disabled:cursor-default disabled:opacity-60",
        pillVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

/** An on/off switch. Label it with `aria-labelledby` or `aria-label`. */
export function Switch({
  checked,
  className,
  ...props
}: Omit<ComponentProps<"button">, "role" | "type"> & { checked: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "flex h-8 w-14 flex-none cursor-pointer rounded-full p-1 transition-colors disabled:cursor-default disabled:opacity-60",
        checked ? "justify-end bg-foreground" : "justify-start bg-muted/40",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "size-6 rounded-full",
          checked ? "bg-volt" : "bg-background",
        )}
      />
    </button>
  );
}

/** Two or more options side by side, e.g. This month / All time. */
export function Tabs<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="grid gap-1 rounded-full bg-block p-1"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "min-h-11 cursor-pointer rounded-full px-2 text-sm font-bold",
            value === option.value && "bg-card",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** "Remove your photo?" with Yes and Cancel, in place of the button that asked. */
export function ConfirmRow({
  question,
  confirm,
  cancel,
  busy,
  onConfirm,
  onCancel,
}: {
  question: string;
  confirm: string;
  cancel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      role="group"
      aria-label={question}
      className="flex flex-wrap items-center gap-3"
    >
      <p className="font-semibold">{question}</p>
      <PillButton variant="solid" onClick={onConfirm} disabled={busy}>
        {confirm}
      </PillButton>
      <PillButton onClick={onCancel} disabled={busy}>
        {cancel}
      </PillButton>
    </div>
  );
}
