"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ComponentProps,
  type PointerEvent,
  type RefObject,
} from "react";

import { cn } from "@/shared/lib/cn";
import {
  cssVarColor,
  luminance,
  type Rgba,
} from "@/shared/lib/glass/css-color";
import {
  getGlassEngine,
  GLASS_LOST_EVENT,
  type GlassBackdrop,
  type GlassShapeSpec,
} from "@/shared/lib/glass/engine/glass-engine";
import { THEME_CHANGE_EVENT } from "@/shared/lib/theme";

/** A piece of glass inside a group, measured from its element. */
type ShapeEntry = {
  element: HTMLElement;
  radius: number;
  notch: number;
  lens: boolean;
  liquid: boolean;
};

type GroupContext = {
  register: (id: string, entry: ShapeEntry) => void;
  unregister: (id: string) => void;
  /** Redraw every frame for a while, e.g. while a selection moves. */
  animate: (ms?: number) => void;
};

const GlassGroupContext = createContext<GroupContext | null>(null);

/** Glass that changes shape keeps drawing this long after the change. */
const ANIMATE_MS = 700;
/** A liquid lens leaves a trail that shrinks away over this long. */
const TRAIL_MS = 480;
const PRESS_SCALE = 0.965;
const INK: Rgba = [0.059, 0.059, 0.078, 1];
const PAPER: Rgba = [0.961, 0.953, 0.925, 1];

/** Every group that wants a redraw, drawn together on the next frame. */
const pending = new Set<() => void>();
let flushFrame = 0;
function scheduleDraw(draw: () => void) {
  pending.add(draw);
  flushFrame ||= requestAnimationFrame(() => {
    flushFrame = 0;
    const draws = [...pending];
    pending.clear();
    draws.forEach((run) => run());
  });
}

type GlassGroupProps = ComponentProps<"div"> & {
  /** The group's own box is glass (default), with these corners. */
  self?: boolean;
  radius?: number;
  /** Size of the Notchs corner cut on the group's own box. */
  notch?: number;
  /**
   * What the glass bends: a snapshot of the page behind it (default), or
   * just the plain page colour.
   */
  backdrop?: "page" | "plain";
  /** A photo under the glass to bend instead, e.g. a card's own image. */
  image?: RefObject<HTMLImageElement | null>;
  /** Sticky or fixed: redraw while the page scrolls under it. */
  floating?: boolean;
  /** Custom property holding the glass colour (default `--glass-solid`). */
  tintVar?: string;
  tintAmount?: number;
  /** Share of the tint on the rim: low for clear glass, ~1 for coloured. */
  rimShare?: number;
  lensTint?: number;
  frost?: number;
  /** How far apart pieces of glass start to merge, px. */
  merge?: number;
  bezel?: number;
  shadow?: number;
  /** Space around the box for the shadow, px. */
  margin?: number;
  /** Presses in under the pointer, like a button. */
  pressable?: boolean;
  /**
   * Shown until the WebGL glass draws (or without WebGL): CSS glass, or
   * the component's own look, styled with `not-data-glass-ready:` classes.
   */
  fallback?: "glass" | "own";
  /** When this changes, redraw every frame for `animateFor` ms. */
  animateKey?: unknown;
  animateFor?: number;
};

type GroupOptions = {
  self: boolean;
  radius: number;
  notch: number;
  backdrop: "page" | "plain";
  image?: RefObject<HTMLImageElement | null>;
  tintVar: string;
  tintAmount?: number;
  rimShare: number;
  lensTint: number;
  frost: number;
  merge: number;
  bezel?: number;
  shadow?: number;
  margin: number;
};

type GroupState = {
  visible: boolean;
  animateUntil: number;
  /** Pointer position (client px) the light hovers over, or none. */
  light: [number, number] | null;
  press: number;
  pressTarget: number;
  trails: { shape: GlassShapeSpec; start: number }[];
  lastRects: Map<string, GlassShapeSpec>;
  frame: number;
};

type GroupRuntime = {
  element: HTMLDivElement | null;
  canvas: HTMLCanvasElement | null;
  shapes: Map<string, ShapeEntry>;
  state: GroupState;
  options: GroupOptions;
};

