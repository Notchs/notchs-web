import type { Rgba } from "../css-color";
import {
  getPageSnapshot,
  invalidatePageSnapshot,
  type PageSnapshot,
} from "../page-snapshot";
import { uploadTexture } from "../webgl";
import {
  BACKDROP,
  createGlassProgram,
  MAX_SHAPES,
  type GlassProgram,
} from "./glass-shader";

export type GlassRect = { x: number; y: number; w: number; h: number };

export type GlassShapeSpec = GlassRect & {
  radius: number;
  /** Size of the Notchs corner cut, 0 for none. */
  notch: number;
  /** A raised selection lens rather than part of the slab. */
  lens: boolean;
};

export type GlassBackdrop =
  | { kind: "plain" }
  | { kind: "page" }
  | { kind: "image"; image: HTMLImageElement; rect: GlassRect };

/** Everything needed to draw one glass group. Lengths in CSS px. */
export type GlassSpec = {
  /** Canvas size, including `margin` on every side for the shadow. */
  width: number;
  height: number;
  margin: number;
  /** Where the canvas's top-left corner sits in the document. */
  docX: number;
  docY: number;
  shapes: GlassShapeSpec[];
  merge: number;
  bezel: number;
  lensBezel: number;
  backdrop: GlassBackdrop;
  bg: Rgba;
  tint: Rgba;
  tintAmount: number;
  /** Share of the tint on the rim: low for clear glass, ~1 for coloured. */
  rimShare: number;
  lensTint: number;
  frost: number;
  dark: boolean;
  /** Where the point light hovers, in canvas px. */
  lightPos: [number, number];
  shadow: number;
};

type ImageTexture = {
  src: string;
  sharp: WebGLTexture | null;
  soft: WebGLTexture | null;
  width: number;
  height: number;
};

/** How much smaller the soft (frost) copy of a texture is. */
const FROST_DOWNSCALE = 12;

function softCopy(source: CanvasImageSource, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width / FROST_DOWNSCALE));
  canvas.height = Math.max(1, Math.round(height / FROST_DOWNSCALE));
  const context = canvas.getContext("2d");
  if (context) {
    context.imageSmoothingQuality = "high";
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
  }
  return canvas;
}

/** Texture coordinates of an image drawn with `object-fit: cover` into `rect`. */
function coverUv(image: ImageTexture, rect: GlassRect) {
  const imageRatio = image.width / image.height;
  const boxRatio = rect.w / rect.h;
  if (imageRatio > boxRatio) {
    const span = boxRatio / imageRatio;
    return [(1 - span) / 2, 0, span, 1];
  }
  const span = imageRatio / boxRatio;
  return [0, (1 - span) / 2, 1, span];
}

/**
 * One WebGL context for every piece of glass on the page (browsers allow
 * only a few). It draws a group into an offscreen canvas and copies the
 * result into the group's own 2D canvas, which sits behind its content.
 */
class GlassEngine {
  private readonly canvas = document.createElement("canvas");
  private readonly gl: WebGLRenderingContext | null;
  private readonly program: GlassProgram | null;
  private readonly images = new WeakMap<HTMLImageElement, ImageTexture>();
  private page: {
    snapshot: PageSnapshot;
    sharp: WebGLTexture | null;
    soft: WebGLTexture | null;
  } | null = null;
  private pageLoading: Promise<void> | null = null;
  private readonly pageListeners = new Set<() => void>();
  readonly scale = Math.min(window.devicePixelRatio || 1, 3);

  constructor() {
    this.gl = this.canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    this.program = this.gl ? createGlassProgram(this.gl) : null;
  }

  get ready() {
    return !!this.program;
  }

  /** Calls `listener` whenever a new page snapshot arrives. */
  onPage(listener: () => void) {
    this.pageListeners.add(listener);
    return () => this.pageListeners.delete(listener);
  }

  /**
   * Drops the page snapshot (e.g. the theme changed, so its colours are
   * wrong); glass shows the plain page colour until the next one arrives.
   */
  dropPage() {
    if (this.page && this.gl) {
      this.gl.deleteTexture(this.page.sharp);
      this.gl.deleteTexture(this.page.soft);
    }
    this.page = null;
  }

  /**
   * Retakes the page snapshot after the page changed look (theme): glass
   * shows the plain page colour meanwhile. Safe to call from many groups.
   */
  refreshPage() {
    if (this.pageLoading) return;
    this.dropPage();
    invalidatePageSnapshot();
    this.loadPage();
  }

  /** Takes (or retakes) the page snapshot that the glass refracts. */
  loadPage() {
    const gl = this.gl;
    if (!gl || this.pageLoading) return;
    this.pageLoading = getPageSnapshot().then((snapshot) => {
      this.pageLoading = null;
      if (!snapshot) return;
      if (this.page) {
        gl.deleteTexture(this.page.sharp);
        gl.deleteTexture(this.page.soft);
      }
      this.page = {
        snapshot,
        sharp: uploadTexture(gl, snapshot.page, 0),
        soft: uploadTexture(gl, snapshot.frost, 1),
      };
      (window as unknown as { __GLASSDEBUG: unknown }).__GLASSDEBUG = snapshot;
      this.pageListeners.forEach((listener) => listener());
    });
  }

