/**
 * Geospatial utilities for SETU Triage Platform
 * Handles coordinate projection, bounding box operations, and elevation approximations
 */

export const CORRIDOR_BBOX = {
  minLng: 85.12,
  maxLng: 85.42,
  minLat: 27.90,
  maxLat: 28.30,
} as const;

export const DEFAULT_VIEW_WIDTH = 1000;
export const DEFAULT_VIEW_HEIGHT = 850;

/**
 * Converts longitude to SVG coordinate space
 */
export function lngToX(
  lng: number,
  viewWidth = DEFAULT_VIEW_WIDTH,
  bbox = CORRIDOR_BBOX
): number {
  return ((lng - bbox.minLng) / (bbox.maxLng - bbox.minLng)) * viewWidth;
}

/**
 * Converts latitude to SVG coordinate space (inverted Y axis)
 */
export function latToY(
  lat: number,
  viewHeight = DEFAULT_VIEW_HEIGHT,
  bbox = CORRIDOR_BBOX
): number {
  return ((bbox.maxLat - lat) / (bbox.maxLat - bbox.minLat)) * viewHeight;
}

/**
 * Converts SVG coordinate space back to geographic longitude
 */
export function xToLng(
  x: number,
  viewWidth = DEFAULT_VIEW_WIDTH,
  bbox = CORRIDOR_BBOX
): number {
  return bbox.minLng + (x / viewWidth) * (bbox.maxLng - bbox.minLng);
}

/**
 * Converts SVG coordinate space back to geographic latitude
 */
export function yToLat(
  y: number,
  viewHeight = DEFAULT_VIEW_HEIGHT,
  bbox = CORRIDOR_BBOX
): number {
  return bbox.maxLat - (y / viewHeight) * (bbox.maxLat - bbox.minLat);
}

/**
 * Estimates elevation (meters ASL) across the Trishuli corridor based on Copernicus DEM gradient
 */
export function estimateElevation(
  lat: number,
  lng: number,
  bbox = CORRIDOR_BBOX
): number {
  const normLat = (lat - bbox.minLat) / (bbox.maxLat - bbox.minLat);
  const normLng = (lng - bbox.minLng) / (bbox.maxLng - bbox.minLng);
  const elev = 580 + normLat * 3200 + Math.abs(normLng - 0.5) * 1200;
  return Math.round(elev);
}

/**
 * Calculates Haversine distance in kilometers between two lat/lng coordinates
 */
export function haversineDistanceKm(
  p1: [number, number],
  p2: [number, number]
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2[1] - p1[1]) * Math.PI) / 180;
  const dLng = ((p2[0] - p1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[1] * Math.PI) / 180) *
      Math.cos((p2[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Checks if a coordinate is within the Trishuli corridor bounds
 */
export function isWithinCorridor(
  lat: number,
  lng: number,
  bbox = CORRIDOR_BBOX
): boolean {
  return (
    lat >= bbox.minLat &&
    lat <= bbox.maxLat &&
    lng >= bbox.minLng &&
    lng <= bbox.maxLng
  );
}
