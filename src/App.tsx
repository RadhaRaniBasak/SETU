/**
 * SETU: Satellite Emergency Triage for Unreachable Villages
 * Evreghen Command Center - Emergency Operations Console
 * Bhote Koshi–Trishuli River Valley Corridor Disaster Response
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { MapStage } from './components/MapStage.tsx';
import { TriageQueue } from './components/TriageQueue.tsx';
import { CopilotPanel } from './components/CopilotPanel.tsx';
import { BenchmarkPanel } from './components/BenchmarkPanel.tsx';
import { LimitationsView } from './components/LimitationsView.tsx';
import { HandheldTerminalView } from './components/HandheldTerminalView.tsx';
import { SitrepModal } from './components/SitrepModal.tsx';
import { InspectorModal } from './components/InspectorModal.tsx';
import { SETULandingPage } from './components/landing/SETULandingPage.tsx';
import {
  AoiPipelineRunnerModal,
  CustomAoiExecutionResult,
} from './components/AoiPipelineRunnerModal.tsx';
import {
  TRISHULI_SCENARIO,
  TRISHULI_STATS,
  SETTLEMENTS_DATA,
  DAMAGED_BRIDGES,
  SUBMERGED_ROADS,
  HAZARD_POLYGONS,
} from './data/trishuliScenario.ts';
import { traceDownstreamValleyFlow } from './services/hydrologyService.ts';
import {
  Settlement,
  DamagedBridge,
  FlowTraceResult,
  PipelineStats,
  DisasterScenario,
} from './types/setu.ts';
import {
  Activity,
  Sliders,
  MapPin,
  Waves,
  ShieldAlert,
  ChevronRight,
  Database,
  Satellite,
  Compass,
  Play,
  Layers,
} from 'lucide-react';

export default function App() {
  // Default directly to Evreghen Command Center console
  const [viewMode, setViewMode] = useState<'console' | 'landing'>('console');
  const [activeTab, setActiveTab] = useState<
    'map' | 'triage' | 'copilot' | 'benchmark' | 'limitations' | 'terminal'
  >('map');
  const [isSitrepOpen, setIsSitrepOpen] = useState(false);
  const [isCustomAoiModalOpen, setIsCustomAoiModalOpen] = useState(false);

  // Active Scenario & Core Data State
  const [activeScenario, setActiveScenario] = useState<DisasterScenario>(TRISHULI_SCENARIO);
  const [stats, setStats] = useState<PipelineStats>(TRISHULI_STATS);
  const [settlements, setSettlements] = useState<Settlement[]>(SETTLEMENTS_DATA);
  const [bridges, setBridges] = useState<DamagedBridge[]>(DAMAGED_BRIDGES);
  const [submergedRoads, setSubmergedRoads] = useState(SUBMERGED_ROADS);
  const [hazardPolygons, setHazardPolygons] = useState(HAZARD_POLYGONS);

  // Inspector & Selection State
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [selectedBridge, setSelectedBridge] = useState<DamagedBridge | null>(null);

  // Interactive Hydrology Flow Trace State
  const [flowTrace, setFlowTrace] = useState<FlowTraceResult | null>(() =>
    traceDownstreamValleyFlow(28.28, 85.388, SETTLEMENTS_DATA)
  );

  // Parameter Sliders
  const [radarConfidence, setRadarConfidence] = useState(0.65);
  const [slopeThreshold, setSlopeThreshold] = useState(15.0);

  // Side Tray on Map View: 'queue' | 'copilot'
  const [mapSideTray, setMapSideTray] = useState<'queue' | 'copilot'>('queue');

  // Trigger flow calculation
  const handleTriggerTrace = async (lat: number, lng: number) => {
    try {
      const res = await fetch('/api/hydrology/trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startLat: lat, startLng: lng }),
      });
      if (res.ok) {
        const traceData = await res.json();
        setFlowTrace(traceData);
      } else {
        const fallback = traceDownstreamValleyFlow(lat, lng, settlements);
        setFlowTrace(fallback);
      }
    } catch {
      const fallback = traceDownstreamValleyFlow(lat, lng, settlements);
      setFlowTrace(fallback);
    }
  };

  const handleSelectSettlement = (s: Settlement) => {
    setSelectedSettlement(s);
    setSelectedBridge(null);
  };

  const handleSelectBridge = (b: DamagedBridge) => {
    setSelectedBridge(b);
    setSelectedSettlement(null);
  };

  const handleAskCopilotFromInspector = (question: string) => {
    setSelectedSettlement(null);
    setSelectedBridge(null);
    setActiveTab('copilot');
  };

  // Re-filter hazard polygons when sliders adjust
  useEffect(() => {
    const filtered = HAZARD_POLYGONS.filter(
      (p) => p.confidence >= radarConfidence && p.slopeDegrees <= slopeThreshold
    );
    setHazardPolygons(filtered);
  }, [radarConfidence, slopeThreshold]);

  const cutoffCount = settlements.filter((s) => s.isCutOff).length;

  if (viewMode === 'landing') {
    return (
      <SETULandingPage
        onLaunchConsole={() => setViewMode('console')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FCFAF7] font-sans text-[#423D38]">
      {/* Top Header in Evreghen Frosted Shell Frame (h-16) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSitrep={() => setIsSitrepOpen(true)}
        cutoffCount={cutoffCount}
        onBackToLanding={() => setViewMode('landing')}
      />

      {/* Main Workstation Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Render Tabs */}
        {activeTab === 'map' && (
          <>
            {/* Left Control & Mission Parameters Panel: Dark Frosted Shell Sidebar */}
            <aside className="w-72 lg:w-80 bg-black/70 backdrop-blur-[12px] border-r border-white/10 text-white flex flex-col justify-between overflow-y-auto shrink-0 z-10 select-none">
              <div className="p-4 space-y-4">
                {/* Active Scenario Card */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/60 font-mono">
                    <span className="flex items-center gap-1.5 text-[#FFB74D] font-bold">
                      <Satellite className="w-3.5 h-3.5 text-[#FE6E00]" />
                      <span>MISSION AOI</span>
                    </span>
                    <span className="text-white/80 font-bold">{activeScenario.date}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {activeScenario.name}
                    </h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      {activeScenario.country}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[11px] text-white/60 space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>RADAR:</span>
                      <span className="text-white">Sentinel-1A (Orbit {activeScenario.orbitPair?.relativeOrbit || 121})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BASELINE PAIR:</span>
                      <span className="text-white">{activeScenario.orbitPair?.preEventDate || '14 Aug'} ↔ {activeScenario.orbitPair?.postEventDate || '26 Aug'} (12d)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>POLARIZATION:</span>
                      <span className="text-white">VV + VH Log-Ratio</span>
                    </div>
                    <div className="flex justify-between">
                      <span>OSM SNAPSHOT:</span>
                      <span className="text-white">Pre-event freeze (ohsome API)</span>
                    </div>
                  </div>

                  {/* Interactive Button for Judges to Run on Any Area and Date */}
                  <button
                    onClick={() => setIsCustomAoiModalOpen(true)}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-[#FE6E00] hover:bg-[#FF6B00] text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Run Any Area & Date Pipeline</span>
                  </button>
                </div>

                {/* Key Metrics Strip (Evreghen Orange Telemetry Accents) */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[10px] text-white/60 font-mono uppercase">
                      Hazard Extent
                    </div>
                    <div className="text-base font-bold font-mono text-[#FE6E00] tabular-nums">
                      {stats.totalHazardAreaKm2} km²
                    </div>
                    <div className="text-[10px] text-white/40">
                      14.8 water / 9.2 debris
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[10px] text-white/60 font-mono uppercase">
                      Severed Bridges
                    </div>
                    <div className="text-base font-bold font-mono text-[#FB2C36] tabular-nums">
                      {stats.damagedBridgesCount}
                    </div>
                    <div className="text-[10px] text-white/40">
                      Choke-points lost
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[10px] text-white/60 font-mono uppercase">
                      Submerged Highway
                    </div>
                    <div className="text-base font-bold font-mono text-[#FFB74D] tabular-nums">
                      {stats.submergedRoadKm} km
                    </div>
                    <div className="text-[10px] text-white/40">
                      Pasang Lhamu H09
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[10px] text-white/60 font-mono uppercase">
                      Isolated Civilians
                    </div>
                    <div className="text-base font-bold font-mono text-[#FE6E00] tabular-nums">
                      {stats.isolatedPopulationCount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-white/40">
                      Across 7 villages
                    </div>
                  </div>
                </div>

                {/* Radar Calibration & DEM Slope Filter Sliders */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Sliders className="w-3.5 h-3.5 text-[#FE6E00]" />
                    <span>Radar & Topographic Filters</span>
                  </div>

                  {/* Confidence Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-white/70 font-mono mb-1">
                      <span>SAR Confidence Threshold:</span>
                      <span className="text-[#FE6E00] font-bold">
                        {(radarConfidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="0.95"
                      step="0.05"
                      value={radarConfidence}
                      onChange={(e) => setRadarConfidence(Number(e.target.value))}
                      className="w-full accent-[#FE6E00] h-1.5 bg-white/20 rounded cursor-pointer"
                    />
                  </div>

                  {/* DEM Slope Mask Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] text-white/70 font-mono mb-1">
                      <span>DEM Slope Cutoff:</span>
                      <span className="text-[#FFB74D] font-bold">
                        {slopeThreshold}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={slopeThreshold}
                      onChange={(e) => setSlopeThreshold(Number(e.target.value))}
                      className="w-full accent-[#FFB74D] h-1.5 bg-white/20 rounded cursor-pointer"
                    />
                    <p className="text-[10px] text-white/40 mt-1">
                      Eliminates steep mountain radar reflections where standing water cannot pool.
                    </p>
                  </div>
                </div>

                {/* Hydrology Trace Status Card */}
                {flowTrace && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Waves className="w-3.5 h-3.5 text-[#FE6E00]" />
                        <span>Upstream Flow Tracer</span>
                      </span>
                      <span className="text-[10px] font-mono text-white/60">
                        D8 DEM Descent
                      </span>
                    </div>
                    <div className="text-[11px] text-white/80 space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span className="text-white/60">VALLEY LENGTH:</span>
                        <span className="text-white font-bold">{flowTrace.totalLengthKm} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">ELEVATION DROP:</span>
                        <span className="text-white font-bold">{flowTrace.totalDescentM}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">PEAK SURGE SPEED:</span>
                        <span className="text-white font-bold">
                          {flowTrace.estimatedPeakVelocityMs} m/s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">DOWNSTREAM IMPACT:</span>
                        <span className="text-[#FE6E00] font-bold">
                          {flowTrace.impactedSettlements.length} villages
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Attribution Footer */}
              <div className="p-3 border-t border-white/10 bg-black/40 text-[10px] text-white/40 space-y-0.5">
                <p>Contains modified Copernicus Sentinel data 2026.</p>
                <p>Copernicus WorldDEM-30 © DLR / Airbus DS / ESA.</p>
                <p>© OpenStreetMap contributors (Pre-event snapshot).</p>
              </div>
            </aside>

            {/* Center Stage: Interactive GIS Map Canvas */}
            <main className="flex-1 relative h-full">
              <MapStage
                settlements={settlements}
                damagedBridges={bridges}
                hazardPolygons={hazardPolygons}
                submergedRoads={submergedRoads}
                flowTrace={flowTrace}
                radarConfidence={radarConfidence}
                slopeThreshold={slopeThreshold}
                onSelectSettlement={handleSelectSettlement}
                onSelectBridge={handleSelectBridge}
                onTriggerTrace={handleTriggerTrace}
                selectedSettlementId={selectedSettlement?.id}
                selectedBridgeId={selectedBridge?.id}
                onOpenSitrep={() => setIsSitrepOpen(true)}
              />

              {/* Floating Inspector Modal if a marker is selected */}
              <InspectorModal
                settlement={selectedSettlement}
                bridge={selectedBridge}
                onClose={() => {
                  setSelectedSettlement(null);
                  setSelectedBridge(null);
                }}
                onAskCopilot={handleAskCopilotFromInspector}
              />
            </main>

            {/* Right Workstation Column (380px): Warm Document Workspace with Triage Queue or Copilot */}
            <aside className="w-96 border-l border-[#E3E0DD] bg-[#FCFAF7] flex flex-col shrink-0 z-10 shadow-sm">
              {/* Tray Switcher Bar */}
              <div className="flex border-b border-[#E3E0DD] bg-[#F3F4F6] p-1.5 gap-1.5">
                <button
                  onClick={() => setMapSideTray('queue')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    mapSideTray === 'queue'
                      ? 'bg-[#FE6E00] text-white shadow-sm'
                      : 'text-[#797067] hover:text-[#423D38] hover:bg-black/5'
                  }`}
                >
                  Cut-off Queue ({cutoffCount})
                </button>
                <button
                  onClick={() => setMapSideTray('copilot')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    mapSideTray === 'copilot'
                      ? 'bg-[#FE6E00] text-white shadow-sm'
                      : 'text-[#797067] hover:text-[#423D38] hover:bg-black/5'
                  }`}
                >
                  Bilingual Copilot
                </button>
              </div>

              {/* Tray Content */}
              <div className="flex-1 overflow-hidden">
                {mapSideTray === 'queue' ? (
                  <TriageQueue
                    settlements={settlements}
                    onSelectSettlement={handleSelectSettlement}
                    selectedSettlementId={selectedSettlement?.id}
                  />
                ) : (
                  <CopilotPanel
                    stats={stats}
                    settlements={settlements}
                    onOpenSitrep={() => setIsSitrepOpen(true)}
                  />
                )}
              </div>
            </aside>
          </>
        )}

        {/* Tab 2: Full Cut-off Villages View */}
        {activeTab === 'triage' && (
          <div className="flex-1 h-full bg-[#FCFAF7]">
            <TriageQueue
              settlements={settlements}
              onSelectSettlement={(s) => {
                handleSelectSettlement(s);
                setActiveTab('map');
              }}
              selectedSettlementId={selectedSettlement?.id}
            />
          </div>
        )}

        {/* Tab 3: Full Copilot View */}
        {activeTab === 'copilot' && (
          <div className="flex-1 h-full bg-[#FCFAF7]">
            <CopilotPanel
              stats={stats}
              settlements={settlements}
              onOpenSitrep={() => setIsSitrepOpen(true)}
            />
          </div>
        )}

        {/* Tab 4: EMSR927 Benchmark View */}
        {activeTab === 'benchmark' && (
          <div className="flex-1 h-full bg-[#FCFAF7]">
            <BenchmarkPanel />
          </div>
        )}

        {/* Tab 5: Limitations Audit View */}
        {activeTab === 'limitations' && (
          <div className="flex-1 h-full bg-[#FCFAF7]">
            <LimitationsView />
          </div>
        )}

        {/* Tab 6: Field Handheld Terminal View */}
        {activeTab === 'terminal' && (
          <div className="flex-1 h-full bg-[#FCFAF7]">
            <HandheldTerminalView
              stats={stats}
              settlements={settlements}
              bridges={bridges}
              onSelectSettlement={(s) => {
                handleSelectSettlement(s);
                setActiveTab('map');
              }}
            />
          </div>
        )}
      </div>

      {/* Sitrep Printable Modal */}
      <SitrepModal
        isOpen={isSitrepOpen}
        onClose={() => setIsSitrepOpen(false)}
        stats={stats}
        bridges={bridges}
        settlements={settlements}
      />
    </div>
  );
}
