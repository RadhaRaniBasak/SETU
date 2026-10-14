import React from 'react';
import { Ruler, X, ArrowRight, Footprints, Plane, Compass } from 'lucide-react';
import { FeltMeasureSegment } from '../../types/setu.ts';

interface FeltMeasureCardProps {
  segment: FeltMeasureSegment | null;
  measuringStep: 'first' | 'second' | 'done';
  onClear: () => void;
  onClose: () => void;
}

export const FeltMeasureCard: React.FC<FeltMeasureCardProps> = ({
  segment,
  measuringStep,
  onClear,
  onClose,
}) => {
  return (
    <div className="absolute bottom-20 right-4 z-30 w-80 rounded-2xl bg-black/70 backdrop-blur-[12px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white p-4 select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FE6E00]/20 text-[#FE6E00] flex items-center justify-center">
            <Ruler className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-sans">Mountain Transit Ruler</h4>
            <p className="text-[10px] text-white/60 font-mono">Felt Geodesic & Terrain Grade</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          title="Exit measure tool"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Measuring State Guide */}
      {measuringStep === 'first' && (
        <div className="py-4 text-center space-y-2">
          <div className="inline-flex p-2 rounded-full bg-[#FE6E00]/10 text-[#FE6E00] animate-pulse">
            <Compass className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-white">Click Start Point A</div>
          <p className="text-[11px] text-white/60">
            Click on any village, bridge, or ridge on the map to begin measuring.
          </p>
        </div>
      )}

      {measuringStep === 'second' && (
        <div className="py-4 text-center space-y-2">
          <div className="inline-flex p-2 rounded-full bg-[#FFB74D]/10 text-[#FFB74D] animate-bounce">
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-white">Click Destination Point B</div>
          <p className="text-[11px] text-white/60">
            Select the destination point to compute straight-line transit & elevation change.
          </p>
        </div>
      )}

      {measuringStep === 'done' && segment && (
        <div className="pt-3 space-y-3">
          {/* Main Distance Big Stat */}
          <div className="flex items-baseline justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#FE6E00] font-bold block">
                Total Distance
              </span>
              <span className="text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                {segment.distanceKm.toFixed(2)}
              </span>
              <span className="text-xs text-[#FFB74D] font-mono ml-1">km</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-white/60 block">
                Elevation Delta
              </span>
              <span className="text-sm font-bold font-mono text-white tabular-nums">
                {segment.elevationDeltaM >= 0 ? `+${segment.elevationDeltaM}` : segment.elevationDeltaM}m
              </span>
              <span className="text-[10px] text-white/60 block font-mono">
                {segment.slopePercent.toFixed(1)}% grade
              </span>
            </div>
          </div>

          {/* Travel Modalities Comparison */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Foot Trek */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-white/60 text-[10px] font-mono">
                <Footprints className="w-3 h-3 text-[#FFB74D]" />
                <span>Foot Trek</span>
              </div>
              <div className="text-white font-bold font-mono text-sm">
                ~{segment.estWalkHours.toFixed(1)} hrs
              </div>
              <div className="text-[9px] text-white/40 font-mono">Mountain trail pacing</div>
            </div>

            {/* Heli Flight */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-white/60 text-[10px] font-mono">
                <Plane className="w-3 h-3 text-[#00C758]" />
                <span>Heli Direct</span>
              </div>
              <div className="text-[#00C758] font-bold font-mono text-sm">
                ~{segment.estHeliMinutes} mins
              </div>
              <div className="text-[9px] text-white/40 font-mono">180 km/h AS350 cruise</div>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={onClear}
            className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors text-center"
          >
            Measure Another Distance
          </button>
        </div>
      )}
    </div>
  );
};
