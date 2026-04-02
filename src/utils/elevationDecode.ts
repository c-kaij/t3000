/**
 * Decode Mapbox Terrain-RGB tile pixel data into elevation values.
 * Formula: height = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1
 */
export function decodeTerrainRGB(imageData: ImageData): Float32Array {
  const { width, height, data } = imageData;
  const elevations = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    elevations[i] = -10000 + (r * 65536 + g * 256 + b) * 0.1;
  }
  return elevations;
}

/**
 * Stitch a 3x3 grid of tile images onto a canvas and return elevation data.
 * Each tile is 512x512 (2x retina). Output is downsampled to resolution x resolution.
 */
export function stitchElevationTiles(
  images: HTMLImageElement[],
  resolution: number = 256
): { elevations: Float32Array; width: number; height: number } {
  const tileSize = 512; // @2x tiles
  const gridSize = 3;
  const fullSize = tileSize * gridSize; // 1536

  const canvas = document.createElement('canvas');
  canvas.width = fullSize;
  canvas.height = fullSize;
  const ctx = canvas.getContext('2d')!;

  // Draw 3x3 grid
  for (let i = 0; i < images.length; i++) {
    const col = i % gridSize;
    const row = Math.floor(i / gridSize);
    ctx.drawImage(images[i], col * tileSize, row * tileSize, tileSize, tileSize);
  }

  // Get full resolution image data
  const fullData = ctx.getImageData(0, 0, fullSize, fullSize);
  const fullElevations = decodeTerrainRGB(fullData);

  // Downsample to target resolution using bilinear sampling
  const result = new Float32Array(resolution * resolution);
  const scale = fullSize / resolution;

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const srcX = Math.min(Math.floor(x * scale), fullSize - 1);
      const srcY = Math.min(Math.floor(y * scale), fullSize - 1);
      result[y * resolution + x] = fullElevations[srcY * fullSize + srcX];
    }
  }

  return { elevations: result, width: resolution, height: resolution };
}

/**
 * Stitch satellite tile images onto a canvas and return as a texture source.
 */
export function stitchSatelliteTiles(images: HTMLImageElement[]): HTMLCanvasElement {
  const tileSize = 512;
  const gridSize = 3;
  const fullSize = tileSize * gridSize;

  const canvas = document.createElement('canvas');
  canvas.width = fullSize;
  canvas.height = fullSize;
  const ctx = canvas.getContext('2d')!;

  for (let i = 0; i < images.length; i++) {
    const col = i % gridSize;
    const row = Math.floor(i / gridSize);
    ctx.drawImage(images[i], col * tileSize, row * tileSize, tileSize, tileSize);
  }

  return canvas;
}
