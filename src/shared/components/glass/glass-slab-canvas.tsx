"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/shared/lib/cn";
import { getGlassEngine } from "@/shared/lib/glass/engine/glass-engine";
import {
  canSnapshotPage,
  getPageSnapshot,
} from "@/shared/lib/glass/page-snapshot";
import { createSlabProgram } from "@/shared/lib/glass/slab-shader";
import { uploadTexture } from "@/shared/lib/glass/webgl";

/** How the WebGL glass came in: grown out of the button, faded in, or not at all. */
export type SlabMode = "morph" | "fade" | "off";

type GlassSlabCanvasProps = {
  /** The element whose box the glass covers. */
  slabRef: RefObject<HTMLElement | null>;
  /** Corner radius of that element, in px. */
  radius: number;
  /** Where the glass grows from (the button that opened it), if anywhere. */
  origin: DOMRect | null;
  /** How much the page around the glass is dimmed (the dialog backdrop). */
  dim: number;
  onMode: (mode: SlabMode) => void;
};

/** Length of the grow-out-of-the-button animation. */
const MORPH_MS = 750;
/** A snapshot ready within this long after opening still gets the morph. */
const MORPH_WINDOW_MS = 150;
/** Keep drawing every frame this long, while the dialog settles into place. */
const SETTLE_MS = 900;

/** Ease-out with a little overshoot, like glass with weight settling. */
const settleEase = (t: number) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Ink, as 0–1 channels: the tint when the theme gives none. */
const INK: [number, number, number] = [0.059, 0.059, 0.078];

/**
 * How strongly the middle is washed with the tint: light glass needs more,
 * so dark content behind it frosts over instead of showing as a dark patch.
 */
const LIGHT_TINT = 0.8;
const DARK_TINT = 0.32;

/**
 * The glass colour of the theme in effect on `element` (`--glass-solid`:
 * white on Paper, Ink on Ink), as 0–1 channels for the shader's tint. The
 * value may be minified (`#fff`) or any CSS colour, so a 2D context, which
 * normalises colours to `#rrggbb`, parses it.
 */
function glassTint(element: Element): [number, number, number] {
  const value = getComputedStyle(element)
    .getPropertyValue("--glass-solid")
    .trim();
  const known = tintCache.get(value);
  if (known) return known;
  const parser = document.createElement("canvas").getContext("2d");
  if (!value || !parser) return INK;
  parser.fillStyle = value;
  const hex = String(parser.fillStyle).replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return INK;
  const tint = [0, 2, 4].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  ) as [number, number, number];
  tintCache.set(value, tint);
  return tint;
}

/** Parsed tints by CSS value; a theme only ever has a couple. */
const tintCache = new Map<string, [number, number, number]>();

/**
 * Liquid Glass level 4 over regular page content: a canvas over the viewport
 * that draws a slab of real glass where `slabRef` sits, refracting a
 * snapshot of the page that stays aligned as the page scrolls. When the
 * snapshot is already warm it grows out of `origin`, stretching a neck from
 * the button and pinching off. Reports `off` without WebGL, without a
 * snapshot, or with reduced transparency, so the caller keeps its CSS glass.
 */
