export interface GeoPoint {
  lat: number;
  lng: number;
  elevationM?: number;
  name?: string;
}

export interface BoundingBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

export interface SatelliteOrbitPair {
  satellite: 'Sentinel-1A' | 'Sentinel-1B' | 'Sentinel-2A' | 'Sentinel-2B';
  sensorType: 'SAR (C-band Radar)' | 'MSI (Multi-Spectral Optical)';
  relativeOrbit: number;
  orbitDirection: 'Ascending' | 'Descending';
  preEventDate: string;
  postEventDate: string;
  repeatCycleDays: number;
  polarization: 'VV + VH' | 'RGB + NIR (B2,B3,B4,B8)';
  resolutionM: number;
  cloudCoverPercent?: number;
}

export interface HazardPolygon {
  id: string;
  type: 'flooded_water' | 'debris_flow' | 'landslide_dam';
  confidence: number; // 0.0 to 1.0
  areaKm2: number;
  meanBackscatterDropDb: number;
  slopeDegrees: number;
  coordinates: [number, number][]; // [lng, lat]
  name: string;
}

export interface DamagedBridge {
  id: string;
  name: string;
  osmId: string;
  riverName: string;
  highwayRef: string;
  lat: number;
  lng: number;
  elevationM: number;
  status: 'Severed' | 'Partially Submerged' | 'Impassable Debris';
  confidence: number;
  preEventBridgeType: string;
  isolatedSettlementIds: string[];
}

export interface SubmergedRoadSegment {
  id: string;
  name: string;
  highwayType: 'primary' | 'secondary' | 'tertiary' | 'track';
  osmWayId: string;
  lengthKm: number;
  status: 'Severed by River' | 'Blocked by Debris' | 'Passable Detour';
  coordinates: [number, number][];
}

export interface Settlement {
  id: string;
  name: string;
  nameNepali: string;
  lat: number;
  lng: number;
  elevationM: number;
  district: string;
  osmPlaceType: 'village' | 'hamlet' | 'town';
  buildingCount: number;
  estimatedPopulation: number;
  isCutOff: boolean;
  isolationCause?: {
    primarySeveredBridge?: string;
    submergedRoadKm?: number;
    nearestHospitalName: string;
    originalDriveTimeMinutes: number;
    currentStatusMessage: string;
    currentStatusMessageNepali: string;
  };
  connectedToRoadNetwork: boolean;
  medicalUrgency: 'High' | 'Medium' | 'Low';
  helicopterLzFeasible: boolean;
  helicopterLzCoordinates?: [number, number];
}

export interface FlowTraceResult {
  sourcePoint: GeoPoint;
  totalLengthKm: number;
  totalDescentM: number;
  estimatedPeakVelocityMs: number;
  transitHours: number;
  flowPath: [number, number, number][]; // [lng, lat, elevationM]
  impactedSettlements: {
    settlementId: string;
    name: string;
    nameNepali: string;
    distanceAlongValleyKm: number;
    estimatedArrivalMinutes: number;
    floodDepthEstimatedM: number;
  }[];
}

export interface PipelineStats {
  floodedAreaKm2: number;
  debrisAreaKm2: number;
  totalHazardAreaKm2: number;
  averageConfidence: number;
  damagedBridgesCount: number;
  submergedRoadKm: number;
  impactedBuildingsCount: number;
  isolatedSettlementsCount: number;
  isolatedPopulationCount: number;
  connectedSettlementsCount: number;
  criticalHospitalsReachableCount: number;
  criticalHospitalsBlockedCount: number;
}

export interface EMSR927Benchmark {
  activationId: 'EMSR927';
  eventDescription: 'Bhote Koshi - Trishuli Flood, August 2026';
  officialCopernicusFloodedAreaKm2: number;
  setuPredictedFloodedAreaKm2: number;
  truePositiveAreaKm2: number;
  falsePositiveAreaKm2: number;
  falseNegativeAreaKm2: number;
  intersectionOverUnionPercent: number;
  f1ScorePercent: number;
  precisionPercent: number;
  recallPercent: number;
  copernicusEMSAttribution: string;
  radarLimitationsNotes: {
    steepGorgeRadarShadowKm2: number;
    monsoonCloudCoverOpticalFailureDays: number;
    revisitLagDays: number;
  };
}

export interface NumericalAuditToken {
  token: string;
  numericValue: number;
  isVerified: boolean;
  matchedField?: string;
  contextSnippet: string;
}

export interface CopilotAuditReport {
  passed: boolean;
  totalNumbersDetected: number;
  verifiedNumbersCount: number;
  unverifiedNumbersCount: number;
  tokens: NumericalAuditToken[];
  verdict: 'VERIFIED_ZERO_HALLUCINATION' | 'FLAGGED_UNGROUNDED_NUMBERS';
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  contentNepali?: string;
  timestamp: string;
  auditReport?: CopilotAuditReport;
}

export interface SituationReportData {
  reportId: string;
  title: string;
  titleNepali: string;
  timestamp: string;
  eventDate: string;
  aoiName: string;
  authorAgency: string;
  executiveSummaryEn: string;
  executiveSummaryNe: string;
  keyMetrics: PipelineStats;
  criticalBridges: DamagedBridge[];
  isolatedSettlements: Settlement[];
  audit: CopilotAuditReport;
  attributions: string[];
}

export interface DisasterScenario {
  id: string;
  name: string;
  nameNepali: string;
  date: string;
  country: string;
  description: string;
  center: [number, number];
  zoom: number;
  orbitPair: SatelliteOrbitPair;
  stats: PipelineStats;
}

// Felt-Inspired Collaborative Mapping Types
export type FeltTool = 'pan' | 'highlighter' | 'marker' | 'note' | 'measure' | 'polygon';

export interface FeltHighlighterPath {
  id: string;
  points: [number, number][]; // [lng, lat]
  color: string;
  width: number;
  opacity: number;
  label?: string;
  author: string;
}

export type FeltMarkerType = 'medical' | 'heli_lz' | 'bridge_out' | 'ration_drop' | 'shelter' | 'hazard';

export interface FeltTriageMarker {
  id: string;
  lat: number;
  lng: number;
  type: FeltMarkerType;
  title: string;
  author: string;
  timestamp: string;
  color: string;
}

export interface FeltStickyNote {
  id: string;
  lat: number;
  lng: number;
  title: string;
  content: string;
  author: string;
  role: string;
  avatarColor: string;
  timestamp: string;
  priority: 'Critical' | 'Urgent' | 'Info';
  resolved: boolean;
}

export interface FeltMeasureSegment {
  p1: { lat: number; lng: number; elev: number };
  p2: { lat: number; lng: number; elev: number };
  distanceKm: number;
  elevationDeltaM: number;
  slopePercent: number;
  estWalkHours: number;
  estHeliMinutes: number;
}

export interface FeltCollaborator {
  id: string;
  name: string;
  agency: string;
  color: string;
  avatar: string;
  pos: [number, number]; // [lng, lat]
  activeAction?: string;
}

