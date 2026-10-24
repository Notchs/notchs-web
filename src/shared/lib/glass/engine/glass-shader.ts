import { createFullscreenProgram } from "../webgl";

/** Most shapes one glass group can hold (including liquid trails). */
export const MAX_SHAPES = 12;
/** What a glass group sees through itself. */
export const BACKDROP = { plain: 0, page: 1, image: 2 } as const;

/**
 * Liquid glass, physically based, for one group of shapes. All lengths are
 * CSS px in the group's canvas (top-left origin); `u_docOrigin` places that
 * canvas in the document, so the page snapshot lines up exactly.
 *
 * Geometry: each shape is a rounded rectangle, optionally with the Notchs
 * corner cut. Base shapes are joined with a smooth minimum, so glass that
 * comes close merges through a neck; lens shapes (selection markers) sit on
 * top as a raised bump. Together they form a height field: a thick slab,
 * flat on top, rounding off over the bezel, plus the bump.
 *
 * Optics, per pixel:
 * - surface normal from the height field's gradient;
 * - refraction by Snell's law (n = 1.5) for each colour channel with a
 *   slightly different index, so the rim splits light into a rainbow;
 * - the bent ray travels through the glass to the backdrop, which is a
 *   snapshot of the page or a photo (the plain page colour until one is
 *   ready), blurred by frost towards the flat middle;
 * - a tint of the theme's glass colour; clear glass tints its rim less
 *   (`u_rimShare`), coloured glass (buttons) is coloured right through;
 * - Fresnel (Schlick) reflection of a soft studio: brighter above, darker
 *   below, with a window highlight from the light direction;
 * - a Blinn–Phong specular from a point light hovering above the pointer
 *   (or above the top-left when there is none), so the gloss is a spot
 *   that follows the pointer rather than a wash over the flat top;
 * - a soft contact shadow below the glass.
 */
