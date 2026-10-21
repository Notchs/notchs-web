import type { ReactNode } from "react";

import { VerifiedIcon } from "@/shared/components/brand/verified-icon";

type DonePanelProps = {
  stamp: string;
  title: string;
  body: ReactNode;
  children?: ReactNode;
};

/** Stamped success screen that ends every branch of the flow. */
export function DonePanel({ stamp, title, body, children }: DonePanelProps) {
  return (
    <div className="flex flex-col items-start gap-6">
      <span className="flex h-16 animate-stamp items-center gap-3 rounded-[10px] border-3 border-foreground px-5 font-display text-xl tracking-[-.02em] [clip-path:polygon(0_0,100%_0,100%_calc(100%-20.78px),calc(100%-12px)_100%,0_100%)] sm:h-18 sm:text-2xl">
        <VerifiedIcon className="size-6 sm:size-7" />
        {stamp}
      </span>
      <div className="flex flex-col gap-2.5">
        <h2 className="font-display text-[1.75rem] leading-[1.1] tracking-[-.02em] text-balance [overflow-wrap:anywhere] sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-relaxed text-muted sm:text-lg">
          {body}
        </p>
      </div>
      {children}
    </div>
  );
}
