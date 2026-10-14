import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Layers,
  Activity,
  Sliders,
  Crosshair,
  AlertTriangle,
  Play,
  Pause,
  ChevronRight,
  Navigation2,
  Maximize2,
  Timer,
  Waves,
  MapPin,
  StickyNote,
  ShieldAlert,
  Share2,
} from 'lucide-react';
import {
  Settlement,
  DamagedBridge,
  HazardPolygon,
  SubmergedRoadSegment,
  FlowTraceResult,
  FeltTool,
  FeltMarkerType,
  FeltHighlighterPath,
  FeltTriageMarker,
  FeltStickyNote,
  FeltMeasureSegment,
  FeltCollaborator,
} from '../types/setu.ts';
import {
  CORRIDOR_BBOX as BBOX,
  DEFAULT_VIEW_WIDTH as VIEW_WIDTH,
  DEFAULT_VIEW_HEIGHT as VIEW_HEIGHT,
  lngToX,
  latToY,
  estimateElevation,
  haversineDistanceKm,
} from '../utils/geoUtils.ts';
import {
  INITIAL_FELT_NOTES,
  INITIAL_FELT_MARKERS,
  INITIAL_FELT_PATHS,
  INITIAL_COLLABORATORS,
} from '../data/feltInitialData.ts';
import { SystemLatencyBadge } from './map/SystemLatencyBadge.tsx';
import { MapControls } from './map/MapControls.tsx';
import { ElevationProfile } from './map/ElevationProfile.tsx';
import { FeltFloatingDock } from './map/FeltFloatingDock.tsx';
import { FeltLayersPalette, LayerState } from './map/FeltLayersPalette.tsx';
import { FeltShareModal } from './map/FeltShareModal.tsx';
import { FeltStickyNoteModal } from './map/FeltStickyNoteModal.tsx';
import { FeltMeasureCard } from './map/FeltMeasureCard.tsx';

interface MapStageProps {
  settlements: Settlement[];
  damagedBridges: DamagedBridge[];
  hazardPolygons: HazardPolygon[];
  submergedRoads: SubmergedRoadSegment[];
  flowTrace: FlowTraceResult | null;
  radarConfidence?: number;
  slopeThreshold?: number;
  onSelectSettlement: (s: Settlement) => void;
  onSelectBridge: (b: DamagedBridge) => void;
  onTriggerTrace: (lat: number, lng: number) => void;
  selectedSettlementId?: string;
  selectedBridgeId?: string;
  onOpenSitrep?: () => void;
}

