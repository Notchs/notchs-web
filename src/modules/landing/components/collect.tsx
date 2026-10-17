import { collectContent } from "../content";
import { NotchCardBuilder } from "./notch-card-builder";
import { SectionHeading } from "./section-heading";

export function Collect() {
  return (
    <div>
      <SectionHeading
        kicker={collectContent.kicker}
        title={collectContent.title}
        className="reveal"
      />
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {collectContent.items.map((item) => (
          <li
            key={item.title}
            className="reveal rounded-2xl border border-line bg-card p-5 pt-6 notch notch-sm"
          >
            <h3 className="font-display text-lg font-extrabold tracking-[-.02em]">
              {item.title}
            </h3>
            <p className="mt-1.5 text-base leading-relaxed text-muted">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-16 sm:mt-20">
        <NotchCardBuilder />
      </div>
    </div>
  );
}
