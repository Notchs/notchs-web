import type { ReactNode } from "react";

type StatusScreenProps = {
  title: string;
  description: string;
  /** Call to action rendered below the description. */
  children?: ReactNode;
};

/** Full-height message layout shared by the not-found and error pages. */
export function StatusScreen({
  title,
  description,
  children,
}: StatusScreenProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-md text-base text-foreground/70">{description}</p>
      </div>
      {children}
    </main>
  );
}
