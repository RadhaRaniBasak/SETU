import React, { useState } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Sliders,
  Plus,
  X,
  Satellite,
  Waves,
  ShieldAlert,
  MapPin,
  Highlighter,
  StickyNote,
  Compass,
  Upload,
  Check,
} from 'lucide-react';

export interface LayerState {
  sarHeatmap: boolean;
  sarOpacity: number;
  hazardPolygons: boolean;
  hazardOpacity: number;
  roadsAndBridges: boolean;
  settlements: boolean;
  hydrologyTracer: boolean;
  userAnnotations: boolean;
  fieldNotes: boolean;
  elevationProfile: boolean;
}

interface FeltLayersPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  layers: LayerState;
  onUpdateLayer: (key: keyof LayerState, value: any) => void;
  counts: {
    hazardKm2: number;
    bridgesCount: number;
    cutoffCount: number;
    notesCount: number;
    markersCount: number;
    pathsCount: number;
  };
}

export const FeltLayersPalette: React.FC<FeltLayersPaletteProps> = ({
  isOpen,
  onClose,
  layers,
  onUpdateLayer,
  counts,
}) => {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importedLayers, setImportedLayers] = useState<string[]>([]);
  const [importName, setImportName] = useState('');
  const [importType, setImportType] = useState('GeoJSON');

  if (!isOpen) return null;

  const handleSimulateImport = () => {
    if (!importName.trim()) return;
    setImportedLayers((prev) => [...prev, `${importName} (${importType})`]);
    setImportName('');
    setShowImportDialog(false);
  };

  return (
    <div className="absolute top-16 left-4 z-30 w-80 max-h-[calc(100vh-140px)] flex flex-col rounded-2xl bg-black/85 backdrop-blur-[12px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-white select-none overflow-hidden animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FE6E00]/20 border border-[#FE6E00]/40 flex items-center justify-center text-[#FE6E00]">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-tight text-white font-sans">
              Layers & Data Elements
            </h3>
            <p className="text-[10px] text-white/50 font-mono">Felt Vector & Raster Stack</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title="Close layers panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* Layer 1: Sentinel-1 SAR Radar ΔdB Inundation */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FE6E00] shadow-[0_0_8px_rgba(254,110,0,0.8)]" />
              <span className="text-xs font-semibold text-white">
                Sentinel-1 SAR Radar
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FE6E00]/20 text-[#FFB74D]">
                {counts.hazardKm2} km²
              </span>
              <button
                onClick={() => onUpdateLayer('sarHeatmap', !layers.sarHeatmap)}
                className="text-white/60 hover:text-white"
                title={layers.sarHeatmap ? 'Hide layer' : 'Show layer'}
              >
                {layers.sarHeatmap ? (
                  <Eye className="w-4 h-4 text-[#FE6E00]" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {layers.sarHeatmap && (
            <div className="space-y-1 pt-1 border-t border-white/10">
              <div className="flex justify-between text-[10px] font-mono text-white/60">
                <span>SAR Opacity</span>
                <span className="text-[#FE6E00]">{(layers.sarOpacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={layers.sarOpacity}
                onChange={(e) => onUpdateLayer('sarOpacity', Number(e.target.value))}
                className="w-full accent-[#FE6E00] h-1 bg-white/20 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Layer 2: Classified Hazard Polygons (Water & Debris) */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-white">
                Water & Debris Polygons
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                Vector Poly
              </span>
              <button
                onClick={() => onUpdateLayer('hazardPolygons', !layers.hazardPolygons)}
                className="text-white/60 hover:text-white"
              >
                {layers.hazardPolygons ? (
                  <Eye className="w-4 h-4 text-[#FE6E00]" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {layers.hazardPolygons && (
            <div className="space-y-1 pt-1 border-t border-white/10">
              <div className="flex justify-between text-[10px] font-mono text-white/60">
                <span>Vector Opacity</span>
                <span className="text-amber-400">{(layers.hazardOpacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={layers.hazardOpacity}
                onChange={(e) => onUpdateLayer('hazardOpacity', Number(e.target.value))}
                className="w-full accent-amber-400 h-1 bg-white/20 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Layer 3: OpenStreetMap Roads & Damaged Bridges */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB2C36]" />
              <span className="text-xs font-semibold text-white">
                OSM Roads & Severed Bridges
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FB2C36]/20 text-rose-300">
                {counts.bridgesCount} Severed
              </span>
              <button
                onClick={() => onUpdateLayer('roadsAndBridges', !layers.roadsAndBridges)}
                className="text-white/60 hover:text-white"
              >
                {layers.roadsAndBridges ? (
                  <Eye className="w-4 h-4 text-[#FB2C36]" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Layer 4: Mountain Settlements & Wards */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C758]" />
              <span className="text-xs font-semibold text-white">
                Settlements & Cut-off Graph
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FE6E00]/20 text-[#FFB74D]">
                {counts.cutoffCount} Cut Off
              </span>
              <button
                onClick={() => onUpdateLayer('settlements', !layers.settlements)}
                className="text-white/60 hover:text-white"
              >
                {layers.settlements ? (
                  <Eye className="w-4 h-4 text-[#00C758]" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Layer 5: Upstream DEM Hydrology Tracer */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-3.5 h-3.5 text-[#FE6E00]" />
              <span className="text-xs font-semibold text-white">
                Upstream DEM Flow Vector
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                GLOF Vector
              </span>
              <button
                onClick={() => onUpdateLayer('hydrologyTracer', !layers.hydrologyTracer)}
                className="text-white/60 hover:text-white"
              >
                {layers.hydrologyTracer ? (
                  <Eye className="w-4 h-4 text-[#FE6E00]" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Layer 6: User Drawn Highlighters & Corridors */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Highlighter className="w-3.5 h-3.5 text-[#FFB74D]" />
              <span className="text-xs font-semibold text-white">
                Highlighters & Annotations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                {counts.pathsCount} Paths
              </span>
              <button
                onClick={() => onUpdateLayer('userAnnotations', !layers.userAnnotations)}
                className="text-white/60 hover:text-white"
              >
                {layers.userAnnotations ? (
                  <Eye className="w-4 h-4 text-[#FFB74D]" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Layer 7: Spatial Field Sticky Notes & Bulletins */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StickyNote className="w-3.5 h-3.5 text-[#FFB74D]" />
              <span className="text-xs font-semibold text-white">
                Field Sticky Notes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FE6E00]/20 text-[#FFB74D] font-bold">
                {counts.notesCount} Pinned
              </span>
              <button
                onClick={() => onUpdateLayer('fieldNotes', !layers.fieldNotes)}
                className="text-white/60 hover:text-white"
              >
                {layers.fieldNotes ? (
                  <Eye className="w-4 h-4 text-[#FFB74D]" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Imported User Custom Layers */}
        {importedLayers.map((layerName, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 text-white font-medium">
              <Check className="w-3.5 h-3.5 text-[#00C758]" />
              <span>{layerName}</span>
            </div>
            <span className="text-[9px] font-mono uppercase text-[#00C758]">Active</span>
          </div>
        ))}
      </div>

      {/* Footer / Add Data button */}
      <div className="p-3 border-t border-white/10 bg-black/40">
        {!showImportDialog ? (
          <button
            onClick={() => setShowImportDialog(true)}
            className="w-full py-2 px-3 rounded-lg bg-[#FE6E00] hover:bg-[#FF6B00] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Add Data / Import Layer</span>
          </button>
        ) : (
          <div className="space-y-2 animate-in fade-in duration-150">
            <div className="text-[11px] font-semibold text-white">Import Vector or Raster</div>
            <input
              type="text"
              placeholder="e.g. Drone Survey Orthophoto or KML"
              value={importName}
              onChange={(e) => setImportName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FE6E00]"
            />
            <div className="flex items-center gap-2">
              <select
                value={importType}
                onChange={(e) => setImportType(e.target.value)}
                className="px-2 py-1 rounded bg-black/60 border border-white/20 text-xs text-white"
              >
                <option value="GeoJSON">GeoJSON</option>
                <option value="Sentinel-1">Sentinel-1 Pass</option>
                <option value="KML/KMZ">KML / KMZ</option>
                <option value="Drone TIFF">Drone GeoTIFF</option>
              </select>
              <button
                onClick={handleSimulateImport}
                disabled={!importName.trim()}
                className="flex-1 py-1 px-3 rounded bg-[#FE6E00] hover:bg-[#FF6B00] disabled:opacity-50 text-white font-bold text-xs"
              >
                Load
              </button>
              <button
                onClick={() => setShowImportDialog(false)}
                className="py-1 px-2 rounded bg-white/10 text-white/60 text-xs hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
