import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { setupScene, animateCameraTo, type SceneContext } from './three/SceneSetup';
import { buildMountainMesh } from './three/MountainMesh';
import { fetchTerrainTiles, fetchSatelliteTiles } from './three/TextureLoader';
import { stitchElevationTiles, stitchSatelliteTiles } from './utils/elevationDecode';
import {
  createHeightReferencePlanes,
  createScaleBar,
} from './three/HeightReferencePlanes';
import mountains from './data/mountains';
import type { MountainData } from './data/mountains';

import MountainSelector from './components/MountainSelector';
import InfoPanel from './components/InfoPanel';
import ViewToggle from './components/ViewToggle';
import SceneControls from './components/SceneControls';
import Legend from './components/Legend';
import LoadingOverlay from './components/LoadingOverlay';

// Shared world scale: 1 Three.js unit = WORLD_SCALE meters
const WORLD_SCALE = 200;
// Spacing between mountains in meters
const MOUNTAIN_SPACING = 25000;

interface MountainSceneData {
  mesh: THREE.Mesh;
  wireframe: THREE.LineSegments;
  topoMaterial: THREE.MeshStandardMaterial;
  satMaterial: THREE.MeshStandardMaterial;
  elevations: Float32Array;
  mountainData: MountainData;
  position: THREE.Vector3;
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneCtxRef = useRef<SceneContext | null>(null);
  const mountainRefs = useRef<MountainSceneData[]>([]);
  const heightPlanesRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number>(0);

  const [selected, setSelected] = useState<[string, string, string]>([
    'everest',
    'k2',
    'matterhorn',
  ]);
  const [viewMode, setViewMode] = useState<'satellite' | 'topographic'>('satellite');
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState('Initializing...');
  const [elevationsMap, setElevationsMap] = useState<Record<string, Float32Array>>({});

  const selectedMountains = selected.map(
    (id) => mountains.find((m) => m.id === id)!
  );

  const hasToken = !!import.meta.env.VITE_MAPBOX_TOKEN;

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = setupScene(containerRef.current);
    sceneCtxRef.current = ctx;

