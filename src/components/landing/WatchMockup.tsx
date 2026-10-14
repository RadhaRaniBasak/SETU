import React from 'react';
import {
  AlertTriangle,
  Check,
  X,
  Radio,
  Clock,
  Compass,
  Send,
  ShieldAlert,
} from 'lucide-react';

export type WatchScreenType =
  | 'surge-warning'
  | 'settlement-status'
  | 'approval-action'
  | 'quick-reply';

interface WatchMockupProps {
  screen: WatchScreenType;
  caption: string;
  className?: string;
}

export const WatchMockup: React.FC<WatchMockupProps> = ({
  screen,
  caption,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center gap-3.5 ${className}`}>
      {/* Tactical Watch Case */}
      <div className="relative w-[190px] h-[230px] rounded-[36px] bg-[#141414] p-2.5 border border-white/20 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] flex flex-col justify-between">
        {/* Titanium Side Digital Crown */}
        <div className="absolute -right-2 top-10 w-2 h-10 rounded-r-md bg-[#2a2a2a] border border-white/20 shadow-sm" />
        {/* Side Button */}
        <div className="absolute -right-1.5 top-24 w-1.5 h-7 rounded-r-sm bg-[#222222] border border-white/10" />

        {/* OLED Screen Bezel */}
        <div className="w-full h-full rounded-[26px] bg-black p-3 flex flex-col justify-between overflow-hidden border border-white/10 text-white font-sans select-none">
          {/* Watch Status Header */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-[#FE6E00] font-bold flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              SETU
            </span>
            <span className="font-semibold text-slate-300">09:42</span>
          </div>

          {/* Screen Content */}
          <div className="my-auto py-1 space-y-1.5">
            {screen === 'surge-warning' && (
              <>
                <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400 uppercase tracking-tight">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>Surge Warning</span>
                </div>
                <div className="text-[13px] font-bold text-white leading-tight">
                  Trishuli Debris Flow
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Peak wave arrival:
                </div>
                <div className="text-xl font-mono font-bold text-[#FE6E00] tracking-tight">
                  00:18:42
                </div>
              </>
            )}

            {screen === 'settlement-status' && (
              <>
                <div className="text-[10px] font-mono uppercase text-[#FE6E00] font-semibold">
                  Priority 01 · Cut-Off
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  Syabrubesi
                </div>
                <div className="p-1 rounded bg-[#1c1c1c] border border-white/10 text-[10px] font-mono text-slate-300 flex justify-between">
                  <span>Isolated:</span>
                  <span className="text-rose-400 font-bold">842</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  Bridge: Severed (2.1km)
                </div>
              </>
            )}

            {screen === 'approval-action' && (
              <>
                <div className="text-[10px] font-mono uppercase text-slate-400 text-center">
                  Rasuwa Air Drop
                </div>
                <div className="text-[11px] font-bold text-center text-white">
                  MI-17 Helo 02
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button className="py-1.5 rounded-full bg-white text-black text-[10px] font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-0.5">
                    <Check className="w-2.5 h-2.5" />
                    Approve
                  </button>
                  <button className="py-1.5 rounded-full bg-transparent border border-amber-400/60 text-[#FE6E00] text-[10px] font-bold hover:bg-amber-400/10 transition-colors flex items-center justify-center gap-0.5">
                    <X className="w-2.5 h-2.5" />
                    Hold
                  </button>
                </div>
              </>
            )}

            {screen === 'quick-reply' && (
              <>
                <div className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                  Field Tactical Mesh
                </div>
                <div className="space-y-1">
                  <div className="py-1 px-2 rounded-lg bg-[#202020] text-[10px] font-medium text-slate-200 border border-white/10 flex items-center justify-between">
                    <span>En Route LZ-1</span>
                    <Send className="w-2.5 h-2.5 text-slate-400" />
                  </div>
                  <div className="py-1 px-2 rounded-lg bg-[#202020] text-[10px] font-medium text-slate-200 border border-white/10 flex items-center justify-between">
                    <span>All Clear</span>
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Watch Indicator Bar */}
          <div className="w-12 h-0.5 bg-white/20 rounded-full mx-auto" />
        </div>
      </div>

      {/* Caption Pill below the watch */}
      <span className="px-3 py-1 rounded-full bg-[#1b1b1b] border border-white/10 text-[11px] font-mono text-slate-300 whitespace-nowrap">
        {caption}
      </span>
    </div>
  );
};
