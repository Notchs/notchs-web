"use client";

import { ArrowRightIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/ui/button";

import { accessLabel } from "../content";
import { useLanding } from "./landing-provider";

type AccessButtonProps = {
  size?: "default" | "sm";
  className?: string;
};

/** Opens the access dialog with the animated QR. */
export function AccessButton({ size, className }: AccessButtonProps) {
  const { openAccess } = useLanding();

  return (
    <Button
      size={size}
      className={className}
      aria-haspopup="dialog"
      onClick={openAccess}
    >
      {accessLabel}
      {size !== "sm" && (
        <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
      )}
    </Button>
  );
}
