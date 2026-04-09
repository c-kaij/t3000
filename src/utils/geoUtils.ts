import type { Store, Meeting } from '../data/stores';

/** Haversine distance between two lat/lng points, in kilometres. */
export function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Minimum distance from point P to line segment A→B, in km. */
function pointToSegmentKm(
  pLat: number, pLng: number,
  aLat: number, aLng: number,
  bLat: number, bLng: number,
): number {
  const dx = bLng - aLng;
  const dy = bLat - aLat;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return haversineKm(pLat, pLng, aLat, aLng);
  const t = Math.max(
    0,
    Math.min(1, ((pLng - aLng) * dx + (pLat - aLat) * dy) / lenSq),
  );
  return haversineKm(pLat, pLng, aLat + t * dy, aLng + t * dx);
}

/**
 * Return unscheduled stores that are geographically close to the route,
 * sorted by score (distance to route + priority bonus). Top 3 returned.
 */
export function computeRecommendations(
  orderedMeetings: Meeting[],
  allStores: Store[],
  storeByName: Record<string, Store>,
): Store[] {
  const scheduledNames = new Set(orderedMeetings.map((m) => m.store));
  const routeStores = orderedMeetings
    .map((m) => storeByName[m.store])
    .filter((s): s is Store => s !== undefined);

  const unscheduled = allStores.filter((s) => !scheduledNames.has(s.name));

  if (routeStores.length === 0) {
    // No route yet — return high-priority stores
    return [...unscheduled]
      .sort((a, b) => {
        const p = { high: 0, medium: 1, low: 2 };
        return p[a.priority] - p[b.priority];
      })
      .slice(0, 3);
  }

  const THRESHOLD_KM = 5;
  const priorityBonus: Record<Store['priority'], number> = { high: -1.5, medium: -0.5, low: 0 };

  const scored = unscheduled.map((store) => {
    let minDist = Infinity;

    if (routeStores.length === 1) {
      minDist = haversineKm(store.lat, store.lng, routeStores[0].lat, routeStores[0].lng);
    } else {
      for (let i = 0; i < routeStores.length - 1; i++) {
        const d = pointToSegmentKm(
          store.lat, store.lng,
          routeStores[i].lat, routeStores[i].lng,
          routeStores[i + 1].lat, routeStores[i + 1].lng,
        );
        if (d < minDist) minDist = d;
      }
    }

    return { store, score: minDist + priorityBonus[store.priority] };
  });

  return scored
    .filter((s) => s.score < THRESHOLD_KM)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((s) => s.store);
}
