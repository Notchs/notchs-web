"use client";

import { useEffect, useRef } from "react";

import { uploadTexture } from "@/shared/lib/glass/webgl";

import { createLensProgram, MAX_SHAPES } from "../lib/lens-shader";

/** A glass lens in map pixels; `r` is the radius it settles at. */
export type Lens = { id: string; x: number; y: number; r: number };

/** Where the travelling drop rests: the active stop, in map pixels. */
export type DropTarget = { x: number; y: number };

type MapLensProps = {
  src: string;
  width: number;
  height: number;
  lenses: Lens[];
  drop: DropTarget;
  /** Called with true once the glass draws, false if WebGL is unavailable. */
  onReady: (ready: boolean) => void;
};

/** Spring for lens radius changes (hover): pull and damping per frame. */
const SPRING_K = 0.16;
const SPRING_DAMP = 0.72;
/** The drop: its radius (hidden under the 56px active pin) and travel time. */
const DROP_R = 25;
const DROP_MS = 1100;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Liquid Glass level 4: the map redrawn in WebGL with thick glass under each
 * pin. When the active stop changes, a glass drop pulls out of the old pin,
 * stretches a neck, pinches off and travels to the new one, merging with any
 * pin it passes. Sits in the map layer right above the image, so it moves
 * and zooms with it, and draws only while something changes. Without WebGL,
 * or with reduced transparency, it reports not ready and the pins keep CSS
 * glass.
 */
export function MapLens({
  src,
  width,
  height,
  lenses,
  drop,
  onReady,
}: MapLensProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<(() => void) | null>(null);
  const lensesRef = useRef(lenses);
  const dropRef = useRef({
    from: drop,
    to: drop,
    start: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      window.matchMedia("(prefers-reduced-transparency: reduce)").matches
    ) {
      onReady(false);
      return;
    }
    // preserveDrawingBuffer keeps the frame readable for page snapshots (the
    // access card's glass refracts the page, map included).
    const gl = canvas.getContext("webgl", {
      antialias: false,
      preserveDrawingBuffer: true,
    });
    const program = gl && createLensProgram(gl);
    if (!gl || !program) {
      onReady(false);
      return;
    }

    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(program.size, width, height);

    // Current radius and speed per lens, eased towards its target.
    const springs = new Map<string, { r: number; v: number }>();
    let frame = 0;
    let cancelled = false;

    const render = (now: number) => {
      frame = 0;
      const data = new Float32Array(MAX_SHAPES * 3);
      let moving = false;

      const visible = lensesRef.current.slice(0, MAX_SHAPES - 1);
      visible.forEach((lens, i) => {
        const spring = springs.get(lens.id) ?? { r: lens.r, v: 0 };
        spring.v = (spring.v + (lens.r - spring.r) * SPRING_K) * SPRING_DAMP;
        spring.r += spring.v;
        if (Math.abs(lens.r - spring.r) > 0.05 || Math.abs(spring.v) > 0.05)
          moving = true;
        else spring.r = lens.r;
        springs.set(lens.id, spring);
        data.set([lens.x, lens.y, spring.r], i * 3);
      });

      const travel = dropRef.current;
      const t = travel.start ? Math.min((now - travel.start) / DROP_MS, 1) : 1;
      if (t < 1) moving = true;
      const k = easeInOut(t);
      data.set(
        [
          travel.from.x + (travel.to.x - travel.from.x) * k,
          travel.from.y + (travel.to.y - travel.from.y) * k,
          DROP_R,
        ],
        visible.length * 3,
      );

      gl.uniform3fv(program.shapes, data);
      gl.uniform1i(program.count, visible.length + 1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (moving) frame = requestAnimationFrame(render);
    };

    drawRef.current = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const image = new Image();
    image.src = src;
    image
      .decode()
      .then(() => {
        if (cancelled) return;
        uploadTexture(gl, image);
        render(performance.now());
        onReady(true);
      })
      .catch(() => onReady(false));

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      drawRef.current = null;
      onReady(false);
    };
  }, [src, width, height, onReady]);

  // Redraw (and spring) whenever the lenses change.
  useEffect(() => {
    lensesRef.current = lenses;
    drawRef.current?.();
  }, [lenses]);

  // Sends the drop from wherever it is now towards the new active stop.
  useEffect(() => {
    const travel = dropRef.current;
    if (travel.to.x === drop.x && travel.to.y === drop.y) return;
    const now = performance.now();
    const t = travel.start ? Math.min((now - travel.start) / DROP_MS, 1) : 1;
    const k = easeInOut(t);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    dropRef.current = {
      from: {
        x: travel.from.x + (travel.to.x - travel.from.x) * k,
        y: travel.from.y + (travel.to.y - travel.from.y) * k,
      },
      to: drop,
      start: reduced ? 0 : now,
    };
    if (reduced) dropRef.current.from = drop;
    drawRef.current?.();
  }, [drop]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