export function GlassSlabCanvas({
  slabRef,
  radius,
  origin,
  dim,
  onMode,
}: GlassSlabCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Off until the glass first draws; a morph appears at once, a fade eases in.
  const [shown, setShown] = useState<SlabMode>("off");

  useEffect(() => {
    const canvas = canvasRef.current;
    // Same rules as the rest of the glass: no WebGL slab with reduced
    // transparency, on a slow device, after a lost context, or where the page
    // is never snapshotted (phones and tablets).
    if (!canvas || !getGlassEngine() || !canSnapshotPage()) {
      onMode("off");
      return;
    }
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    const program = gl && createSlabProgram(gl);
    if (!gl || !program) {
      onMode("off");
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const openedAt = performance.now();
    let frame = 0;
    let cancelled = false;
    let ready = false;
    let morphStart = 0;
    let settleUntil = 0;
    let pageSize: [number, number] = [1, 1];
    const light = { x: 0, y: 0 };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (now: number) => {
      frame = 0;
      const element = slabRef.current;
      const slab = element?.getBoundingClientRect();
      if (!ready || !element || !slab) return;

      let rect = [slab.x, slab.y, slab.width, slab.height];
      let r = radius;
      let originOn = 0;
      let originRect = [0, 0, 0, 0];
      let originRadius = 0;
      let moving = now < settleUntil;

      if (morphStart && origin) {
        const t = Math.min((now - morphStart) / MORPH_MS, 1);
        const k = settleEase(t);
        rect = [
          mix(origin.x, slab.x, k),
          mix(origin.y, slab.y, k),
          mix(origin.width, slab.width, k),
          mix(origin.height, slab.height, k),
        ];
        r = mix(origin.height / 2, radius, Math.min(k, 1));
        // The button-shaped glass stays, then shrinks away: the neck pinches.
        const shrink = 1 - Math.min(Math.max((t - 0.35) / 0.5, 0), 1);
        if (shrink > 0) {
          originOn = 1;
          const w = origin.width * shrink;
          const h = origin.height * shrink;
          originRect = [
            origin.x + (origin.width - w) / 2,
            origin.y + (origin.height - h) / 2,
            w,
            h,
          ];
          originRadius = h / 2;
        }
        if (t < 1) moving = true;
      }

      gl.uniform2f(program.view, window.innerWidth, window.innerHeight);
      gl.uniform2f(program.scroll, window.scrollX, window.scrollY);
      gl.uniform2f(program.pageSize, pageSize[0], pageSize[1]);
      gl.uniform4f(program.slab, rect[0], rect[1], rect[2], rect[3]);
      gl.uniform1f(program.radius, Math.min(r, rect[2] / 2, rect[3] / 2));
      gl.uniform4f(
        program.origin,
        originRect[0],
        originRect[1],
        originRect[2],
        originRect[3],
      );
      gl.uniform1f(program.originRadius, originRadius);
      gl.uniform1f(program.originOn, originOn);
      gl.uniform2f(program.light, light.x, light.y);
      gl.uniform1f(program.dim, dim);
      const tint = glassTint(element);
      const luminance = 0.2126 * tint[0] + 0.7152 * tint[1] + 0.0722 * tint[2];
      gl.uniform3f(program.tint, ...tint);
      gl.uniform1f(
        program.tintAmount,
        luminance > 0.5 ? LIGHT_TINT : DARK_TINT,
      );
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (moving) frame = requestAnimationFrame(render);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onResize = () => {
      resize();
      schedule();
    };

    const onPointer = (event: PointerEvent) => {
      const slab = slabRef.current?.getBoundingClientRect();
      if (!slab || event.pointerType !== "mouse") return;
      light.x = Math.max(
        -1,
        Math.min(1, (event.clientX - slab.x - slab.width / 2) / slab.width),
      );
      light.y = Math.max(
        -1,
        Math.min(1, (event.clientY - slab.y - slab.height / 2) / slab.height),
      );
      schedule();
    };

    resize();
    getPageSnapshot().then((snapshot) => {
      if (cancelled) return;
      if (!snapshot) {
        onMode("off");
        return;
      }
      uploadTexture(gl, snapshot.page, 0);
      uploadTexture(gl, snapshot.frost, 1);
      pageSize = [snapshot.width, snapshot.height];
      ready = true;

      const now = performance.now();
      const morph =
        !!origin && !reducedMotion && now - openedAt < MORPH_WINDOW_MS;
      morphStart = morph ? now : 0;
      settleUntil = now + SETTLE_MS;
      onMode(morph ? "morph" : "fade");
      setShown(morph ? "morph" : "fade");
      schedule();
    });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [slabRef, radius, origin, dim, onMode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 size-full",
        shown === "off" && "opacity-0",
        shown === "fade" &&
          "transition-opacity duration-300 motion-reduce:transition-none starting:opacity-0",
      )}
    />
  );
}
