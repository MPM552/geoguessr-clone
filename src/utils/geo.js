const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Great-circle distance between two lat/lng points, in kilometers.
 */
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Score out of 1000, linear down to 0 at MAX_DISTANCE_KM (1000km) and beyond.
 */
export const MAX_SCORING_DISTANCE_KM = 1000;

export function calculateScore(distanceKm) {
  if (distanceKm >= MAX_SCORING_DISTANCE_KM) return 0;
  const raw = 1000 * (1 - distanceKm / MAX_SCORING_DISTANCE_KM);
  return Math.round(raw);
}
