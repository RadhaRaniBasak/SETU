import React, { useState } from 'react';
import {
  AlertCircle,
  Building,
  Navigation,
  CheckCircle,
  Search,
  Filter,
  ArrowRight,
  Plane,
  Heart,
  Activity,
  Flame,
} from 'lucide-react';
import { Settlement } from '../types/setu.ts';

interface TriageQueueProps {
  settlements: Settlement[];
  onSelectSettlement: (s: Settlement) => void;
  selectedSettlementId?: string;
}

export const TriageQueue: React.FC<TriageQueueProps> = ({
  settlements,
  onSelectSettlement,
  selectedSettlementId,
}) => {
  const [filter, setFilter] = useState<'all' | 'cutoff' | 'connected'>('cutoff');
  const [search, setSearch] = useState('');

  const filtered = settlements.filter((s) => {
    if (filter === 'cutoff' && !s.isCutOff) return false;
    if (filter === 'connected' && s.isCutOff) return false;
    if (search) {
      const term = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(term) ||
        s.nameNepali.includes(term) ||
        s.district.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalCutoffPop = settlements
    .filter((s) => s.isCutOff)
    .reduce((sum, s) => sum + s.estimatedPopulation, 0);

  return (
    <div className="flex flex-col h-full bg-[#FCFAF7] border-l border-[#E3E0DD] text-[#423D38]">
      {/* Top Header Card */}
      <div className="p-4 border-b border-[#E3E0DD] bg-[#F3F4F6]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FE6E00] font-bold">
              CRITICAL ISOLATION LOG
            </span>
            <h2 className="text-sm font-bold text-[#423D38] tracking-tight flex items-center gap-2 mt-0.5">
              <span>Settlement Road Triage</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FE6E00]/15 text-[#FE6E00] font-bold">
                {settlements.filter((s) => s.isCutOff).length} CUT OFF
              </span>
            </h2>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold font-mono text-[#FE6E00] tabular-nums tracking-tight">
              {totalCutoffPop.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase font-mono text-[#797067]">
              Isolated Civilians
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-[#797067] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search village, hamlet, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#E3E0DD] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#423D38] placeholder-[#797067] focus:outline-none focus:border-[#FE6E00] focus:ring-1 focus:ring-[#FE6E00] transition-colors"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#EDEBE9] rounded-lg border border-[#E3E0DD]">
          <button
            onClick={() => setFilter('cutoff')}
            className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              filter === 'cutoff'
                ? 'bg-[#FE6E00] text-white shadow-sm'
                : 'text-[#797067] hover:text-[#423D38]'
            }`}
          >
            Cut-Off ({settlements.filter((s) => s.isCutOff).length})
          </button>
          <button
            onClick={() => setFilter('connected')}
            className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              filter === 'connected'
                ? 'bg-white text-[#016630] shadow-sm border border-[#016630]/20'
                : 'text-[#797067] hover:text-[#423D38]'
            }`}
          >
            Connected ({settlements.filter((s) => !s.isCutOff).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white text-[#423D38] shadow-sm border border-[#E3E0DD]'
                : 'text-[#797067] hover:text-[#423D38]'
            }`}
          >
            All ({settlements.length})
          </button>
        </div>
      </div>

      {/* Settlement Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filtered.map((s) => {
          const isSelected = selectedSettlementId === s.id;
          return (
            <div
              key={s.id}
              onClick={() => onSelectSettlement(s)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden bg-white shadow-sm ${
                isSelected
                  ? 'border-2 border-[#FE6E00] ring-2 ring-[#FE6E00]/20 shadow-md'
                  : s.isCutOff
                  ? 'border-[#E3E0DD] hover:border-[#FE6E00]/60'
                  : 'border-[#E3E0DD] opacity-85 hover:opacity-100 hover:border-[#D1D5DC]'
              }`}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        s.isCutOff ? 'bg-[#FE6E00] animate-pulse' : 'bg-[#00C758]'
                      }`}
                    />
                    <span className="text-sm font-bold text-[#423D38] tracking-tight">
                      {s.name}
                    </span>
                    <span className="text-xs text-[#797067] font-mono">
                      {s.nameNepali}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#797067] mt-0.5">
                    <span>{s.district}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{s.elevationM}m ASL</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-bold font-mono text-[#423D38] tabular-nums tracking-tight">
                    {s.estimatedPopulation.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#797067] flex items-center gap-1 justify-end">
                    <Building className="w-3 h-3 text-[#797067]" />
                    <span className="tabular-nums">{s.buildingCount} bldgs</span>
                  </div>
                </div>
              </div>

              {/* Sparkline Bar */}
              <div className="flex items-center gap-1 my-2.5">
                {[40, 65, 30, 85, 55, 95, 70, 45, 60].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full ${
                      s.isCutOff ? 'bg-[#FE6E00]/30' : 'bg-[#00C758]/30'
                    }`}
                    style={{ height: `${(h / 100) * 14 + 3}px` }}
                  />
                ))}
              </div>

              {/* Status and Why Cut Off details */}
              {s.isCutOff ? (
                <div className="pt-2 border-t border-[#E3E0DD]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#FE6E00]">
                      <AlertCircle className="w-3.5 h-3.5 text-[#FE6E00]" />
                      <span>Single-Point-of-Failure Breach</span>
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        s.medicalUrgency === 'High'
                          ? 'bg-[#FB2C36]/15 text-[#FB2C36]'
                          : 'bg-[#EDB200]/20 text-[#874B00]'
                      }`}
                    >
                      Urgency: {s.medicalUrgency}
                    </span>
                  </div>

                  {s.isolationCause && (
                    <div className="bg-[#F3F4F6] rounded-lg p-2.5 text-xs border border-[#E3E0DD] space-y-1">
                      <div className="text-[#423D38] flex items-start gap-1">
                        <span className="text-[#797067] font-mono text-[11px]">Severed:</span>
                        <span className="text-[#FB2C36] font-semibold">
                          {s.isolationCause.primarySeveredBridge}
                        </span>
                      </div>
                      <div className="text-[#797067] flex items-center justify-between text-[11px]">
                        <span>Blocked to {s.isolationCause.nearestHospitalName}</span>
                        <span className="font-mono text-[#423D38] font-bold">
                          {s.isolationCause.originalDriveTimeMinutes}m drive
                        </span>
                      </div>
                      <p className="text-[11px] text-[#797067] italic pt-0.5">
                        "{s.isolationCause.currentStatusMessageNepali}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2.5 text-[11px] text-[#797067]">
                    <div className="flex items-center gap-1.5">
                      <Plane className="w-3 h-3 text-[#797067]" />
                      <span>
                        Heli LZ:{' '}
                        {s.helicopterLzFeasible ? (
                          <span className="text-[#016630] font-bold">Feasible Ground</span>
                        ) : (
                          <span className="text-[#FB2C36] font-bold">No Landing Flat</span>
                        )}
                      </span>
                    </div>
                    <span className="text-[#FE6E00] flex items-center gap-0.5 hover:text-[#FF6B00] text-xs font-semibold">
                      Inspect on Map <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#E3E0DD] flex items-center justify-between text-xs text-[#016630]">
                  <span className="flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00C758]" />
                    <span>Passable Highway Connection Active</span>
                  </span>
                  <span className="text-[#797067] text-[11px]">Direct Hospital Access</span>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-[#797067]">
            No settlements match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
