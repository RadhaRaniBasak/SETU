import { FlowTraceResult, GeoPoint, Settlement } from '../types/setu.ts';
import { SETTLEMENTS_DATA } from '../data/trishuliScenario.ts';
import { haversineDistanceKm } from '../utils/geoUtils.ts';

// Pre-computed valley center points with Copernicus WorldDEM-30 elevations
export const TRISHULI_VALLEY_CENTERLINE: [number, number, number][] = [
  [85.392, 28.295, 4320], // Upstream Glacier Tongue / Cirque
  [85.388, 28.282, 3450], // Upper moraine lake breach
  [85.385, 28.272, 1814], // Rasuwagadhi border
  [85.381, 28.258, 1780],
  [85.378, 28.243, 1760], // Timure
  [85.372, 28.232, 1720],
  [85.368, 28.225, 1680], // Tatopani
  [85.362, 28.210, 1610],
  [85.356, 28.198, 1540], // Larcha Bridge
  [85.348, 28.182, 1490],
  [85.334, 28.158, 1460], // Syaphrubesi Confluence
  [85.320, 28.135, 1380],
  [85.305, 28.110, 1300],
  [85.278, 28.082, 1220], // Mailung
  [85.245, 28.030, 980],
  [85.210, 27.995, 780],
  [85.185, 27.978, 650],  // Betrawati
  [85.165, 27.942, 610],
  [85.158, 27.915, 580],  // Bidur / Trishuli Bazaar
];

export function traceDownstreamValleyFlow(
  startLat: number,
  startLng: number,
  settlements: Settlement[] = SETTLEMENTS_DATA
): FlowTraceResult {
  // Find closest point on centerline at or upstream of the click
  let closestIdx = 0;
  let minDistance = Infinity;

  TRISHULI_VALLEY_CENTERLINE.forEach((pt, idx) => {
    const dist = haversineDistanceKm([startLng, startLat], [pt[0], pt[1]]);
    if (dist < minDistance) {
      minDistance = dist;
      closestIdx = idx;
    }
  });

  const slicedPath = TRISHULI_VALLEY_CENTERLINE.slice(closestIdx);
  if (slicedPath.length < 2) {
    // If clicked near downstream end, include at least 3 points
    const fallbackSlice = TRISHULI_VALLEY_CENTERLINE.slice(
      Math.max(0, TRISHULI_VALLEY_CENTERLINE.length - 4)
    );
    return buildTraceResult(fallbackSlice, { lat: startLat, lng: startLng }, settlements);
  }

  return buildTraceResult(slicedPath, { lat: startLat, lng: startLng }, settlements);
}

function buildTraceResult(
  path: [number, number, number][],
  sourcePoint: GeoPoint,
  settlements: Settlement[]
): FlowTraceResult {
  let cumulativeDistKm = 0;
  const totalDescentM = Math.max(0, path[0][2] - path[path.length - 1][2]);

  // Average Himalayan flood wave velocity: 5.5 m/s (~19.8 km/h)
  const averageVelocityKmh = 21.0;

  for (let i = 0; i < path.length - 1; i++) {
    cumulativeDistKm += haversineDistanceKm([path[i][0], path[i][1]], [path[i + 1][0], path[i + 1][1]]);
  }

  const transitHours = cumulativeDistKm / averageVelocityKmh;

  // Find settlements located along this sliced path
  const impactedSettlements: FlowTraceResult['impactedSettlements'] = [];

  settlements.forEach((s) => {
    let bestDistToPath = Infinity;
    let distanceAlongPath = 0;
    let distAccum = 0;

    for (let i = 0; i < path.length; i++) {
      if (i > 0) {
        distAccum += haversineDistanceKm([path[i - 1][0], path[i - 1][1]], [path[i][0], path[i][1]]);
      }
      const d = haversineDistanceKm([s.lng, s.lat], [path[i][0], path[i][1]]);
      if (d < bestDistToPath) {
        bestDistToPath = d;
        distanceAlongPath = distAccum;
      }
    }

    // Settlements within 2.5km valley buffer corridor
    if (bestDistToPath <= 2.5) {
      const etaMinutes = Math.round((distanceAlongPath / averageVelocityKmh) * 60);
      const floodDepthEstimatedM = Number((4.5 * Math.exp(-distanceAlongPath / 35) + 1.2).toFixed(1));

      impactedSettlements.push({
        settlementId: s.id,
        name: s.name,
        nameNepali: s.nameNepali,
        distanceAlongValleyKm: Number(distanceAlongPath.toFixed(1)),
        estimatedArrivalMinutes: Math.max(5, etaMinutes),
        floodDepthEstimatedM,
      });
    }
  });

  // Sort by arrival time
  impactedSettlements.sort((a, b) => a.estimatedArrivalMinutes - b.estimatedArrivalMinutes);

  return {
    sourcePoint: {
      lat: path[0][1],
      lng: path[0][0],
      elevationM: path[0][2],
      name: 'Simulated Outburst Breach Point',
    },
    totalLengthKm: Number(cumulativeDistKm.toFixed(1)),
    totalDescentM,
    estimatedPeakVelocityMs: 6.2,
    transitHours: Number(transitHours.toFixed(1)),
    flowPath: path,
    impactedSettlements,
  };
}
