import React from 'react';
import { Satellite, FileText, CheckCircle2, Smartphone, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'triage' | 'copilot' | 'benchmark' | 'limitations' | 'terminal';
  setActiveTab: (tab: 'map' | 'triage' | 'copilot' | 'benchmark' | 'limitations' | 'terminal') => void;
  onOpenSitrep: () => void;
  cutoffCount: number;
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSitrep,
  cutoffCount,
  onBackToLanding,
}) => {
  return (
    <header className="h-16 px-6 bg-black/70 backdrop-blur-[12px] border-b border-white/10 text-white flex items-center justify-between gap-6 shrink-0 z-40 select-none">
      {/* Zone 1: Brand Wordmark (Evreghen Command Center Shell Framing) */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          onClick={onBackToLanding}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="SETU Evreghen Command Center"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FE6E00] flex items-center justify-center text-white shadow-sm shadow-[#FE6E00]/30 group-hover:bg-[#FF6B00] transition-colors">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white whitespace-nowrap">
                SETU
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#FFB74D] font-semibold tracking-wider">
                EVREGHEN COMMAND
              </span>
              <span className="hidden sm:inline-block text-xs font-mono text-white/50">
                नेपाल सेतु
              </span>
            </div>
            <p className="text-[11px] text-white/60 font-medium whitespace-nowrap hidden md:block">
              Disaster Operations & Rescue Triage Console
            </p>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Links (Evreghen Navigation Pill Rules) */}
      <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
            activeTab === 'map'
              ? 'bg-[#FE6E00] text-white font-semibold shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Mission Map
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'terminal'
              ? 'bg-[#FE6E00] text-white font-semibold shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Field Terminal</span>
        </button>
        <button
          onClick={() => setActiveTab('triage')}
          className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'triage'
              ? 'bg-[#FE6E00] text-white font-semibold shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>Cut-off Villages</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'triage'
                ? 'bg-white text-[#FE6E00]'
                : 'bg-[#FE6E00]/20 text-[#FFB74D]'
            }`}
          >
            {cutoffCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('copilot')}
          className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
            activeTab === 'copilot'
              ? 'bg-[#FE6E00] text-white font-semibold shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Bilingual Copilot
        </button>
        <button
          onClick={() => setActiveTab('benchmark')}
          className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
            activeTab === 'benchmark'
              ? 'bg-[#FE6E00] text-white font-semibold shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          EMSR927 Benchmark
        </button>
        <button
          onClick={() => setActiveTab('limitations')}
          className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
            activeTab === 'limitations'
              ? 'bg-[#FE6E00] text-white font-semibold shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Limitations Audit
        </button>
      </nav>

      {/* Zone 3: Primary Action & Verified Telemetry Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 bg-[#DCFCE7] text-[#016630] border border-[#016630]/20 rounded-full px-2.5 py-1 text-[11px] font-mono font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#016630]" />
          <span>S1A Track 121 Verified</span>
        </div>

        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-md transition-colors whitespace-nowrap"
            title="View Product Story"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFB74D]" />
            <span>Product Story</span>
          </button>
        )}

        <button
          onClick={onOpenSitrep}
          className="flex items-center gap-2 h-10 px-4 text-xs font-semibold text-white bg-[#FE6E00] hover:bg-[#FF6B00] rounded-[6px] shadow-sm transition-all whitespace-nowrap"
        >
          <FileText className="w-4 h-4" />
          <span>Generate 1-Page Sitrep</span>
        </button>
      </div>
    </header>
  );
};
