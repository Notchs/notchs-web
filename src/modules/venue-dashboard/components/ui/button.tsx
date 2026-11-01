import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { GuardedLink } from "./guarded-link";
import { Icon, type IconName } from "./icon";

const NOTCHED = "clip-notch pr-7 focus-visible:[clip-path:none]";

const variants = {
  primary: `bg-ink font-bold text-volt ${NOTCHED}`,
  dark: `bg-ink text-paper hover:bg-graphite ${NOTCHED}`,
  volt: `bg-volt font-bold text-ink ${NOTCHED}`,
  paper: `bg-paper text-ink ${NOTCHED}`,
  ghost: "shadow-[inset_0_0_0_1.5px_rgb(15_15_20/0.16)] hover:bg-ink/5",
  ghostOnInk:
    "shadow-[inset_0_0_0_1.5px_rgb(245_243_236/0.18)] hover:bg-paper/10",
  text: "h-10 px-1 underline decoration-1 underline-offset-4",
  danger:
    "text-unnotched shadow-[inset_0_0_0_1.5px_var(--unnotched)] hover:bg-unnotched/8",
  dangerSolid: "bg-unnotched text-white",
} as const;

const sizes = {
  sm: "h-10 px-3.5 text-[15px]",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-5 text-[17px]",
} as const;

export type ButtonVariant = keyof typeof variants;

type OwnProps = {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  icon?: IconName;
  iconRight?: IconName;
  full?: boolean;
  children: ReactNode;
};

const styles = ({
  variant = "ghost",
  size = "md",
  full,
  className,
}: OwnProps & { className?: string }) =>
  cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-[10px] font-semibold whitespace-nowrap transition-[background-color,opacity,transform] duration-150 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
    sizes[size],
    variants[variant],
    full && "w-full",
    className,
  );

const iconSize = (size: OwnProps["size"]) => (size === "sm" ? 16 : 20);

export function Button({
  variant,
  size,
  icon,
  iconRight,
  full,
  className,
  children,
  type = "button",
  ...props
}: OwnProps & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={styles({ variant, size, full, className, children })}
      {...props}
    >
      {icon && <Icon name={icon} size={iconSize(size)} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize(size)} />}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  icon,
  iconRight,
  full,
  className,
  children,
  href,
}: OwnProps & { href: string; className?: string }) {
  return (
    <GuardedLink
      href={href}
      className={styles({ variant, size, full, className, children })}
    >
      {icon && <Icon name={icon} size={iconSize(size)} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize(size)} />}
    </GuardedLink>
  );
}