const glassFragmentShader = `
precision highp float;

uniform vec2 u_viewPx;
uniform float u_dpr;
uniform vec2 u_docOrigin;

uniform vec4 u_shapes[${MAX_SHAPES}];
uniform vec4 u_shapeInfo[${MAX_SHAPES}];
uniform int u_count;
uniform float u_merge;
uniform float u_bezel;
uniform float u_lensBezel;

uniform int u_backdrop;
uniform sampler2D u_tex;
uniform sampler2D u_frostTex;
uniform vec2 u_pageSize;
uniform vec4 u_imageRect;
uniform vec4 u_imageUv;

uniform vec3 u_bg;

uniform vec3 u_tint;
uniform float u_tintAmount;
uniform float u_rimShare;
uniform float u_lensTint;
uniform float u_frost;
uniform float u_dark;
uniform vec2 u_lightPos;
uniform float u_shadow;
uniform float u_margin;

const float SLAB = 16.0;      // slab height at the flat top, px
const float BUMP = 9.0;       // extra height of a lens, px
const float GAP = 10.0;       // glass top to backdrop, px
const float MAX_SHIFT = 46.0; // longest refraction offset, px
const vec3 VIEW = vec3(0.0, 0.0, 1.0);
const float LIGHT_HEIGHT = 240.0; // the point light hovers this far above, px

float roundRect(vec2 p, vec4 rect, float r) {
  vec2 extent = rect.zw * 0.5;
  vec2 q = abs(p - rect.xy - extent) - extent + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// The Notchs corner cut: a straight 60 degree cut off the bottom-right.
float notched(vec2 p, vec4 rect, float r, float cut) {
  float d = roundRect(p, rect, r);
  if (cut <= 0.0) return d;
  vec2 corner = rect.xy + rect.zw;
  vec2 a = corner - vec2(0.0, cut);
  vec2 n = normalize(vec2(cut, cut * 0.57));
  return max(d, dot(p - a, n));
}

float smoothMin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

// x: base field, y: lens field (signed distances, negative inside).
vec2 fields(vec2 p) {
  float base = 1e4;
  float lens = 1e4;
  for (int i = 0; i < ${MAX_SHAPES}; i++) {
    if (i >= u_count) break;
    vec4 info = u_shapeInfo[i];
    float d = notched(p, u_shapes[i], info.x, info.y);
    if (info.z > 0.5) lens = smoothMin(lens, d, u_merge * 0.7);
    else base = smoothMin(base, d, u_merge);
  }
  return vec2(base, lens);
}

// Convex squircle profile: steep at the edge, flat on top.
float profile(float depth, float bezel) {
  float s = clamp(depth / bezel, 0.0, 1.0);
  return pow(1.0 - pow(1.0 - s, 4.0), 0.25);
}

float heightAt(vec2 p) {
  vec2 f = fields(p);
  return SLAB * profile(-f.x, u_bezel) + BUMP * profile(-f.y, u_lensBezel);
}

// What lies behind the glass at a point, sharp (frost 0) to soft (frost 1).
vec3 backdrop(vec2 local, float frost) {
  vec2 doc = u_docOrigin + local;
  if (u_backdrop == 1) {
    vec2 uv = doc / u_pageSize;
    if (uv.x >= 0.0 && uv.y >= 0.0 && uv.x <= 1.0 && uv.y <= 1.0) {
      vec3 sharp = texture2D(u_tex, uv).rgb;
      vec3 soft = texture2D(u_frostTex, uv).rgb;
      return mix(sharp, soft, frost);
    }
  } else if (u_backdrop == 2) {
    vec2 inImage = (local - u_imageRect.xy) / u_imageRect.zw;
    if (inImage.x >= 0.0 && inImage.y >= 0.0 && inImage.x <= 1.0 && inImage.y <= 1.0) {
      vec2 uv = inImage * u_imageUv.zw + u_imageUv.xy;
      vec3 sharp = texture2D(u_tex, uv).rgb;
      vec3 soft = texture2D(u_frostTex, uv).rgb;
      return mix(sharp, soft, frost);
    }
  }
  return u_bg;
}

vec3 studio(vec3 r, vec3 light) {
  float up = clamp(-r.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 low = u_dark > 0.5 ? vec3(0.05, 0.05, 0.07) : vec3(0.78, 0.78, 0.8);
  vec3 high = u_dark > 0.5 ? vec3(0.42, 0.42, 0.46) : vec3(1.0);
  vec3 sky = mix(low, high, smoothstep(0.15, 0.95, up));
  float window = pow(max(dot(normalize(r), light), 0.0), 28.0);
  return sky + window * (u_dark > 0.5 ? 0.6 : 0.35);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_viewPx.y - gl_FragCoord.y) / u_dpr;
  vec2 f = fields(p);
  float d = min(f.x, f.y);

  // Outside the glass: only the contact shadow, fading out before the edge.
  vec4 shadow = vec4(0.0);
  if (d > 0.0) {
    float below = fields(p - vec2(0.0, 6.0)).x;
    float shade = u_shadow * exp(-max(below, 0.0) / 12.0) *
      (1.0 - smoothstep(u_margin * 0.4, u_margin * 0.95, below));
    shadow = vec4(0.0, 0.0, 0.0, shade);
    if (d > 0.8) {
      gl_FragColor = shadow;
      return;
    }
  }

  // Surface normal from the height field.
  float h = heightAt(p);
  vec2 grad = vec2(
    heightAt(p + vec2(1.0, 0.0)) - heightAt(p - vec2(1.0, 0.0)),
    heightAt(p + vec2(0.0, 1.0)) - heightAt(p - vec2(0.0, 1.0))
  ) * 0.5;
  vec3 n = normalize(vec3(-grad, 1.0));

  // Refraction through the slab, one index per colour channel.
  vec3 incident = vec3(0.0, 0.0, -1.0);
  float travel = h + GAP;
  vec3 rr = refract(incident, n, 1.0 / 1.5);
  vec3 rg = refract(incident, n, 1.0 / 1.515);
  vec3 rb = refract(incident, n, 1.0 / 1.53);
  vec2 shiftR = clamp(rr.xy / max(-rr.z, 0.25) * travel, -MAX_SHIFT, MAX_SHIFT);
  vec2 shiftG = clamp(rg.xy / max(-rg.z, 0.25) * travel, -MAX_SHIFT, MAX_SHIFT);
  vec2 shiftB = clamp(rb.xy / max(-rb.z, 0.25) * travel, -MAX_SHIFT, MAX_SHIFT);

  float core = smoothstep(0.15, 0.9, -f.x / u_bezel);
  float frost = u_frost * core;
  vec3 seen = vec3(
    backdrop(p + shiftR, frost).r,
    backdrop(p + shiftG, frost).g,
    backdrop(p + shiftB, frost).b
  );

  // Tint: the theme's glass colour, lighter on the rim, more on a lens.
  float inLens = smoothstep(0.8, -0.8, f.y);
  float tint = u_tintAmount * mix(u_rimShare, 1.0, core);
  seen = mix(seen, u_tint, clamp(tint + inLens * u_lensTint, 0.0, 1.0));

  // Reflection: Fresnel-weighted studio environment.
  vec3 light = normalize(vec3(u_lightPos - p, LIGHT_HEIGHT));
  vec3 reflected = reflect(incident, n);
  float cosTheta = clamp(dot(n, VIEW), 0.0, 1.0);
  float fresnel = 0.04 + 0.96 * pow(1.0 - cosTheta, 5.0);
  vec3 color = mix(seen, studio(reflected, light), clamp(fresnel * 2.2, 0.0, 1.0));

  // Specular highlight and the bright line along the very edge.
  vec3 halfway = normalize(light + VIEW);
  // A tight sparkle (it must never wash out text) plus a faint broad sheen.
  float sparkle = u_dark > 0.5 ? 0.22 : 0.4;
  float spec = pow(max(dot(n, halfway), 0.0), 700.0) * sparkle +
    pow(max(dot(n, halfway), 0.0), 18.0) * (u_dark > 0.5 ? 0.015 : 0.04);
  // Coloured glass keeps only a trace of the edge line: no hairline border.
  float edge = (1.0 - smoothstep(0.0, 1.4, -d)) * mix(1.0, 0.15, u_rimShare);
  // Light catching the rim: a glint, never a drawn border.
  color += spec + edge * (u_dark > 0.5 ? 0.12 : 0.16);

  float inside = smoothstep(0.8, -0.8, d);
  gl_FragColor = mix(shadow, vec4(clamp(color, 0.0, 1.0), 1.0), inside);
}`;

