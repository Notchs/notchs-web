import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { CityProvider } from "@/modules/city";

import { howItWorksContent, placesContent, sectionIds } from "../content";
import { jetbrainsMono } from "../fonts";
import { CityCommunity } from "./city-community";
import { CityPulse } from "./city-pulse";
import { Collect } from "./collect";
import { Faq } from "./faq";
import { ForVenues } from "./for-venues";
import { Hero } from "./hero";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";
import { LandingProvider } from "./landing-provider";
import { Moments } from "./moments";
import { Neighbourhoods } from "./neighbourhoods";
import { NotchDemo } from "./notch-demo";
import { PlaceCards } from "./places";
import { SectionHeading } from "./section-heading";
import { StructuredData } from "./structured-data";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Page-width section; `scroll-mt` keeps headings clear of the floating header. */
function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-[1440px] scroll-mt-24 px-gutter py-16 sm:py-24",
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
      <CityProvider>
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
            <CityPulse />
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

          <Section id={sectionIds.neighbourhoods}>
            <Neighbourhoods />
          </Section>

          <Section id={sectionIds.moments}>
            <Moments />
          </Section>

          <Section id={sectionIds.rewards}>
            <Collect />
          </Section>

          <Section id={sectionIds.cities}>
            <CityCommunity />
          </Section>

          <Section id={sectionIds.venues}>
            <ForVenues />
          </Section>

          <Section id={sectionIds.faq}>
            <Faq />
          </Section>
        </main>
        <LandingFooter />
      </CityProvider>
    </LandingProvider>
  );
}
