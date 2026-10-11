import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/shared/lib/cn";

const buttonStyles =
  "group clip-notch bg-btn text-btn-fg hover:bg-btn-hover inline-flex min-h-14 cursor-pointer items-center gap-2.5 rounded-[10px] px-7 leading-none font-semibold transition-[background-color,scale] duration-150 focus-visible:outline-none active:scale-[.98]";

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
  type = "button",
  ...props
}: ComponentProps<"button">) {
  return (
    <ButtonFrame className={className}>
      <button type={type} className={buttonStyles} {...props} />
    </ButtonFrame>
  );
}

/** A link with the same look as `Button`. */
export function ButtonLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <ButtonFrame className={className}>
      <Link className={buttonStyles} {...props} />
    </ButtonFrame>
  );
}
