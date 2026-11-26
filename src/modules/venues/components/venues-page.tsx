import type { ReactNode } from "react";

import { Faq, LandingShell } from "@/modules/landing";
import { cn } from "@/shared/lib/cn";

import { faqContent, problemContent } from "../content";
import { CalculatorSection } from "./calculator-section";
import { FoundingCta } from "./founding-cta";
import { FairAndPricing } from "./fair-and-pricing";
import { HowItWorks } from "./how-it-works";
import { Reasons } from "./reasons";
import { VenuesHero } from "./venues-hero";

function Section({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[1440px] scroll-mt-24 px-gutter py-12 sm:py-24",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** /venues: the page that sells Notchs to venue owners. */
export function VenuesPage() {
  return (
    <LandingShell>
      <main>
        <VenuesHero />

        <Section className="pt-0 sm:pt-0">
          <div className="grid gap-6 border-t border-line pt-12 sm:pt-16 lg:grid-cols-2 lg:gap-16">
            <h2 className="font-display text-[clamp(1.875rem,1.1rem+3vw,3.25rem)] leading-[1.2] font-extrabold tracking-[-.01em] text-balance">
              {problemContent.title}
            </h2>
            <p className="text-[1.0625rem] leading-relaxed text-muted sm:text-lg">
              {problemContent.body}
            </p>
          </div>
        </Section>

        <Section>
          <Reasons />
        </Section>

        <Section>
          <HowItWorks />
        </Section>

        <Section>
          <CalculatorSection />
        </Section>

        <Section className="pt-0 sm:pt-0">
          <FairAndPricing />
        </Section>

        <Section>
          <Faq
            kicker={faqContent.kicker}
            title={faqContent.title}
            items={faqContent.items}
          />
        </Section>

        <Section className="pt-0 sm:pt-0">
          <FoundingCta />
        </Section>
      </main>
    </LandingShell>
  );
}