    // Animation loop
    function animate() {
      animFrameRef.current = requestAnimationFrame(animate);
      ctx.controls.update();
      ctx.renderer.render(ctx.scene, ctx.camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      ctx.camera.aspect = w / h;
      ctx.camera.updateProjectionMatrix();
      ctx.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      ctx.renderer.dispose();
      if (containerRef.current?.contains(ctx.renderer.domElement)) {
        containerRef.current.removeChild(ctx.renderer.domElement);
      }
    };
  }, []);

  // Load mountains when selection changes
  useEffect(() => {
    const ctx = sceneCtxRef.current;
    if (!ctx) return;

    let cancelled = false;

    async function loadMountains() {
      setLoading(true);

      // Clear existing mountain meshes
      for (const md of mountainRefs.current) {
        ctx!.scene.remove(md.mesh);
        ctx!.scene.remove(md.wireframe);
        md.mesh.geometry.dispose();
      }
      mountainRefs.current = [];

      // Remove old height reference planes
      if (heightPlanesRef.current) {
        ctx!.scene.remove(heightPlanesRef.current);
        heightPlanesRef.current = null;
      }

      const newElevations: Record<string, Float32Array> = {};
      const sceneData: MountainSceneData[] = [];

      for (let i = 0; i < 3; i++) {
        const mountain = selectedMountains[i];
        if (cancelled) return;
        setLoadingProgress(`Loading ${mountain.name} terrain...`);

        let terrainImages: HTMLImageElement[];
        let satImages: HTMLImageElement[];

        if (hasToken) {
          try {
            [terrainImages, satImages] = await Promise.all([
              fetchTerrainTiles(mountain.lat, mountain.lng, mountain.zoom),
              fetchSatelliteTiles(mountain.lat, mountain.lng, mountain.zoom),
            ]);
          } catch (e) {
            console.warn(`Failed to load tiles for ${mountain.name}, using procedural`, e);
            terrainImages = [];
            satImages = [];
          }
        } else {
          terrainImages = [];
          satImages = [];
        }

        if (cancelled) return;

        let elevationData: { elevations: Float32Array; width: number; height: number };
        let satCanvas: HTMLCanvasElement;

        if (terrainImages.length === 9) {
          elevationData = stitchElevationTiles(terrainImages, 256);
          satCanvas = stitchSatelliteTiles(satImages);
        } else {
          // Generate procedural terrain
          elevationData = generateProceduralTerrain(mountain, 256);
          satCanvas = generateProceduralTexture(mountain, elevationData.elevations, 1024);
        }

        const { mesh, topoMaterial, satMaterial, wireframe, elevations } =
          buildMountainMesh(
            elevationData,
            satCanvas,
            mountain.lat,
            mountain.zoom,
            WORLD_SCALE
          );

        // Position mountains side by side
        const xOffset = (i - 1) * (MOUNTAIN_SPACING / WORLD_SCALE);
        mesh.position.x = xOffset;
        wireframe.position.copy(mesh.position);

        const pos = new THREE.Vector3(xOffset, mountain.elevation / WORLD_SCALE / 2, 0);

        ctx!.scene.add(mesh);
        ctx!.scene.add(wireframe);

        sceneData.push({
          mesh,
          wireframe,
          topoMaterial,
          satMaterial,
          elevations,
          mountainData: mountain,
          position: pos,
        });

        newElevations[mountain.id] = elevations;
      }

      if (cancelled) return;

      mountainRefs.current = sceneData;
      setElevationsMap(newElevations);

      // Add height reference planes
      const sceneWidth = (MOUNTAIN_SPACING * 3) / WORLD_SCALE;
      const heightPlanes = createHeightReferencePlanes(WORLD_SCALE, sceneWidth);
      ctx!.scene.add(heightPlanes);
      heightPlanesRef.current = heightPlanes;

      // Add scale bar
      const scaleBar = createScaleBar(WORLD_SCALE);
      scaleBar.position.set(-sceneWidth / 2.5, 0.1, sceneWidth / 3);
      ctx!.scene.add(scaleBar);

      // Set camera to see all mountains
      ctx!.camera.position.set(0, 60, 120);
      ctx!.controls.target.set(0, 15, 0);
      ctx!.controls.update();

      setLoading(false);
      setLoadingProgress('');
    }

    loadMountains();
    return () => {
      cancelled = true;
    };
  }, [selected[0], selected[1], selected[2], hasToken]);

  // Update view mode
  useEffect(() => {
    for (const md of mountainRefs.current) {
      if (viewMode === 'topographic') {
        (md.mesh as THREE.Mesh).material = md.topoMaterial;
        md.wireframe.visible = true;
      } else {
        (md.mesh as THREE.Mesh).material = md.satMaterial;
        md.wireframe.visible = false;
      }
    }
  }, [viewMode]);

  const handleSelectionChange = useCallback((index: number, id: string) => {
    setSelected((prev) => {
      const next = [...prev] as [string, string, string];
      next[index] = id;
      return next;
    });
  }, []);

  const handleFocus = useCallback((index: number) => {
    const ctx = sceneCtxRef.current;
    const md = mountainRefs.current[index];
    if (!ctx || !md) return;
    animateCameraTo(ctx.camera, ctx.controls, md.mesh.position.clone().setY(20));
  }, []);

  const handleReset = useCallback(() => {
    const ctx = sceneCtxRef.current;
    if (!ctx) return;
    animateCameraTo(
      ctx.camera,
      ctx.controls,
      new THREE.Vector3(0, 15, 0),
      1200
    );
  }, []);

  const ranks = selectedMountains.map((m) => {
    const maxElev = Math.max(...selectedMountains.map((s) => s.elevation));
    const maxProm = Math.max(...selectedMountains.map((s) => s.prominence));
    return {
      tallest: m.elevation === maxElev,
      mostProminent: m.prominence === maxProm,
    };
  });

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loading */}
      <LoadingOverlay loading={loading} progress={loadingProgress} />

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-start gap-3">
        <MountainSelector selected={selected} onChange={handleSelectionChange} />
        <ViewToggle mode={viewMode} onToggle={setViewMode} />
        <SceneControls
          mountains={selectedMountains}
          onFocus={handleFocus}
          onReset={handleReset}
        />
      </div>

      {/* Info panels */}
      {!loading && (
        <div className="absolute top-20 right-4 z-10 flex flex-col gap-3">
          {selectedMountains.map((m, i) => (
            <InfoPanel
              key={m.id}
              mountain={m}
              elevations={elevationsMap[m.id] || null}
              rank={ranks[i]}
            />
          ))}
        </div>
      )}

      {/* No token warning */}
      {!hasToken && !loading && (
        <div className="absolute top-20 left-4 z-10 glass-panel p-3 max-w-xs animate-fade-in">
          <p className="text-xs text-amber-400 font-medium mb-1">
            No Mapbox Token Found
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Add <code className="text-[var(--text-primary)]">VITE_MAPBOX_TOKEN</code> to
            your <code className="text-[var(--text-primary)]">.env</code> file for real
            satellite imagery and terrain data. Currently showing procedural terrain.
          </p>
        </div>
      )}

      {/* Bottom legend */}
      {!loading && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
          <Legend mountains={selectedMountains} />
        </div>
      )}
    </div>
  );
}

/**
 * Generate procedural terrain when Mapbox tiles are not available.
 * Creates a believable mountain shape based on actual elevation data.
 */
