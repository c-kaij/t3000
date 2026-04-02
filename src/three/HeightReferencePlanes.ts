import * as THREE from 'three';

const REFERENCE_HEIGHTS = [2000, 4000, 6000, 8000]; // meters

export function createHeightReferencePlanes(
  worldScale: number,
  sceneWidth: number
): THREE.Group {
  const group = new THREE.Group();

  for (const height of REFERENCE_HEIGHTS) {
    const y = height / worldScale;

    // Semi-transparent plane
    const planeGeo = new THREE.PlaneGeometry(sceneWidth, sceneWidth);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = y;
    group.add(plane);

    // Dashed edge lines
    const edgeSize = sceneWidth / 2;
    const points = [
      new THREE.Vector3(-edgeSize, y, -edgeSize),
      new THREE.Vector3(edgeSize, y, -edgeSize),
      new THREE.Vector3(edgeSize, y, edgeSize),
      new THREE.Vector3(-edgeSize, y, edgeSize),
      new THREE.Vector3(-edgeSize, y, -edgeSize),
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x6699cc,
      dashSize: sceneWidth * 0.02,
      gapSize: sceneWidth * 0.01,
      transparent: true,
      opacity: 0.3,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    line.computeLineDistances();
    group.add(line);

    // Text label using sprite
    const label = createTextSprite(`${(height / 1000).toFixed(0)}km`, 0.8);
    label.position.set(-edgeSize * 1.05, y, 0);
    group.add(label);
  }

  return group;
}

function createTextSprite(text: string, scale: number): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 256, 64);
  ctx.font = 'bold 36px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#8ab4f8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scale, scale * 0.25, 1);
  return sprite;
}

export function createScaleBar(worldScale: number): THREE.Group {
  const group = new THREE.Group();
  const barLength = 1000 / worldScale; // 1km in world units

  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(barLength, 0, 0),
  ];
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
  const line = new THREE.Line(geo, mat);
  group.add(line);

  // End caps
  for (const x of [0, barLength]) {
    const capPoints = [
      new THREE.Vector3(x, -barLength * 0.03, 0),
      new THREE.Vector3(x, barLength * 0.03, 0),
    ];
    const capGeo = new THREE.BufferGeometry().setFromPoints(capPoints);
    const cap = new THREE.Line(capGeo, mat);
    group.add(cap);
  }

  const label = createTextSprite('1 km', barLength * 0.6);
  label.position.set(barLength / 2, barLength * 0.08, 0);
  group.add(label);

  return group;
}
