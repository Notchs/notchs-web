"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";

import { EyeIcon, EyeOffIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

type FieldProps = ComponentProps<"input"> & {
  label: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  /** Shown before the input, e.g. a "+91" country code. */
  prefix?: string;
  /** Sits inside the input on the right, e.g. a show-password toggle. */
  action?: ReactNode;
  /** Shown beside the label on the right, e.g. a "Forgot password?" link. */
  labelAction?: ReactNode;
};

/** Labelled 52px text input with optional icon, prefix, hint and error. */
export function Field({
  label,
  hint,
  error,
  icon,
  prefix,
  action,
  labelAction,
  className,
  ...props
}: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
        {labelAction}
      </div>
      <div
        className={cn(
          "flex h-13 items-center rounded-[10px] border bg-card transition-colors duration-150 focus-within:border-foreground",
          error ? "border-unnotched" : "border-line",
        )}
      >
        {icon && (
          <span className="ml-4 size-5 flex-none text-muted *:size-full">
            {icon}
          </span>
        )}
        {prefix && (
          <span className="ml-4 flex-none border-r border-line pr-3 font-medium text-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="h-full min-w-0 flex-1 rounded-[10px] bg-transparent px-4 text-base text-foreground placeholder:text-muted/70 focus:outline-none focus-visible:outline-none"
          {...props}
        />
        {action}
      </div>
      {message && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn(
            "text-[.9375rem] leading-normal",
            error ? "text-unnotched" : "text-muted",
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

/** Password input with an eye button that shows or hides it. */
export function PasswordField(props: Omit<FieldProps, "type" | "action">) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      {...props}
      type={visible ? "text" : "password"}
      action={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="mr-1 flex size-11 flex-none cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground"
        >
          {visible ? (
            <EyeOffIcon className="size-5" />
          ) : (
            <EyeIcon className="size-5" />
          )}
        </button>
      }
    />
  );
}