function generateProceduralTerrain(
  mountain: MountainData,
  resolution: number
): { elevations: Float32Array; width: number; height: number } {
  const elevations = new Float32Array(resolution * resolution);
  const center = resolution / 2;
  const baseElevation = Math.max(0, mountain.elevation - mountain.prominence);

  // Seed pseudo-random from mountain name
  let seed = 0;
  for (let i = 0; i < mountain.id.length; i++) {
    seed = ((seed << 5) - seed + mountain.id.charCodeAt(i)) | 0;
  }
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed & 0x7fffffff) / 0x7fffffff;
  };

  // Generate noise octaves
  const noiseSize = 64;
  const noise = new Float32Array(noiseSize * noiseSize);
  for (let i = 0; i < noise.length; i++) noise[i] = rand();

  function sampleNoise(x: number, y: number): number {
    const xi = ((x % noiseSize) + noiseSize) % noiseSize;
    const yi = ((y % noiseSize) + noiseSize) % noiseSize;
    const x0 = Math.floor(xi),
      y0 = Math.floor(yi);
    const x1 = (x0 + 1) % noiseSize,
      y1 = (y0 + 1) % noiseSize;
    const fx = xi - x0,
      fy = yi - y0;
    const v00 = noise[y0 * noiseSize + x0];
    const v10 = noise[y0 * noiseSize + x1];
    const v01 = noise[y1 * noiseSize + x0];
    const v11 = noise[y1 * noiseSize + x1];
    return (
      v00 * (1 - fx) * (1 - fy) +
      v10 * fx * (1 - fy) +
      v01 * (1 - fx) * fy +
      v11 * fx * fy
    );
  }

  function fbm(x: number, y: number): number {
    let val = 0, amp = 0.5, freq = 1;
    for (let o = 0; o < 6; o++) {
      val += amp * sampleNoise(x * freq, y * freq);
      amp *= 0.5;
      freq *= 2.1;
    }
    return val;
  }

  // Create multiple peaks for realism
  const peaks = [
    { x: center, y: center, strength: 1.0 },
    { x: center + (rand() - 0.5) * resolution * 0.3, y: center + (rand() - 0.5) * resolution * 0.3, strength: 0.6 },
    { x: center + (rand() - 0.5) * resolution * 0.4, y: center + (rand() - 0.5) * resolution * 0.4, strength: 0.4 },
  ];

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      let peakInfluence = 0;
      for (const peak of peaks) {
        const dx = (x - peak.x) / (resolution * 0.35);
        const dy = (y - peak.y) / (resolution * 0.35);
        const dist = Math.sqrt(dx * dx + dy * dy);
        peakInfluence += peak.strength * Math.max(0, 1 - dist) * Math.exp(-dist * 1.5);
      }

      const noiseVal = fbm(x * 0.08, y * 0.08) * 0.3;
      const ridgeNoise = Math.abs(fbm(x * 0.04 + 100, y * 0.04 + 100) - 0.5) * 0.4;

      const t = Math.max(0, Math.min(1, peakInfluence + noiseVal - ridgeNoise));
      elevations[y * resolution + x] = baseElevation + t * mountain.prominence;
    }
  }

  return { elevations, width: resolution, height: resolution };
}

/**
 * Generate a procedural texture that looks like terrain.
 */
function generateProceduralTexture(
  _mountain: MountainData,
  elevations: Float32Array,
  size: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const elevRes = Math.sqrt(elevations.length);
  let minE = Infinity, maxE = -Infinity;
  for (let i = 0; i < elevations.length; i++) {
    if (elevations[i] < minE) minE = elevations[i];
    if (elevations[i] > maxE) maxE = elevations[i];
  }
  const range = maxE - minE || 1;

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const ex = Math.floor((x / size) * elevRes);
      const ey = Math.floor((y / size) * elevRes);
      const elev = elevations[ey * elevRes + ex];
      const t = (elev - minE) / range;

      let r: number, g: number, b: number;

      if (t < 0.15) {
        // Deep green - forest
        r = 35 + t * 200;
        g = 65 + t * 300;
        b = 25 + t * 100;
      } else if (t < 0.35) {
        // Light green to brown
        const lt = (t - 0.15) / 0.2;
        r = 65 + lt * 80;
        g = 95 - lt * 20;
        b = 40 - lt * 10;
      } else if (t < 0.6) {
        // Brown to gray rock
        const lt = (t - 0.35) / 0.25;
        r = 145 - lt * 30;
        g = 75 + lt * 40;
        b = 30 + lt * 60;
      } else if (t < 0.8) {
        // Gray rock
        const lt = (t - 0.6) / 0.2;
        r = 115 + lt * 60;
        g = 115 + lt * 60;
        b = 90 + lt * 80;
      } else {
        // Snow
        const lt = (t - 0.8) / 0.2;
        r = 175 + lt * 80;
        g = 175 + lt * 80;
        b = 170 + lt * 85;
      }

      // Add slight noise for texture
      const noise = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      const n = noise * 8 - 4;

      const idx = (y * size + x) * 4;
      data[idx] = Math.max(0, Math.min(255, r + n));
      data[idx + 1] = Math.max(0, Math.min(255, g + n));
      data[idx + 2] = Math.max(0, Math.min(255, b + n));
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
