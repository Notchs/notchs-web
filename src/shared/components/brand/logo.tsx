import Image from "next/image";

import { siteConfig } from "@/config/site";

/** Width-to-height ratio of the lockup SVGs (viewBox 115.045 x 24). */
const LOCKUP_ASPECT_RATIO = 115.045 / 24;

type LogoProps = {
  /**
   * Fixed-colour lockup (mark plus wordmark) on a transparent background.
   * Use "on-dark" on Ink surfaces and "on-light" on Paper ones; "on-dark"
   * has the Volt mark, which must never sit on white or Paper.
   */
  variant?: "on-dark" | "on-light";
  height?: number;
  className?: string;
};

export function Logo({
  variant = "on-dark",
  height = 32,
  className,
}: LogoProps) {
  return (
    <Image
      src={`/brand/notchs-lockup-${variant}.svg`}
      alt={siteConfig.name}
      height={height}
      width={Math.round(height * LOCKUP_ASPECT_RATIO)}
      className={className}
      preload
    />
  );
}
