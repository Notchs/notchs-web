import { siteConfig } from "@/config/site";

export function HomeHero() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
        {siteConfig.name}
      </h1>
      <p className="max-w-md text-lg text-foreground/70">
        {siteConfig.description}
      </p>
    </main>
  );
}
