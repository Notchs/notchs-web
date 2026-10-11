import Image from "next/image";

import { siteConfig } from "@/config/site";

/** Width-to-height ratio of the lockup SVGs (viewBox 138.631 x 36). */
const LOCKUP_ASPECT_RATIO = 138.631 / 36;

type LogoProps = {
  /** Use "on-ink" on dark (Ink) surfaces and "on-paper" on light (Paper) ones. */
  variant?: "on-ink" | "on-paper";
  height?: number;
  className?: string;
};

export function Logo({
  variant = "on-ink",
  height = 32,
  className,
}: LogoProps) {
  return (
    <Image
      src={`/brand/lockup-${variant}.svg`}
      alt={siteConfig.name}
      height={height}
      width={Math.round(height * LOCKUP_ASPECT_RATIO)}
      className={className}
      preload
    />
  );
}
