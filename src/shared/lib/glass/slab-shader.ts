import { createFullscreenProgram } from "./webgl";

/**
 * A slab of thick glass over a snapshot of the page, drawn on a canvas that
 * covers the viewport. Everything is in CSS pixels of the viewport.
 *
 * The slab is a rounded rectangle in a signed distance field; while it
 * opens it is joined to the button it grew from with a smooth minimum, so
 * the glass stretches a neck out of the button and pinches off, like the map
 * pins. Its rim is clear and bends the page beyond the edge, each colour a
 * little differently; its middle is frosted and washed with the theme's
 * glass colour (white or Ink), strongly enough on light glass that dark
 * content behind turns to light frost rather than a dark patch;
 * light from the top left (leaning towards the pointer) catches the rim; and
 * a soft shadow falls below. The page under the glass is dimmed by the same
 * amount as the dialog backdrop, so it matches what is around it.
 */
const slabFragmentShader = `
precision highp float;
uniform sampler2D u_page;
uniform sampler2D u_frost;
uniform vec2 u_view;
uniform vec2 u_scroll;
uniform vec2 u_pageSize;
uniform vec4 u_slab;
uniform float u_radius;
uniform vec4 u_origin;
uniform float u_originRadius;
uniform float u_originOn;
uniform vec2 u_light;
uniform float u_dim;
uniform vec3 u_tint;
uniform float u_tintAmount;
varying vec2 v_uv;

const vec3 INK = vec3(0.059, 0.059, 0.078);
const float MERGE = 46.0;   // how far apart the slab and button start to merge
const float BEZEL = 26.0;   // width of the curved rim
const float BEND = 30.0;    // how far the steepest rim shifts the page
const float RIM_SHARE = 0.2;  // share of the tint the clear rim gets

float roundRect(vec2 p, vec4 rect, float r) {
  vec2 extent = rect.zw * 0.5;
  vec2 q = abs(p - rect.xy - extent) - extent + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float smoothMin(float a, float b) {
  float h = max(MERGE - abs(a - b), 0.0) / MERGE;
  return min(a, b) - h * h * MERGE * 0.25;
}

float field(vec2 p) {
  float d = roundRect(p, u_slab, u_radius);
  if (u_originOn > 0.5) d = smoothMin(d, roundRect(p, u_origin, u_originRadius));
  return d;
}

vec3 pageAt(vec2 p) {
  vec2 uv = (p + u_scroll) / u_pageSize;
  return texture2D(u_page, clamp(uv, 0.0, 1.0)).rgb;
}

// The frost copy is tiny; a few spread taps smooth it into a soft haze.
vec3 frostAt(vec2 p) {
  vec2 uv = (p + u_scroll) / u_pageSize;
  vec2 tap = 18.0 / u_pageSize;
  vec3 sum = texture2D(u_frost, uv).rgb * 2.0;
  sum += texture2D(u_frost, uv + vec2(tap.x, 0.0)).rgb;
  sum += texture2D(u_frost, uv - vec2(tap.x, 0.0)).rgb;
  sum += texture2D(u_frost, uv + vec2(0.0, tap.y)).rgb;
  sum += texture2D(u_frost, uv - vec2(0.0, tap.y)).rgb;
  return sum / 6.0;
}

// Thick glass profile: steep at the edge (s = 0), flat on top (s = 1).
float rimHeight(float s) {
  return pow(1.0 - pow(1.0 - clamp(s, 0.0, 1.0), 4.0), 0.25);
}

float rimSlope(float s) {
  float steepest = (rimHeight(0.05) - rimHeight(0.03)) / 0.02;
  float slope = (rimHeight(s + 0.01) - rimHeight(s - 0.01)) / 0.02;
  return clamp(slope / steepest, 0.0, 1.0);
}

void main() {
  vec2 p = v_uv * u_view;
  float d = field(p);

  // Soft shadow below the glass.
  float below = field(p - vec2(0.0, 16.0));
  float shadow = 0.3 * exp(-max(below, 0.0) / 18.0) *
    (1.0 - smoothstep(24.0, 56.0, below));
  if (d > 60.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec2 e = vec2(1.0, 0.0);
  vec2 n = normalize(vec2(
    field(p + e.xy) - field(p - e.xy),
    field(p + e.yx) - field(p - e.yx)
  ) + 1e-5);

  float depth = -d;
  float s = depth / BEZEL;
  float slope = depth > 0.0 ? rimSlope(s) : 0.0;
  vec2 shift = n * slope * BEND;

  vec3 rim = vec3(
    pageAt(p + shift * 1.0).r,
    pageAt(p + shift * 0.95).g,
    pageAt(p + shift * 0.9).b
  );
  rim = mix(mix(rim, INK, u_dim), u_tint, u_tintAmount * RIM_SHARE);

  vec3 haze = mix(mix(frostAt(p), INK, u_dim), u_tint, u_tintAmount);
  vec3 glass = mix(rim, haze, smoothstep(0.25, 0.95, s));

  vec2 light = normalize(vec2(-0.6, -0.8) + u_light * 0.9);
  float lit = max(dot(n, light), 0.0);
  float back = max(dot(n, -light), 0.0);
  float edgeLine = 1.0 - smoothstep(0.0, 1.6, depth);
  glass += slope * (0.6 * lit * lit + 0.16 * back) + 0.32 * edgeLine;

  float inside = smoothstep(0.8, -0.8, d);
  vec4 outside = vec4(0.0, 0.0, 0.0, shadow);
  vec4 surface = vec4(clamp(glass, 0.0, 1.0), 1.0);
  gl_FragColor = mix(outside, surface, inside);
}`;

/** Compiles the slab program and looks up its uniforms. Null if WebGL fails. */
export function createSlabProgram(gl: WebGLRenderingContext) {
  const program = createFullscreenProgram(gl, slabFragmentShader);
  if (!program) return null;
  const at = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform1i(at("u_page"), 0);
  gl.uniform1i(at("u_frost"), 1);
  return {
    view: at("u_view"),
    scroll: at("u_scroll"),
    pageSize: at("u_pageSize"),
    slab: at("u_slab"),
    radius: at("u_radius"),
    origin: at("u_origin"),
    originRadius: at("u_originRadius"),
    originOn: at("u_originOn"),
    light: at("u_light"),
    dim: at("u_dim"),
    tint: at("u_tint"),
    tintAmount: at("u_tintAmount"),
  };
}
