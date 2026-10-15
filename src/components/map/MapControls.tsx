
import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Waves, Eye } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  tracerActive: boolean;
  onToggleTracer: () => void;
  splitSwipeMode: boolean;
  onToggleSplitSwipe: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  tracerActive,
  onToggleTracer,
  splitSwipeMode,
  onToggleSplitSwipe,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div
        className="flex items-center bg-black/70 backdrop-blur-[12px] border border-white/10 rounded-xl p-1 shadow-lg text-white"
        role="toolbar"
        aria-label="Map navigation tools"
      >
        <button
          onClick={onZoomIn}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus-visible:ring-1 focus-visible:ring-[#FE6E00]"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus-visible:ring-1 focus-visible:ring-[#FE6E00]"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onResetView}
          className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus-visible:ring-1 focus-visible:ring-[#FE6E00]"
          title="Reset View"
          aria-label="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <button
        onClick={onToggleTracer}
        aria-pressed={tracerActive}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-lg focus-visible:ring-1 focus-visible:ring-[#FE6E00] ${
          tracerActive
            ? 'bg-[#FB2C36] text-white border-[#FB2C36] shadow-red-500/30 animate-pulse'
            : 'bg-black/70 backdrop-blur-[12px] text-[#FFB74D] border-white/10 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Waves className="w-4 h-4 text-[#FE6E00]" aria-hidden="true" />
        <span>{tracerActive ? 'Click Map Upstream' : 'Trace Valley Flow'}</span>
      </button>

      <button
        onClick={onToggleSplitSwipe}
        aria-pressed={splitSwipeMode}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-lg focus-visible:ring-1 focus-visible:ring-[#FE6E00] ${
          splitSwipeMode
            ? 'bg-[#FE6E00] text-white border-[#FF6B00]'
            : 'bg-black/70 backdrop-blur-[12px] text-white/80 border-white/10 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Eye className="w-4 h-4" aria-hidden="true" />
        <span>{splitSwipeMode ? 'Exit Compare' : 'Compare'}</span>
      </button>
    </div>
  );
};