/** Measures the group and draws its glass. True while it is still moving. */
function drawGroup(runtime: GroupRuntime): boolean {
  const engine = getGlassEngine();
  const { element, canvas, state, shapes } = runtime;
  const {
    self,
    radius,
    notch,
    backdrop,
    image,
    tintVar,
    tintAmount,
    rimShare,
    lensTint,
    frost,
    merge,
    bezel,
    shadow,
    margin,
  } = runtime.options;
  if (!element || !canvas) return false;
  // No engine any more (the GPU context was lost): back to the CSS glass.
  if (!engine) {
    clearGlass(element, canvas, shapes);
    return false;
  }
  if (!state.visible) return false;

  // Screen box, and the factor from screen px to the element's own layout
  // px (it may be scaled, e.g. a card in the hero deck); the canvas lives
  // inside the element, so it is drawn at layout size and scaled with it.
  const box = element.getBoundingClientRect();
  if (!box.width || !box.height) return false;
  const layoutW = element.offsetWidth || box.width;
  const layoutH = element.offsetHeight || box.height;
  const k = layoutW / box.width;
  const now = performance.now();

  // Press spring.
  state.press += (state.pressTarget - state.press) * 0.35;
  if (Math.abs(state.pressTarget - state.press) < 0.001)
    state.press = state.pressTarget;

  const pieces: GlassShapeSpec[] = [];
  if (self) {
    const w = layoutW * state.press;
    const h = layoutH * state.press;
    pieces.push({
      x: margin + (layoutW - w) / 2,
      y: margin + (layoutH - h) / 2,
      w,
      h,
      radius,
      notch,
      lens: false,
    });
  }
  shapes.forEach((entry, id) => {
    const r = entry.element.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const shape: GlassShapeSpec = {
      x: (r.left - box.left) * k + margin,
      y: (r.top - box.top) * k + margin,
      w: r.width * k,
      h: r.height * k,
      radius: entry.radius,
      notch: entry.notch,
      lens: entry.lens,
    };
    // A liquid piece that jumped leaves a shrinking trail: the neck.
    const last = state.lastRects.get(id);
    if (
      entry.liquid &&
      last &&
      Math.hypot(last.x - shape.x, last.y - shape.y) > 6 &&
      !state.trails.some((t) => t.start === now)
    ) {
      state.trails.push({ shape: last, start: now });
      state.animateUntil = Math.max(state.animateUntil, now + TRAIL_MS);
    }
    state.lastRects.set(id, shape);
    pieces.push(shape);
  });
  state.trails = state.trails.filter((t) => now - t.start < TRAIL_MS);
  for (const trail of state.trails) {
    const k = 1 - (now - trail.start) / TRAIL_MS;
    const s = k * k;
    const { x, y, w, h } = trail.shape;
    pieces.push({
      ...trail.shape,
      x: x + (w * (1 - s)) / 2,
      y: y + (h * (1 - s)) / 2,
      w: w * s,
      h: h * s,
    });
  }

  // Nothing to draw (e.g. `self` turned off): clear, and show the fallback.
  if (!pieces.length) {
    clearGlass(element, canvas, shapes);
    return false;
  }

  const bg = cssVarColor(element, "--background", INK);
  const dark = luminance(bg) < 0.5;
  const photo = image?.current;
  let source: GlassBackdrop = { kind: backdrop };
  if (photo) {
    const r = photo.getBoundingClientRect();
    source = {
      kind: "image",
      image: photo,
      rect: {
        x: (r.left - box.left) * k + margin,
        y: (r.top - box.top) * k + margin,
        w: r.width * k,
        h: r.height * k,
      },
    };
  }

  const drawn = engine.render(
    {
      width: layoutW + margin * 2,
      height: layoutH + margin * 2,
      margin,
      docX: box.left + window.scrollX - margin,
      docY: box.top + window.scrollY - margin,
      shapes: pieces,
      merge,
      bezel: bezel ?? Math.min(18, layoutH / 2, layoutW / 2),
      lensBezel: 10,
      backdrop: source,
      bg,
      tint: cssVarColor(element, tintVar, dark ? INK : PAPER),
      tintAmount: tintAmount ?? (dark ? 0.42 : 0.5),
      rimShare,
      lensTint,
      frost,
      dark,
      // Over the pointer, or by default above the top-left of the glass.
      lightPos: state.light
        ? [
            (state.light[0] - box.left) * k + margin,
            (state.light[1] - box.top) * k + margin,
          ]
        : [margin + layoutW * 0.2, margin - 260],
      shadow: shadow ?? (dark ? 0.32 : 0.16),
    },
    canvas,
  );
  if (drawn) {
    canvas.style.left = `${-margin}px`;
    canvas.style.top = `${-margin}px`;
    canvas.style.width = `${layoutW + margin * 2}px`;
    canvas.style.height = `${layoutH + margin * 2}px`;
    element.dataset.glassReady = "";
    shapes.forEach((entry) => (entry.element.dataset.glassReady = ""));
  } else {
    clearGlass(element, canvas, shapes);
  }

  return now < state.animateUntil || state.press !== state.pressTarget;
}

