import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

const baseStyles =
  "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:pointer-events-none disabled:opacity-50";

const variantStyles = {
  primary: "bg-foreground text-background hover:bg-foreground/85",
  outline: "border border-foreground/15 hover:bg-foreground/5",
} as const;

export type ButtonVariant = keyof typeof variantStyles;

/** Button class names, exported so links can share the exact same look. */
export function buttonStyles(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(baseStyles, variantStyles[variant], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
};

export function Button({
  variant,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, className)}
      {...props}
    />
  );
}
