import { heroContent, sectionIds } from "../content";
import { AccessButton } from "./access-button";
import { HeroShowcase } from "./hero-showcase";

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-[1440px] gap-10 overflow-x-clip px-gutter pt-8 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-14 lg:pb-24"
    >
      <div>
        <p className="mb-6 flex animate-fade-in items-center gap-3.5 text-xs font-semibold tracking-[.14em] text-muted uppercase [animation-delay:50ms] before:h-px before:w-8 before:bg-current">
          {heroContent.kicker}
        </p>
        <h1 className="animate-fade-in font-display text-[clamp(2.5rem,1.2rem+5.2vw,5.25rem)] leading-[.96] font-extrabold tracking-[-.035em] [animation-delay:150ms]">
          {heroContent.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-[34ch] animate-fade-in text-[1.0625rem] leading-relaxed text-muted [animation-delay:300ms] sm:text-xl">
          {heroContent.description}
        </p>
        <div className="mt-9 flex animate-fade-in flex-col gap-3 [animation-delay:450ms] sm:flex-row sm:items-center sm:gap-6">
          <AccessButton className="w-full sm:w-auto" />
          <a
            href={`#${sectionIds.howItWorks}`}
            className="inline-flex min-h-12 items-center justify-center font-semibold underline decoration-line decoration-2 underline-offset-[6px] transition-colors duration-150 hover:decoration-current"
          >
            {heroContent.secondary}
          </a>
        </div>
      </div>

      <HeroShowcase />
    </section>
  );
}
