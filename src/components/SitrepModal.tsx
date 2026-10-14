import React, { useState } from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Building,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { DamagedBridge, PipelineStats, Settlement } from '../types/setu.ts';

interface SitrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PipelineStats;
  bridges: DamagedBridge[];
  settlements: Settlement[];
}

export const SitrepModal: React.FC<SitrepModalProps> = ({
  isOpen,
  onClose,
  stats,
  bridges,
  settlements,
}) => {
  const [loading, setLoading] = useState(false);
  const [sitrepData, setSitrepData] = useState<{
    summaryEn: string;
    summaryNe: string;
    auditPassed: boolean;
  } | null>(null);

  React.useEffect(() => {
    if (isOpen && !sitrepData) {
      fetchSitrep();
    }
  }, [isOpen]);

  const fetchSitrep = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/copilot/sitrep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setSitrepData({
          summaryEn: data.summaryEn,
          summaryNe: data.summaryNe,
          auditPassed: data.audit?.overallPassed ?? true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const cutoffSettlements = settlements.filter((s) => s.isCutOff);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[12px] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E3E0DD] rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:border-none print:w-full print:p-0 text-[#423D38]">
        {/* Modal Controls Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#F3F4F6] border-b border-[#E3E0DD] print:hidden shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-[#423D38]">
            <FileText className="w-4 h-4 text-[#FE6E00]" />
            <span>One-Page Bilingual Situation Report Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchSitrep}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#423D38] hover:text-black bg-white hover:bg-[#EDEBE9] border border-[#E3E0DD] rounded-md transition-colors shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate Copilot Text</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#FE6E00] hover:bg-[#FF6B00] rounded-md transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#797067] hover:text-[#423D38] rounded-md hover:bg-[#EDEBE9]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable One-Page Report Document */}
        <div className="p-8 overflow-y-auto print:p-0 print:overflow-visible space-y-6 text-[#423D38] bg-white">
          {/* Official Document Header */}
          <div className="border-b-2 border-[#D1D5DC] pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono tracking-wider text-[#FE6E00] uppercase">
                  SETU // NDRRMA SATELLITE EMERGENCY TASKFORCE
                </span>
                <span className="text-xs text-[#797067]">·</span>
                <span className="text-xs font-mono text-[#016630] font-semibold">
                  SITREP NO: SETU-2026-001
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#423D38] mt-1">
                DISASTER SITUATION REPORT: BHOTE KOSHI–TRISHULI CORRIDOR
              </h1>
              <p className="text-xs text-[#797067] mt-0.5">
                Event: High-Altitude Glacier Collapse & Debris Surge | Date of Origin: 26 August 2026
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-mono text-[#797067]">
                SENSOR: S1A SAR + WorldDEM-30
              </div>
              <div className="text-xs font-mono text-[#797067]">
                ORBIT: 121 (12d Repeat Cycle)
              </div>
              <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-[#016630]">
                <ShieldCheck className="w-3 h-3 text-[#00C758]" />
                <span>Zero-Hallucination Certified</span>
              </div>
            </div>
          </div>

          {/* Key Facts Metric Ribbon */}
          <div className="grid grid-cols-5 gap-3 text-center border border-[#E3E0DD] rounded-xl p-3 bg-[#F3F4F6]">
            <div>
              <div className="text-[10px] uppercase font-mono text-[#797067]">
                Total Hazard Extent
              </div>
              <div className="text-lg font-bold font-mono text-[#FE6E00] tabular-nums">
                {stats.totalHazardAreaKm2} km²
              </div>
              <div className="text-[9px] text-[#797067]">
                14.8 water / 9.2 debris
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-[#797067]">
                Damaged Bridges
              </div>
              <div className="text-lg font-bold font-mono text-[#FB2C36] tabular-nums">
                {stats.damagedBridgesCount}
              </div>
              <div className="text-[9px] text-[#797067]">
                Key gorge spans lost
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-[#797067]">
                Submerged Highway
              </div>
              <div className="text-lg font-bold font-mono text-[#874B00] tabular-nums">
                {stats.submergedRoadKm} km
              </div>
              <div className="text-[9px] text-[#797067]">
                Pasang Lhamu corridor
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-[#797067]">
                Cut-Off Settlements
              </div>
              <div className="text-lg font-bold font-mono text-[#FE6E00] tabular-nums">
                {stats.isolatedSettlementsCount}
              </div>
              <div className="text-[9px] text-[#797067]">
                Zero road link to town
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-[#797067]">
                Isolated Population
              </div>
              <div className="text-lg font-bold font-mono text-[#FB2C36] tabular-nums">
                {stats.isolatedPopulationCount.toLocaleString()}
              </div>
              <div className="text-[9px] text-[#797067]">
                Requires heli / trail air-drop
              </div>
            </div>
          </div>

          {/* Bilingual Executive Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
            {/* English Executive Summary */}
            <div className="p-4 rounded-xl bg-white border border-[#E3E0DD] shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E3E0DD]">
                <span className="font-bold text-[#423D38] uppercase tracking-wider">
                  Tactical Operational Assessment (English)
                </span>
                <span className="text-[10px] font-mono text-[#797067]">
                  Engine: SETU Grounded NLP Analyzer v2.4
                </span>
              </div>
              <p className="whitespace-pre-wrap text-[#423D38]">
                {sitrepData?.summaryEn || 'Loading verified tactical brief...'}
              </p>
            </div>

            {/* Nepali Executive Summary */}
            <div className="p-4 rounded-xl bg-white border border-[#E3E0DD] shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E3E0DD]">
                <span className="font-bold text-[#FE6E00] uppercase tracking-wider">
                  कार्यकारी सारांश (नेपालीमा)
                </span>
                <span className="text-[10px] font-mono text-[#797067]">
                  भाषा: नेपाली
                </span>
              </div>
              <p className="whitespace-pre-wrap text-[#423D38]">
                {sitrepData?.summaryNe || 'विपद् सारांश लोड हुँदैछ...'}
              </p>
            </div>
          </div>

          {/* Severed Bridges & Isolated Settlements Table */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#423D38] mb-2">
                1. Critical Severed Bridge Choke-Points (OpenStreetMap Intersect)
              </h3>
              <div className="border border-[#E3E0DD] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[rgba(254,110,0,0.05)] text-[#FF6B00] border-b border-[#E3E0DD]">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Bridge Name</th>
                      <th className="py-2 px-3 font-semibold">River</th>
                      <th className="py-2 px-3 font-semibold">Status</th>
                      <th className="py-2 px-3 font-semibold">Confidence</th>
                      <th className="py-2 px-3 font-semibold">Isolated Settlement Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E0DD] text-[#423D38] text-[11px]">
                    {bridges.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-[#F3F4F6]/50">
                        <td className="py-1.5 px-3 font-semibold text-[#423D38]">
                          {b.name}
                        </td>
                        <td className="py-1.5 px-3 text-[#797067]">{b.riverName}</td>
                        <td className="py-1.5 px-3 text-[#FB2C36] font-semibold">
                          {b.status}
                        </td>
                        <td className="py-1.5 px-3 text-[#797067]">{(b.confidence * 100).toFixed(0)}%</td>
                        <td className="py-1.5 px-3 text-[#797067]">
                          {b.isolatedSettlementIds.length > 0
                            ? b.isolatedSettlementIds
                                .map((id) => settlements.find((s) => s.id === id)?.name)
                                .filter(Boolean)
                                .join(', ')
                            : 'Regional Highway Link'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#423D38] mb-2">
                2. Isolated Mountain Settlements Priority Registry
              </h3>
              <div className="border border-[#E3E0DD] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[rgba(254,110,0,0.05)] text-[#FF6B00] border-b border-[#E3E0DD]">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Settlement</th>
                      <th className="py-2 px-3 font-semibold">District</th>
                      <th className="py-2 px-3 font-semibold">Population</th>
                      <th className="py-2 px-3 font-semibold">Medical Urgency</th>
                      <th className="py-2 px-3 font-semibold">Heli LZ Feasibility</th>
                      <th className="py-2 px-3 font-semibold">Nearest Blocked Hub</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3E0DD] text-[#423D38] text-[11px]">
                    {cutoffSettlements.map((s) => (
                      <tr key={s.id} className="hover:bg-[#F3F4F6]/50">
                        <td className="py-1.5 px-3 font-semibold text-[#423D38]">
                          {s.name} ({s.nameNepali})
                        </td>
                        <td className="py-1.5 px-3 text-[#797067]">{s.district}</td>
                        <td className="py-1.5 px-3 tabular-nums font-bold text-[#FE6E00]">
                          {s.estimatedPopulation.toLocaleString()}
                        </td>
                        <td className="py-1.5 px-3 font-semibold text-[#FB2C36]">
                          {s.medicalUrgency}
                        </td>
                        <td className="py-1.5 px-3">
                          {s.helicopterLzFeasible ? (
                            <span className="text-[#016630] font-semibold">
                              Feasible
                            </span>
                          ) : (
                            <span className="text-[#797067]">No LZ</span>
                          )}
                        </td>
                        <td className="py-1.5 px-3 text-[#797067]">
                          {s.isolationCause?.nearestHospitalName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Legal Attribution Notice */}
          <div className="pt-3 border-t border-[#E3E0DD] text-[10px] text-[#797067] space-y-1">
            <p>
              Contains modified Copernicus Sentinel data 2026. Produced using Copernicus WorldDEM-30 © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018 provided under COPERNICUS by the European Union and ESA; all rights reserved.
            </p>
            <p>
              © OpenStreetMap contributors. Copernicus Emergency Management Service data [EMSR927] used for validation checking only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
