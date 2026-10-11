import { HeroSection } from "@/shared/components/layout/hero-section";
import { PageShell } from "@/shared/components/layout/page-shell";

import { comingSoonContent } from "../content";
import { NotchMarkCut } from "./notch-mark-cut";
import { Tally } from "./tally";

function Location() {
  return (
    <span className="hidden text-xs font-medium tracking-[.08em] text-muted uppercase tabular-nums sm:block">
      {comingSoonContent.location}
    </span>
  );
}

export function ComingSoonPage() {
  return (
    <PageShell headerMeta={<Location />}>
      <HeroSection
        kicker={comingSoonContent.kicker}
        title={comingSoonContent.titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        description={comingSoonContent.tagline}
        descriptionClassName="mt-8 max-w-[26ch]"
        mark={<NotchMarkCut />}
        markClassName="split:w-[min(100%,420px)]"
      >
        <p className="mt-12 flex animate-fade-in items-center gap-4 text-[.9375rem] font-medium [animation-delay:900ms]">
          <Tally />
          <span>
            Don&rsquo;t stay{" "}
            <em className="text-unnotched not-italic">unnotched.</em>
          </span>
        </p>
      </HeroSection>
    </PageShell>
  );
}