/** Compiles the glass program and looks up its uniforms. Null if WebGL fails. */
export function createGlassProgram(gl: WebGLRenderingContext) {
  const program = createFullscreenProgram(gl, glassFragmentShader);
  if (!program) return null;
  const at = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(at("u_tex"), 0);
  gl.uniform1i(at("u_frostTex"), 1);
  return {
    viewPx: at("u_viewPx"),
    dpr: at("u_dpr"),
    docOrigin: at("u_docOrigin"),
    shapes: at("u_shapes"),
    shapeInfo: at("u_shapeInfo"),
    count: at("u_count"),
    merge: at("u_merge"),
    bezel: at("u_bezel"),
    lensBezel: at("u_lensBezel"),
    backdrop: at("u_backdrop"),
    pageSize: at("u_pageSize"),
    imageRect: at("u_imageRect"),
    imageUv: at("u_imageUv"),
    bg: at("u_bg"),
    tint: at("u_tint"),
    tintAmount: at("u_tintAmount"),
    rimShare: at("u_rimShare"),
    lensTint: at("u_lensTint"),
    frost: at("u_frost"),
    dark: at("u_dark"),
    lightPos: at("u_lightPos"),
    shadow: at("u_shadow"),
    margin: at("u_margin"),
  };
}

export type GlassProgram = NonNullable<ReturnType<typeof createGlassProgram>>;
