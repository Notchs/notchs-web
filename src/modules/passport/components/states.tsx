import { shellContent } from "../content";

/** Shown while a section loads; holds its place so nothing jumps. */
export function Loading({ className }: { className?: string }) {
  return (
    <p role="status" className={className ?? "py-6 text-muted"}>
      {shellContent.loading}
    </p>
  );
}

export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      <p className="text-muted">{shellContent.loadError}</p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-11 cursor-pointer font-semibold underline underline-offset-[3px]"
      >
        {shellContent.retry}
      </button>
    </div>
  );
}
