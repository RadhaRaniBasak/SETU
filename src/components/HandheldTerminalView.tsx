import React, { useState } from 'react';
import {
  Satellite,
  Waves,
  Heart,
  Activity,
  Flame,
  AlertTriangle,
  Plane,
  Building,
  Navigation,
  Compass,
  CloudRain,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { DamagedBridge, PipelineStats, Settlement } from '../types/setu.ts';

interface HandheldTerminalViewProps {
  stats: PipelineStats;
  settlements: Settlement[];
  bridges: DamagedBridge[];
  onSelectSettlement: (s: Settlement) => void;
}

export const HandheldTerminalView: React.FC<HandheldTerminalViewProps> = ({
  stats,
  settlements,
  bridges,
  onSelectSettlement,
}) => {
  const [activeSegment, setActiveSegment] = useState<'metrics' | 'queue' | 'radio'>('metrics');
  const cutoff = settlements.filter((s) => s.isCutOff);

  return (
    <div className="h-full overflow-y-auto bg-[#FCFAF7] p-4 sm:p-6 text-[#423D38] flex flex-col items-center">
      {/* Title Header */}
      <div className="w-full max-w-5xl flex items-center justify-between pb-4 mb-6 border-b border-[#E3E0DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FE6E00]/15 text-[#FE6E00] text-xs font-mono font-bold border border-[#FE6E00]/30">
              OFFLINE TACTICAL MODE
            </span>
            <span className="text-xs text-[#797067] font-mono">LoRa Mesh 915MHz</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#423D38] tracking-tight mt-1">
            Handheld Field Triage & Wearable Quick-Cards
          </h1>
          <p className="text-xs text-[#797067] mt-0.5">
            Optimized for SAR helicopters, rugged field tablets, and satellite communicators in zero-connectivity terrain.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white border border-[#E3E0DD] text-xs font-mono text-[#423D38] shadow-sm">
            09:41 UTC · GPS LOCK
          </span>
        </div>
      </div>

      {/* 3-Column Handheld Device Mockup Array */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Column 1: Radar Doppler & Weather Monitor */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[320px] rounded-[40px] p-4 bg-black/90 border-[6px] border-white/20 shadow-2xl space-y-4 text-white">
            {/* Handheld Status Bar */}
            <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono text-white/60">
              <span>09:41</span>
              <div className="w-16 h-4 bg-black rounded-full mx-auto" />
              <span className="text-[#00C758] font-bold">5G SAT</span>
            </div>

            {/* Radar Mini Stage Card */}
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FE6E00] animate-ping" />
                  <span className="font-bold text-white tracking-tight">S1A SAR Radar</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FE6E00]/20 text-[#FFB74D]">
                  ORBIT 121
                </span>
              </div>

              {/* Doppler Ring graphic */}
              <div className="h-32 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-[#FE6E00]/20 animate-ping" />
                  <div className="w-16 h-16 rounded-full border border-[#FE6E00]/40" />
                  <div className="w-8 h-8 rounded-full bg-[#FE6E00]/30 border border-[#FE6E00]" />
                </div>
                <div className="absolute top-2 left-2 text-[9px] font-mono text-[#FFB74D]">
                  ΔVV: -14.2dB
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[#FE6E00]">
                  DEBRIS: 9.2 km²
                </div>
              </div>

              {/* Meteorological & Satellite Telemetry strip */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono pt-1">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[9px] text-white/50 uppercase">Cloud Cover</div>
                  <div className="text-sm font-bold text-[#FFB74D] tabular-nums">92% Blind</div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[9px] text-white/50 uppercase">SAR Status</div>
                  <div className="text-sm font-bold text-[#00C758]">Penetrating</div>
                </div>
              </div>
            </div>

            {/* Weather / Surge Velocity Card */}
            <div className="rounded-2xl bg-white/5 p-3.5 border border-white/10">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-white/60 font-mono text-[11px]">PEAK VALLEY SURGE</span>
                <span className="text-[10px] font-mono text-[#FE6E00] font-bold">D8 MODEL</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-white tabular-nums">
                  6.2
                </span>
                <span className="text-xs font-mono text-white/60">m/s velocity</span>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-[10px] text-white/60 font-mono">
                <span>Larcha</span>
                <span>Bidur (580m)</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-mono text-[#797067] mt-3">Field Terminal: Radar & Hydro</span>
        </div>

        {/* Device Column 2: Tactical Wearable Smartwatch Squircle Cards */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[320px] rounded-[40px] p-4 bg-black/90 border-[6px] border-white/20 shadow-2xl space-y-3 text-white">
            {/* Handheld Header */}
            <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono text-white/60">
              <span>09:41</span>
              <span className="text-xs font-mono text-[#FE6E00] font-bold">TRIAGE HUD</span>
            </div>

            {/* Smartwatch Card 1 */}
            <div className="rounded-3xl bg-white/5 p-4 border border-white/10 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-white/60 font-mono">
                <span>CUT-OFF CITIZENS</span>
                <span className="text-[#FB2C36] font-bold">7 VILLAGES</span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-white tabular-nums tracking-tight mt-1">
                {stats.isolatedPopulationCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-white/60 mt-0.5">civilians stranded</div>

              <div className="h-8 w-full mt-2">
                <svg viewBox="0 0 100 25" className="w-full h-full">
                  <path
                    d="M 0 15 Q 12 2 25 14 T 50 12 T 75 16 T 100 8"
                    fill="none"
                    stroke="#FE6E00"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Smartwatch Card 2 */}
            <div className="rounded-3xl bg-white/5 p-4 border border-white/10 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-white/60 font-mono">
                <span>SEVERED BRIDGES</span>
                <span className="text-[#FB2C36] font-bold">100% BLOCKED</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-[#FB2C36] tabular-nums">
                  {stats.damagedBridgesCount}
                </span>
                <span className="text-xs font-mono text-white/60">choke-point spans</span>
              </div>

              <div className="flex items-end gap-1.5 h-7 mt-2">
                {[50, 75, 40, 95, 60, 100, 80, 45, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-gradient-to-t from-[#FB2C36] to-[#FE6E00]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Smartwatch Card 3 */}
            <div className="rounded-3xl bg-white/5 p-3.5 border border-white/10 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-white/60 font-mono">
                <span>SUBMERGED ROAD</span>
                <span className="text-[#FFB74D] font-mono font-bold">PASANG LHAMU H09</span>
              </div>
              <div className="text-2xl font-extrabold font-mono text-[#FFB74D] tabular-nums mt-0.5">
                {stats.submergedRoadKm} km
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-[#FE6E00] h-full w-[78%] rounded-full" />
              </div>
            </div>
          </div>
          <span className="text-xs font-mono text-[#797067] mt-3">Tactical Wearable: Vital Metrics</span>
        </div>

        {/* Device Column 3: Village Action Triage */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[320px] rounded-[40px] p-4 bg-black/90 border-[6px] border-white/20 shadow-2xl space-y-3 text-white">
            {/* Header */}
            <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono text-white/60">
              <span>09:41</span>
              <span className="text-xs font-mono text-[#FE6E00] font-bold">ISOLATED QUEUE</span>
            </div>

            {/* Goal Progress Ring */}
            <div className="rounded-3xl bg-white/5 p-3 border border-white/10 flex items-center gap-3">
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="#00C758"
                    strokeWidth="4"
                    strokeDasharray={100}
                    strokeDashoffset={27}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-[10px] font-mono font-bold text-white">73%</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">EMSR927 IoU Match</div>
                <div className="text-[10px] text-white/60 font-mono">Zero Ground Leakage</div>
              </div>
            </div>

            {/* Settlement Squircle List Items */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {cutoff.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectSettlement(s)}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FE6E00]" />
                        <span>{s.name}</span>
                      </div>
                      <div className="text-[10px] text-white/60 font-mono">
                        {s.nameNepali} · {s.elevationM}m
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-[#FE6E00]">
                        {s.estimatedPopulation.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-[#FB2C36] font-semibold">
                        {s.medicalUrgency} Urgency
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
                    <span className="truncate max-w-[140px] text-white/80">
                      {s.isolationCause?.primarySeveredBridge?.split(' &')[0] || 'Road Severed'}
                    </span>
                    <span className="text-[#FE6E00] font-bold flex items-center">
                      Triage <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span className="text-xs font-mono text-[#797067] mt-3">Tactical Terminal: Settlement List</span>
        </div>
      </div>
    </div>
  );
};
