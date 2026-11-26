import { heroContent, sectionIds } from "../content";
import { AccessButton } from "./access-button";
import { HeroShowcase } from "./hero-showcase";

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-[1440px] gap-8 overflow-x-clip px-gutter pt-6 pb-4 sm:gap-10 sm:pt-8 sm:pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-14 lg:pb-24"
    >
      <div className="max-sm:text-center">
        <h1 className="font-display text-[clamp(2.5rem,1.2rem+5.2vw,5.25rem)] leading-[1.06] font-extrabold tracking-[-.02em]">
          {heroContent.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-[34ch] text-[1.0625rem] leading-relaxed text-muted max-sm:mx-auto sm:text-xl">
          {heroContent.description}
        </p>
        <div className="mt-9 flex animate-fade-in flex-col items-center gap-3 [animation-delay:450ms] sm:flex-row sm:items-center sm:gap-6">
          <AccessButton />
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
