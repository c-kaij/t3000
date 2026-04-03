/** Convert longitude to tile X at a given zoom level */
export function lng2tileX(lng: number, zoom: number): number {
  return Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
}

/** Convert latitude to tile Y at a given zoom level */
export function lat2tileY(lat: number, zoom: number): number {
  const latRad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
}

/** Convert tile X back to longitude */
export function tileX2lng(x: number, zoom: number): number {
  return (x / Math.pow(2, zoom)) * 360 - 180;
}

/** Convert tile Y back to latitude */
export function tileY2lat(y: number, zoom: number): number {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, zoom);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

/**
 * Get an NxN grid of tile coordinates centered on a lat/lng.
 * @param radius - half-size: 1 = 3×3, 2 = 5×5, 3 = 7×7 (default 1)
 */
export function getTileGrid(
  lat: number,
  lng: number,
  zoom: number,
  radius = 1,
): { x: number; y: number; z: number }[] {
  const centerX = lng2tileX(lng, zoom);
  const centerY = lat2tileY(lat, zoom);
  const tiles: { x: number; y: number; z: number }[] = [];
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      tiles.push({ x: centerX + dx, y: centerY + dy, z: zoom });
    }
  }
  return tiles;
}

/** Get the real-world width of a tile in meters at a given latitude and zoom */
export function tileWidthMeters(lat: number, zoom: number): number {
  const earthCircumference = 40075016.686;
  const latRad = (lat * Math.PI) / 180;
  return (earthCircumference * Math.cos(latRad)) / Math.pow(2, zoom);
}
