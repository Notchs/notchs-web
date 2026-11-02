"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { cn } from "@/shared/lib/cn";
import { THEME_CHANGE_EVENT } from "@/shared/lib/theme";

import { QR_MODULES, buildQrPattern } from "../lib/qr-pattern";

/** One module is 4 x 4 CSS pixels, so the code is 200 x 200. */
const MODULE_PX = 4;
const QR_PX = QR_MODULES * MODULE_PX;
const REVEAL_MS = 1800;
/** Modules left empty around the centre, so the logo sits in a clear gap. */
const LOGO_MODULES = 12;

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

/** Fisher-Yates shuffle, so modules appear in a random order. */
function shuffle(items: number[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Starts empty; the code's modules appear one by one in random order, drawn
 * straight onto the glass in the theme's text colour (dark on light, or
 * light on dark, which phone cameras read too), with a clear gap in the
 * middle for the logo. Then the logo drops in and a scan line sweeps up and
 * down. Switching theme repaints it
 * at once; reduced motion shows the finished code straight away.
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

    const gapStart = (QR_MODULES - LOGO_MODULES) / 2;
    const inLogoGap = (i: number) => {
      const x = i % QR_MODULES;
      const y = Math.floor(i / QR_MODULES);
      return (
        x >= gapStart &&
        x < gapStart + LOGO_MODULES &&
        y >= gapStart &&
        y < gapStart + LOGO_MODULES
      );
    };
    const dark: number[] = [];
    pattern.forEach((isDark, i) => {
      if (isDark && !inLogoGap(i)) dark.push(i);
    });
    shuffle(dark);

    const paint = (count: number) => {
      ctx.clearRect(0, 0, QR_PX, QR_PX);
      ctx.fillStyle = getComputedStyle(canvas).color;
      for (let i = 0; i < count; i++) {
        const cell = dark[i];
        ctx.fillRect(
          (cell % QR_MODULES) * MODULE_PX,
          Math.floor(cell / QR_MODULES) * MODULE_PX,
          MODULE_PX,
          MODULE_PX,
        );
      }
    };

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reduced ? 0 : REVEAL_MS;

    let painted = 0;
    let start: number | undefined;
    let frame = requestAnimationFrame(function tick(now) {
      start ??= now;
      const progress = duration ? Math.min(1, (now - start) / duration) : 1;
      painted = Math.round(easeInOut(progress) * dark.length);
      paint(painted);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setReady(true);
    });

    // A theme change swaps the colours; repaint what is shown so far.
    const repaint = () => requestAnimationFrame(() => paint(painted));
    const scheme = window.matchMedia("(prefers-color-scheme: light)");
    window.addEventListener(THEME_CHANGE_EVENT, repaint);
    scheme.addEventListener("change", repaint);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(THEME_CHANGE_EVENT, repaint);
      scheme.removeEventListener("change", repaint);
    };
  }, [pattern]);

  return (
    <div className="p-5">
      <div className="relative" style={{ width: QR_PX, height: QR_PX }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Sample Notchs QR code with the Notchs logo in the centre"
          className="block size-full text-foreground [image-rendering:pixelated]"
        />
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 left-1/2 grid size-10 -translate-1/2 place-items-center text-foreground transition-[opacity,scale] duration-500 ease-notch",
            ready ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <NotchGlyph className="size-7" />
        </span>
        {ready && (
          <span
            aria-hidden="true"
            className="absolute -inset-x-3 h-1 animate-scan rounded-full border-y border-foreground/40 bg-volt motion-reduce:hidden"
          />
        )}
      </div>
    </div>
  );
}