  private imageTexture(image: HTMLImageElement) {
    const gl = this.gl;
    const src = image.currentSrc || image.src;
    if (!gl || !image.complete || !image.naturalWidth) return null;
    const known = this.images.get(image);
    if (known && known.src === src) return known;
    if (known) {
      gl.deleteTexture(known.sharp);
      gl.deleteTexture(known.soft);
    }
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const texture: ImageTexture = {
      src,
      sharp: uploadTexture(gl, image, 0),
      soft: uploadTexture(gl, softCopy(image, width, height), 1),
      width,
      height,
    };
    this.images.set(image, texture);
    return texture;
  }

  /** Draws `spec` into `target`. False when nothing could be drawn. */
  render(spec: GlassSpec, target: HTMLCanvasElement) {
    const gl = this.gl;
    const u = this.program;
    if (!gl || !u) return false;

    const pxW = Math.max(1, Math.ceil(spec.width * this.scale));
    const pxH = Math.max(1, Math.ceil(spec.height * this.scale));
    if (this.canvas.width < pxW || this.canvas.height < pxH) {
      this.canvas.width = Math.max(this.canvas.width, pxW);
      this.canvas.height = Math.max(this.canvas.height, pxH);
    }
    gl.viewport(0, 0, pxW, pxH);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Backdrop: the plain page colour until a page snapshot or photo is ready.
    let backdrop: number = BACKDROP.plain;
    if (spec.backdrop.kind === "page" && this.page) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.page.sharp);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.page.soft);
      gl.uniform2f(
        u.pageSize,
        this.page.snapshot.width,
        this.page.snapshot.height,
      );
      backdrop = BACKDROP.page;
    } else if (spec.backdrop.kind === "image") {
      const texture = this.imageTexture(spec.backdrop.image);
      if (texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.sharp);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture.soft);
        const { rect } = spec.backdrop;
        gl.uniform4f(u.imageRect, rect.x, rect.y, rect.w, rect.h);
        const [ux, uy, uw, uh] = coverUv(texture, rect);
        gl.uniform4f(u.imageUv, ux, uy, uw, uh);
        backdrop = BACKDROP.image;
      }
    }
    gl.uniform1i(u.backdrop, backdrop);

    const shapes = new Float32Array(MAX_SHAPES * 4);
    const info = new Float32Array(MAX_SHAPES * 4);
    const count = Math.min(spec.shapes.length, MAX_SHAPES);
    for (let i = 0; i < count; i++) {
      const s = spec.shapes[i];
      shapes.set([s.x, s.y, s.w, s.h], i * 4);
      info.set(
        [Math.min(s.radius, s.w / 2, s.h / 2), s.notch, s.lens ? 1 : 0, 0],
        i * 4,
      );
    }

    gl.uniform2f(u.viewPx, pxW, pxH);
    gl.uniform1f(u.dpr, this.scale);
    gl.uniform2f(u.docOrigin, spec.docX, spec.docY);
    gl.uniform4fv(u.shapes, shapes);
    gl.uniform4fv(u.shapeInfo, info);
    gl.uniform1i(u.count, count);
    gl.uniform1f(u.merge, spec.merge);
    gl.uniform1f(u.bezel, spec.bezel);
    gl.uniform1f(u.lensBezel, spec.lensBezel);
    gl.uniform3f(u.bg, spec.bg[0], spec.bg[1], spec.bg[2]);
    gl.uniform3f(u.tint, spec.tint[0], spec.tint[1], spec.tint[2]);
    gl.uniform1f(u.tintAmount, spec.tintAmount);
    gl.uniform1f(u.rimShare, spec.rimShare);
    gl.uniform1f(u.lensTint, spec.lensTint);
    gl.uniform1f(u.frost, spec.frost);
    gl.uniform1f(u.dark, spec.dark ? 1 : 0);
    gl.uniform2f(u.lightPos, spec.lightPos[0], spec.lightPos[1]);
    gl.uniform1f(u.shadow, spec.shadow);
    gl.uniform1f(u.margin, spec.margin);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Copy out before the frame ends (the offscreen buffer is not kept).
    if (target.width !== pxW || target.height !== pxH) {
      target.width = pxW;
      target.height = pxH;
    }
    const context = target.getContext("2d");
    if (!context) return false;
    context.clearRect(0, 0, pxW, pxH);
    context.drawImage(
      this.canvas,
      0,
      this.canvas.height - pxH,
      pxW,
      pxH,
      0,
      0,
      pxW,
      pxH,
    );
    return true;
  }
}

let engine: GlassEngine | null | undefined;

/**
 * The shared glass engine, or null where WebGL is missing or the viewer
 * asked for reduced transparency (CSS glass is used instead).
 */
export function getGlassEngine() {
  if (engine !== undefined) return engine;
  if (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-transparency: reduce)").matches
  ) {
    engine = null;
    return engine;
  }
  const created = new GlassEngine();
  engine = created.ready ? created : null;
  return engine;
}

export type { GlassEngine };
