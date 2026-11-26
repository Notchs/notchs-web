import { SectionHeading } from "@/modules/landing";

import { momentsContent } from "../content";

export function Moments() {
  return (
    <>
      <SectionHeading
        kicker={momentsContent.kicker}
        title={momentsContent.title}
        className="mb-10 sm:mb-12"
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {momentsContent.items.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-line p-6 sm:p-7"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
