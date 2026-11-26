import { SectionHeading } from "@/modules/landing";

import { howItWorksContent, howItWorksId } from "../content";

/** Three setup steps on a Paper panel, for contrast in either theme. */
export function HowItWorks() {
  return (
    <div
      id={howItWorksId}
      className="scroll-mt-24 rounded-3xl border border-line bg-background p-6 py-10 tone-paper sm:p-10 lg:p-14"
    >
      <SectionHeading
        kicker={howItWorksContent.kicker}
        title={howItWorksContent.title}
        className="mb-10 sm:mb-12"
      />
      <ol className="grid gap-8 sm:grid-cols-3 sm:gap-6">
        {howItWorksContent.steps.map((step, index) => (
          <li key={step.title} className="border-t-2 border-foreground pt-5">
            <p
              aria-hidden="true"
              className="font-display text-2xl font-extrabold"
            >
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
