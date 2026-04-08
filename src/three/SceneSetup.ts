import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
}

/**
 * Initialise the Three.js scene on an existing <canvas> element.
 * The canvas is already in the DOM (rendered via JSX), so its CSS
 * dimensions are correct when this function is called from useLayoutEffect.
 */
export function setupScene(canvas: HTMLCanvasElement): SceneContext {
  // ── Renderer ──────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // Shadows disabled for now — add back once rendering is confirmed working
  renderer.shadowMap.enabled = false;

  // false = don't touch CSS; the canvas fills its container via CSS classes
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  renderer.setSize(w > 0 ? w : 800, h > 0 ? h : 600, false);

  // ── Scene ─────────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1117);
  scene.fog = new THREE.FogExp2(0x0d1117, 0.00018);

  // ── Camera ────────────────────────────────────────────────────────────────
  const aspect = w > 0 && h > 0 ? w / h : 16 / 9;
  const camera = new THREE.PerspectiveCamera(55, aspect, 1, 100000);
  camera.position.set(0, 60, 110);

  // ── Controls ──────────────────────────────────────────────────────────────
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minDistance = 5;
  controls.maxDistance = 1000;
  controls.target.set(0, 20, 0);
  controls.update();

  // ── Lighting ──────────────────────────────────────────────────────────────
  // Generous ambient so terrain is always readable
  scene.add(new THREE.AmbientLight(0xffffff, 1.8));

  // Primary directional sun
  const sun = new THREE.DirectionalLight(0xffe8d0, 2.8);
  sun.position.set(-200, 400, 200);
  scene.add(sun);

  // Sky/ground colour fill
  scene.add(new THREE.HemisphereLight(0x87ceeb, 0x2d3a1e, 0.9));

  // ── Ground plane ──────────────────────────────────────────────────────────
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(8000, 8000),
    new THREE.MeshLambertMaterial({ color: 0x0a1220 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2;
  scene.add(ground);

  return { scene, camera, renderer, controls };
}

/** Update renderer + camera when the canvas is resized. */
export function handleCanvasResize(
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
): void {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w === 0 || h === 0) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