export const MapStage: React.FC<MapStageProps> = ({
  settlements,
  damagedBridges,
  hazardPolygons,
  submergedRoads,
  flowTrace,
  radarConfidence = 0.65,
  slopeThreshold = 15.0,
  onSelectSettlement,
  onSelectBridge,
  onTriggerTrace,
  selectedSettlementId,
  selectedBridgeId,
  onOpenSitrep,
}) => {
  // Zoom & Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // FELT TOOLBAR STATE
  const [activeTool, setActiveTool] = useState<FeltTool>('pan');
  const [highlighterColor, setHighlighterColor] = useState('#06b6d4');
  const [highlighterWidth, setStrokeWidth] = useState(6);
  const [currentMarkerType, setCurrentMarkerType] = useState<FeltMarkerType>('heli_lz');

  // FELT SPATIAL DATA
  const [highlighterPaths, setHighlighterPaths] = useState<FeltHighlighterPath[]>(INITIAL_FELT_PATHS);
  const [currentDrawingPath, setCurrentDrawingPath] = useState<[number, number][] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [triageMarkers, setTriageMarkers] = useState<FeltTriageMarker[]>(INITIAL_FELT_MARKERS);
  const [stickyNotes, setStickyNotes] = useState<FeltStickyNote[]>(INITIAL_FELT_NOTES);
  const [activeNoteModal, setActiveNoteModal] = useState<{
    note: FeltStickyNote;
    isNew: boolean;
  } | null>(null);

  // FELT COLLABORATION & LAYERS
  const [collaborators, setCollaborators] = useState<FeltCollaborator[]>(INITIAL_COLLABORATORS);
  const [showCollaborators, setShowCollaborators] = useState(true);
  const [showLayersPalette, setShowLayersPalette] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // FELT MEASURE TOOL
  const [measurePoints, setMeasurePoints] = useState<{
    p1: { lat: number; lng: number; elev: number } | null;
    p2: { lat: number; lng: number; elev: number } | null;
  }>({ p1: null, p2: null });
  const [measureSegment, setMeasureSegment] = useState<FeltMeasureSegment | null>(null);

  // FELT LAYERS VISIBILITY & OPACITY
  const [layerState, setLayerState] = useState<LayerState>({
    sarHeatmap: true,
    sarOpacity: 0.75,
    hazardPolygons: true,
    hazardOpacity: 0.6,
    roadsAndBridges: true,
    settlements: true,
    hydrologyTracer: true,
    userAnnotations: true,
    fieldNotes: true,
    elevationProfile: true,
  });

  const handleUpdateLayer = (key: keyof LayerState, value: any) => {
    setLayerState((prev) => ({ ...prev, [key]: value }));
  };

  // Split Comparison Slider (Pre vs Post)
  const [splitSwipeMode, setSplitSwipeMode] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);

  // Time Scrubber
  const [timelineHour, setTimelineHour] = useState(14);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);

  // System Latency Tracker
  const [systemLatency, setSystemLatency] = useState('4.2s');
  const [isProcessing, setIsProcessing] = useState(false);
  const [calculationLabel, setCalculationLabel] = useState('Sentinel-1A VV/VH + DEM Slope Mask');

  // Upstream Tracer Active
  const [tracerActive, setTracerActive] = useState(false);

  // Mouse HUD Coords
  const [mouseCoord, setMouseCoord] = useState<{
    lat: number;
    lng: number;
    elev: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Track latency adjustments
  useEffect(() => {
    setIsProcessing(true);
    const timer = setTimeout(() => {
      const time = (3.7 + (1 - radarConfidence) * 0.7 + (slopeThreshold / 30) * 0.4).toFixed(1);
      setSystemLatency(`${time}s`);
      setCalculationLabel(`SAR ${(radarConfidence * 100).toFixed(0)}% · Slope ${slopeThreshold}°`);
      setIsProcessing(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [radarConfidence, slopeThreshold, hazardPolygons.length]);

  useEffect(() => {
    if (flowTrace) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        const time = (2.4 + (flowTrace.totalLengthKm / 50) * 1.5).toFixed(1);
        setSystemLatency(`${time}s`);
        setCalculationLabel(`DEM flow path ${flowTrace.totalLengthKm}km`);
        setIsProcessing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [flowTrace]);

  // Timeline playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setTimelineHour((prev) => (prev >= 24 ? 0 : prev + 1));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  // Collaborative cursor subtle wandering animation
  useEffect(() => {
    if (!showCollaborators) return;
    const interval = setInterval(() => {
      setCollaborators((prev) =>
        prev.map((c) => ({
          ...c,
          pos: [
            c.pos[0] + (Math.random() - 0.5) * 0.003,
            c.pos[1] + (Math.random() - 0.5) * 0.003,
          ],
        }))
      );
    }, 3200);
    return () => clearInterval(interval);
  }, [showCollaborators]);

  // Helper to convert screen coordinates to geographic coordinates
  const getGeoFromEvent = (e: React.MouseEvent) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - pan.x;
    const clickY = e.clientY - rect.top - pan.y;

    const normX = clickX / (VIEW_WIDTH * zoom);
    const normY = clickY / (VIEW_HEIGHT * zoom);

    const lng = BBOX.minLng + normX * (BBOX.maxLng - BBOX.minLng);
    const lat = BBOX.maxLat - normY * (BBOX.maxLat - BBOX.minLat);
    const elev = estimateElevation(lat, lng);

    return { lat, lng, elev, clickX, clickY };
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (tracerActive) return;

    if (activeTool === 'highlighter') {
      const geo = getGeoFromEvent(e);
      if (geo) {
        setIsDrawing(true);
        setCurrentDrawingPath([[geo.lng, geo.lat]]);
      }
      return;
    }

    if (activeTool === 'pan') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const geo = getGeoFromEvent(e);
    if (geo) {
      if (
        geo.lng >= BBOX.minLng &&
        geo.lng <= BBOX.maxLng &&
        geo.lat >= BBOX.minLat &&
        geo.lat <= BBOX.maxLat
      ) {
        setMouseCoord({
          lat: Number(geo.lat.toFixed(4)),
          lng: Number(geo.lng.toFixed(4)),
          elev: geo.elev,
        });
      }
    }

    if (isDrawing && activeTool === 'highlighter' && geo) {
      setCurrentDrawingPath((prev) => (prev ? [...prev, [geo.lng, geo.lat]] : [[geo.lng, geo.lat]]));
      return;
    }

    if (isDragging && activeTool === 'pan' && !tracerActive) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && activeTool === 'highlighter' && currentDrawingPath && currentDrawingPath.length > 2) {
      const newPath: FeltHighlighterPath = {
        id: `path-${Date.now()}`,
        author: 'Field Ops Lead',
        color: highlighterColor,
        width: highlighterWidth,
        opacity: 0.8,
        label: `Corridor ${highlighterPaths.length + 1}`,
        points: currentDrawingPath,
      };
      setHighlighterPaths((prev) => [...prev, newPath]);
      setCurrentDrawingPath(null);
      setIsDrawing(false);
      return;
    }

    setIsDrawing(false);
    setIsDragging(false);
  };

  // Map Click for Tools: Marker, Sticky Note, Measure, Tracer
  const handleMapClick = (e: React.MouseEvent) => {
    const geo = getGeoFromEvent(e);
    if (!geo) return;

    // 1. Tracer tool
    if (tracerActive) {
      onTriggerTrace(geo.lat, geo.lng);
      setTracerActive(false);
      return;
    }

    // 2. Drop Pin Marker
    if (activeTool === 'marker') {
      const markerTitles: Record<FeltMarkerType, string> = {
        heli_lz: 'Safe Heli LZ (Point)',
        bridge_out: 'Severed River Span',
        medical: 'Field Triage Post',
        ration_drop: 'Airdrop Delivery Point',
        shelter: 'Displacement Evac Camp',
        hazard: 'Unstable Slurry Block',
      };
      const markerColors: Record<FeltMarkerType, string> = {
        heli_lz: '#10b981',
        bridge_out: '#f43f5e',
        medical: '#06b6d4',
        ration_drop: '#f59e0b',
        shelter: '#8b5cf6',
        hazard: '#ea580c',
      };

      const newMarker: FeltTriageMarker = {
        id: `marker-${Date.now()}`,
        lat: geo.lat,
        lng: geo.lng,
        type: currentMarkerType,
        title: markerTitles[currentMarkerType],
        author: 'Rescue Dispatcher',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: markerColors[currentMarkerType],
      };
      setTriageMarkers((prev) => [...prev, newMarker]);
      return;
    }

    // 3. Drop Sticky Note
    if (activeTool === 'note') {
      const draftNote: FeltStickyNote = {
        id: `note-${Date.now()}`,
        lat: geo.lat,
        lng: geo.lng,
        title: 'New Spatial Field Note',
        content: '',
        author: 'Capt. P. Thapa',
        role: 'SAR Coordinator',
        avatarColor: '#f59e0b',
        timestamp: 'Just now',
        priority: 'Urgent',
        resolved: false,
      };
      setActiveNoteModal({ note: draftNote, isNew: true });
      return;
    }

    // 4. Mountain Transit Measure Ruler
    if (activeTool === 'measure') {
      if (!measurePoints.p1) {
        setMeasurePoints({
          p1: { lat: geo.lat, lng: geo.lng, elev: geo.elev },
          p2: null,
        });
        setMeasureSegment(null);
      } else if (!measurePoints.p2) {
        const p1 = measurePoints.p1;
        const p2 = { lat: geo.lat, lng: geo.lng, elev: geo.elev };
        const distKm = haversineDistanceKm([p1.lng, p1.lat], [p2.lng, p2.lat]);
        const elevDelta = p2.elev - p1.elev;
        const slopePercent = distKm > 0 ? (Math.abs(elevDelta) / (distKm * 1000)) * 100 : 0;
        // Mountain walking speed: base ~2.8 km/h minus slope drag
        const walkHours = Math.max(0.4, distKm / (2.8 * (1 - Math.min(0.5, slopePercent / 100))));
        const heliMinutes = Math.max(2, Math.round((distKm / 180) * 60 + 2));

        setMeasurePoints({ p1, p2 });
        setMeasureSegment({
          p1,
          p2,
          distanceKm: distKm,
          elevationDeltaM: elevDelta,
          slopePercent,
          estWalkHours: walkHours,
          estHeliMinutes: heliMinutes,
        });
      }
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // GeoJSON Export Handler (Felt-Style)
  const handleExportGeoJSON = () => {
    const featureCollection = {
      type: 'FeatureCollection',
      name: 'SETU_Trishuli_Disaster_Triage',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: [
        // Settlements
        ...settlements.map((s) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
          properties: {
            id: s.id,
            name: s.name,
            nameNepali: s.nameNepali,
            isCutOff: s.isCutOff,
            population: s.estimatedPopulation,
            elevationM: s.elevationM,
          },
        })),
        // Damaged Bridges
        ...damagedBridges.map((b) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [b.lng, b.lat] },
          properties: {
            id: b.id,
            name: b.name,
            status: b.status,
            elevationM: b.elevationM,
          },
        })),
        // User Drawn Highlighters
        ...highlighterPaths.map((p) => ({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: p.points },
          properties: {
            id: p.id,
            label: p.label,
            author: p.author,
            color: p.color,
          },
        })),
        // Felt Sticky Notes
        ...stickyNotes.map((n) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [n.lng, n.lat] },
          properties: {
            id: n.id,
            title: n.title,
            content: n.content,
            priority: n.priority,
            author: n.author,
          },
        })),
      ],
    };

    const blob = new Blob([JSON.stringify(featureCollection, null, 2)], {
      type: 'application/geo+json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `setu-trishuli-triage-${new Date().toISOString().slice(0, 10)}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Base River Geometry
  const riverPathString = useMemo(() => {
    const riverCoords: [number, number][] = [
      [85.392, 28.295],
      [85.385, 28.272],
      [85.378, 28.243],
      [85.368, 28.225],
      [85.356, 28.198],
      [85.334, 28.158],
      [85.305, 28.11],
      [85.278, 28.082],
      [85.245, 28.03],
      [85.185, 27.978],
      [85.158, 27.915],
    ];

    return riverCoords
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${lngToX(c[0])} ${latToY(c[1])}`)
      .join(' ');
  }, []);

  // Elevation Profile
  const profilePoints = useMemo(() => {
    if (!flowTrace) return [];
    return flowTrace.flowPath.map((pt, idx) => ({
      distKm: (idx * 2.6).toFixed(1),
      elevM: pt[2],
      x: idx * 45,
      y: 90 - ((pt[2] - 580) / (4320 - 580)) * 75,
    }));
  }, [flowTrace]);

  const profileSvgPath = useMemo(() => {
    if (profilePoints.length === 0) return '';
    return profilePoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [profilePoints]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#080c14] overflow-hidden select-none ${
        tracerActive
          ? 'cursor-crosshair'
          : activeTool === 'highlighter' || activeTool === 'marker' || activeTool === 'note' || activeTool === 'measure'
          ? 'cursor-crosshair'
          : isDragging
          ? 'cursor-grabbing'
          : 'cursor-grab'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleMapClick}
    >
      {/* 1. FELT FLOATING TOOLBAR DOCK (Top Center) */}
      <FeltFloatingDock
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        currentColor={highlighterColor}
        setCurrentColor={setHighlighterColor}
        strokeWidth={highlighterWidth}
        setStrokeWidth={setStrokeWidth}
        onClearHighlighters={() => setHighlighterPaths([])}
        hasDrawings={highlighterPaths.length > 0}
        currentMarkerType={currentMarkerType}
        setCurrentMarkerType={setCurrentMarkerType}
        showLayersPalette={showLayersPalette}
        setShowLayersPalette={setShowLayersPalette}
        showCollaborators={showCollaborators}
        setShowCollaborators={setShowCollaborators}
        onOpenShareModal={() => setShowShareModal(true)}
        activeCollaboratorCount={collaborators.length}
        notesCount={stickyNotes.length}
        markersCount={triageMarkers.length}
      />

      {/* 2. FELT LAYERS & DATA PALETTE (Floating Left) */}
      <FeltLayersPalette
        isOpen={showLayersPalette}
        onClose={() => setShowLayersPalette(false)}
        layers={layerState}
        onUpdateLayer={handleUpdateLayer}
        counts={{
          hazardKm2: 24.0,
          bridgesCount: damagedBridges.filter((b) => b.status === 'Severed').length,
          cutoffCount: settlements.filter((s) => s.isCutOff).length,
          notesCount: stickyNotes.length,
          markersCount: triageMarkers.length,
          pathsCount: highlighterPaths.length,
        }}
      />

      {/* 3. FELT SHARE & EXPORT MODAL */}
      <FeltShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onOpenSitrep={onOpenSitrep || (() => {})}
        onExportGeoJSON={handleExportGeoJSON}
      />

      {/* 4. FELT STICKY NOTE MODAL */}
      <FeltStickyNoteModal
        isOpen={!!activeNoteModal}
        note={activeNoteModal ? activeNoteModal.note : null}
        isNew={activeNoteModal ? activeNoteModal.isNew : false}
        onClose={() => setActiveNoteModal(null)}
        onSave={(updatedNote) => {
          setStickyNotes((prev) => {
            const exists = prev.some((n) => n.id === updatedNote.id);
            if (exists) {
              return prev.map((n) => (n.id === updatedNote.id ? updatedNote : n));
            }
            return [...prev, updatedNote];
          });
        }}
        onDelete={(noteId) => {
          setStickyNotes((prev) => prev.filter((n) => n.id !== noteId));
        }}
      />

      {/* 5. FELT MEASURE CARD HUD */}
      {activeTool === 'measure' && (
        <FeltMeasureCard
          segment={measureSegment}
          measuringStep={!measurePoints.p1 ? 'first' : !measurePoints.p2 ? 'second' : 'done'}
          onClear={() => {
            setMeasurePoints({ p1: null, p2: null });
            setMeasureSegment(null);
          }}
          onClose={() => {
            setActiveTool('pan');
            setMeasurePoints({ p1: null, p2: null });
            setMeasureSegment(null);
          }}
        />
      )}

      {/* 6. SVG Canvas Map */}
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="w-full h-full transition-transform duration-75 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <defs>
          <pattern id="topoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255, 255, 255, 0.025)"
              strokeWidth="0.5"
            />
          </pattern>

          <linearGradient id="valleySlope" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#080c15" />
            <stop offset="50%" stopColor="#0d1424" />
            <stop offset="100%" stopColor="#060910" />
          </linearGradient>

          <linearGradient id="sarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="debrisGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.35" />
          </linearGradient>

          {/* Glow filter for active measure line and highlighters */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Base Mountain Topography */}
        <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="url(#valleySlope)" />
        <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="url(#topoGrid)" />

        {/* Mountain Ridge Contour Shading lines */}
        <path
          d="M 600 50 Q 750 200 700 450 T 850 800"
          fill="none"
          stroke="rgba(148, 163, 184, 0.06)"
          strokeWidth="1.5"
        />
        <path
          d="M 400 50 Q 550 220 500 500 T 600 850"
          fill="none"
          stroke="rgba(148, 163, 184, 0.06)"
          strokeWidth="1.5"
        />
        <path
          d="M 200 100 Q 300 350 350 650 T 450 850"
          fill="none"
          stroke="rgba(148, 163, 184, 0.06)"
          strokeWidth="1.5"
        />

        {/* 2. Main Trishuli River Trunk */}
        <path
          d={riverPathString}
          fill="none"
          stroke="#0284c7"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        <path
          d={riverPathString}
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* 3. Sentinel-1 SAR Radar Inundation Heatmap */}
        {layerState.sarHeatmap && (
          <g opacity={layerState.sarOpacity} className="transition-opacity">
            <path
              d="M 750 60 Q 730 180 710 320 T 560 620 L 590 640 Q 740 340 780 160 Z"
              fill="url(#sarGradient)"
            />
            <path
              d="M 520 480 Q 480 620 420 740 L 450 760 Q 510 630 550 490 Z"
              fill="url(#sarGradient)"
            />
          </g>
        )}

        {/* 4. Hazard Polygons */}
        {layerState.hazardPolygons &&
          hazardPolygons.map((poly) => {
            const svgPath = poly.coordinates
              .map((c, i) => `${i === 0 ? 'M' : 'L'} ${lngToX(c[0])} ${latToY(c[1])}`)
              .join(' ') + ' Z';

            return (
              <g key={poly.id}>
                <path
                  d={svgPath}
                  fill={poly.type === 'debris_flow' ? 'url(#debrisGradient)' : 'url(#sarGradient)'}
                  stroke={poly.type === 'debris_flow' ? '#f59e0b' : '#38bdf8'}
                  strokeWidth="1.5"
                  strokeDasharray={poly.type === 'debris_flow' ? '4 2' : 'none'}
                  opacity={layerState.hazardOpacity}
                />
              </g>
            );
          })}

        {/* 5. Upstream DEM Flow Tracer Vector */}
        {layerState.hydrologyTracer && flowTrace && (
          <g>
            <path
              d={flowTrace.flowPath
                .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${lngToX(pt[0])} ${latToY(pt[1])}`)
                .join(' ')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="6 4"
              className="animate-pulse"
              filter="url(#neonGlow)"
            />
          </g>
        )}

        {/* 6. Roads & Bridges */}
        {layerState.roadsAndBridges &&
          submergedRoads.map((road) => {
            const roadPath = road.coordinates
              .map((c, i) => `${i === 0 ? 'M' : 'L'} ${lngToX(c[0])} ${latToY(c[1])}`)
              .join(' ');

            return (
              <path
                key={road.id}
                d={roadPath}
                fill="none"
                stroke={road.status === 'Severed by River' ? '#f43f5e' : '#f59e0b'}
                strokeWidth="2.5"
                strokeDasharray={road.status === 'Severed by River' ? '3 3' : 'none'}
                opacity="0.9"
              />
            );
          })}

        {/* 7. Damaged Bridges */}
        {layerState.roadsAndBridges &&
          damagedBridges.map((br) => {
            const bx = lngToX(br.lng);
            const by = latToY(br.lat);
            const isSelected = selectedBridgeId === br.id;

            return (
              <g
                key={br.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBridge(br);
                }}
              >
                <circle
                  cx={bx}
                  cy={by}
                  r={isSelected ? 10 : 7}
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />
                <line x1={bx - 3} y1={by - 3} x2={bx + 3} y2={by + 3} stroke="#ffffff" strokeWidth="1.5" />
                <line x1={bx + 3} y1={by - 3} x2={bx - 3} y2={by + 3} stroke="#ffffff" strokeWidth="1.5" />
                <text
                  x={bx + 10}
                  y={by + 4}
                  fill="#fecdd3"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                  className="pointer-events-none drop-shadow"
                >
                  {br.name.split(' (')[0]}
                </text>
              </g>
            );
          })}

        {/* 8. Settlements */}
        {layerState.settlements &&
          settlements.map((s) => {
            const sx = lngToX(s.lng);
            const sy = latToY(s.lat);
            const isSelected = selectedSettlementId === s.id;

            return (
              <g
                key={s.id}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSettlement(s);
                }}
              >
                {s.isCutOff ? (
                  <>
                    <circle
                      cx={sx}
                      cy={sy}
                      r={isSelected ? 11 : 8}
                      fill="#ea580c"
                      stroke="#fed7aa"
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    <circle cx={sx} cy={sy} r="3" fill="#ffffff" />
                  </>
                ) : (
                  <>
                    <circle
                      cx={sx}
                      cy={sy}
                      r={isSelected ? 9 : 6}
                      fill="#059669"
                      stroke="#a7f3d0"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />
                    <circle cx={sx} cy={sy} r="2" fill="#ffffff" />
                  </>
                )}

                <text
                  x={sx}
                  y={sy - 12}
                  textAnchor="middle"
                  fill={s.isCutOff ? '#fb923c' : '#34d399'}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  className="pointer-events-none drop-shadow-md"
                >
                  {s.name}
                </text>
                <text
                  x={sx}
                  y={sy + 18}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  className="pointer-events-none"
                >
                  {s.estimatedPopulation.toLocaleString()} pop
                </text>
              </g>
            );
          })}

        {/* 9. FELT USER HIGHLIGHTER PATHS */}
        {layerState.userAnnotations &&
          highlighterPaths.map((hp) => {
            if (hp.points.length < 2) return null;
            const pathStr = hp.points
              .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${lngToX(pt[0])} ${latToY(pt[1])}`)
              .join(' ');

            return (
              <g key={hp.id}>
                <path
                  d={pathStr}
                  fill="none"
                  stroke={hp.color}
                  strokeWidth={hp.width}
                  opacity={hp.opacity}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#neonGlow)"
                />
                {hp.label && (
                  <text
                    x={lngToX(hp.points[0][0]) + 8}
                    y={latToY(hp.points[0][1]) - 8}
                    fill={hp.color}
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="700"
                    className="pointer-events-none drop-shadow-md"
                  >
                    {hp.label}
                  </text>
                )}
              </g>
            );
          })}

        {/* 10. In-Progress Drawing Path */}
        {isDrawing && currentDrawingPath && currentDrawingPath.length > 1 && (
          <path
            d={currentDrawingPath
              .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${lngToX(pt[0])} ${latToY(pt[1])}`)
              .join(' ')}
            fill="none"
            stroke={highlighterColor}
            strokeWidth={highlighterWidth}
            opacity="0.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
          />
        )}

        {/* 11. FELT TRIAGE PINS & MARKERS */}
        {layerState.userAnnotations &&
          triageMarkers.map((marker) => {
            const mx = lngToX(marker.lng);
            const my = latToY(marker.lat);

            return (
              <g key={marker.id} className="cursor-pointer">
                {/* Marker Pin Head */}
                <circle
                  cx={mx}
                  cy={my}
                  r="12"
                  fill={marker.color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="drop-shadow-lg"
                />
                <text
                  x={mx}
                  y={my + 4}
                  textAnchor="middle"
                  fontSize="10"
                  className="select-none pointer-events-none"
                >
                  {marker.type === 'heli_lz' && '🚁'}
                  {marker.type === 'bridge_out' && '⚠️'}
                  {marker.type === 'medical' && '🏥'}
                  {marker.type === 'ration_drop' && '📦'}
                  {marker.type === 'shelter' && '⛺'}
                  {marker.type === 'hazard' && '🌊'}
                </text>
                {/* Marker Callout Label */}
                <rect
                  x={mx + 16}
                  y={my - 14}
                  width={marker.title.length * 6.5 + 16}
                  height="22"
                  rx="6"
                  fill="rgba(15, 23, 42, 0.9)"
                  stroke={marker.color}
                  strokeWidth="1"
                />
                <text
                  x={mx + 24}
                  y={my + 1}
                  fill="#f8fafc"
                  fontSize="10"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="700"
                  className="pointer-events-none"
                >
                  {marker.title}
                </text>
              </g>
            );
          })}

        {/* 12. FELT SPATIAL STICKY NOTES ON MAP */}
        {layerState.fieldNotes &&
          stickyNotes.map((note) => {
            const nx = lngToX(note.lng);
            const ny = latToY(note.lat);

            const priorityColor =
              note.priority === 'Critical'
                ? '#f43f5e'
                : note.priority === 'Urgent'
                ? '#f59e0b'
                : '#06b6d4';

            return (
              <g
                key={note.id}
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNoteModal({ note, isNew: false });
                }}
              >
                {/* Sticky Note Pin Shape */}
                <path
                  d={`M ${nx} ${ny} L ${nx + 10} ${ny - 18} L ${nx + 140} ${ny - 18} A 8 8 0 0 1 ${nx + 148} ${ny - 10} L ${nx + 148} ${ny + 38} A 8 8 0 0 1 ${nx + 140} ${ny + 46} L ${nx + 18} ${ny + 46} A 8 8 0 0 1 ${nx + 10} ${ny + 38} L ${nx + 10} ${ny} Z`}
                  fill={note.resolved ? 'rgba(15, 23, 42, 0.92)' : 'rgba(30, 41, 59, 0.95)'}
                  stroke={priorityColor}
                  strokeWidth="1.5"
                  className="drop-shadow-2xl"
                />
                {/* Pin Head */}
                <circle cx={nx} cy={ny} r="4" fill={priorityColor} stroke="#ffffff" strokeWidth="1.5" />

                {/* Priority Chip */}
                <rect
                  x={nx + 18}
                  y={ny - 12}
                  width="44"
                  height="14"
                  rx="4"
                  fill={priorityColor}
                  opacity="0.25"
                />
                <text
                  x={nx + 22}
                  y={ny - 2}
                  fill={priorityColor}
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                >
                  {note.priority}
                </text>

                {/* Author Timestamp */}
                <text
                  x={nx + 66}
                  y={ny - 2}
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {note.timestamp}
                </text>

                {/* Title */}
                <text
                  x={nx + 18}
                  y={ny + 14}
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="700"
                >
                  {note.title.length > 18 ? note.title.slice(0, 18) + '...' : note.title}
                </text>

                {/* Author Name */}
                <text
                  x={nx + 18}
                  y={ny + 32}
                  fill="#cbd5e1"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {note.author}
                </text>
              </g>
            );
          })}

        {/* 13. FELT MEASURE RULER SVG OVERLAY */}
        {activeTool === 'measure' && measurePoints.p1 && (
          <g>
            {/* Point A Marker */}
            <circle
              cx={lngToX(measurePoints.p1.lng)}
              cy={latToY(measurePoints.p1.lat)}
              r="6"
              fill="#06b6d4"
              stroke="#ffffff"
              strokeWidth="2"
              filter="url(#neonGlow)"
            />
            <text
              x={lngToX(measurePoints.p1.lng)}
              y={latToY(measurePoints.p1.lat) - 10}
              textAnchor="middle"
              fill="#06b6d4"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="bold"
            >
              Point A
            </text>

            {/* Connecting Line if Point B exists */}
            {measurePoints.p2 && (
              <>
                <line
                  x1={lngToX(measurePoints.p1.lng)}
                  y1={latToY(measurePoints.p1.lat)}
                  x2={lngToX(measurePoints.p2.lng)}
                  y2={latToY(measurePoints.p2.lat)}
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  filter="url(#neonGlow)"
                />
                <circle
                  cx={lngToX(measurePoints.p2.lng)}
                  cy={latToY(measurePoints.p2.lat)}
                  r="6"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="url(#neonGlow)"
                />
                <text
                  x={lngToX(measurePoints.p2.lng)}
                  y={latToY(measurePoints.p2.lat) - 10}
                  textAnchor="middle"
                  fill="#f59e0b"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                >
                  Point B
                </text>

                {/* Midpoint Distance Badge */}
                {measureSegment && (
                  <g>
                    <rect
                      x={(lngToX(measurePoints.p1.lng) + lngToX(measurePoints.p2.lng)) / 2 - 38}
                      y={(latToY(measurePoints.p1.lat) + latToY(measurePoints.p2.lat)) / 2 - 12}
                      width="76"
                      height="24"
                      rx="8"
                      fill="#0f172a"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                    />
                    <text
                      x={(lngToX(measurePoints.p1.lng) + lngToX(measurePoints.p2.lng)) / 2}
                      y={(latToY(measurePoints.p1.lat) + latToY(measurePoints.p2.lat)) / 2 + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="700"
                    >
                      {measureSegment.distanceKm.toFixed(1)} km
                    </text>
                  </g>
                )}
              </>
            )}
          </g>
        )}

        {/* 14. FELT COLLABORATIVE LIVE CURSORS */}
        {showCollaborators &&
          collaborators.map((collab) => {
            const cx = lngToX(collab.pos[0]);
            const cy = latToY(collab.pos[1]);

            return (
              <g key={collab.id} className="pointer-events-none transition-all duration-700 ease-out">
                {/* Felt Cursor Arrow SVG */}
                <path
                  d={`M ${cx} ${cy} L ${cx + 12} ${cy + 10} L ${cx + 5} ${cy + 12} L ${cx + 9} ${cy + 20} L ${cx + 5} ${cy + 22} L ${cx + 1} ${cy + 14} L ${cx - 3} ${cy + 18} Z`}
                  fill={collab.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="drop-shadow-lg"
                />
                {/* User Name Tag */}
                <rect
                  x={cx + 14}
                  y={cy + 6}
                  width={collab.name.length * 6 + 18}
                  height="18"
                  rx="6"
                  fill={collab.color}
                  className="drop-shadow-md"
                />
                <text
                  x={cx + 20}
                  y={cy + 19}
                  fill="#000000"
                  fontSize="9"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="800"
                >
                  {collab.name}
                </text>
              </g>
            );
          })}
      </svg>

      {/* Vertical SAR Backscatter Intensity Scale (Left Side) */}
      <div className="absolute top-16 right-4 z-20 flex flex-col items-center bg-black/70 backdrop-blur-[12px] border border-white/10 rounded-2xl p-2 shadow-xl text-white">
        <span className="text-[9px] font-mono font-bold text-white/60 uppercase tracking-wider mb-2">
          SAR ΔdB
        </span>
        <div className="relative w-3.5 h-32 rounded-full overflow-hidden bg-gradient-to-t from-[#3080FF] via-[#FE6E00] to-[#FFB74D] shadow-inner">
          <div className="absolute top-1 left-0 right-0 h-0.5 bg-white/80" />
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/60" />
          <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-white/80" />
        </div>
        <div className="flex flex-col justify-between h-32 -ml-1 text-[9px] font-mono text-white/70 mt-[-128px] pl-6 pointer-events-none">
          <span>+6dB</span>
          <span>-4dB</span>
          <span>-18dB</span>
        </div>
        <span className="text-[8px] font-mono text-[#FE6E00] uppercase mt-2 font-bold">
          VV/VH
        </span>
      </div>

      {/* Floating Disaster Event Status Card (Bottom-Left) */}
      <div className="absolute bottom-20 left-4 z-20 bg-black/70 backdrop-blur-[12px] border border-white/10 rounded-2xl p-3.5 shadow-2xl max-w-xs text-white">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FE6E00]/20 border border-[#FE6E00]/40 flex items-center justify-center text-[#FE6E00]">
              <Waves className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">
                Trishuli Glacial Outburst
              </h4>
              <div className="text-[10px] text-white/60 font-mono">
                Category 4 GLOF · Observed 26 Aug
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FB2C36]/20 text-[#FB2C36] border border-[#FB2C36]/30 font-semibold">
            CRITICAL
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/10">
          <div>
            <div className="text-[9px] text-white/50 uppercase">Surge Speed</div>
            <div className="text-white font-bold tabular-nums">6.2 m/s</div>
          </div>
          <div>
            <div className="text-[9px] text-white/50 uppercase">Hazard Area</div>
            <div className="text-[#FE6E00] font-bold tabular-nums">24.0 km²</div>
          </div>
          <div>
            <div className="text-[9px] text-white/50 uppercase">Movement</div>
            <div className="text-white font-bold">South-West</div>
          </div>
          <div>
            <div className="text-[9px] text-white/50 uppercase">Severed Links</div>
            <div className="text-[#FB2C36] font-bold tabular-nums">7 Bridges</div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Time Scrubber Bar (Bottom Center) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-[12px] border border-white/10 rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-4 text-white">
        <button
          onClick={() => setIsPlayingTimeline((prev) => !prev)}
          className="w-8 h-8 rounded-xl bg-[#FE6E00] hover:bg-[#FF6B00] text-white flex items-center justify-center transition-colors shadow-sm"
          title={isPlayingTimeline ? 'Pause Timeline' : 'Play Timeline Step'}
        >
          {isPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div className="flex flex-col gap-1 w-56 sm:w-64">
          <div className="flex justify-between items-center text-[10px] font-mono text-white/70">
            <span>PRE: 14 Aug (0h)</span>
            <span className="text-[#FE6E00] font-bold">
              T+{timelineHour.toString().padStart(2, '0')}:00 hrs
            </span>
            <span>POST: 26 Aug</span>
          </div>
          <input
            type="range"
            min="0"
            max="24"
            value={timelineHour}
            onChange={(e) => setTimelineHour(Number(e.target.value))}
            className="w-full accent-[#FE6E00] h-1.5 bg-white/20 rounded-lg cursor-pointer"
          />
        </div>

        <div className="text-right pl-2 border-l border-white/10 text-xs font-mono hidden sm:block">
          <div className="text-white font-bold tabular-nums">26 Aug 2026</div>
          <div className="text-[10px] text-white/60">S1A Pass Orbit 121</div>
        </div>
      </div>

      {/* Elevation & Debris Wave Profile HUD (Floating Bottom-Right) */}
      {layerState.elevationProfile && flowTrace && profileSvgPath && (
        <ElevationProfile flowTrace={flowTrace} profileSvgPath={profileSvgPath} />
      )}

      {/* Floating HUD: Map Controls (Right Side) */}
      <div className="absolute top-28 right-4 flex flex-col gap-2 z-20">
        <MapControls
          onZoomIn={() => setZoom((z) => Math.min(3.5, z + 0.25))}
          onZoomOut={() => setZoom((z) => Math.max(0.75, z - 0.25))}
          onResetView={resetView}
          tracerActive={tracerActive}
          onToggleTracer={() => setTracerActive((prev) => !prev)}
          splitSwipeMode={splitSwipeMode}
          onToggleSplitSwipe={() => setSplitSwipeMode((prev) => !prev)}
        />
      </div>

      {/* Split Comparison Slider Overlay */}
      {splitSwipeMode && (
        <div
          className="absolute inset-y-0 pointer-events-none border-r-2 border-[#FE6E00] z-10"
          style={{ left: `${splitPosition}%` }}
        >
          <div className="absolute top-20 -left-28 px-2.5 py-1 bg-black/80 backdrop-blur-[12px] border border-white/20 text-white text-[10px] font-mono rounded-lg shadow-lg">
            PRE (14 Aug Baseline)
          </div>
          <div className="absolute top-20 left-2 px-2.5 py-1 bg-[#FE6E00] border border-[#FF6B00] text-white text-[10px] font-mono font-bold rounded-lg shadow-lg">
            POST (26 Aug Radar Inundation)
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={splitPosition}
            onChange={(e) => setSplitPosition(Number(e.target.value))}
            className="absolute top-1/2 -left-20 w-40 pointer-events-auto opacity-80 accent-[#FE6E00] cursor-ew-resize"
          />
        </div>
      )}

      {/* FELT SCALE BAR & COORDINATES PILL (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-[12px] border border-white/10 rounded-xl px-3 py-1.5 text-[10px] font-mono text-white/70 flex items-center gap-3 shadow-md pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1 bg-white/30 relative rounded">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-[#FE6E00] rounded-l" />
          </div>
          <span>2 km</span>
        </div>
        <div className="w-px h-3 bg-white/20" />
        <span>WGS84 / UTM 45N</span>
        {mouseCoord && (
          <>
            <div className="w-px h-3 bg-white/20" />
            <span className="text-white">
              {mouseCoord.lat}°N, {mouseCoord.lng}°E
            </span>
            <span className="text-[#FFB74D] font-bold">{mouseCoord.elev}m ASL</span>
          </>
        )}
      </div>

      {/* Small Persistent System Latency Timer (Bottom-Right Corner) */}
      <SystemLatencyBadge
        systemLatency={systemLatency}
        isProcessing={isProcessing}
        calculationLabel={calculationLabel}
        mouseCoord={mouseCoord}
      />

      {/* 15. FELT FLOATING TOOL DOCK (Bottom Center) */}
      <FeltFloatingDock
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        currentColor={highlighterColor}
        setCurrentColor={setHighlighterColor}
        strokeWidth={highlighterWidth}
        setStrokeWidth={setStrokeWidth}
        onClearHighlighters={() => setHighlighterPaths([])}
        hasDrawings={highlighterPaths.length > 0}
        currentMarkerType={currentMarkerType}
        setCurrentMarkerType={setCurrentMarkerType}
        showLayersPalette={showLayersPalette}
        setShowLayersPalette={setShowLayersPalette}
        showCollaborators={showCollaborators}
        setShowCollaborators={setShowCollaborators}
        onOpenShareModal={() => setShowShareModal(true)}
        activeCollaboratorCount={collaborators.length}
        notesCount={stickyNotes.length}
        markersCount={triageMarkers.length}
      />

      {/* 16. FELT LAYERS PALETTE */}
      <FeltLayersPalette
        isOpen={showLayersPalette}
        onClose={() => setShowLayersPalette(false)}
        layers={layerState}
        onUpdateLayer={handleUpdateLayer}
        counts={{
          hazardKm2: 24.0,
          bridgesCount: damagedBridges.length,
          cutoffCount: settlements.filter((s) => s.isCutOff).length,
          notesCount: stickyNotes.length,
          markersCount: triageMarkers.length,
          pathsCount: highlighterPaths.length,
        }}
      />

      {/* 17. FELT SHARE & EXPORT MODAL */}
      <FeltShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onOpenSitrep={() => {
          setShowShareModal(false);
          onOpenSitrep && onOpenSitrep();
        }}
        onExportGeoJSON={handleExportGeoJSON}
      />

      {/* 18. FELT STICKY NOTE EDIT MODAL */}
      {activeNoteModal && (
        <FeltStickyNoteModal
          isOpen={!!activeNoteModal}
          note={activeNoteModal.note}
          isNew={activeNoteModal.isNew}
          onClose={() => setActiveNoteModal(null)}
          onSave={(updatedNote) => {
            if (activeNoteModal.isNew) {
              setStickyNotes((prev) => [...prev, updatedNote]);
            } else {
              setStickyNotes((prev) =>
                prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
              );
            }
            setActiveNoteModal(null);
          }}
          onDelete={(id) => {
            setStickyNotes((prev) => prev.filter((n) => n.id !== id));
            setActiveNoteModal(null);
          }}
        />
      )}

      {/* 19. FELT MEASURE CARD HUD */}
      {(activeTool === 'measure' || measureSegment) && (
        <FeltMeasureCard
          segment={measureSegment}
          measuringStep={
            !measurePoints.p1 ? 'first' : !measurePoints.p2 ? 'second' : 'done'
          }
          onClear={() => {
            setMeasurePoints({ p1: null, p2: null });
            setMeasureSegment(null);
          }}
          onClose={() => {
            setActiveTool('pan');
            setMeasurePoints({ p1: null, p2: null });
            setMeasureSegment(null);
          }}
        />
      )}
    </div>
  );
};
