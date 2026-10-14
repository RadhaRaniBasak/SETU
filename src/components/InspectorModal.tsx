import React from 'react';
import {
  X,
  AlertTriangle,
  Building,
  Navigation,
  Plane,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Settlement, DamagedBridge } from '../types/setu.ts';

interface InspectorModalProps {
  settlement: Settlement | null;
  bridge: DamagedBridge | null;
  onClose: () => void;
  onAskCopilot: (question: string) => void;
}

export const InspectorModal: React.FC<InspectorModalProps> = ({
  settlement,
  bridge,
  onClose,
  onAskCopilot,
}) => {
  if (!settlement && !bridge) return null;

  return (
    <div className="absolute top-16 right-6 z-30 w-80 bg-white border border-[#E3E0DD] rounded-xl shadow-2xl overflow-hidden text-xs text-[#423D38] animate-in fade-in zoom-in-95 duration-150">
      {/* Settlement Inspector */}
      {settlement && (
        <div>
          <div className="p-4 bg-[#F3F4F6] border-b border-[#E3E0DD] flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    settlement.isCutOff ? 'bg-[#FE6E00]' : 'bg-[#00C758]'
                  }`}
                />
                <h3 className="text-sm font-bold text-[#423D38] tracking-tight">
                  {settlement.name}
                </h3>
              </div>
              <p className="text-[11px] text-[#797067] font-mono mt-0.5">
                {settlement.nameNepali} · {settlement.district}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#797067] hover:text-[#423D38] rounded hover:bg-[#EDEBE9]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[#F3F4F6] border border-[#E3E0DD]">
                <div className="text-[10px] text-[#797067] font-mono uppercase">
                  Population
                </div>
                <div className="text-sm font-bold font-mono text-[#423D38] tabular-nums">
                  {settlement.estimatedPopulation.toLocaleString()}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#F3F4F6] border border-[#E3E0DD]">
                <div className="text-[10px] text-[#797067] font-mono uppercase">
                  Buildings
                </div>
                <div className="text-sm font-bold font-mono text-[#423D38] tabular-nums">
                  {settlement.buildingCount}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-[#423D38]">
              <div className="flex justify-between">
                <span className="text-[#797067]">Elevation:</span>
                <span className="font-mono text-[#423D38] font-semibold">{settlement.elevationM}m ASL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797067]">Coordinates:</span>
                <span className="font-mono text-[#423D38]">
                  {settlement.lat.toFixed(3)}°N, {settlement.lng.toFixed(3)}°E
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797067]">Helicopter LZ:</span>
                <span
                  className={
                    settlement.helicopterLzFeasible
                      ? 'text-[#016630] font-semibold'
                      : 'text-[#FB2C36] font-semibold'
                  }
                >
                  {settlement.helicopterLzFeasible ? 'Feasible Ground' : 'Terrain Too Steep'}
                </span>
              </div>
            </div>

            {settlement.isCutOff && settlement.isolationCause && (
              <div className="p-2.5 rounded-lg bg-[#FE6E00]/10 border border-[#FE6E00]/30 text-[#423D38] space-y-1.5">
                <div className="font-semibold text-[#FE6E00] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Isolation Root Cause</span>
                </div>
                <p className="text-[11px] text-[#423D38]">
                  Single-Point-of-Failure:{' '}
                  <strong className="text-[#FB2C36]">
                    {settlement.isolationCause.primarySeveredBridge}
                  </strong>
                </p>
                <p className="text-[11px] text-[#797067]">
                  {settlement.isolationCause.currentStatusMessage}
                </p>
              </div>
            )}

            <button
              onClick={() =>
                onAskCopilot(
                  `What is the rescue priority and road disconnection cause for ${settlement.name}?`
                )
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#FE6E00] hover:bg-[#FF6B00] text-white rounded-md font-semibold transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Copilot About {settlement.name}</span>
            </button>
          </div>
        </div>
      )}

      {/* Bridge Inspector */}
      {bridge && (
        <div>
          <div className="p-4 bg-[#F3F4F6] border-b border-[#E3E0DD] flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB2C36]" />
                <h3 className="text-sm font-bold text-[#423D38] tracking-tight">
                  {bridge.name}
                </h3>
              </div>
              <p className="text-[11px] text-[#797067] font-mono mt-0.5">
                {bridge.riverName} · {bridge.highwayRef}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#797067] hover:text-[#423D38] rounded hover:bg-[#EDEBE9]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="p-2.5 rounded-lg bg-[#FB2C36]/10 border border-[#FB2C36]/30 text-[#423D38]">
              <div className="font-semibold text-[#FB2C36]">
                Breach Status: {bridge.status}
              </div>
              <div className="text-[11px] text-[#797067] mt-0.5">
                SAR Confidence: {(bridge.confidence * 100).toFixed(0)}% · Type: {bridge.preEventBridgeType}
              </div>
            </div>

            <div className="space-y-1.5 text-[#423D38]">
              <div className="flex justify-between">
                <span className="text-[#797067]">OSM Way ID:</span>
                <span className="font-mono text-[#FE6E00] font-semibold">{bridge.osmId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797067]">Elevation:</span>
                <span className="font-mono text-[#423D38] font-semibold">{bridge.elevationM}m ASL</span>
              </div>
            </div>

            {bridge.isolatedSettlementIds.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-[#797067] uppercase font-mono mb-1">
                  Settlements Severed By This Bridge:
                </div>
                <div className="space-y-1">
                  {bridge.isolatedSettlementIds.map((id) => (
                    <div
                      key={id}
                      className="px-2 py-1 rounded bg-[#F3F4F6] border border-[#E3E0DD] text-[#423D38] flex items-center justify-between"
                    >
                      <span className="capitalize">{id.replace('s_', '')}</span>
                      <span className="text-[10px] text-[#FB2C36] font-mono font-bold">Cut Off</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() =>
                onAskCopilot(
                  `Which settlements are isolated due to the damage on ${bridge.name}?`
                )
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#FE6E00] hover:bg-[#FF6B00] text-white rounded-md font-semibold transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Copilot About This Bridge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
