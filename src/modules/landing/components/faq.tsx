import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { PlusIcon } from "@/shared/components/icons";

import { faqContent } from "../content";
import { SectionHeading } from "./section-heading";

export function Faq() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
      <SectionHeading
        kicker={faqContent.kicker}
        title={faqContent.title}
        className="reveal"
      />
      {/* Each question is a piece of glass, kept just apart so the rows
          read cleanly; a lens follows the pointer from question to question. */}
      <GlassGroup self={false} merge={6} className="reveal">
        <GlassLensTrack lensRadius={14} inset={4}>
          <div role="list" className="grid gap-2">
            {faqContent.items.map((item) => (
              <GlassShape
                key={item.q}
                role="listitem"
                radius={18}
                className="px-5"
              >
                <details name="faq" className="group details-smooth">
                  <summary
                    className="relative flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.0625rem] font-semibold sm:text-lg [&::-webkit-details-marker]:hidden"
                    {...LENS_ITEM}
                  >
                    {item.q}
                    <PlusIcon className="size-5 flex-none text-muted transition-transform duration-200 ease-notch group-open:rotate-45" />
                  </summary>
                  <p className="max-w-[60ch] pr-9 pb-5 text-base leading-relaxed text-muted">
                    {item.a}
                  </p>
                </details>
              </GlassShape>
            ))}
          </div>
        </GlassLensTrack>
      </GlassGroup>
    </div>
  );
}
