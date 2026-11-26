import type { ReactNode } from "react";

import { Faq, LandingShell } from "@/modules/landing";
import { cn } from "@/shared/lib/cn";

import { faqContent, problemContent } from "../content";
import { CustomersHero } from "./customers-hero";
import { Earn } from "./earn";
import { HowItWorks } from "./how-it-works";
import { Moments } from "./moments";
import { NotchCard } from "./notch-card";
import { Trust } from "./trust";

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

/** /customers: what people who go out get from Notchs. */
export function CustomersPage() {
  return (
    <LandingShell>
      <main>
        <CustomersHero />

        <Section className="pt-0 sm:pt-0">
          <div className="grid gap-6 rounded-3xl bg-block p-6 py-10 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
            <h2 className="font-display text-[clamp(1.625rem,1rem+2.4vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-.01em] text-balance">
              {problemContent.title}
            </h2>
            <p className="text-[1.0625rem] leading-relaxed text-muted sm:text-lg">
              {problemContent.body}
            </p>
          </div>
        </Section>

        <Section>
          <HowItWorks />
        </Section>

        <Section>
          <Earn />
        </Section>

        <Section className="pt-0 sm:pt-0">
          <NotchCard />
        </Section>

        <Section>
          <Trust />
        </Section>

        <Section>
          <Moments />
        </Section>

        <Section>
          <Faq
            kicker={faqContent.kicker}
            title={faqContent.title}
            items={faqContent.items}
          />
        </Section>
      </main>
    </LandingShell>
  );
}
