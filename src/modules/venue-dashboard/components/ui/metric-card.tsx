import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { Delta, InfoTip } from "./badges";
import { GuardedLink } from "./guarded-link";
import { Icon, type IconName } from "./icon";

export type MetricCardProps = {
  label: string;
  value: ReactNode;
  unit?: string;
  icon?: IconName;
  tip?: string;
  delta?: number | null;
  deltaUnit?: string;
  foot?: string;
  href?: string;
  unavailable?: boolean;
};

export function MetricCard({
  label,
  value,
  unit,
  icon,
  tip,
  delta,
  deltaUnit,
  foot,
  href,
  unavailable,
}: MetricCardProps) {
  const body = (
    <>
      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
        {icon && <Icon name={icon} size={16} />}
        <span className="min-w-0 flex-1">{label}</span>
      </span>
      <span
        className={cn(
          "font-display text-[28px] leading-none tracking-[-.02em] whitespace-nowrap",
          unavailable && "text-xl text-muted",
        )}
      >
        {value}
        {unit && (
          <small className="ml-1 font-sans text-sm font-medium tracking-normal text-muted">
            {unit}
          </small>
        )}
      </span>
      <span className="flex flex-wrap items-center gap-2 text-xs text-muted">
        {delta != null && <Delta value={delta} unit={deltaUnit} />}
        {foot}
      </span>
    </>
  );
  const frame =
    "flex min-w-0 flex-col gap-2 rounded-[14px] border border-line bg-card px-[18px] py-4";
  return (
    <div className="relative min-w-0">
      {href ? (
        <GuardedLink
          href={href}
          className={cn(
            frame,
            "h-full transition-shadow duration-150 hover:shadow-[inset_0_0_0_1.5px_var(--ink)]",
          )}
        >
          {body}
        </GuardedLink>
      ) : (
        <div className={cn(frame, "h-full")}>{body}</div>
      )}
      {tip && (
        <span className="absolute top-4 right-[18px]">
          <InfoTip text={tip} />
        </span>
      )}
    </div>
  );
}
