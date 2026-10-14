# API Contracts: SETU Backend

## Base URL
`/api`

---

## 1. POST /api/pipeline/run
Executes the satellite triage pipeline for a designated AOI and event date.

### Request Body
```json
{
  "aoi": {
    "name": "Trishuli-Bhote Koshi Corridor",
    "bbox": [85.25, 27.90, 85.45, 28.25],
    "scenarioId": "trishuli_2026"
  },
  "eventDate": "2026-08-26",
  "radarConfidenceThreshold": 0.65,
  "slopeFilterDegrees": 15.0
}
```

### Response Body
```json
{
  "status": "success",
  "executionTimeMs": 342,
  "hazardStats": {
    "floodedAreaKm2": 14.8,
    "debrisFlowAreaKm2": 9.2,
    "totalImpactKm2": 24.0,
    "confidenceScore": 0.88
  },
  "infrastructureStats": {
    "damagedBridgesCount": 7,
    "submergedRoadsKm": 38.4,
    "impactedBuildings": 312
  },
  "cutoffStats": {
    "isolatedVillagesCount": 11,
    "estimatedCutoffPopulation": 8450,
    "nearestHospitalsBlocked": 2
  },
  "layers": {
    "hazardPolygons": [],
    "damagedBridges": [],
    "cutoffSettlements": [],
    "flowTraces": []
  }
}
```

---

## 2. POST /api/copilot/query
Interactively queries the Gemini 3.8 Flash copilot regarding tactical rescue details. Responses are audited against computed ground truth facts.

### Request Body
```json
{
  "prompt": "How many villages are cut off in the upper Bhote Koshi, and which bridge blocked them?",
  "language": "en",
  "contextFacts": { ... }
}
```

### Response Body
```json
{
  "answer": "...",
  "language": "en",
  "audit": {
    "passed": true,
    "extractedNumbers": [11, 8450, 7],
    "verifiedNumbers": [11, 8450, 7],
    "unverifiedNumbers": [],
    "verdict": "VERIFIED_ZERO_HALLUCINATION"
  }
}
```

---

## 3. POST /api/copilot/sitrep
Generates a formal, bilingual 1-page situation report formatted for disaster response leadership.

### Request Body
```json
{
  "language": "both",
  "scenarioId": "trishuli_2026",
  "contextFacts": { ... }
}
```

### Response Body
```json
{
  "reportEnglish": "...",
  "reportNepali": "...",
  "metadata": {
    "reportNumber": "SETU-SITREP-2026-001",
    "timestamp": "2026-08-27T06:00:00Z",
    "eventDate": "2026-08-26",
    "auditPassed": true
  }
}
```

---

## 4. POST /api/hydrology/trace
Traces downstream valley flow path using Copernicus DEM from an upstream source point.

### Request Body
```json
{
  "startPoint": { "lat": 28.245, "lng": 85.385, "elevationM": 4120 },
  "bufferRadiusMeters": 350
}
```

### Response Body
```json
{
  "flowPathCoordinates": [[85.385, 28.245], [85.378, 28.225], ...],
  "valleyLengthKm": 42.6,
  "estimatedTransitTimeHours": 3.8,
  "impactedSettlementsDownstream": [
    { "name": "Tatopani", "distanceKm": 12.4, "etaMinutes": 67 },
    { "name": "Larcha", "distanceKm": 18.2, "etaMinutes": 98 }
  ]
}
```