/** Wipes the WebGL glass so the group's and pieces' fallback look shows. */
function clearGlass(
  element: HTMLElement,
  canvas: HTMLCanvasElement,
  shapes: Map<string, ShapeEntry>,
) {
  canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  delete element.dataset.glassReady;
  shapes.forEach((entry) => delete entry.element.dataset.glassReady);
}

/**
 * A group of Liquid Glass, drawn by the shared WebGL engine into a canvas
 * behind the group's content. The group's own box (unless `self` is false)
 * and every <GlassShape> inside it are pieces of one glass: close pieces
 * merge through a neck, lenses sit on top as raised bumps. The glass bends
 * a snapshot of the page behind it (glass is left out of that snapshot) or
 * a photo, reflects the room, and catches light leaning towards the
 * pointer.
 *
 * Redraws only when something changes: size, theme, pointer, press, a
 * moving selection, or (floating) scroll; and only while on screen. Without
 * WebGL or with reduced transparency it shows the CSS glass instead.
 */
export function GlassGroup({
  self = true,
  radius = 16,
  notch = 0,
  backdrop = "page",
  image,
  floating = false,
  tintVar = "--glass-solid",
  tintAmount,
  rimShare = 0.22,
  lensTint = 0.12,
  frost = 0.35,
  merge = 18,
  bezel,
  shadow,
  margin = 24,
  pressable = false,
  fallback = "glass",
  animateKey,
  animateFor = ANIMATE_MS,
  className,
  style,
  children,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  ref,
  ...props
}: GlassGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = useRef(new Map<string, ShapeEntry>());

  // Live values the draw loop reads without re-rendering.
  const live = useRef<GroupState>({
    visible: false,
    animateUntil: 0,
    light: null,
    press: 1,
    pressTarget: 1,
    trails: [] as { shape: GlassShapeSpec; start: number }[],
    lastRects: new Map<string, GlassShapeSpec>(),
    frame: 0,
  });

  const options: GroupOptions = {
    self,
    radius,
    notch,
    backdrop,
    image,
    tintVar,
    tintAmount,
    rimShare,
    lensTint,
    frost,
    merge,
    bezel,
    shadow,
    margin,
  };
  const optionsRef = useRef(options);
  const drawer = useRef<(() => void) | null>(null);

  // Stable: queues this group's draw for the next frame.
  const redraw = useCallback(() => {
    if (drawer.current) scheduleDraw(drawer.current);
  }, []);

  // New props (theme tint, radius…) take effect on the next draw.
  useEffect(() => {
    optionsRef.current = options;
    redraw();
  });

  const animate = useCallback(
    (ms = ANIMATE_MS) => {
      const state = live.current;
      state.animateUntil = Math.max(state.animateUntil, performance.now() + ms);
      redraw();
    },
    [redraw],
  );

  // Something the glass sits on moves (e.g. the map flies): follow it.
  useEffect(() => {
    if (animateKey !== undefined) animate(animateFor);
  }, [animateKey, animateFor, animate]);

  useEffect(() => {
    const engine = getGlassEngine();
    const element = groupRef.current;
    if (!engine || !element) return;
    const state = live.current;
    drawer.current = () => {
      const moving = drawGroup({
        element: groupRef.current,
        canvas: canvasRef.current,
        shapes: shapes.current,
        state,
        options: optionsRef.current,
      });
      if (moving) {
        cancelAnimationFrame(state.frame);
        state.frame = requestAnimationFrame(redraw);
      }
    };

    const visibility = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        if (state.visible) redraw();
      },
      { rootMargin: "200px" },
    );
    visibility.observe(element);
    const resize = new ResizeObserver(redraw);
    resize.observe(element);

    const scheme = window.matchMedia("(prefers-color-scheme: light)");
    // The theme flips CSS variables (read them once the styles apply) and
    // the page snapshot's colours, so that is retaken.
    const onTheme = () =>
      requestAnimationFrame(() => {
        if (backdrop === "page") engine.refreshPage();
        redraw();
      });
    window.addEventListener(THEME_CHANGE_EVENT, onTheme);
    scheme.addEventListener("change", onTheme);
    window.addEventListener("resize", redraw);
    window.addEventListener(GLASS_LOST_EVENT, redraw);
    // A strip inside the group scrolled: its pieces moved.
    element.addEventListener("scroll", redraw, {
      capture: true,
      passive: true,
    });
    if (floating) window.addEventListener("scroll", redraw, { passive: true });

    let offPage: (() => boolean) | undefined;
    if (backdrop === "page") {
      offPage = engine.onPage(redraw);
      const start = () => engine.loadPage();
      if ("requestIdleCallback" in window)
        window.requestIdleCallback(start, { timeout: 2500 });
      else setTimeout(start, 1200);
    }
    const photo = image?.current;
    photo?.addEventListener("load", redraw);

    return () => {
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener(THEME_CHANGE_EVENT, onTheme);
      scheme.removeEventListener("change", onTheme);
      window.removeEventListener("resize", redraw);
      window.removeEventListener(GLASS_LOST_EVENT, redraw);
      element.removeEventListener("scroll", redraw, { capture: true });
      window.removeEventListener("scroll", redraw);
      offPage?.();
      photo?.removeEventListener("load", redraw);
      cancelAnimationFrame(state.frame);
    };
  }, [redraw, floating, backdrop, image]);

  const context = useMemo<GroupContext>(
    () => ({
      register: (id, entry) => {
        shapes.current.set(id, entry);
        animate();
      },
      unregister: (id) => {
        shapes.current.delete(id);
        live.current.lastRects.delete(id);
        redraw();
      },
      animate,
    }),
    [animate, redraw],
  );

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      groupRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <GlassGroupContext value={context}>
      <div
        ref={setRef}
        data-glass=""
        // CSS glass shows until (or unless) the WebGL glass draws.
        data-glass-self={self && fallback === "glass" ? "" : undefined}
        className={cn("relative isolate", className)}
        style={{ ...style, ...(self && { borderRadius: radius }) }}
        onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
          onPointerMove?.(event);
          if (event.pointerType !== "mouse") return;
          live.current.light = [event.clientX, event.clientY];
          redraw();
        }}
        onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
          onPointerLeave?.(event);
          live.current.light = null;
          live.current.pressTarget = 1;
          animate(300);
        }}
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          onPointerDown?.(event);
          if (!pressable) return;
          live.current.pressTarget = PRESS_SCALE;
          animate(300);
          const release = () => {
            live.current.pressTarget = 1;
            animate(400);
            window.removeEventListener("pointerup", release);
            window.removeEventListener("pointercancel", release);
          };
          window.addEventListener("pointerup", release);
          window.addEventListener("pointercancel", release);
        }}
        {...props}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute -z-10"
        />
        {children}
      </div>
    </GlassGroupContext>
  );
}

