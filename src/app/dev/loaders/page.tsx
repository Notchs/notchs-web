import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { env } from "@/config/env";
import { MainLoader } from "@/shared/components/ui/loaders/main-loader";
import { SecondaryLoader } from "@/shared/components/ui/loaders/secondary-loader";

export const metadata: Metadata = {
  title: "Loaders",
  robots: { index: false, follow: false },
};

const LOADERS = [
  { name: "MainLoader", Loader: MainLoader, sizes: [24, 64, 100, 160] },
  {
    name: "SecondaryLoader",
    Loader: SecondaryLoader,
    sizes: [32, 64, 100, 160],
  },
];

const BACKGROUNDS = [
  { name: "Ink", className: "bg-ink" },
  { name: "Graphite", className: "bg-graphite" },
];

/** Local development only: a 404 in every real build. */
export default function LoadersDemoPage() {
  if (env.isProductionBuild) notFound();

  return (
    <main className="row-span-3 bg-ink p-6 text-paper">
      <h1 className="mb-6 text-2xl font-semibold">Loaders</h1>
      {LOADERS.flatMap(({ name, Loader, sizes }) =>
        BACKGROUNDS.map((background) => (
          <section
            key={`${name}-${background.name}`}
            className={`mb-6 rounded-[14px] p-6 ${background.className}`}
          >
            <h2 className="mb-6 font-semibold">
              {name} on {background.name}
            </h2>
            <div className="flex flex-wrap items-end gap-10">
              {sizes.map((size) => (
                <figure key={size} className="flex flex-col items-center gap-3">
                  <Loader size={size} delayMs={0} />
                  <figcaption className="text-sm">{size}px</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )),
      )}
    </main>
  );
}
