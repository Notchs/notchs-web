import { SectionHeading } from "@/modules/landing";

import { earnContent } from "../content";

/** What a person collects from real visits. */
export function Earn() {
  return (
    <>
      <SectionHeading
        kicker={earnContent.kicker}
        title={earnContent.title}
        className="mb-10 sm:mb-12"
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {earnContent.items.map((item) => (
          <li key={item.title} className="rounded-2xl bg-block p-6 sm:p-7">
            <h3 className="font-display text-lg font-extrabold tracking-[-.01em]">
              {item.title}
            </h3>
            <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
