import * as THREE from 'three';
import { tileWidthMeters } from '../utils/tileUtils';

export interface MountainGeometryData {
  elevations: Float32Array;
  width: number;
  height: number;
}

export interface MountainMeshResult {
  mesh: THREE.Mesh;
  topoMaterial: THREE.MeshLambertMaterial;
  satMaterial: THREE.MeshLambertMaterial;
  elevations: Float32Array;
}

/**
 * Build a Three.js terrain mesh from elevation data.
 * Uses MeshLambertMaterial (no PBR complexity) so it renders reliably
 * under any lighting setup.
 */
export function buildMountainMesh(
  data: MountainGeometryData,
  satelliteCanvas: HTMLCanvasElement,
  lat: number,
  zoom: number,
  worldScale: number,
  gridSize = 3, // number of tiles per side (3 = 3×3, 5 = 5×5, etc.)
): MountainMeshResult {
  const { elevations, width, height } = data;

  // Real-world footprint of the NxN tile grid in Three.js units
  const tileMeterWidth = tileWidthMeters(lat, zoom) * gridSize;
  const planeSize = tileMeterWidth / worldScale;

  // --- Geometry ---------------------------------------------------------------
  const geometry = new THREE.PlaneGeometry(planeSize, planeSize, width - 1, height - 1);
  // Rotate from XY-plane (default) → XZ-plane so Y = elevation
  geometry.rotateX(-Math.PI / 2);

  const positions = geometry.attributes.position as THREE.BufferAttribute;
  let minElev = Infinity;
  let maxElev = -Infinity;

  for (let i = 0; i < positions.count; i++) {
    const elev = elevations[i] ?? 0;
    positions.setY(i, elev / worldScale);
    if (elev < minElev) minElev = elev;
    if (elev > maxElev) maxElev = elev;
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  // --- Satellite material ------------------------------------------------------
  const satTexture = new THREE.CanvasTexture(satelliteCanvas);
  satTexture.colorSpace = THREE.SRGBColorSpace;
  const satMaterial = new THREE.MeshLambertMaterial({ map: satTexture });

  // --- Topographic material (vertex colours by elevation band) -----------------
  const elevRange = maxElev - minElev || 1;
  const colours = new Float32Array(positions.count * 3);

  for (let i = 0; i < positions.count; i++) {
    const t = ((elevations[i] ?? 0) - minElev) / elevRange;
    const c = topoColour(t);
    colours[i * 3]     = c.r;
    colours[i * 3 + 1] = c.g;
    colours[i * 3 + 2] = c.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colours, 3));

  const topoMaterial = new THREE.MeshLambertMaterial({ vertexColors: true });

  // --- Mesh -------------------------------------------------------------------
  const mesh = new THREE.Mesh(geometry, satMaterial);
  mesh.name = 'terrain';

  return { mesh, topoMaterial, satMaterial, elevations };
}

// ---------------------------------------------------------------------------
// Colour ramp: green → brown → grey → white  (low → high)
// ---------------------------------------------------------------------------
function topoColour(t: number): THREE.Color {
  const stops: [number, THREE.Color][] = [
    [0.00, new THREE.Color(0x2d5a27)],
    [0.20, new THREE.Color(0x5a8a3c)],
    [0.40, new THREE.Color(0x8a7a52)],
    [0.65, new THREE.Color(0x7a7a7a)],
    [0.85, new THREE.Color(0xc0c0c0)],
    [1.00, new THREE.Color(0xffffff)],
  ];

  for (let i = 1; i < stops.length; i++) {
    const [lo, cLo] = stops[i - 1];
    const [hi, cHi] = stops[i];
    if (t <= hi) {
      const alpha = (t - lo) / (hi - lo);
      return new THREE.Color().lerpColors(cLo, cHi, alpha);
    }
  }
  return new THREE.Color(0xffffff);
}
