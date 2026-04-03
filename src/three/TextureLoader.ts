import { getTileGrid } from '../utils/tileUtils';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

function tileUrl(tileset: string, z: number, x: number, y: number): string {
  return `https://api.mapbox.com/v4/${tileset}/${z}/${x}/${y}@2x.png?access_token=${MAPBOX_TOKEN}`;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

export async function fetchTerrainTiles(
  lat: number,
  lng: number,
  zoom: number,
  radius = 1,
): Promise<HTMLImageElement[]> {
  const tiles = getTileGrid(lat, lng, zoom, radius);
  return Promise.all(
    tiles.map((t) => loadImage(tileUrl('mapbox.terrain-rgb', t.z, t.x, t.y)))
  );
}

export async function fetchSatelliteTiles(
  lat: number,
  lng: number,
  zoom: number,
  radius = 1,
): Promise<HTMLImageElement[]> {
  const tiles = getTileGrid(lat, lng, zoom, radius);
  return Promise.all(
    tiles.map((t) => loadImage(tileUrl('mapbox.satellite', t.z, t.x, t.y)))
  );
}
