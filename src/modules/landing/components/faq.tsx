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
      <ul className="reveal border-t border-line">
        {faqContent.items.map((item) => (
          <li key={item.q} className="border-b border-line">
            <details name="faq" className="group details-smooth">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.0625rem] font-semibold sm:text-lg [&::-webkit-details-marker]:hidden">
                {item.q}
                <PlusIcon className="size-5 flex-none text-muted transition-transform duration-200 ease-notch group-open:rotate-45" />
              </summary>
              <p className="max-w-[60ch] pr-9 pb-5 text-base leading-relaxed text-muted">
                {item.a}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
