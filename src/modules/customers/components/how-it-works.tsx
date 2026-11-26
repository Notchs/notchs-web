import { SectionHeading } from "@/modules/landing";
import { VerifiedIcon } from "@/shared/components/brand/verified-icon";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import { chatSample, howItWorksContent, howItWorksId } from "../content";

/** Four steps beside a sample WhatsApp chat (labelled Example). */
export function HowItWorks() {
  return (
    <div id={howItWorksId} className="scroll-mt-24">
      <SectionHeading
        kicker={howItWorksContent.kicker}
        title={howItWorksContent.title}
        className="mb-10 sm:mb-12"
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <ol className="grid gap-7">
          {howItWorksContent.steps.map((step, index) => (
            <li key={step.title} className="flex gap-5">
              <span
                aria-hidden="true"
                className="grid size-11 flex-none place-items-center rounded-full border-2 border-foreground font-display font-extrabold"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div
          {...INK_GROUND}
          className="mx-auto w-full max-w-sm rounded-3xl bg-ink p-5 text-paper sm:p-6"
        >
          <p className="text-center text-sm text-stone-light">
            {chatSample.label}
          </p>
          <p className="mt-5 ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-volt px-4 py-3 text-[.9375rem] text-ink">
            {chatSample.sent}
          </p>
          <div className="mt-3 w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-graphite px-4 py-3 text-[.9375rem] leading-relaxed">
            <p className="flex items-center gap-2 font-semibold text-volt">
              <VerifiedIcon className="size-4" />
              {chatSample.replyTitle}
            </p>
            {chatSample.replyLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
