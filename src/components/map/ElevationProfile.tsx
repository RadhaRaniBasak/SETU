import React from 'react';
import { TrendingDown } from 'lucide-react';
import { FlowTraceResult } from '../../types/setu.ts';

interface ElevationProfileProps {
  flowTrace: FlowTraceResult;
  profileSvgPath: string;
}

export const ElevationProfile: React.FC<ElevationProfileProps> = ({
  flowTrace,
  profileSvgPath,
}) => {
  return (
    <div
      className="absolute top-16 right-4 z-20 bg-black/70 backdrop-blur-[12px] border border-white/10 rounded-2xl p-3 shadow-2xl w-80 text-white"
      role="region"
      aria-label="Valley Elevation Descent & Surge Wave Profile"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <TrendingDown className="w-3.5 h-3.5 text-[#FE6E00]" aria-hidden="true" />
          <span>Valley Descent & Surge Wave</span>
        </div>
        <span className="text-[10px] font-mono text-[#FFB74D] font-bold">
          Δh = {flowTrace.totalDescentM}m
        </span>
      </div>

      {/* Smooth Bezier Wave SVG Area Chart */}
      <div className="relative h-20 w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 p-1">
        <svg viewBox="0 0 450 95" className="w-full h-full preserve-3d" aria-hidden="true">
          <defs>
            <linearGradient id="waveGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FE6E00" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FE6E00" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {profileSvgPath && (
            <>
              <path
                d={`${profileSvgPath} L 450 95 L 0 95 Z`}
                fill="url(#waveGlow)"
              />
              <path
                d={profileSvgPath}
                fill="none"
                stroke="#FE6E00"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
        <div className="absolute top-1 left-2 text-[9px] font-mono text-white/60">
          Glacier 4,320m
        </div>
        <div className="absolute bottom-1 right-2 text-[9px] font-mono text-white/60">
          Bidur 580m
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/10 text-center font-mono">
        <div>
          <div className="text-[9px] text-white/50 uppercase">Length</div>
          <div className="text-xs font-bold text-white tabular-nums">
            {flowTrace.totalLengthKm} km
          </div>
        </div>
        <div>
          <div className="text-[9px] text-white/50 uppercase">Transit</div>
          <div className="text-xs font-bold text-[#FFB74D] tabular-nums">
            {flowTrace.transitHours} hrs
          </div>
        </div>
        <div>
          <div className="text-[9px] text-white/50 uppercase">Villages</div>
          <div className="text-xs font-bold text-[#FE6E00] tabular-nums">
            {flowTrace.impactedSettlements.length}
          </div>
        </div>
      </div>
    </div>
  );
};
