import { describe, it, expect } from 'vitest';
import { traceDownstreamValleyFlow } from '../../src/services/hydrologyService.ts';
import { haversineDistanceKm } from '../../src/utils/geoUtils.ts';
import { SETTLEMENTS_DATA } from '../../src/data/trishuliScenario.ts';

describe('geoUtils: Haversine distance', () => {
  it('calculates geographic distance correctly', () => {
    // Distance between Rasuwagadhi (85.385, 28.272) and Timure (85.378, 28.243) is ~3.3 km
    const dist = haversineDistanceKm([85.385, 28.272], [85.378, 28.243]);
    expect(dist).toBeGreaterThan(2.5);
    expect(dist).toBeLessThan(4.5);
  });
});

describe('hydrologyService: Valley flow descent tracer', () => {
  it('traces downstream flow starting from upstream glacier', () => {
    const trace = traceDownstreamValleyFlow(28.295, 85.392, SETTLEMENTS_DATA);
    expect(trace).toBeDefined();
    expect(trace.totalLengthKm).toBeGreaterThan(30);
    expect(trace.totalDescentM).toBeGreaterThan(3000);
    expect(trace.impactedSettlements.length).toBeGreaterThan(0);
    expect(trace.transitHours).toBeGreaterThan(0);
  });

  it('calculates increasing ETA minutes along the downstream path', () => {
    const trace = traceDownstreamValleyFlow(28.28, 85.388, SETTLEMENTS_DATA);
    const settlements = trace.impactedSettlements;
    if (settlements.length >= 2) {
      expect(settlements[1].estimatedArrivalMinutes).toBeGreaterThanOrEqual(
        settlements[0].estimatedArrivalMinutes
      );
    }
  });
});