type GlassShapeProps = ComponentProps<"div"> & {
  radius?: number;
  notch?: number;
  /** A raised selection lens that magnifies what is under it. */
  lens?: boolean;
  /** Leaves a shrinking trail when it moves, so it flows like liquid. */
  liquid?: boolean;
  /** Changes here (e.g. which option is selected) animate the glass. */
  motionKey?: unknown;
};

/**
 * A piece of glass inside a <GlassGroup>: its element's box becomes glass
 * that merges with the group's other pieces. Renders a plain div.
 */
export function GlassShape({
  radius = 14,
  notch = 0,
  lens = false,
  liquid = false,
  motionKey,
  ref,
  style,
  ...props
}: GlassShapeProps) {
  const group = use(GlassGroupContext);
  const id = useId();
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!group || !element) return;
    group.register(id, { element, radius, notch, lens, liquid });
    return () => group.unregister(id);
  }, [group, id, radius, notch, lens, liquid]);

  useEffect(() => {
    group?.animate();
  }, [group, motionKey]);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // A piece of the slab shows CSS glass until (or unless) the WebGL glass
  // draws, like a group's own box. Lenses are only a hover cue: none.
  return (
    <div
      ref={setRef}
      data-glass-shape={lens ? undefined : ""}
      style={{ borderRadius: radius, ...style }}
      {...props}
    />
  );
}

/** Lets custom controls inside a group trigger glass animation. */
export function useGlassGroup() {
  return use(GlassGroupContext);
}
