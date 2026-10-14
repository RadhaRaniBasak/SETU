import React, { useState, useEffect, useRef } from 'react';
import {
  Hand,
  Highlighter,
  MapPin,
  StickyNote,
  Ruler,
  Layers,
  Users,
  Maximize2,
  Sparkles,
  Satellite,
  Waves,
  ShieldAlert,
  Check,
  MousePointer2,
  ExternalLink,
  Sliders,
  ChevronRight,
  Flame,
  AlertTriangle,
} from 'lucide-react';

interface FeltHeroStudioPreviewProps {
  onOpenStudio: () => void;
}

interface MiniStickyNote {
  id: string;
  x: number;
  y: number;
  author: string;
  role: string;
  color: string;
  title: string;
  message: string;
  time: string;
}

interface MiniMarker {
  id: string;
  x: number;
  y: number;
  type: 'danger' | 'medical' | 'bridge' | 'heli';
  label: string;
}

interface DrawingPath {
  id: string;
  color: string;
  points: { x: number; y: number }[];
}

export const FeltHeroStudioPreview: React.FC<FeltHeroStudioPreviewProps> = ({
  onOpenStudio,
}) => {
  // Active Felt tool in the mini dock
  const [activeTool, setActiveTool] = useState<'hand' | 'highlighter' | 'pin' | 'note' | 'measure'>('hand');
  const [currentColor, setCurrentColor] = useState<string>('#FE6E00'); // Amber default
  const [showLayers, setShowLayers] = useState(false);
  const [splitPosition, setSplitPosition] = useState<number>(68); // Before/After split percentage
  const [selectedPin, setSelectedPin] = useState<string | null>('dhunche');

  // Interactive user drawing paths
  const [paths, setPaths] = useState<DrawingPath[]>([
    {
      id: 'flow-path-1',
      color: '#38bdf8',
      points: [
        { x: 340, y: 80 },
        { x: 320, y: 130 },
        { x: 300, y: 190 },
        { x: 260, y: 250 },
        { x: 220, y: 310 },
      ],
    },
    {
      id: 'hazard-perimeter',
      color: '#FE6E00',
      points: [
        { x: 240, y: 230 },
        { x: 290, y: 240 },
        { x: 275, y: 290 },
        { x: 230, y: 280 },
        { x: 240, y: 230 },
      ],
    },
  ]);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);

  // Interactive sticky notes
  const [notes, setNotes] = useState<MiniStickyNote[]>([
    {
      id: 'n1',
      x: 175,
      y: 95,
      author: 'Maj. Thapa',
      role: 'Disaster Ops',
      color: '#FE6E00',
      title: 'Bailey Bridge Washed Out',
      message: '14m flash surge severed spans. Route column via eastern ridgeline.',
      time: '3m ago',
    },
    {
      id: 'n2',
      x: 290,
      y: 285,
      author: 'Dr. Priya',
      role: 'Medical Triage',
      color: '#f43f5e',
      title: 'Syabrubesi Clinic Low Fuel',
      message: '48 patients isolated. Generator at 15%. Heli LZ confirmed safe.',
      time: 'Just now',
    },
  ]);

  // Active markers
  const [markers, setMarkers] = useState<MiniMarker[]>([
    { id: 'dhunche', x: 210, y: 240, type: 'danger', label: 'Dhunche (Cut-off)' },
    { id: 'syabrubesi', x: 280, y: 170, type: 'medical', label: 'Syabrubesi (Clinic)' },
    { id: 'bridge-4', x: 250, y: 200, type: 'bridge', label: 'Bridge #04 (Collapsed)' },
    { id: 'lz-alpha', x: 140, y: 310, type: 'heli', label: 'Heli LZ Alpha (Open)' },
  ]);

  // Simulated multiplayer cursors moving naturally
  const [cursor1, setCursor1] = useState({ x: 310, y: 220 });
  const [cursor2, setCursor2] = useState({ x: 190, y: 160 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCursor1((prev) => ({
        x: Math.max(80, Math.min(440, prev.x + (Math.random() - 0.5) * 40)),
        y: Math.max(60, Math.min(360, prev.y + (Math.random() - 0.5) * 35)),
      }));
      setCursor2((prev) => ({
        x: Math.max(90, Math.min(430, prev.x + (Math.random() - 0.5) * 35)),
        y: Math.max(70, Math.min(350, prev.y + (Math.random() - 0.5) * 30)),
      }));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Handle canvas interactions
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (activeTool === 'highlighter') {
      setIsDrawing(true);
      currentPathRef.current = [{ x, y }];
    } else if (activeTool === 'pin') {
      const newMarker: MiniMarker = {
        id: `marker-${Date.now()}`,
        x,
        y,
        type: 'danger',
        label: `Incident Pin #${markers.length + 1}`,
      };
      setMarkers([...markers, newMarker]);
      setSelectedPin(newMarker.id);
      setActiveTool('hand');
    } else if (activeTool === 'note') {
      const newNote: MiniStickyNote = {
        id: `note-${Date.now()}`,
        x: Math.min(x, 340),
        y: Math.min(y, 280),
        author: 'Field Observer',
        role: 'Field Team',
        color: currentColor,
        title: 'New Spatial Field Note',
        message: 'Tap "Open Full Studio" to edit details or attach telemetry.',
        time: 'Just now',
      };
      setNotes([...notes, newNote]);
      setActiveTool('hand');
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || activeTool !== 'highlighter') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    currentPathRef.current.push({ x, y });
    setPaths((prev) => {
      const existing = prev.filter((p) => p.id !== 'active-drawing');
      return [
        ...existing,
        {
          id: 'active-drawing',
          color: currentColor,
          points: [...currentPathRef.current],
        },
      ];
    });
  };

  const handleSvgMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setPaths((prev) =>
        prev.map((p) =>
          p.id === 'active-drawing' ? { ...p, id: `drawn-${Date.now()}` } : p
        )
      );
      currentPathRef.current = [];
    }
  };

  const toSvgPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    return points.reduce(
      (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
      ''
    );
  };

  return (
    <div className="relative w-full max-w-[620px] rounded-2xl bg-[#141414] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300 group hover:border-[#FE6E00]/40">
      {/* Felt Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/10 select-none">
        {/* Left: Window Controls + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FE6E00]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]/80" />
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-white/10 text-xs">
            <span className="font-semibold text-white tracking-tight">SETU Map Studio</span>
            <span className="text-slate-500 font-mono text-[11px]">trishuli-gorge-2024.felt</span>
          </div>
        </div>

        {/* Right: Live Presence Avatars & Maximize CTA */}
        <div className="flex items-center gap-2.5">
          {/* Teammates stack */}
          <div className="flex items-center -space-x-1.5">
            <div
              className="w-5 h-5 rounded-full bg-[#FE6E00] text-black font-bold text-[9px] flex items-center justify-center ring-2 ring-[#1a1a1a]"
              title="Maj. Thapa (Disaster Ops)"
            >
              MT
            </div>
            <div
              className="w-5 h-5 rounded-full bg-[#38bdf8] text-black font-bold text-[9px] flex items-center justify-center ring-2 ring-[#1a1a1a]"
              title="Dr. Priya (Medical)"
            >
              PK
            </div>
            <div
              className="w-5 h-5 rounded-full bg-[#4ade80] text-black font-bold text-[9px] flex items-center justify-center ring-2 ring-[#1a1a1a]"
              title="Field SAR Alpha"
            >
              SA
            </div>
          </div>

          <button
            onClick={onOpenStudio}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-black font-semibold text-[11px] hover:bg-slate-200 transition-all shadow-sm"
          >
            <span>Full Studio</span>
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div
        className="relative w-full h-[380px] sm:h-[440px] bg-[#0d1117] overflow-hidden cursor-crosshair select-none"
        onMouseLeave={handleSvgMouseUp}
      >
        {/* Synthetic Aperture Radar & Topographic Background Canvas */}
        <svg
          className="absolute inset-0 w-full h-full"
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
        >
          <defs>
            {/* Mountain DEM Contour Pattern */}
            <pattern id="felt-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            </pattern>

            {/* Glowing filter for neon highlighters */}
            <filter id="felt-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear gradients */}
            <linearGradient id="river-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>

            <linearGradient id="flood-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(229,176,74,0.35)" />
              <stop offset="100%" stopColor="rgba(244,63,94,0.45)" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#felt-grid)" />

          {/* Topographic Contour Curves */}
          <path
            d="M -20 180 Q 120 110, 260 140 T 540 90"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M -20 250 Q 160 190, 310 230 T 560 170"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M -20 320 Q 200 270, 360 300 T 560 250"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1.5"
          />

          {/* SAR Flood Inundation Polygon */}
          <path
            d="M 230 140 Q 280 180, 260 250 Q 220 300, 190 280 Q 210 210, 230 140 Z"
            fill="url(#flood-gradient)"
            stroke="#FE6E00"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            className="animate-pulse"
          />

          {/* Main Trishuli River Path */}
          <path
            d="M 370 20 Q 330 90, 310 160 T 260 250 T 200 340 T 150 440"
            fill="none"
            stroke="url(#river-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
          />

          {/* Road Network Vectors */}
          <path
            d="M 120 420 L 190 320 L 250 220 L 290 150 L 390 60"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          {/* Severed Road Segment (Red glow) */}
          <path
            d="M 230 250 L 260 205"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="3.5"
            strokeDasharray="4 2"
            className="drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]"
          />

          {/* User Drawing Highlighter Paths */}
          {paths.map((p) => (
            <path
              key={p.id}
              d={toSvgPath(p.points)}
              fill="none"
              stroke={p.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.75"
              filter="url(#felt-glow)"
            />
          ))}

          {/* Mountain Measure Segment Line (if measure tool active) */}
          {activeTool === 'measure' && (
            <g>
              <line
                x1="210"
                y1="240"
                x2="280"
                y2="170"
                stroke="#4ade80"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <circle cx="210" cy="240" r="4" fill="#4ade80" />
              <circle cx="280" cy="170" r="4" fill="#4ade80" />
              <rect
                x="225"
                y="190"
                width="84"
                height="22"
                rx="6"
                fill="#161616"
                stroke="#4ade80"
                strokeWidth="1"
              />
              <text
                x="267"
                y="205"
                textAnchor="middle"
                fill="#4ade80"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                7.4 km · 3.5h
              </text>
            </g>
          )}
        </svg>

        {/* Spatial Sticky Notes */}
        {notes.map((note) => (
          <div
            key={note.id}
            style={{ left: `${note.x}px`, top: `${note.y}px` }}
            className="absolute z-20 w-44 p-2.5 rounded-xl bg-[#1c1c1c]/95 backdrop-blur-md border border-white/20 shadow-xl cursor-pointer hover:scale-105 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPin(note.id);
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${note.color}25`, color: note.color }}
              >
                {note.author}
              </span>
              <span className="text-[9px] font-mono text-slate-500">{note.time}</span>
            </div>
            <p className="text-[11px] font-semibold text-white leading-tight mb-1">
              {note.title}
            </p>
            <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
              {note.message}
            </p>
          </div>
        ))}

        {/* Triage Markers / Pins */}
        {markers.map((marker) => {
          const isSelected = selectedPin === marker.id;
          return (
            <div
              key={marker.id}
              style={{ left: `${marker.x}px`, top: `${marker.y}px` }}
              className="absolute z-10 -translate-x-1/2 -translate-y-full cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPin(marker.id);
              }}
            >
              {/* Marker Pin */}
              <div
                className={`relative flex items-center justify-center w-7 h-7 rounded-full shadow-lg transition-transform ${
                  isSelected ? 'scale-125' : 'group-hover:scale-110'
                } ${
                  marker.type === 'danger'
                    ? 'bg-[#f43f5e] text-white ring-4 ring-[#f43f5e]/30'
                    : marker.type === 'medical'
                    ? 'bg-[#38bdf8] text-slate-950 ring-4 ring-[#38bdf8]/30'
                    : marker.type === 'bridge'
                    ? 'bg-[#FE6E00] text-black ring-4 ring-[#FE6E00]/30'
                    : 'bg-[#4ade80] text-slate-950 ring-4 ring-[#4ade80]/30'
                }`}
              >
                {marker.type === 'danger' && <AlertTriangle className="w-3.5 h-3.5" />}
                {marker.type === 'medical' && <Sparkles className="w-3.5 h-3.5" />}
                {marker.type === 'bridge' && <Waves className="w-3.5 h-3.5" />}
                {marker.type === 'heli' && <Check className="w-3.5 h-3.5" />}
              </div>

              {/* Label Chip */}
              <div className="mt-1 px-2 py-0.5 rounded-full bg-[#161616]/90 border border-white/15 text-[10px] font-mono text-white whitespace-nowrap shadow-md">
                {marker.label}
              </div>
            </div>
          );
        })}

        {/* Live Collaborator Cursors */}
        <div
          style={{ left: `${cursor1.x}px`, top: `${cursor1.y}px` }}
          className="absolute z-30 pointer-events-none transition-all duration-1000 ease-out"
        >
          <MousePointer2 className="w-4 h-4 text-[#FE6E00] fill-[#FE6E00] drop-shadow" />
          <div className="ml-3 -mt-1 px-1.5 py-0.5 rounded bg-[#FE6E00] text-black font-semibold text-[9px] font-mono shadow">
            Maj. Thapa
          </div>
        </div>

        <div
          style={{ left: `${cursor2.x}px`, top: `${cursor2.y}px` }}
          className="absolute z-30 pointer-events-none transition-all duration-1000 ease-out"
        >
          <MousePointer2 className="w-4 h-4 text-[#38bdf8] fill-[#38bdf8] drop-shadow" />
          <div className="ml-3 -mt-1 px-1.5 py-0.5 rounded bg-[#38bdf8] text-slate-950 font-semibold text-[9px] font-mono shadow">
            Dr. Priya
          </div>
        </div>

        {/* Floating Layer Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161616]/90 backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-ping" />
          <span className="text-[#FE6E00] font-semibold">SAR Inundation</span>
          <span className="text-slate-500">·</span>
          <span>Sentinel-1 Pass 148</span>
        </div>

        {/* Before/After Split Swipe Toggle in Top Right */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161616]/90 backdrop-blur-md border border-white/15 text-[10px] font-mono">
          <span className="text-slate-400">Pre-Flood</span>
          <div className="w-10 h-3 rounded-full bg-slate-800 relative cursor-pointer flex items-center px-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FE6E00]" />
          </div>
          <span className="text-[#FE6E00] font-semibold">Post-SAR</span>
        </div>

        {/* Iconic Felt Bottom Floating Tool Dock */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#181818]/95 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Pan / Hand Tool */}
          <button
            onClick={() => setActiveTool('hand')}
            title="Pan / Select"
            className={`p-2 rounded-full transition-all ${
              activeTool === 'hand'
                ? 'bg-white text-black font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
          </button>

          {/* Highlighter Tool */}
          <button
            onClick={() => setActiveTool('highlighter')}
            title="Vector Highlighter (Draw on map)"
            className={`p-2 rounded-full transition-all flex items-center gap-1 ${
              activeTool === 'highlighter'
                ? 'bg-[#FE6E00] text-black font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>

          {/* Color swatch picker for highlighter */}
          {activeTool === 'highlighter' && (
            <div className="flex items-center gap-1 px-1 border-r border-white/10">
              {['#FE6E00', '#38bdf8', '#f43f5e', '#4ade80'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrentColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-3.5 h-3.5 rounded-full transition-transform ${
                    currentColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Marker Pin Tool */}
          <button
            onClick={() => setActiveTool('pin')}
            title="Drop Triage Pin"
            className={`p-2 rounded-full transition-all ${
              activeTool === 'pin'
                ? 'bg-[#f43f5e] text-white font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
          </button>

          {/* Sticky Note Tool */}
          <button
            onClick={() => setActiveTool('note')}
            title="Add Spatial Sticky Note"
            className={`p-2 rounded-full transition-all ${
              activeTool === 'note'
                ? 'bg-[#38bdf8] text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <StickyNote className="w-3.5 h-3.5" />
          </button>

          {/* Mountain Measure Ruler Tool */}
          <button
            onClick={() => setActiveTool('measure')}
            title="Measure Mountain Distance & Trek Hours"
            className={`p-2 rounded-full transition-all ${
              activeTool === 'measure'
                ? 'bg-[#4ade80] text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

          {/* Layers Drawer Toggle */}
          <button
            onClick={() => setShowLayers(!showLayers)}
            title="Map Layers"
            className={`p-2 rounded-full transition-all ${
              showLayers
                ? 'bg-white/20 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Full Screen Launch CTA */}
          <button
            onClick={onOpenStudio}
            title="Open Interactive Studio"
            className="px-3 py-1.5 rounded-full bg-[#FE6E00] text-black font-semibold text-[11px] hover:bg-[#d69f39] transition-all flex items-center gap-1 shadow-md ml-1"
          >
            <span>Launch</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Layers Flyout if toggled */}
        {showLayers && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-40 w-56 p-3 rounded-xl bg-[#1c1c1c]/95 backdrop-blur-xl border border-white/20 shadow-2xl text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold text-white pb-1 border-b border-white/10">
              <span>Active GIS Layers</span>
              <span className="text-[10px] text-[#FE6E00] font-mono">6 Active</span>
            </div>
            {[
              { name: 'Sentinel-1 Inundation', active: true, color: '#FE6E00' },
              { name: 'Severed Road Vectors', active: true, color: '#f43f5e' },
              { name: 'Isolated Settlements', active: true, color: '#38bdf8' },
              { name: '30m DEM Slope Contours', active: true, color: '#94a3b8' },
              { name: 'Field Notes & Pins', active: true, color: '#4ade80' },
            ].map((layer) => (
              <div key={layer.name} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="text-[11px]">{layer.name}</span>
                </div>
                <Check className="w-3 h-3 text-[#4ade80]" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Felt Canvas Bottom Hint Bar */}
      <div className="px-4 py-2 bg-[#171717] border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FE6E00]" />
          <span>Felt-Inspired Collaborative GIS Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Click tools to draw or pin</span>
          <button
            onClick={onOpenStudio}
            className="text-[#FE6E00] hover:underline font-semibold flex items-center gap-1"
          >
            <span>Full Workstation</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
