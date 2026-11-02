import { createFullscreenProgram } from "@/shared/lib/glass/webgl";

/** Most glass shapes drawn at once; matches the uniform array in the shader. */
export const MAX_SHAPES = 10;

/**
 * Liquid Glass over the map. Every shape (x, y, radius in map pixels) is a
 * disc in one signed distance field, joined with a smooth minimum, so glass
 * that comes close merges through a neck like two drops of water.
 *
 * The glass is a thick slab: flat on top, so the middle shows the map as it
 * is, and curved at the rim, where the slope bends in map from beyond the
 * edge. Each colour bends a little differently (the rainbow fringe), light
 * from the top left catches the rim, and a soft shadow sits underneath.
 */
export const lensFragmentShader = `
precision highp float;
uniform sampler2D u_map;
uniform vec2 u_size;
uniform vec3 u_shapes[${MAX_SHAPES}];
uniform int u_count;
varying vec2 v_uv;

const float MERGE = 22.0;   // how far apart shapes start to merge
const float BEZEL = 15.0;   // width of the curved rim
const float BEND = 20.0;    // how far the steepest rim shifts the map
const float FROST = 0.2;    // white mixed into the glass

vec3 mapAt(vec2 px) {
  return texture2D(u_map, clamp(px / u_size, 0.0, 1.0)).rgb;
}

float smoothMin(float a, float b) {
  float h = max(MERGE - abs(a - b), 0.0) / MERGE;
  return min(a, b) - h * h * MERGE * 0.25;
}

float field(vec2 p) {
  float d = 1e5;
  for (int i = 0; i < ${MAX_SHAPES}; i++) {
    if (i >= u_count) break;
    d = smoothMin(d, length(p - u_shapes[i].xy) - u_shapes[i].z);
  }
  return d;
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
  vec2 p = v_uv * u_size;
  vec3 color = mapAt(p);
  float d = field(p);

  if (d > 18.0) {
    gl_FragColor = vec4(color, 1.0);
    return;
  }

  // Soft contact shadow, offset down as if lit from above.
  float below = field(p - vec2(0.0, 4.0));
  color *= 1.0 - 0.15 * exp(-max(below, 0.0) / 6.0) * step(0.0, d);

  // Outward normal of the merged shape.
  vec2 e = vec2(1.0, 0.0);
  vec2 n = normalize(vec2(
    field(p + e.xy) - field(p - e.xy),
    field(p + e.yx) - field(p - e.yx)
  ) + 1e-5);

  float depth = -d;
  float slope = depth > 0.0 ? rimSlope(depth / BEZEL) : 0.0;
  vec2 shift = n * slope * BEND;

  vec3 glass = vec3(
    mapAt(p + shift * 1.0).r,
    mapAt(p + shift * 0.96).g,
    mapAt(p + shift * 0.92).b
  );
  glass = mix(glass, vec3(1.0), FROST);

  // Light catching the rim: strong on the top-left edge, a kick on the
  // bottom right, and a thin bright line along the very edge.
  vec2 light = normalize(vec2(-0.6, -0.8));
  float lit = max(dot(n, light), 0.0);
  float back = max(dot(n, -light), 0.0);
  float edgeLine = 1.0 - smoothstep(0.0, 1.8, depth);
  glass += slope * (0.55 * lit * lit + 0.18 * back) + 0.35 * edgeLine;
  glass -= slope * 0.05 * back;

  float inside = smoothstep(0.8, -0.8, d);
  gl_FragColor = vec4(mix(color, clamp(glass, 0.0, 1.0), inside), 1.0);
}`;

/** Compiles the lens program. Null if WebGL fails. */
export function createLensProgram(gl: WebGLRenderingContext) {
  const program = createFullscreenProgram(gl, lensFragmentShader);
  if (!program) return null;
  return {
    size: gl.getUniformLocation(program, "u_size"),
    shapes: gl.getUniformLocation(program, "u_shapes"),
    count: gl.getUniformLocation(program, "u_count"),
  };
}
