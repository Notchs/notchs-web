import Link from "next/link";

import { PageShell } from "@/shared/components/layout/page-shell";
import { cn } from "@/shared/lib/cn";

import { hubContent, hubSections, type HubScreen } from "../content";

function ScreenRow({ screen }: { screen: HubScreen }) {
  const built = Boolean(screen.href);
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3.5">
      <div className="min-w-0">
        <p className="font-semibold">
          {screen.href ? (
            <Link
              href={screen.href}
              className="underline decoration-line underline-offset-4 hover:decoration-current"
            >
              {screen.name}
            </Link>
          ) : (
            screen.name
          )}
          {screen.code && (
            <span className="ml-2 text-xs font-medium text-muted">
              {screen.code}
            </span>
          )}
        </p>
        {screen.note && (
          <p className="mt-0.5 text-sm text-muted">{screen.note}</p>
        )}
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
          built ? "bg-volt text-ink" : "bg-block text-muted",
        )}
      >
        {built ? hubContent.built : hubContent.notBuilt}
      </span>
    </li>
  );
}

/** Team-only index of every screen, with links to the ones that are built. */
export function TeamHubPage() {
  return (
    <PageShell>
      <main className="px-gutter pt-6 pb-16">
        <p className="mb-5 text-xs font-semibold tracking-[.14em] text-muted uppercase">
          {hubContent.kicker}
        </p>
        <h1 className="font-display text-[clamp(2.25rem,1rem+4vw,4.5rem)] leading-[.95] font-extrabold tracking-[-.03em]">
          {hubContent.title}
        </h1>
        <p className="mt-5 max-w-[60ch] text-muted">{hubContent.description}</p>

        <div className="mt-10 grid max-w-3xl gap-10">
          {hubSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold">{section.title}</h2>
              <ul className="mt-3 divide-y divide-line rounded-[10px] border border-line bg-card">
                {section.screens.map((screen) => (
                  <ScreenRow key={screen.name} screen={screen} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
