/**
 * Bumped when the team preview switches a page's state, so open queries
 * load again. Real data never changes this.
 */
let version = 0;
const listeners = new Set<() => void>();

export const getDataVersion = () => version;

export function subscribeDataVersion(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function bumpDataVersion() {
  version += 1;
  listeners.forEach((listener) => listener());
}
