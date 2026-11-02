"use client";

import { ArrowRightIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/ui/button";
import { prewarmPageSnapshot } from "@/shared/lib/glass/page-snapshot";

import { accessLabel, accessLabelShort } from "../content";
import { useLanding } from "./landing-provider";

type AccessButtonProps = {
  size?: "default" | "sm";
  className?: string;
};

/**
 * Opens the access dialog with the animated QR. Hover or focus starts the
 * page snapshot its glass refracts, so it is usually ready by the click.
 */
export function AccessButton({ size, className }: AccessButtonProps) {
  const { openAccess } = useLanding();

  return (
    <Button
      size={size}
      className={className}
      aria-haspopup="dialog"
      onClick={(event) => openAccess(event.currentTarget)}
      onPointerEnter={prewarmPageSnapshot}
      onFocus={prewarmPageSnapshot}
    >
      {size === "sm" ? (
        <>
          <span className="sm:hidden">{accessLabelShort}</span>
          <span className="max-sm:hidden">{accessLabel}</span>
        </>
      ) : (
        <>
          {accessLabel}
          <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </>
      )}
    </Button>
  );
}
