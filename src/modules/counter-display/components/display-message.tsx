import type { ReactNode } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";

/** A full-screen message on the counter phone. */
export function DisplayMessage({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <main className="row-span-full flex min-h-svh flex-col items-center justify-center gap-4 bg-ink p-6 text-center text-paper">
      <NotchGlyph className="size-8 text-volt" />
      <h1 className="m-0 max-w-[24ch] font-display text-2xl leading-[1.15] tracking-[-.02em]">
        {title}
      </h1>
      {body && <p className="m-0 max-w-[40ch] text-stone-light">{body}</p>}
      {children}
    </main>
  );
}
