"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { cn } from "@/shared/lib/cn";

import { QR_MODULES, buildQrPattern } from "../lib/qr-pattern";

/** One module is 4 x 4 CSS pixels, so the code is 200 x 200. */
const MODULE_PX = 4;
const QR_PX = QR_MODULES * MODULE_PX;
const REVEAL_MS = 1800;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

/** Fisher-Yates shuffle, so light modules appear in a random order. */
function shuffle(items: number[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Starts as a solid Ink square; light modules turn Paper one by one in random
 * order until the code takes shape. Then the logo drops in and a scan line
 * sweeps up and down. Reduced motion shows the finished code at once.
 */
export function AccessQr() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const pattern = useMemo(() => buildQrPattern(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Whole-number scale keeps every module edge sharp on retina screens.
    const scale = Math.max(1, Math.round(window.devicePixelRatio || 1));
    canvas.width = QR_PX * scale;
    canvas.height = QR_PX * scale;
    ctx.scale(scale, scale);

    const root = getComputedStyle(document.documentElement);
    const ink = root.getPropertyValue("--ink").trim();
    const paper = root.getPropertyValue("--paper").trim();

    const light: number[] = [];
    pattern.forEach((dark, i) => {
      if (!dark) light.push(i);
    });
    shuffle(light);

    ctx.fillStyle = ink;
    ctx.fillRect(0, 0, QR_PX, QR_PX);
    ctx.fillStyle = paper;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reduced ? 0 : REVEAL_MS;

    let painted = 0;
    let start: number | undefined;
    let frame = requestAnimationFrame(function tick(now) {
      start ??= now;
      const progress = duration ? Math.min(1, (now - start) / duration) : 1;
      const target = Math.round(easeInOut(progress) * light.length);
      for (; painted < target; painted++) {
        const cell = light[painted];
        ctx.fillRect(
          (cell % QR_MODULES) * MODULE_PX,
          Math.floor(cell / QR_MODULES) * MODULE_PX,
          MODULE_PX,
          MODULE_PX,
        );
      }
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setReady(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [pattern]);

  return (
    <div className="rounded-2xl bg-paper p-5">
      <div className="relative" style={{ width: QR_PX, height: QR_PX }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Sample Notchs QR code with the Notchs logo in the centre"
          className="block size-full [image-rendering:pixelated]"
        />
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 left-1/2 grid size-10 -translate-1/2 place-items-center rounded-lg bg-ink text-paper transition-[opacity,scale] duration-500 ease-notch",
            ready ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <NotchGlyph className="size-6" />
        </span>
        {ready && (
          <span
            aria-hidden="true"
            className="absolute -inset-x-3 h-1 animate-scan rounded-full border-y border-ink bg-volt motion-reduce:hidden"
          />
        )}
      </div>
    </div>
  );
}
