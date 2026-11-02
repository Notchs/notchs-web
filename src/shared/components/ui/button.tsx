import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

import { GlassGroup } from "@/shared/components/glass/glass-group";
import { cn } from "@/shared/lib/cn";

/** The text and layout of the button; the glass behind it is the group's. */
const baseStyles =
  "group inline-flex w-full cursor-pointer items-center justify-center gap-2.5 leading-none font-semibold text-btn-fg focus-visible:outline-none";

const sizeStyles = {
  default: "min-h-14 px-7",
  sm: "min-h-9 px-3.5 text-[.8125rem] sm:min-h-10 sm:px-4 sm:text-sm",
} as const;

type ButtonSize = keyof typeof sizeStyles;

/** Size of the Notchs corner cut on buttons, px (the cut is 60 degrees). */
const BUTTON_NOTCH = 14;

type FrameProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Draws the focus ring and the button's glass: a slab of the theme's button
 * colour (Ink in light, Volt in dark) with the Notchs corner cut, which
 * bends the page grid at its rim, catches the light and presses in under
 * the pointer. Until the glass draws, or without WebGL, the button is solid.
 */
function ButtonFrame({ className, children }: FrameProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-[10px] has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-foreground",
        className,
      )}
    >
      <GlassGroup
        radius={10}
        notch={BUTTON_NOTCH}
        pressable
        tintVar="--btn"
        tintAmount={0.97}
        rimShare={0.95}
        bezel={7}
        lensTint={0}
        frost={0.2}
        margin={16}
        fallback="own"
        className="inline-flex w-full rounded-[10px] transition-[background-color] duration-150 not-data-glass-ready:bg-btn not-data-glass-ready:clip-notch not-data-glass-ready:hover:bg-btn-hover"
      >
        {children}
      </GlassGroup>
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
