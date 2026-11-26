import { routes } from "@/config/routes";
import { ArrowRightIcon } from "@/shared/components/icons";
import { ButtonLink } from "@/shared/components/ui/button";

import { accessLabel, accessLabelShort } from "../content";

type AccessButtonProps = {
  /** "sm" and "md" use the short label on phones. */
  size?: "default" | "sm" | "md";
  className?: string;
};

/** Opens the WhatsApp login: a newcomer's first message makes their passport. */
export function AccessButton({ size, className }: AccessButtonProps) {
  return (
    <ButtonLink href={routes.login} size={size} className={className}>
      {size === "sm" || size === "md" ? (
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
    </ButtonLink>
  );
}
