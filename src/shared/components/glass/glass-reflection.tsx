import { cn } from "@/shared/lib/cn";

/**
 * What a slab of glass reflects, layered over its content. Moves with the
 * `--sweep`, `--drift` and `--light-x/y` variables from `useGlassMotion`:
 *
 * - a broad light streak and a sharp one that slide across as the page
 *   scrolls, like a window passing over polished glass;
 * - two soft window-pane reflections drifting in parallax;
 * - a highlight under the pointer;
 * - light along the top and left edges, a darker lower edge, and a fine
 *   rainbow line along the bottom where the edge splits the light.
 *
 * Purely decorative and never in the way of a click.
 */
export function GlassReflection({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
    >
      {/* Light streaks, sliding as the page scrolls. */}
      <span className="absolute -inset-1/2 translate-y-(--sweep) bg-[linear-gradient(115deg,transparent_38%,rgb(255_255_255/.05)_44%,rgb(255_255_255/.13)_48%,rgb(255_255_255/.03)_52%,transparent_58%)] mix-blend-screen" />
      <span className="absolute -inset-1/2 translate-y-[calc(var(--sweep,0px)*-0.6)] bg-[linear-gradient(115deg,transparent_61%,rgb(255_255_255/.16)_61.6%,transparent_62.4%)] mix-blend-screen" />

      {/* Window panes from the room, drifting in parallax. */}
      <span className="absolute top-[8%] left-[12%] h-[38%] w-[26%] translate-x-(--drift) rounded-2xl bg-white/[.045] blur-md" />
      <span className="absolute top-[8%] left-[42%] h-[38%] w-[18%] translate-x-[calc(var(--drift,0px)*1.4)] rounded-2xl bg-white/[.035] blur-md" />

      {/* Highlight under the pointer. */}
      <span className="absolute inset-0 bg-[radial-gradient(260px_circle_at_var(--light-x,30%)_var(--light-y,0%),rgb(255_255_255/.12),transparent_70%)] mix-blend-screen" />

      {/* Edges: lit top and left, shaded bottom, rainbow along the base. */}
      <span className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgb(255_255_255/.38),inset_1px_0_0_rgb(255_255_255/.14),inset_0_-1px_0_rgb(255_255_255/.06),inset_0_-14px_24px_-18px_rgb(0_0_0/.5)]" />
      <span className="absolute inset-x-[12%] bottom-0 h-[1.5px] bg-[linear-gradient(90deg,transparent,rgb(255_91_91/.55),rgb(255_210_91/.55),rgb(91_255_155/.5),rgb(91_200_255/.55),rgb(176_91_255/.5),transparent)] blur-[0.4px]" />
    </div>
  );
}
