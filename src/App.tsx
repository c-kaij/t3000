import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { setupScene, handleCanvasResize, type SceneContext } from './three/SceneSetup';
import { buildMountainMesh } from './three/MountainMesh';
import { fetchTerrainTiles, fetchSatelliteTiles } from './three/TextureLoader';
import { stitchElevationTiles, stitchSatelliteTiles } from './utils/elevationDecode';
import { tileWidthMeters } from './utils/tileUtils';
import { createHeightReferencePlanes } from './three/HeightReferencePlanes';
import mountains from './data/mountains';
import type { MountainData } from './data/mountains';

import InfoPanel from './components/InfoPanel';
import ViewToggle from './components/ViewToggle';
import LoadingOverlay from './components/LoadingOverlay';

// 1 Three.js unit = WORLD_SCALE metres
const WORLD_SCALE = 200;

// Phase 1: K2 hardcoded — mountain selection comes in Phase 2
const ACTIVE_MOUNTAIN = mountains.find((m) => m.id === 'k2')!;

// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  // The <canvas> lives in JSX below — Three.js receives it directly,
  // so there is no "append canvas to div" step and no sizing ambiguity.
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneCtxRef = useRef<SceneContext | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number>(0);

  const mountain: MountainData = ACTIVE_MOUNTAIN;
  const [viewMode, setViewMode] = useState<'satellite' | 'topographic'>('satellite');
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState('Initializing…');
  const [elevations, setElevations] = useState<Float32Array | null>(null);

  const hasToken = !!import.meta.env.VITE_MAPBOX_TOKEN;

  // ── Three.js scene setup (useLayoutEffect = runs synchronously after layout)
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = setupScene(canvas);
    sceneCtxRef.current = ctx;

    // Render loop
    let rafId = 0;
    function animate() {
      rafId = requestAnimationFrame(animate);
      ctx.controls.update();
      ctx.renderer.render(ctx.scene, ctx.camera);
    }
    animate();
    animFrameRef.current = rafId;

    // Keep renderer resolution in sync with canvas CSS size
    const ro = new ResizeObserver(() => handleCanvasResize(canvas, ctx.camera, ctx.renderer));
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      ctx.renderer.dispose();
    };
  }, []);

  // ── Load mountain terrain
  useEffect(() => {
    const ctx = sceneCtxRef.current;
    if (!ctx) return;

    let cancelled = false;

    async function loadMountain() {
      setLoading(true);
      setLoadingProgress(`Loading ${mountain.name}…`);

      // Remove previous mesh group
      if (meshGroupRef.current) {
        ctx!.scene.remove(meshGroupRef.current);
        meshGroupRef.current = null;
      }

      const tileRadius = mountain.tileRadius ?? 1;
      const gridSize   = tileRadius * 2 + 1;          // 3 or 5 etc.
      const tileCount  = gridSize * gridSize;          // 9 or 25 etc.
      const resolution = 512;                          // mesh vertex resolution

      // Fetch tiles (if Mapbox token available)
      let terrainImages: HTMLImageElement[] = [];
      let satImages: HTMLImageElement[] = [];
      if (hasToken) {
        try {
          setLoadingProgress(`Fetching ${tileCount * 2} map tiles…`);
          [terrainImages, satImages] = await Promise.all([
            fetchTerrainTiles(mountain.lat, mountain.lng, mountain.zoom, tileRadius),
            fetchSatelliteTiles(mountain.lat, mountain.lng, mountain.zoom, tileRadius),
          ]);
        } catch (e) {
          console.warn('Tile fetch failed — falling back to procedural terrain', e);
        }
      }
      if (cancelled) return;

      setLoadingProgress('Building terrain mesh…');

      const elevationData =
        terrainImages.length === tileCount
          ? stitchElevationTiles(terrainImages, resolution)
          : generateProceduralTerrain(mountain, 128);

      const satCanvas =
        satImages.length === tileCount
          ? stitchSatelliteTiles(satImages)
          : generateProceduralTexture(mountain, elevationData.elevations, 512);

      if (cancelled) return;

      const { mesh, topoMaterial, satMaterial, elevations } = buildMountainMesh(
        elevationData,
        satCanvas,
        mountain.lat,
        mountain.zoom,
        WORLD_SCALE,
        gridSize,
      );

      // Group so we can remove everything cleanly later
      const group = new THREE.Group();
      group.add(mesh);

      // Height reference planes — sized to match the full tile footprint
      const planeSize = (tileWidthMeters(mountain.lat, mountain.zoom) * gridSize) / WORLD_SCALE;
      const refPlanes = createHeightReferencePlanes(WORLD_SCALE, planeSize * 1.1);
      group.add(refPlanes);

      ctx!.scene.add(group);
      meshGroupRef.current = group;

      // Store material refs on the mesh for view-mode switching
      (mesh as any)._topoMat = topoMaterial;
      (mesh as any)._satMat  = satMaterial;

      // Auto-position camera to frame the full area
      const peakY     = mountain.elevation / WORLD_SCALE;
      const camDist   = planeSize * 0.85;
      const camHeight = Math.max(peakY * 1.1, camDist * 0.45);
      ctx!.camera.position.set(0, camHeight, camDist);
      ctx!.controls.target.set(0, peakY * 0.25, 0);
      ctx!.controls.update();

      setElevations(elevations);
      setLoading(false);
      setLoadingProgress('');
    }

    loadMountain();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── View mode switch
  useEffect(() => {
    if (!meshGroupRef.current) return;
    const mesh = meshGroupRef.current.children.find((c) => c.name === 'terrain') as THREE.Mesh | undefined;
    if (!mesh) return;
    mesh.material = viewMode === 'topographic' ? (mesh as any)._topoMat : (mesh as any)._satMat;
  }, [viewMode]);

  // ── Reset camera
  const handleReset = () => {
    const ctx = sceneCtxRef.current;
    if (!ctx) return;
    const gridSize  = ((mountain.tileRadius ?? 1) * 2 + 1);
    const planeSize = (tileWidthMeters(mountain.lat, mountain.zoom) * gridSize) / WORLD_SCALE;
    const peakY     = mountain.elevation / WORLD_SCALE;
    const camDist   = planeSize * 0.85;
    const camHeight = Math.max(peakY * 1.1, camDist * 0.45);
    ctx.camera.position.set(0, camHeight, camDist);
    ctx.controls.target.set(0, peakY * 0.25, 0);
    ctx.controls.update();
  };

  // ── Render
  return (
    <div className="w-full h-full relative bg-[#0d1117]">
      {/*
        The canvas IS the 3D viewport.
        It sits at the base of the stacking context; all UI floats above it.
        Three.js receives this element directly — no append-to-div needed.
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      <LoadingOverlay loading={loading} progress={loadingProgress} />

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center gap-3">
        <div className="glass-panel px-3 py-2 flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: mountain.accentColor }}
          />
          <span className="text-sm font-bold">{mountain.name}</span>
          <span className="text-xs text-[var(--text-secondary)]">
            {mountain.elevation.toLocaleString()}m · {mountain.country}
          </span>
        </div>
        <ViewToggle mode={viewMode} onToggle={setViewMode} />
        {!loading && (
          <button
            onClick={handleReset}
            className="glass-panel px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Reset View
          </button>
        )}
      </div>

      {/* Info panel */}
      {!loading && (
        <div className="absolute top-16 right-4 z-10">
          <InfoPanel mountain={mountain} elevations={elevations} />
        </div>
      )}

      {/* No-token notice */}
      {!hasToken && !loading && (
        <div className="absolute bottom-4 left-4 z-10 glass-panel p-3 max-w-xs animate-fade-in">
          <p className="text-xs text-amber-400 font-medium mb-1">Procedural terrain</p>
          <p className="text-xs text-[var(--text-secondary)]">
            Add <code className="text-[var(--text-primary)]">VITE_MAPBOX_TOKEN</code> to{' '}
            <code className="text-[var(--text-primary)]">.env</code> for real satellite imagery.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Procedural terrain generation ─────────────────────────────────────────────

function generateProceduralTerrain(
  mountain: MountainData,
  resolution: number,
): { elevations: Float32Array; width: number; height: number } {
  const elevations = new Float32Array(resolution * resolution);
  const center = resolution / 2;
  const baseElevation = Math.max(0, mountain.elevation - mountain.prominence);

  let seed = 0;
  for (let i = 0; i < mountain.id.length; i++) {
    seed = ((seed << 5) - seed + mountain.id.charCodeAt(i)) | 0;
  }
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed & 0x7fffffff) / 0x7fffffff;
  };

  const noiseSize = 64;
  const noise = new Float32Array(noiseSize * noiseSize);
  for (let i = 0; i < noise.length; i++) noise[i] = rand();

  const sampleNoise = (x: number, y: number): number => {
    const xi = ((x % noiseSize) + noiseSize) % noiseSize;
    const yi = ((y % noiseSize) + noiseSize) % noiseSize;
    const x0 = Math.floor(xi), y0 = Math.floor(yi);
    const x1 = (x0 + 1) % noiseSize, y1 = (y0 + 1) % noiseSize;
    const fx = xi - x0, fy = yi - y0;
    return (
      noise[y0 * noiseSize + x0] * (1 - fx) * (1 - fy) +
      noise[y0 * noiseSize + x1] * fx       * (1 - fy) +
      noise[y1 * noiseSize + x0] * (1 - fx) * fy +
      noise[y1 * noiseSize + x1] * fx       * fy
    );
  };

  const fbm = (x: number, y: number): number => {
    let v = 0, amp = 0.5, freq = 1;
    for (let o = 0; o < 6; o++) { v += amp * sampleNoise(x * freq, y * freq); amp *= 0.5; freq *= 2.1; }
    return v;
  };

  const peaks = [
    { x: center,                                     y: center,                                     s: 1.0 },
    { x: center + (rand() - 0.5) * resolution * 0.3, y: center + (rand() - 0.5) * resolution * 0.3, s: 0.6 },
    { x: center + (rand() - 0.5) * resolution * 0.4, y: center + (rand() - 0.5) * resolution * 0.4, s: 0.4 },
  ];

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      let influence = 0;
      for (const p of peaks) {
        const dx = (x - p.x) / (resolution * 0.35);
        const dy = (y - p.y) / (resolution * 0.35);
        const d  = Math.sqrt(dx * dx + dy * dy);
        influence += p.s * Math.max(0, 1 - d) * Math.exp(-d * 1.5);
      }
      const t = Math.max(0, Math.min(1,
        influence + fbm(x * 0.08, y * 0.08) * 0.3 - Math.abs(fbm(x * 0.04 + 100, y * 0.04 + 100) - 0.5) * 0.4,
      ));
      elevations[y * resolution + x] = baseElevation + t * mountain.prominence;
    }
  }

  return { elevations, width: resolution, height: resolution };
}

function generateProceduralTexture(
  _mountain: MountainData,
  elevations: Float32Array,
  size: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const elevRes = Math.sqrt(elevations.length);

  let minE = Infinity, maxE = -Infinity;
  for (const e of elevations) { if (e < minE) minE = e; if (e > maxE) maxE = e; }
  const range = maxE - minE || 1;

  const img = ctx.createImageData(size, size);
  const d   = img.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const ex = Math.floor((x / size) * elevRes);
      const ey = Math.floor((y / size) * elevRes);
      const t  = (elevations[ey * elevRes + ex] - minE) / range;

      let r: number, g: number, b: number;
      if      (t < 0.15) { r = 35  + t * 200; g = 65  + t * 300; b = 25  + t * 100; }
      else if (t < 0.35) { const l = (t-.15)/.2; r = 65+l*80; g = 95-l*20; b = 40-l*10; }
      else if (t < 0.60) { const l = (t-.35)/.25; r = 145-l*30; g = 75+l*40; b = 30+l*60; }
      else if (t < 0.80) { const l = (t-.60)/.2; r = 115+l*60; g = 115+l*60; b = 90+l*80; }
      else               { const l = (t-.80)/.2; r = 175+l*80; g = 175+l*80; b = 170+l*85; }

      const n = ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1) * 8 - 4;
      const i = (y * size + x) * 4;
      d[i]   = Math.max(0, Math.min(255, r + n));
      d[i+1] = Math.max(0, Math.min(255, g + n));
      d[i+2] = Math.max(0, Math.min(255, b + n));
      d[i+3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas;
}
