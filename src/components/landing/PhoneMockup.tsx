import React from 'react';
import {
  Satellite,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Waves,
  Shield,
  ChevronRight,
  WifiOff,
  Clock,
  Radio,
  FileText,
} from 'lucide-react';

export type PhoneScreenType =
  | 'triage-queue'
  | 'sar-alert'
  | 'approval-card'
  | 'flow-tracer'
  | 'sitrep-preview';

interface PhoneMockupProps {
  screen: PhoneScreenType;
  className?: string;
  badge?: string;
  onActionClick?: (action: string) => void;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  screen,
  className = '',
  badge,
  onActionClick,
}) => {
  return (
    <div
      className={`relative w-[280px] sm:w-[300px] h-[580px] sm:h-[610px] rounded-[42px] bg-[#0d0d0d] p-3 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col shrink-0 select-none ${className}`}
    >
      {/* Outer rim glare highlight */}
      <div className="absolute inset-0 rounded-[42px] pointer-events-none ring-1 ring-white/10" />

      {/* Dynamic Island / Speaker notch */}
      <div className="relative mx-auto mb-2 w-28 h-5 bg-black rounded-full flex items-center justify-center gap-2 px-3 z-20">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
      </div>

      {/* Screen Inner Bezel */}
      <div className="relative flex-1 rounded-[32px] bg-[#121212] overflow-hidden border border-white/5 flex flex-col text-white font-sans">
        {/* Top Status Bar inside phone */}
        <div className="px-5 pt-1.5 pb-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/5">
          <span className="font-semibold text-slate-300">09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#FE6E00] font-semibold flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              S1A 121
            </span>
            <div className="w-4 h-2 border border-slate-500 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-full bg-white rounded-xs" />
            </div>
          </div>
        </div>

        {/* Screen Content based on type */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
          {screen === 'triage-queue' && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FE6E00] font-semibold">
                    Cut-Off Priority
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Trishuli Basin
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FE6E00]/10 text-[#FE6E00] border border-amber-400/30 font-semibold">
                  7 Isolated
                </span>
              </div>

              {/* Triage Village 1: Syabrubesi */}
              <div className="p-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs font-bold text-white">Syabrubesi</span>
                      <span className="text-[10px] font-mono text-slate-400">स्याफ्रुबेसी</span>
                    </div>
                    <span className="text-[10px] text-rose-400 font-mono font-medium">
                      Critical · 842 Isolated
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    PRIORITY 1
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-tight">
                  Trishuli River Bridge washed out. Pasang Lhamu Hwy submerged by 1.8km debris surge.
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                  <span>Reroute: 6.4km footpath</span>
                  <span className="text-[#FE6E00]">ETA: Helo only</span>
                </div>
              </div>

              {/* Triage Village 2: Ramche */}
              <div className="p-2.5 rounded-xl bg-[#181818] border border-white/5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FE6E00]" />
                      <span className="text-xs font-bold text-slate-200">Ramche</span>
                    </div>
                    <span className="text-[10px] text-[#FE6E00] font-mono">
                      High · 520 Isolated
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FE6E00]/15 text-amber-300">
                    PRIORITY 2
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  Southern culvert severed. 34m landslide headwall active.
                </div>
              </div>

              {/* Triage Village 3: Thuman */}
              <div className="p-2.5 rounded-xl bg-[#181818] border border-white/5 space-y-1.5">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-slate-200">Thuman High Ridge</span>
                  <span className="text-[10px] font-mono text-emerald-400">SHELTER ACTIVE</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Elev 2,338m. High ground secure. Water supplies critical (24h).
                </div>
              </div>
            </>
          )}

          {screen === 'sar-alert' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  COPERNICUS S-1A
                </span>
                <span className="text-[10px] font-mono text-slate-400">Orbit 121</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1b1b1b] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">SAR Change Coherence</span>
                  <span className="text-xs font-mono font-bold text-cyan-400">94.2%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-[94%]" />
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono text-slate-300">
                  <div className="p-1.5 rounded bg-[#141414] border border-white/5">
                    <span className="text-slate-500 block">VV BACKSCATTER</span>
                    <span className="text-white font-semibold">-18.4 dB</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#141414] border border-white/5">
                    <span className="text-slate-500 block">SURGE SPEED</span>
                    <span className="text-[#FE6E00] font-semibold">4.8 m/s</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FE6E00]/10 border border-amber-400/30 text-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#FE6E00]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flash-Flood Runoff Triggered</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Hydrology model detected 4,200m³ peak surge descent into Langtang Trishuli confluence.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#161616] border border-white/5 flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Ground Truth Latency</span>
                <span className="text-emerald-400 font-bold">2.4s</span>
              </div>
            </>
          )}

          {screen === 'approval-card' && (
            <>
              <div className="text-center pt-1 space-y-1">
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#FE6E00]/15 border border-amber-400/30 text-[#FE6E00] text-[10px] font-mono font-bold">
                  AWAITING FIELD DISPATCH
                </span>
                <h4 className="text-sm font-bold text-white">Syabrubesi Helo Drop</h4>
                <p className="text-[11px] text-slate-400">Flight Route 04 · MI-17 Call Sign RESCUE-02</p>
              </div>

              <div className="p-3 rounded-xl bg-[#1b1b1b] border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px] font-mono">
                  <span>PAYLOAD</span>
                  <span className="text-white font-semibold">1,200kg MRE + Water Purifiers</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px] font-mono">
                  <span>LANDING ZONE</span>
                  <span className="text-emerald-400 font-semibold">Thuman Helipad (Secure)</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px] font-mono">
                  <span>COORDINATES</span>
                  <span className="text-slate-300 font-mono">28.161° N, 85.340° E</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px] font-mono">
                  <span>SURFACE WIND</span>
                  <span className="text-slate-300">8 kts SSE · Ceiling 3,200m</span>
                </div>
              </div>

              {/* Dual Action Buttons matching design language */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onActionClick && onActionClick('approve')}
                  className="w-full py-2.5 rounded-full bg-white text-black font-semibold text-xs transition-transform active:scale-95 shadow-md flex items-center justify-center gap-1.5 hover:bg-slate-100"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  <span>Authorize Air Drop</span>
                </button>
                <button
                  onClick={() => onActionClick && onActionClick('deny')}
                  className="w-full py-2 rounded-full bg-transparent border border-amber-400/50 text-[#FE6E00] text-xs font-semibold hover:bg-[#FE6E00]/10 transition-colors"
                >
                  Deny / Hold Dispatch
                </button>
              </div>
            </>
          )}

          {screen === 'flow-tracer' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-sky-400 flex items-center gap-1">
                  <Waves className="w-3 h-3 text-sky-400" />
                  D8 FLOW TRACE
                </span>
                <span className="text-[10px] font-mono text-slate-400">Copernicus 30m</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1a1a1a] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Valley Descent Corridor</span>
                  <span className="font-mono text-sky-400 text-xs">22.4 km</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">HEADWATERS:</span>
                    <span className="text-slate-200">4,120m glacial snout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TERMINUS:</span>
                    <span className="text-slate-200">1,460m Betrawati</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">TOTAL DROP:</span>
                    <span className="text-[#FE6E00] font-semibold">2,660m</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/20 text-[11px] text-slate-300 space-y-1">
                <div className="font-semibold text-sky-300">Downstream Impact Vector</div>
                <p className="text-[10px] text-slate-400">
                  3 bridges within 40m elevation contour flagged for hydrodynamic scour.
                </p>
              </div>
            </>
          )}

          {screen === 'sitrep-preview' && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-semibold flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  SITREP // VERIFIED
                </span>
                <span className="text-[10px] font-mono text-slate-400">NDRRMA FMT</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1b1b1b] border border-white/10 space-y-2">
                <div className="text-xs font-bold text-white">
                  INCIDENT 2026-TRISHULI-01
                </div>
                <div className="text-[10px] font-mono text-slate-400 border-b border-white/5 pb-1.5">
                  26 AUG 2026 · RASUWA DISTRICT
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <p>• 7 settlements confirmed severed from motorized road access.</p>
                  <p>• 1,362 citizens in critical isolation.</p>
                  <p>• 3 key bridges non-functional (scour / deck shift).</p>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-[10px] font-mono text-emerald-300">
                <span>Bilingual Nepali / English</span>
                <span className="font-bold">Zero Hallucination</span>
              </div>
            </>
          )}
        </div>

        {/* Bottom Home Indicator */}
        <div className="p-2 flex justify-center">
          <div className="w-24 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Floating Badge if specified */}
      {badge && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900 border border-white/15 text-[10px] font-mono text-slate-300 whitespace-nowrap shadow-lg">
          {badge}
        </div>
      )}
    </div>
  );
};
