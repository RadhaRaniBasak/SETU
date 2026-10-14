import { CopilotAuditReport, NumericalAuditToken, PipelineStats, Settlement } from '../types/setu.ts';

// Devanagari numerals mapping
const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
};

/**
 * Converts Devanagari numerals (०, १, २, ...) to Latin digits (0, 1, 2, ...)
 */
export function convertDevanagariToLatinDigits(str: string): string {
  return str.replace(/[०-९]/g, (match) => DEVANAGARI_DIGITS[match] || match);
}

/**
 * Builds the canonical lookup dictionary of verifiable numerical facts from the disaster state
 */
export function buildAllowedNumbersSet(stats: PipelineStats, settlements: Settlement[]): Map<number, string> {
  const allowed = new Map<number, string>();

  // Core hazard metrics
  allowed.set(stats.floodedAreaKm2, 'Flooded Area (km²)');
  allowed.set(Math.round(stats.floodedAreaKm2), 'Flooded Area (km² rounded)');
  allowed.set(stats.debrisAreaKm2, 'Debris Flow Area (km²)');
  allowed.set(Math.round(stats.debrisAreaKm2), 'Debris Flow Area (km² rounded)');
  allowed.set(stats.totalHazardAreaKm2, 'Total Hazard Area (km²)');
  allowed.set(Math.round(stats.totalHazardAreaKm2), 'Total Hazard Area (km² rounded)');

  // Infrastructure metrics
  allowed.set(stats.damagedBridgesCount, 'Damaged Bridges Count');
  allowed.set(stats.submergedRoadKm, 'Submerged Road (km)');
  allowed.set(Math.round(stats.submergedRoadKm), 'Submerged Road (km rounded)');
  allowed.set(stats.impactedBuildingsCount, 'Impacted Buildings Count');

  // Cutoff metrics
  allowed.set(stats.isolatedSettlementsCount, 'Isolated Settlements Count');
  allowed.set(stats.isolatedPopulationCount, 'Isolated Population Count');
  allowed.set(Math.round(stats.isolatedPopulationCount / 1000) * 1000, 'Isolated Population (approx thousands)');
  allowed.set(stats.connectedSettlementsCount, 'Connected Settlements Count');
  allowed.set(stats.criticalHospitalsReachableCount, 'Hospitals Reachable');
  allowed.set(stats.criticalHospitalsBlockedCount, 'Hospitals Blocked');

  // Background context numbers from disaster report
  allowed.set(1342, 'Reported Casualties (NDRRMA)');
  allowed.set(4900, 'Reported Missing / Out of Contact (NDRRMA)');

  // Settlement populations & building counts
  settlements.forEach((s) => {
    allowed.set(s.estimatedPopulation, `${s.name} Population`);
    allowed.set(s.buildingCount, `${s.name} Buildings`);
    if (s.isolationCause?.submergedRoadKm) {
      allowed.set(s.isolationCause.submergedRoadKm, `${s.name} Submerged Road km`);
      allowed.set(Math.round(s.isolationCause.submergedRoadKm), `${s.name} Submerged Road km (rounded)`);
    }
  });

  // Calendar dates and technical constants
  allowed.set(2026, 'Year 2026');
  allowed.set(26, '26 August (Disaster Date)');
  allowed.set(14, '14 August (Baseline Pre-Event Date)');
  allowed.set(6, '6 September (NDRRMA SitRep Date)');
  allowed.set(8, 'August (Month 8)');
  allowed.set(9, 'September (Month 9)');
  allowed.set(12, '12-Day Orbit Repeat');
  allowed.set(121, 'Relative Orbit 121');
  allowed.set(10, '10m Spatial Resolution');
  allowed.set(1, 'Count (1)');
  allowed.set(2, 'Count (2)');
  allowed.set(3, 'Count (3)');
  allowed.set(4, 'Count (4)');
  allowed.set(5, 'Count (5)');
  allowed.set(0, 'Zero');

  return allowed;
}

/**
 * Validates generated Copilot text against verified ground-truth values.
 * Handles Devanagari digits, comma-separated numbers (8,640), and floating-point tolerances.
 */
export function validateCopilotText(
  text: string,
  stats: PipelineStats,
  settlements: Settlement[]
): CopilotAuditReport {
  const allowedMap = buildAllowedNumbersSet(stats, settlements);
  const normalizedText = convertDevanagariToLatinDigits(text);

  // Match numbers including decimals and optional thousands commas (e.g. "8,640", "14.8", "7")
  const numberRegex = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b|\b\d+(?:\.\d+)?\b/g;
  let match: RegExpExecArray | null;
  const tokens: NumericalAuditToken[] = [];

  while ((match = numberRegex.exec(normalizedText)) !== null) {
    const rawMatch = match[0];
    // Strip thousands separators for numeric parsing
    const cleanNumStr = rawMatch.replace(/,/g, '');
    const val = parseFloat(cleanNumStr);
    if (isNaN(val)) continue;

    // Check context around number for display snippet
    const startIdx = Math.max(0, match.index - 25);
    const endIdx = Math.min(normalizedText.length, match.index + rawMatch.length + 25);
    const contextSnippet = normalizedText.substring(startIdx, endIdx).trim();

    // Check if directly in allowed map or within 0.05 float tolerance
    let isVerified = false;
    let matchedField: string | undefined = undefined;

    for (const [allowedVal, fieldName] of allowedMap.entries()) {
      if (Math.abs(allowedVal - val) < 0.05) {
        isVerified = true;
        matchedField = fieldName;
        break;
      }
    }

    tokens.push({
      token: rawMatch,
      numericValue: val,
      isVerified,
      matchedField,
      contextSnippet,
    });
  }

  const unverified = tokens.filter((t) => !t.isVerified);
  const verified = tokens.filter((t) => t.isVerified);

  return {
    passed: unverified.length === 0,
    totalNumbersDetected: tokens.length,
    verifiedNumbersCount: verified.length,
    unverifiedNumbersCount: unverified.length,
    tokens,
    verdict: unverified.length === 0 ? 'VERIFIED_ZERO_HALLUCINATION' : 'FLAGGED_UNGROUNDED_NUMBERS',
  };
}
