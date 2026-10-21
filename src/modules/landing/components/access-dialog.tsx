"use client";

import { useState, useRef, type MouseEvent, type Ref } from "react";

import { siteConfig } from "@/config/site";
import { GlassGroup } from "@/shared/components/glass/glass-group";
import { GlassReflection } from "@/shared/components/glass/glass-reflection";
import {
  GlassSlabCanvas,
  type SlabMode,
} from "@/shared/components/glass/glass-slab-canvas";
import { LiquidGlass } from "@/shared/components/glass/liquid-glass";
import { CloseIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";
import { SNAPSHOT_IGNORE_ATTRIBUTE } from "@/shared/lib/glass/page-snapshot";
import { useGlassMotion } from "@/shared/lib/glass/use-glass-motion";

import { accessDialogContent } from "../content";
import { jetbrainsMono } from "../fonts";
import { AccessQr } from "./access-qr";

type AccessDialogProps = {
  ref: Ref<HTMLDialogElement>;
  open: boolean;
  openCount: number;
  /** The button the glass grows out of, when it can (see LandingProvider). */
  origin: DOMRect | null;
  onClose: () => void;
};

/** The slab's shape: corner radius and the width of its curved rim, in px. */
const SLAB_RADIUS = 28;
const SLAB_BEZEL = 24;
/** Matches the backdrop dimming (`backdrop:bg-ink/30`) inside the WebGL glass. */
const BACKDROP_DIM = 0.3;

/** Closes the dialog when the dimmed area around it is clicked. */
function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
  if (event.target === event.currentTarget) event.currentTarget.close();
}

/**
 * The access card as a slab of real glass over the page, which stays visible
 * and keeps scrolling behind it.
 *
 * With WebGL (Liquid Glass level 4, any browser) the glass is drawn over a
 * snapshot of the page: its clear rim bends what scrolls beneath, splitting
 * the colours, the middle is frosted, and when the snapshot is ready in time
 * the glass grows out of the button that opened it. Otherwise it falls back
 * to CSS glass: a refracting rim in Chromium, frosted elsewhere, tilting
 * towards the pointer. Either way light streaks and window reflections slide
 * over it as you scroll, the middle is frosted in the theme's glass colour
 * (white or Ink, never a dark block in light mode) so the text reads, and the
 * code is drawn in the theme's colours on a plate that keeps it scannable. Native <dialog> gives
 * focus trapping and Esc to close.
 */
export function AccessDialog({
  ref,
  open,
  openCount,
  origin,
  onClose,
}: AccessDialogProps) {
  const slabRef = useRef<HTMLDivElement>(null);
  useGlassMotion(slabRef, open);
  // Set by the WebGL glass once it knows; until then a warm snapshot means
  // it is about to grow out of the button, so the CSS glass stays out.
  const [slab, setSlab] = useState<SlabMode | null>(null);
  const mode: SlabMode = slab ?? (origin ? "morph" : "off");
  const webgl = mode !== "off";

  return (
    <dialog
      ref={ref}
      aria-labelledby="access-title"
      onClose={() => {
        setSlab(null);
        onClose();
      }}
      onClick={closeOnBackdrop}
      {...{ [SNAPSHOT_IGNORE_ATTRIBUTE]: "" }}
      className={`${jetbrainsMono.variable} m-auto w-[calc(100%_-_2rem)] max-w-[26rem] overflow-visible border-0 bg-transparent p-0 text-foreground outline-none backdrop:bg-ink/30`}
    >
      {open && (
        <>
          <GlassSlabCanvas
            slabRef={slabRef}
            radius={SLAB_RADIUS}
            origin={origin}
            dim={BACKDROP_DIM}
            onMode={setSlab}
          />
          <div
            className={cn(
              "[perspective:1200px]",
              mode !== "morph" && "animate-rise",
            )}
          >
            <LiquidGlass
              ref={slabRef}
              bare
              refract={!webgl}
              radius={SLAB_RADIUS}
              bezel={SLAB_BEZEL}
              depth={56}
              rimBlur={1.5}
              coreBlur={20}
              className={cn(
                "relative overflow-hidden rounded-[28px]",
                // CSS glass, when WebGL is not drawing it.
                !webgl &&
                  "[transform:rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] bg-(--glass-fill) shadow-[0_0_0_1px_rgb(255_255_255/.14),0_2px_6px_rgb(0_0_0/.25),0_40px_90px_-30px_rgb(0_0_0/.75)] backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-75 [@media(prefers-reduced-transparency:reduce)]:bg-(--glass-solid)",
              )}
            >
              {/* A light wash of the glass colour over the frosted middle. */}
              {!webgl && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-2 rounded-[22px] bg-(--glass-solid) opacity-60 blur-lg"
                />
              )}
              {/* While the glass grows out of the button, its contents wait. */}
              <GlassReflection
                className={cn(
                  mode === "morph" && "animate-fade-in [animation-delay:420ms]",
                )}
              />

              <div
                className={cn(
                  mode === "morph" && "animate-fade-in [animation-delay:420ms]",
                  "relative grid max-h-[calc(100dvh_-_2rem)] justify-items-center gap-6 overflow-y-auto px-6 pt-6 pb-7 text-center sm:px-8",
                )}
              >
                <div className="flex w-full items-start justify-between gap-4 text-left">
                  <div>
                    <h2
                      id="access-title"
                      className="font-display text-2xl leading-tight font-extrabold tracking-[-.02em]"
                    >
                      {accessDialogContent.title}
                    </h2>
                    <p className="mt-2 text-base leading-snug text-foreground/75">
                      {accessDialogContent.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={accessDialogContent.close}
                    onClick={(event) =>
                      event.currentTarget.closest("dialog")?.close()
                    }
                    className="-mt-1 -mr-2 grid size-12 flex-none cursor-pointer place-items-center rounded-full text-foreground/70 transition-colors duration-150 hover:bg-glass-tint hover:text-foreground"
                  >
                    <CloseIcon className="size-5" />
                  </button>
                </div>

                {/* On a plate of the theme's background, so it always scans. */}
                <AccessQr key={openCount} />

                <p className="font-mono text-[.8125rem] tracking-wide text-foreground/60">
                  {accessDialogContent.note}
                </p>

                {/* A glass key on the card's glass: it presses in. */}
                <GlassGroup
                  backdrop="plain"
                  radius={12}
                  pressable
                  tintAmount={0.35}
                  margin={12}
                  className="w-full rounded-xl"
                >
                  <a
                    href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("Notchs access")}`}
                    className="inline-flex min-h-12 w-full items-center justify-center px-5 font-semibold"
                  >
                    {accessDialogContent.notify}
                  </a>
                </GlassGroup>
              </div>
            </LiquidGlass>
          </div>
        </>
      )}
    </dialog>
  );
}
