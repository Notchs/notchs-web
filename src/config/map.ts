/**
 * Map tiles for every MapLibre map. OpenFreeMap serves free OpenStreetMap
 * vector tiles with no key or account; the team agreed to it as the only map
 * host. Add a host here only with the team's agreement (CLAUDE.md §5).
 */
export const mapConfig = {
  /** A quiet light base map, so venue pins stand out. */
  style: "https://tiles.openfreemap.org/styles/positron",
  /** Ahmedabad, for when there are no venues to fit the map to. */
  city: { center: [72.5714, 23.0225] as [number, number], zoom: 11.5 },
  minZoom: 9,
  maxZoom: 18,
} as const;
