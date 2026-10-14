import React from 'react';
import { RotateCw, Zap } from 'lucide-react';

interface SystemLatencyBadgeProps {
  systemLatency: string;
  isProcessing: boolean;
  calculationLabel?: string;
  mouseCoord?: {
    lat: number;
    lng: number;
    elev: number;
  } | null;
}

export const SystemLatencyBadge: React.FC<SystemLatencyBadgeProps> = ({
  systemLatency,
  isProcessing,
  calculationLabel,
  mouseCoord,
}) => {
  return (
    <div
      className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-1.5 pointer-events-auto"
      role="region"
      aria-label="System status and latency metrics"
    >
      <div
        className={`backdrop-blur-[12px] border rounded-2xl px-3.5 py-2 shadow-2xl flex items-center gap-2.5 transition-all duration-200 ${
          isProcessing
            ? 'bg-black/80 border-[#FE6E00]/60 ring-1 ring-[#FE6E00]/30'
            : 'bg-black/70 border-white/10'
        }`}
        aria-live="polite"
      >
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isProcessing ? 'bg-[#FE6E00]' : 'bg-[#00C758]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isProcessing ? 'bg-[#FE6E00]' : 'bg-[#00C758]'
              }`}
            />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/60 font-semibold">
            SYSTEM LATENCY
          </span>
        </div>
        <div className="h-3.5 w-px bg-white/15" aria-hidden="true" />
        <div className="text-xs font-mono font-bold tabular-nums flex items-center gap-1.5">
          {isProcessing ? (
            <span className="text-[#FFB74D] flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-[#FE6E00]" />
              <span>Recalculating...</span>
            </span>
          ) : (
            <span className="text-[#00C758] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#00C758] fill-[#00C758]/20" />
              <span>Pipeline: {systemLatency}</span>
            </span>
          )}
        </div>
      </div>

      {/* Calculation label indicating the trigger */}
      {calculationLabel && (
        <div className="text-[9px] font-mono text-white/70 bg-black/70 backdrop-blur-[12px] px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FE6E00]" aria-hidden="true" />
          <span>{calculationLabel}</span>
        </div>
      )}

      {/* Floating HUD: Cursor Coordinates & DEM Elevation (If Hovering) */}
      {mouseCoord && (
        <div className="bg-black/70 backdrop-blur-[12px] border border-white/10 rounded-xl px-2.5 py-1 text-[10px] font-mono text-white/70 flex items-center gap-2.5 shadow-md">
          <span>{mouseCoord.lat}°N, {mouseCoord.lng}°E</span>
          <span className="text-[#FFB74D] font-semibold">{mouseCoord.elev}m ASL</span>
        </div>
      )}
    </div>
  );
};
