import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/shared/lib/cn";

/** The text and layout of the button; the colour is the frame's. */
const baseStyles =
  "group inline-flex w-full cursor-pointer items-center justify-center gap-2.5 leading-none font-semibold text-btn-fg focus-visible:outline-none";

const sizeStyles = {
  default: "min-h-14 px-7",
  sm: "min-h-9 px-3.5 text-[.8125rem] sm:min-h-10 sm:px-4 sm:text-sm",
} as const;

type ButtonSize = keyof typeof sizeStyles;

type FrameProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Draws the focus ring and the button's surface: solid in the theme's button
 * colour (Ink in light, Volt in dark) with the Notchs corner cut.
 */
function ButtonFrame({ className, children }: FrameProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-[10px] has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-foreground",
        className,
      )}
    >
      <div className="inline-flex w-full rounded-[10px] bg-btn transition-[background-color] duration-150 clip-notch hover:bg-btn-hover">
        {children}
      </div>
    </span>
  );
}

export function Button({
  className,
  size = "default",
  type = "button",
  ...props
}: ComponentProps<"button"> & { size?: ButtonSize }) {
  return (
    <ButtonFrame className={className}>
      <button
        type={type}
        className={cn(baseStyles, sizeStyles[size])}
        {...props}
      />
    </ButtonFrame>
  );
}

/** A link with the same look as `Button`. */
export function ButtonLink({
  className,
  size = "default",
  ...props
}: ComponentProps<typeof Link> & { size?: ButtonSize }) {
  return (
    <ButtonFrame className={className}>
      <Link className={cn(baseStyles, sizeStyles[size])} {...props} />
    </ButtonFrame>
  );
}
