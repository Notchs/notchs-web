import { cn } from "@/shared/lib/cn";

type SectionHeadingProps = {
  kicker: string;
  title: string;
  description?: string;
  /** Use on Ink panels, where Stone Light stays readable on Ink and Graphite. */
  onInk?: boolean;
  className?: string;
};

/** Kicker line, Unbounded title and an optional lead paragraph. */
export function SectionHeading({
  kicker,
  title,
  description,
  onInk,
  className,
}: SectionHeadingProps) {
  const secondary = onInk ? "text-stone-light" : "text-muted";

  return (
    <div className={cn("max-w-[40rem]", className)}>
      <p
        className={cn(
          "mb-5 flex items-center gap-3.5 text-xs font-semibold tracking-[.14em] uppercase before:h-px before:w-8 before:bg-current",
          secondary,
        )}
      >
        {kicker}
      </p>
      <h2 className="font-display text-[clamp(1.875rem,1.1rem+3vw,3.25rem)] leading-[1.02] font-extrabold tracking-[-.03em] text-balance">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-[1.0625rem] leading-relaxed sm:text-lg",
            secondary,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
