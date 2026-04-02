import * as THREE from 'three';
import { tileWidthMeters } from '../utils/tileUtils';

export interface MountainGeometryData {
  elevations: Float32Array;
  width: number;
  height: number;
}

/**
 * Build a Three.js mesh from elevation data.
 * worldScale: meters per Three.js unit (shared across all mountains)
 */
export function buildMountainMesh(
  data: MountainGeometryData,
  satelliteCanvas: HTMLCanvasElement,
  lat: number,
  zoom: number,
  worldScale: number
): {
  mesh: THREE.Mesh;
  topoMaterial: THREE.MeshStandardMaterial;
  satMaterial: THREE.MeshStandardMaterial;
  wireframe: THREE.LineSegments;
  elevations: Float32Array;
} {
  const { elevations, width, height } = data;

  // Real-world size of the 3x3 tile grid in meters
  const tileMeterWidth = tileWidthMeters(lat, zoom) * 3;
  const planeSize = tileMeterWidth / worldScale;

  const geometry = new THREE.PlaneGeometry(planeSize, planeSize, width - 1, height - 1);
  geometry.rotateX(-Math.PI / 2);

  const positions = geometry.attributes.position;
  let minElev = Infinity;
  let maxElev = -Infinity;

  // Set Y (elevation) for each vertex
  for (let i = 0; i < positions.count; i++) {
    const elev = elevations[i] || 0;
    positions.setY(i, elev / worldScale);
    if (elev < minElev) minElev = elev;
    if (elev > maxElev) maxElev = elev;
  }

  geometry.computeVertexNormals();

  // Satellite material
  const satTexture = new THREE.CanvasTexture(satelliteCanvas);
  satTexture.colorSpace = THREE.SRGBColorSpace;
  const satMaterial = new THREE.MeshStandardMaterial({
    map: satTexture,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Topographic material - vertex colors based on elevation bands
  const colors = new Float32Array(positions.count * 3);
  const elevRange = maxElev - minElev || 1;

  for (let i = 0; i < positions.count; i++) {
    const elev = elevations[i] || 0;
    const t = (elev - minElev) / elevRange;
    const color = getTopoColor(t);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const topoMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0.0,
  });

  const mesh = new THREE.Mesh(geometry, satMaterial);
  mesh.receiveShadow = true;
  mesh.castShadow = true;

  // Wireframe for topo mode
  const wireGeo = new THREE.WireframeGeometry(geometry);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.08,
    transparent: true,
  });
  const wireframe = new THREE.LineSegments(wireGeo, wireMat);
  wireframe.visible = false;

  return { mesh, topoMaterial, satMaterial, wireframe, elevations };
}

function getTopoColor(t: number): THREE.Color {
  // Green (low) -> Brown -> Gray -> White (high)
  if (t < 0.2) {
    return new THREE.Color().lerpColors(
      new THREE.Color(0x2d5a27),
      new THREE.Color(0x5a8a3c),
      t / 0.2
    );
  } else if (t < 0.4) {
    return new THREE.Color().lerpColors(
      new THREE.Color(0x5a8a3c),
      new THREE.Color(0x8a7a52),
      (t - 0.2) / 0.2
    );
  } else if (t < 0.65) {
    return new THREE.Color().lerpColors(
      new THREE.Color(0x8a7a52),
      new THREE.Color(0x7a7a7a),
      (t - 0.4) / 0.25
    );
  } else if (t < 0.85) {
    return new THREE.Color().lerpColors(
      new THREE.Color(0x7a7a7a),
      new THREE.Color(0xc0c0c0),
      (t - 0.65) / 0.2
    );
  } else {
    return new THREE.Color().lerpColors(
      new THREE.Color(0xc0c0c0),
      new THREE.Color(0xffffff),
      (t - 0.85) / 0.15
    );
  }
}
