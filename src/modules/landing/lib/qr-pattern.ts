/** Modules per side of the access QR: 50 x 4 px = 200 px. */
export const QR_MODULES = 50;

/** Small, repeatable random numbers, so every render draws the same code. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A QR-looking grid (1 = dark module, 0 = light). It has the three corner
 * squares, timing lines and an alignment square of a real code, random data
 * elsewhere and a clear centre for the logo. It does not scan.
 *
 * Example: `buildQrPattern(25)[0]` is 1, the top-left corner square.
 */
export function buildQrPattern(size = QR_MODULES, seed = 145): Uint8Array {
  const grid = new Uint8Array(size * size);
  const fixed = new Uint8Array(size * size);

  const set = (x: number, y: number, dark: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    grid[y * size + x] = dark ? 1 : 0;
    fixed[y * size + x] = 1;
  };

  // Corner squares, each with a one-module light border around it.
  const finder = (left: number, top: number) => {
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        const inside = x >= 0 && x <= 6 && y >= 0 && y <= 6;
        const ring = x === 0 || x === 6 || y === 0 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        set(left + x, top + y, inside && (ring || core));
      }
    }
  };
  finder(0, 0);
  finder(size - 7, 0);
  finder(0, size - 7);

  for (let i = 8; i < size - 8; i++) {
    set(i, 6, i % 2 === 0);
    set(6, i, i % 2 === 0);
  }

  const align = size - 7;
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      set(align + x, align + y, Math.max(Math.abs(x), Math.abs(y)) !== 1);
    }
  }

  const logo = logoModules(size);
  const logoStart = Math.floor((size - logo) / 2);
  for (let y = logoStart; y < logoStart + logo; y++) {
    for (let x = logoStart; x < logoStart + logo; x++) set(x, y, false);
  }

  const random = seededRandom(seed);
  for (let i = 0; i < grid.length; i++) {
    if (!fixed[i]) grid[i] = random() < 0.5 ? 1 : 0;
  }
  return grid;
}

/** Width of the clear centre, in modules: about a quarter of the code. */
export function logoModules(size: number) {
  return Math.round(size * 0.24);
}
