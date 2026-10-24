import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description: string;
  /** Buttons on the right, such as "Add venue". */
  actions?: ReactNode;
};

/** Title row at the top of every admin page. */
export function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-tight font-extrabold tracking-[-.03em]">
          {title}
        </h1>
        <p className="mt-2 text-[1.0625rem] text-muted">{description}</p>
      </div>
      {actions}
    </div>
  );
}
