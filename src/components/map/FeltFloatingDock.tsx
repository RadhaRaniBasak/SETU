import React, { useState } from 'react';
import {
  Hand,
  Highlighter,
  MapPin,
  StickyNote,
  Ruler,
  Layers,
  Users,
  Share2,
  Trash2,
  Check,
  AlertTriangle,
  Plus,
  Compass,
} from 'lucide-react';
import { FeltTool, FeltMarkerType } from '../../types/setu.ts';

interface FeltFloatingDockProps {
  activeTool: FeltTool;
  setActiveTool: (tool: FeltTool) => void;
  // Highlighter styling
  currentColor: string;
  setCurrentColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  onClearHighlighters: () => void;
  hasDrawings: boolean;
  // Marker picker
  currentMarkerType: FeltMarkerType;
  setCurrentMarkerType: (type: FeltMarkerType) => void;
  // Layer & Collaborator toggles
  showLayersPalette: boolean;
  setShowLayersPalette: (show: boolean | ((prev: boolean) => boolean)) => void;
  showCollaborators: boolean;
  setShowCollaborators: (show: boolean | ((prev: boolean) => boolean)) => void;
  onOpenShareModal: () => void;
  activeCollaboratorCount: number;
  // Note count
  notesCount: number;
  markersCount: number;
}

const HIGHLIGHTER_COLORS = [
  { name: 'Telemetry Orange', hex: '#fe6e00' },
  { name: 'Electric Cyan', hex: '#06b6d4' },
  { name: 'Hazard Amber', hex: '#f59e0b' },
  { name: 'Emergency Rose', hex: '#fb2c36' },
  { name: 'Alpine Mint', hex: '#00c758' },
  { name: 'Purple Neon', hex: '#8200da' },
];

const MARKER_TYPES: { type: FeltMarkerType; label: string; icon: string; color: string }[] = [
  { type: 'heli_lz', label: 'Heli Landing Zone', icon: '🚁', color: '#00c758' },
  { type: 'bridge_out', label: 'Bridge Washout', icon: '⚠️', color: '#fb2c36' },
  { type: 'medical', label: 'Field Medical Aid', icon: '🏥', color: '#3080ff' },
  { type: 'ration_drop', label: 'Airdrop Zone', icon: '📦', color: '#edb200' },
  { type: 'shelter', label: 'Evac Shelter', icon: '⛺', color: '#8200da' },
  { type: 'hazard', label: 'Slurry / Dam', icon: '🌊', color: '#fe6e00' },
];

