import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import {
  howItWorksContent,
  placesContent,
  saturdayContent,
  sectionIds,
} from "../content";
import { jetbrainsMono } from "../fonts";
import { Collect } from "./collect";
import { Faq } from "./faq";
import { ForVenues } from "./for-venues";
import { Hero } from "./hero";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";
import { LandingProvider } from "./landing-provider";
import { Moments } from "./moments";
import { NotchDemo } from "./notch-demo";
import { PlaceCards } from "./places";
import { SaturdayMap } from "./saturday-map";
import { SectionHeading } from "./section-heading";
import { StructuredData } from "./structured-data";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Page-width section; `scroll-mt` keeps headings clear of the sticky header. */
function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-[1440px] scroll-mt-20 px-gutter py-16 sm:py-24",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function LandingPage() {
  return (
    <LandingProvider>
      <StructuredData />
      <LandingHeader />
      <main data-smooth-scroll className={jetbrainsMono.variable}>
        <Hero />

        <Section id={sectionIds.howItWorks}>
          <SectionHeading
            kicker={howItWorksContent.kicker}
            title={howItWorksContent.title}
            description={howItWorksContent.description}
            className="mb-12 reveal"
          />
          <NotchDemo />
        </Section>

        <Section id={sectionIds.map}>
          <SectionHeading
            kicker={saturdayContent.kicker}
            title={saturdayContent.title}
            description={saturdayContent.description}
            className="mb-10 reveal"
          />
          <SaturdayMap />
        </Section>

        <Section id={sectionIds.places}>
          <SectionHeading
            kicker={placesContent.kicker}
            title={placesContent.title}
            description={placesContent.description}
            className="mb-12 reveal"
          />
          <PlaceCards />
        </Section>

        <Section id={sectionIds.moments}>
          <Moments />
        </Section>

        <Section>
          <Collect />
        </Section>

        <Section id={sectionIds.venues}>
          <ForVenues />
        </Section>

        <Section id={sectionIds.faq}>
          <Faq />
        </Section>
      </main>
      <LandingFooter />
    </LandingProvider>
  );
}
