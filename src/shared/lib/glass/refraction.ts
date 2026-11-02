/** Set on <html> where glass may bend the content behind it (Level 3). */
export const REFRACTION_ATTRIBUTE = "data-glass-refraction";

/**
 * Runs before first paint. Refraction uses an SVG filter inside
 * `backdrop-filter`, which only Chromium renders; Safari and Firefox keep the
 * frosted glass. `navigator.userAgentData` exists only in Chromium.
 */
export const glassInitScript = `(function(){try{if(navigator.userAgentData&&!matchMedia("(prefers-reduced-transparency: reduce)").matches)document.documentElement.setAttribute("${REFRACTION_ATTRIBUTE}","")}catch(e){}})()`;

export function refractionEnabled() {
  return document.documentElement.hasAttribute(REFRACTION_ATTRIBUTE);
}

/**
 * Height of thick glass across its rim, from the edge (s = 0) to where the
 * top turns flat (s = 1): a convex squircle, steep at the edge and flat in
 * the middle, so the centre shows the content undistorted.
 */
function rimHeight(s: number) {
  return Math.pow(1 - Math.pow(1 - s, 4), 0.25);
}

/** Rim slope, normalised so the steepest usable point is 1. */
function rimSlope(s: number) {
  const ds = 0.01;
  const at = (x: number) =>
    (rimHeight(Math.min(x + ds, 1)) - rimHeight(Math.max(x - ds, 0))) /
    (2 * ds);
  return Math.min(at(s) / at(0.04), 1);
}

/** Light from the top left and slightly in front, as in Apple's renders. */
const LIGHT = (() => {
  const [x, y, z] = [-0.55, -0.7, 0.45];
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
})();

export type LensMaps = { displacement: string; specular: string; core: string };

/**
 * Builds the two maps a rounded-rectangle lens needs, as PNG data URLs.
 *
 * Displacement: red and green shift sampling on x and y. Neutral (128) on
 * the flat top; along the rim it follows the slope, pulling content in from
 * further inside, so it compresses into the curve like the edge of a thick
 * slab. (A backdrop holds only what is behind the element, so the lens may
 * not reach beyond its edge.)
 *
 * Specular: white light catching the rim, brightest where the curved edge
 * faces the light (top left) with a weaker kick on the opposite edge.
 *
 * Core: opaque over the flat top, fading out across the rim, so a filter can
 * frost the middle more heavily while the rim stays clear.
 */
export function createLensMaps(
  width: number,
  height: number,
  radius: number,
  bezel: number,
): LensMaps | null {
  const canvases = [0, 1, 2].map(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  });
  const contexts = canvases.map((canvas) => canvas.getContext("2d"));
  const [displacementContext, specularContext, coreContext] = contexts;
  if (!displacementContext || !specularContext || !coreContext) return null;

  const displacement = displacementContext.createImageData(width, height);
  const specular = specularContext.createImageData(width, height);
  const core = coreContext.createImageData(width, height);
  const halfW = width / 2;
  const halfH = height / 2;
  const r = Math.min(radius, halfW, halfH);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Signed distance to the rounded rectangle (negative inside).
      const px = x + 0.5 - halfW;
      const py = y + 0.5 - halfH;
      const qx = Math.abs(px) - (halfW - r);
      const qy = Math.abs(py) - (halfH - r);
      const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
      const depth = -(outside + Math.min(Math.max(qx, qy), 0) - r);

      // Outward normal of the nearest edge.
      let nx = 0;
      let ny = 0;
      if (qx > 0 && qy > 0) {
        nx = qx / (outside || 1);
        ny = qy / (outside || 1);
      } else if (qx > qy) {
        nx = 1;
      } else {
        ny = 1;
      }
      nx *= Math.sign(px);
      ny *= Math.sign(py);

      const i = (y * width + x) * 4;
      const s = Math.min(Math.max(depth / bezel, 0), 1);
      const slope = depth > 0 && s < 1 ? rimSlope(s) : 0;

      displacement.data[i] = 128 - nx * slope * 127;
      displacement.data[i + 1] = 128 - ny * slope * 127;
      displacement.data[i + 2] = 128;
      displacement.data[i + 3] = 255;

      // Surface normal of the rim, lit from LIGHT, seen from straight above.
      const tilt = slope * 1.6;
      const length = Math.hypot(nx * tilt, ny * tilt, 1);
      const facing =
        (nx * tilt * LIGHT[0] + ny * tilt * LIGHT[1] + LIGHT[2]) / length;
      const rimLine = depth > 0 ? Math.max(0, 1 - depth / 1.8) : 0;
      const highlight =
        Math.pow(Math.max(facing - LIGHT[2] / length, 0), 1.4) * slope * 1.3 +
        Math.pow(Math.max(-facing + LIGHT[2] / length, 0), 2) * slope * 0.35 +
        rimLine * 0.55;
      specular.data[i] = 255;
      specular.data[i + 1] = 255;
      specular.data[i + 2] = 255;
      specular.data[i + 3] = Math.min(highlight, 1) * 255;

      const coreAlpha = Math.min(Math.max((s - 0.3) / 0.55, 0), 1);
      core.data[i] = 255;
      core.data[i + 1] = 255;
      core.data[i + 2] = 255;
      core.data[i + 3] = coreAlpha * coreAlpha * 255;
    }
  }

  displacementContext.putImageData(displacement, 0, 0);
  specularContext.putImageData(specular, 0, 0);
  coreContext.putImageData(core, 0, 0);
  return {
    displacement: canvases[0].toDataURL(),
    specular: canvases[1].toDataURL(),
    core: canvases[2].toDataURL(),
  };
}
