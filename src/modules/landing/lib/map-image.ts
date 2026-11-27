/**
 * The area the still map image (assets/ahmedabad-map.webp) covers, so points
 * can move between % on the image and [longitude, latitude] on the live map.
 */
export const MAP_IMAGE = {
  width: 1280,
  height: 1024,
  west: 72.419,
  east: 72.6433,
  north: 23.1196,
  south: 22.9592,
};

const spanLng = MAP_IMAGE.east - MAP_IMAGE.west;
const spanLat = MAP_IMAGE.north - MAP_IMAGE.south;

/** % across and down the still image to [longitude, latitude]. */
export const imageToLngLat = (x: number, y: number): [number, number] => [
  MAP_IMAGE.west + (spanLng * x) / 100,
  MAP_IMAGE.north - (spanLat * y) / 100,
];

/** [longitude, latitude] to % across and down the still image. */
export const lngLatToImage = ([lng, lat]: [number, number]) => ({
  x: ((lng - MAP_IMAGE.west) / spanLng) * 100,
  y: ((MAP_IMAGE.north - lat) / spanLat) * 100,
});

/** Whether a point at these % falls on the still image. */
export const onImage = ({ x, y }: { x: number; y: number }) =>
  x >= 0 && x <= 100 && y >= 0 && y <= 100;
