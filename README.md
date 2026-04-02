# Mountain Comparator

Compare famous mountains side by side in true-to-scale 3D with real satellite imagery and terrain data.

## Features

- **True-to-Scale 3D Rendering** — All mountains share the same vertical scale so you can visually compare their real heights
- **15+ Famous Peaks** — Everest, K2, Matterhorn, Denali, Kilimanjaro, and more
- **Satellite & Topographic Modes** — Toggle between real satellite imagery and elevation-colored contour view
- **Real Terrain Data** — Mapbox Terrain-RGB elevation tiles decoded into 3D mesh geometry
- **Interactive Controls** — Full 360° orbit, zoom, pan, and focus-on-mountain camera animations
- **Info Panels** — Elevation stats, prominence, country, and cross-section elevation profiles
- **Height Reference Planes** — Semi-transparent planes at 2km/4km/6km/8km for scale reference

## Setup

```bash
npm install
```

### Mapbox Token (Optional)

For real satellite imagery and terrain data, add your Mapbox access token:

```bash
cp .env.example .env
# Edit .env and add your token:
# VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Without a token, the app uses procedural terrain generation that still shows correct relative mountain heights.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Tech Stack

- React + TypeScript + Vite
- Three.js with OrbitControls
- Mapbox Terrain-RGB & Satellite tiles
- Tailwind CSS
- Chart.js for elevation profiles
