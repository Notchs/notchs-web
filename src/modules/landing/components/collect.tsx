import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";

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
      {/* Four pieces of one glass: close neighbours melt together. The
          whole group fades in, so the glass and the text arrive together. */}
      <GlassGroup self={false} merge={16} className="mt-10 reveal">
        <div role="list" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {collectContent.items.map((item) => (
            <GlassShape
              key={item.title}
              role="listitem"
              radius={16}
              className="p-5 pt-6"
            >
              <h3 className="font-display text-lg font-extrabold tracking-[-.02em]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-base leading-relaxed text-muted">
                {item.body}
              </p>
            </GlassShape>
          ))}
        </div>
      </GlassGroup>
      <div className="mt-16 sm:mt-20">
        <NotchCardBuilder />
      </div>
    </div>
  );
}
