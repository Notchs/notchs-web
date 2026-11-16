import type { ReactNode } from "react";
import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { ArrowLeftIcon, ArrowRightIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/ui/button";

/** Centres one screen of a flow and replays the rise-in when `screenKey` changes. */
export function AuthFormPanel({
  screenKey,
  children,
}: {
  screenKey: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div
        key={screenKey}
        className="flex w-full max-w-115 animate-rise flex-col gap-7"
      >
        <AuthLogo />
        {children}
      </div>
    </div>
  );
}

/** The Notchs mark (Volt N in an Ink box) and wordmark, above every form. */
function AuthLogo() {
  return (
    <Link
      href={routes.mainSite}
      aria-label={`${siteConfig.name} home`}
      className="flex min-h-12 items-center gap-3 self-start"
    >
      <span className="flex size-11 items-center justify-center rounded-[10px] bg-ink text-volt">
        <NotchGlyph className="size-6" />
      </span>
      <span className="font-display text-2xl leading-none tracking-[-.02em]">
        {siteConfig.name}
      </span>
    </Link>
  );
}

type AuthHeaderProps = {
  kicker?: string;
  title: string;
  description?: ReactNode;
  /** A back button shown above the title. */
  back?: ReactNode;
  /** Smaller title, for a one-line heading. */
  compact?: boolean;
};

export function AuthHeader({
  kicker,
  title,
  description,
  back,
  compact = false,
}: AuthHeaderProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {back}
      {kicker && (
        <span className="text-[.8125rem] leading-none font-semibold tracking-[.08em] text-muted uppercase">
          {kicker}
        </span>
      )}
      <h2
        className={
          compact
            ? "text-lg leading-snug font-normal text-muted"
            : "font-display text-[1.75rem] leading-[1.1] tracking-[-.02em] text-balance sm:text-4xl"
        }
      >
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export function AuthBackButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group -ml-1 flex h-12 cursor-pointer items-center gap-2 self-start rounded-md px-1 font-semibold"
    >
      <ArrowLeftIcon className="size-5 transition-transform duration-150 group-hover:-translate-x-0.5" />
      {label}
    </button>
  );
}

type AuthButtonProps = {
  busy?: boolean;
  /** Shown instead of the label while `busy`. */
  busyLabel?: string;
  disabled?: boolean;
  /** Draws the arrow after the label (not while busy). */
  arrow?: boolean;
  children: ReactNode;
};

/**
 * The form's submit button: Ink with Volt text on the Paper form panel.
 * Disabled while busy, so a second click can't send the form twice.
 */
export function AuthButton({
  busy = false,
  busyLabel,
  disabled,
  arrow = false,
  children,
}: AuthButtonProps) {
  return (
    <Button
      type="submit"
      disabled={busy || disabled}
      aria-busy={busy || undefined}
    >
      {busy && busyLabel ? busyLabel : children}
      {arrow && !busy && <ArrowRightIcon className="size-4.5" />}
    </Button>
  );
}

/** A quiet text link under a form, e.g. "Forgot password?". */
export function AuthTextButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer text-[.9375rem] font-semibold underline underline-offset-[3px] hover:text-muted"
    >
      {children}
    </button>
  );
}
