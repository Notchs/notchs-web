"use client";

import { cn } from "@/shared/lib/cn";

const LENGTH = 6;

type CodeInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

/**
 * Six boxes over one real input, so paste, autofill from the email app and
 * screen readers all work as with a normal field.
 */
export function CodeInput({
  id,
  value,
  onChange,
  invalid,
  describedBy,
}: CodeInputProps) {
  const active = Math.min(value.length, LENGTH - 1);

  return (
    <div className="group relative grid grid-cols-6 gap-2 sm:gap-2.5">
      {Array.from({ length: LENGTH }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "flex h-14 items-center justify-center rounded-[10px] border-2 bg-card font-display text-2xl transition-colors duration-150 sm:h-16 sm:text-[1.75rem]",
            invalid
              ? "border-unnotched"
              : i === active
                ? "border-line group-focus-within:border-foreground"
                : "border-line",
          )}
        >
          {value[i] ?? ""}
        </span>
      ))}
      <input
        id={id}
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, LENGTH))
        }
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={LENGTH}
        autoFocus
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="absolute inset-0 size-full cursor-text text-base opacity-0"
      />
    </div>
  );
}
