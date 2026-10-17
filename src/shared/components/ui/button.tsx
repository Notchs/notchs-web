import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/shared/lib/cn";

const baseStyles =
  "group clip-notch bg-btn text-btn-fg hover:bg-btn-hover inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] leading-none font-semibold transition-[background-color,scale] duration-150 focus-visible:outline-none active:scale-[.98]";

const sizeStyles = {
  default: "min-h-14 px-7",
  sm: "min-h-9 px-3 text-[.8125rem] sm:min-h-12 sm:px-5 sm:text-[.9375rem]",
} as const;

type ButtonSize = keyof typeof sizeStyles;

type FrameProps = {
  className?: string;
  children: ReactNode;
};

/** Draws the focus ring, which the clipped corner of the button would cut off. */
function ButtonFrame({ className, children }: FrameProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-[10px] has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-foreground",
        className,
      )}
    >
      {children}
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
