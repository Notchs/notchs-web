import type { ReactNode } from "react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { ArrowLeftIcon } from "@/shared/components/icons";
import { HeroSection } from "@/shared/components/layout/hero-section";
import { PageShell } from "@/shared/components/layout/page-shell";
import { ButtonLink } from "@/shared/components/ui/button";

type StatusPageProps = {
  /** Small label above the title, e.g. "Error 404". */
  kicker: string;
  title: string;
  description: string;
  mark: ReactNode;
  /** Replaces the default "back home" action. */
  action?: ReactNode;
};

function BackHomeLink() {
  return (
    <ButtonLink href={routes.home}>
      <ArrowLeftIcon className="size-4.5 transition-transform duration-250 ease-notch group-hover:-translate-x-[3px]" />
      Back to {siteConfig.name}
    </ButtonLink>
  );
}

/** Full page for errors and access states (403, 404, unexpected errors). */
export function StatusPage({
  kicker,
  title,
  description,
  mark,
  action = <BackHomeLink />,
}: StatusPageProps) {
  return (
    <PageShell>
      <HeroSection
        kicker={kicker}
        title={title}
        description={description}
        mark={mark}
      >
        <div className="mt-10 animate-fade-in [animation-delay:450ms]">
          {action}
        </div>
      </HeroSection>
    </PageShell>
  );
}
