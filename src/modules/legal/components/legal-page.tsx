import { PageShell } from "@/shared/components/layout/page-shell";
import { PlusIcon } from "@/shared/components/icons";

import type { LegalContent } from "../content";

/** A short summary card, then each topic in plain words (A10, A11). */
export function LegalPage({ content }: { content: LegalContent }) {
  return (
    <PageShell>
      <main className="mx-auto w-full max-w-2xl px-gutter py-12 lg:py-20">
        <h1 className="font-display text-4xl leading-tight font-extrabold tracking-[-.02em]">
          {content.title}
        </h1>

        <dl className="mt-8 grid gap-4 rounded-[14px] border border-line p-5">
          {content.summary.map((item) => (
            <div key={item.label}>
              <dt className="text-[.8125rem] font-semibold tracking-[.08em] text-muted uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 leading-relaxed">{item.text}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          {content.sections.map((section) => (
            <details
              key={section.q}
              className="group details-smooth border-b border-line"
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                <h2>{section.q}</h2>
                <PlusIcon className="size-5 flex-none text-muted transition-transform duration-200 ease-notch group-open:rotate-45" />
              </summary>
              <p className="pr-9 pb-5 leading-relaxed text-muted">
                {section.a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-6 text-muted">{content.updated}</p>
      </main>
    </PageShell>
  );
}