export const FeltFloatingDock: React.FC<FeltFloatingDockProps> = ({
  activeTool,
  setActiveTool,
  currentColor,
  setCurrentColor,
  strokeWidth,
  setStrokeWidth,
  onClearHighlighters,
  hasDrawings,
  currentMarkerType,
  setCurrentMarkerType,
  showLayersPalette,
  setShowLayersPalette,
  showCollaborators,
  setShowCollaborators,
  onOpenShareModal,
  activeCollaboratorCount,
  notesCount,
  markersCount,
}) => {
  const [showColorSubmenu, setShowColorSubmenu] = useState(false);
  const [showMarkerSubmenu, setShowMarkerSubmenu] = useState(false);

  const handleToolClick = (tool: FeltTool) => {
    if (activeTool === tool) {
      if (tool === 'highlighter') {
        setShowColorSubmenu((prev) => !prev);
        setShowMarkerSubmenu(false);
      } else if (tool === 'marker') {
        setShowMarkerSubmenu((prev) => !prev);
        setShowColorSubmenu(false);
      }
    } else {
      setActiveTool(tool);
      setShowColorSubmenu(tool === 'highlighter');
      setShowMarkerSubmenu(tool === 'marker');
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 select-none pointer-events-auto">
      {/* Submenu for Highlighter options (Color & Width) */}
      {showColorSubmenu && activeTool === 'highlighter' && (
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/85 backdrop-blur-[12px] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-white">
          <span className="text-[10px] font-mono uppercase font-bold text-white/60">
            Pen Color
          </span>
          <div className="flex items-center gap-1.5">
            {HIGHLIGHTER_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setCurrentColor(c.hex)}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${
                  currentColor === c.hex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                    : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {currentColor === c.hex && <Check className="w-3 h-3 text-white stroke-[3]" />}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-white/20 mx-1" />

          {/* Stroke Width Selector */}
          <span className="text-[10px] font-mono uppercase font-bold text-white/60">
            Width
          </span>
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
            {[
              { val: 3, label: 'S' },
              { val: 6, label: 'M' },
              { val: 12, label: 'L' },
            ].map((size) => (
              <button
                key={size.val}
                onClick={() => setStrokeWidth(size.val)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                  strokeWidth === size.val
                    ? 'bg-[#FE6E00] text-white shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>

          {hasDrawings && (
            <>
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button
                onClick={onClearHighlighters}
                className="flex items-center gap-1 text-[11px] text-[#FB2C36] hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors"
                title="Clear all drawings"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Submenu for Crisis Triage Marker Picker */}
      {showMarkerSubmenu && activeTool === 'marker' && (
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-black/85 backdrop-blur-[12px] border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-white">
          <span className="text-[10px] font-mono uppercase font-bold text-white/60 mr-1">
            Pin Type:
          </span>
          {MARKER_TYPES.map((m) => {
            const isSelected = currentMarkerType === m.type;
            return (
              <button
                key={m.type}
                onClick={() => {
                  setCurrentMarkerType(m.type);
                  setShowMarkerSubmenu(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#FE6E00] text-white font-bold shadow-md'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
                title={m.label}
              >
                <span>{m.icon}</span>
                <span className="text-[11px] font-mono">{m.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* MAIN FELT FLOATING DOCK (Dark Frosted Shell Elevation) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/70 backdrop-blur-[12px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] text-white">
        {/* Brand / Applet Symbol */}
        <div className="flex items-center gap-1.5 pl-3 pr-2 border-r border-white/15 text-xs font-bold text-[#FFB74D] font-mono tracking-tight">
          <span className="w-2 h-2 rounded-full bg-[#FE6E00] animate-pulse" />
          <span>EVREGHEN·GIS</span>
        </div>

        {/* Tool: Hand (Pan/Select) */}
        <button
          onClick={() => handleToolClick('pan')}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            activeTool === 'pan'
              ? 'bg-[#FE6E00] text-white shadow-md shadow-[#FE6E00]/30 scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Pan & Select Tool (H)"
          aria-label="Pan and select tool"
        >
          <Hand className="w-4 h-4" />
        </button>

        {/* Tool: Highlighter / Drawing Pen */}
        <button
          onClick={() => handleToolClick('highlighter')}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            activeTool === 'highlighter'
              ? 'bg-[#FE6E00] text-white shadow-md shadow-[#FE6E00]/30 scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Felt Highlighter Pen (P) - Draw disaster corridors"
          aria-label="Highlighter pen"
        >
          <Highlighter className="w-4 h-4" />
          <span
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-black"
            style={{ backgroundColor: currentColor }}
          />
        </button>

        {/* Tool: Pin / Marker */}
        <button
          onClick={() => handleToolClick('marker')}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            activeTool === 'marker'
              ? 'bg-[#FE6E00] text-white shadow-md shadow-[#FE6E00]/30 scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Drop Crisis Triage Pin (M)"
          aria-label="Drop triage pin"
        >
          <MapPin className="w-4 h-4" />
          {markersCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#00C758] text-[9px] font-mono font-bold text-white">
              {markersCount}
            </span>
          )}
        </button>

        {/* Tool: Felt Sticky Note */}
        <button
          onClick={() => handleToolClick('note')}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            activeTool === 'note'
              ? 'bg-[#FE6E00] text-white shadow-md shadow-[#FE6E00]/30 scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Spatial Sticky Note (N) - Pin field bulletin"
          aria-label="Add sticky note"
        >
          <StickyNote className="w-4 h-4" />
          {notesCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#FFB74D] text-[9px] font-mono font-bold text-black">
              {notesCount}
            </span>
          )}
        </button>

        {/* Tool: Mountain Distance & Slope Measure Ruler */}
        <button
          onClick={() => handleToolClick('measure')}
          className={`relative p-2.5 rounded-full transition-all flex items-center justify-center ${
            activeTool === 'measure'
              ? 'bg-[#FE6E00] text-white shadow-md shadow-[#FE6E00]/30 scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Measure Distance & Elevation Grade (D)"
          aria-label="Measure distance"
        >
          <Ruler className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/20 mx-0.5" />

        {/* Toggle Layers Palette */}
        <button
          onClick={() => setShowLayersPalette((prev) => !prev)}
          className={`relative px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            showLayersPalette
              ? 'bg-[#FE6E00] text-white font-bold'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Layers & Data Sources"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] hidden sm:inline">Layers</span>
        </button>

        {/* Toggle Collaborative Team Presence */}
        <button
          onClick={() => setShowCollaborators((prev) => !prev)}
          className={`relative px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
            showCollaborators
              ? 'bg-white/20 text-[#00C758] border border-white/20'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Multiplayer Rescue Team Presence"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="w-2 h-2 rounded-full bg-[#00C758] animate-pulse" />
          <span className="font-mono text-[11px] hidden sm:inline">
            {activeCollaboratorCount} Live
          </span>
        </button>

        {/* Felt-Style Share / Export Button */}
        <button
          onClick={onOpenShareModal}
          className="ml-1 px-3.5 py-1.5 rounded-full bg-[#FE6E00] hover:bg-[#FF6B00] text-white text-xs font-bold font-sans flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          title="Share Collaborative Link & Export Map"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Helpful Hint bar */}
      {activeTool !== 'pan' && (
        <div className="text-[10px] font-mono text-[#FFB74D] bg-black/80 backdrop-blur-[12px] px-3 py-0.5 rounded-full border border-white/10 shadow-md">
          {activeTool === 'highlighter' && 'Click & drag across map to highlight flood risk path'}
          {activeTool === 'marker' && 'Click anywhere on terrain to drop selected triage pin'}
          {activeTool === 'note' && 'Click on the map to pin a spatial field note'}
          {activeTool === 'measure' && 'Click Point A then Point B to measure distance & terrain slope'}
        </div>
      )}
    </div>
  );
};
