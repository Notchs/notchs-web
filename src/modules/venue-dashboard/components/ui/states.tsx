import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { content } from "../../content";
import { Button } from "./button";
import { PanelTitle } from "./card";
import { Icon, type IconName } from "./icon";

export function Skeleton({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "block animate-skeleton rounded-[14px] bg-block",
        className,
      )}
      {...props}
    />
  );
}

/** A page-shaped placeholder while data loads. */
export function PageSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label={content.common.loading}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 wide:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 wide:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton className="h-80" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      </div>
    </div>
  );
}

export function ErrorState({
  onRetry,
  title = content.common.errorTitle,
  body = content.common.errorBody,
}: {
  onRetry: () => void;
  title?: string;
  body?: string;
}) {
  return (
    <div
      role="alert"
      className="m-auto flex w-full max-w-140 flex-col gap-4 rounded-[14px] border border-line bg-card p-8"
    >
      <span className="text-unnotched">
        <Icon name="alert" size={32} />
      </span>
      <PanelTitle>{title}</PanelTitle>
      <p className="m-0 text-muted">{body}</p>
      <div>
        <Button variant="dark" icon="refresh" onClick={onRetry}>
          {content.common.retry}
        </Button>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  children,
}: {
  icon: IconName;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex max-w-155 flex-col items-start gap-4 rounded-[14px] border border-line bg-card p-10">
      <Icon name={icon} size={36} />
      <PanelTitle>{title}</PanelTitle>
      <p className="m-0 text-muted">{body}</p>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}

/** A feature that can't show numbers yet, and says why. */
export function UnavailableBox({
  badge,
  title,
  body,
  children,
}: {
  badge: ReactNode;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[14px] border-[1.5px] border-dashed border-ink/16 p-7">
      {badge}
      <h2 className="m-0 font-display text-xl leading-[1.2] tracking-[-.02em]">
        {title}
      </h2>
      <p className="m-0 max-w-[52ch] text-[15px] text-muted">{body}</p>
      {children}
    </div>
  );
}

export function Banner({
  icon,
  title,
  body,
  tone = "alert",
  children,
}: {
  icon: IconName;
  title: string;
  body?: string;
  tone?: "alert" | "info";
  children?: ReactNode;
}) {
  const isAlert = tone === "alert";
  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-4 rounded-[14px] bg-card px-5 py-[18px]",
        isAlert
          ? "shadow-[inset_0_0_0_1.5px_var(--unnotched)]"
          : "shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)]",
      )}
    >
      <span className={isAlert ? "text-unnotched" : ""}>
        <Icon name={icon} size={24} />
      </span>
      <span className="flex min-w-50 flex-1 flex-col gap-1">
        <b className="text-base">{title}</b>
        {body && <span className="text-sm text-muted">{body}</span>}
      </span>
      {children}
    </div>
  );
}
