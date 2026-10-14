import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Play,
  ArrowRight,
} from 'lucide-react';

interface GetStartedSectionProps {
  onLaunchConsole: () => void;
}

export const GetStartedSection: React.FC<GetStartedSectionProps> = ({
  onLaunchConsole,
}) => {
  const [copied, setCopied] = useState(false);
  const installCommand = 'curl -sSL https://get.setu.space | bash';

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="get-started" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1200px] mx-auto bg-[#FCFAF7]">
      {/* Numbered Section Label Pattern */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="px-2 py-0.5 rounded bg-[#FE6E00]/15 text-[#FE6E00] font-mono text-xs font-bold border border-[#FE6E00]/30">
          04
        </span>
        <span className="text-xs font-mono tracking-widest text-[#797067] uppercase font-bold">
          DEPLOYMENT & ACCESSIBILITY
        </span>
      </div>

      {/* Full-width Statement Headline */}
      <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#423D38] max-w-4xl leading-[1.15] mb-14">
        Deploy in seconds. Run on any terminal or device.
      </h2>

      {/* Two Column Deployment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Column 1: Desktop / Command Center Card */}
        <div className="rounded-2xl bg-white border border-[#E3E0DD] p-6 sm:p-8 flex flex-col justify-between space-y-8 shadow-sm">
          <div className="space-y-4">
            {/* Step header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#FE6E00] font-bold">
                01 · Command Center
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#FE6E00]/15 text-[#FE6E00] flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#423D38] tracking-tight">
                EOC & Tactical Workstation
              </h3>
              <p className="text-sm text-[#797067] mt-1 leading-relaxed">
                Deploy the full SETU GIS pipeline on command laptops, ruggedized field servers, or air-gapped Docker nodes.
              </p>
            </div>

            {/* Platform pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-[#F3F4F6] border border-[#E3E0DD] text-xs font-mono text-[#423D38]">
                macOS (Apple Silicon)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F3F4F6] border border-[#E3E0DD] text-xs font-mono text-[#423D38]">
                Linux (Debian/Ubuntu)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F3F4F6] border border-[#E3E0DD] text-xs font-mono text-[#423D38]">
                Windows (WSL2)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FE6E00]/15 border border-[#FE6E00]/30 text-xs font-mono text-[#FE6E00] font-bold">
                Docker Container
              </span>
            </div>

            {/* Architecture note */}
            <p className="text-xs font-mono text-[#797067]">
              Native compiled x86_64 & ARM64 binaries. No external GIS runtime required.
            </p>

            {/* Terminal-style command row with Copy button */}
            <div className="p-3.5 rounded-xl bg-black/85 backdrop-blur-[12px] border border-white/10 flex items-center justify-between gap-3 group text-white">
              <div className="flex items-center gap-2 overflow-x-auto font-mono text-xs text-white/90 scrollbar-none">
                <span className="text-[#FE6E00] font-bold select-none">$</span>
                <span className="select-all font-medium text-white">
                  {installCommand}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white transition-colors flex items-center gap-1.5 shrink-0 active:scale-95"
                title="Copy install command"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00C758]" />
                    <span className="text-[#00C758]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white/60" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Two text links */}
          <div className="pt-4 border-t border-[#E3E0DD] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <a
              href="#security"
              className="text-[#FE6E00] hover:text-[#FF6B00] font-bold transition-colors flex items-center gap-1 group"
            >
              <span>Verify GPG signatures</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#faq"
              className="text-[#797067] hover:text-[#423D38] transition-colors flex items-center gap-1"
            >
              <span>Self-hosted offline manual</span>
              <ExternalLink className="w-3 h-3 text-[#797067]" />
            </a>
          </div>
        </div>

        {/* Column 2: Mobile & Field Responder Card */}
        <div className="rounded-2xl bg-white border border-[#E3E0DD] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm relative overflow-hidden">
          <div className="space-y-4">
            {/* Step header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#FE6E00] font-bold">
                02 · Field Mobile
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#FE6E00]/15 text-[#FE6E00] flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#423D38] tracking-tight">
                Tactical Mobile & Wearables
              </h3>
              <p className="text-sm text-[#797067] mt-1 leading-relaxed">
                Empower forward search teams with real-time GPS tracking, offline triage queues, and instant wrist notifications.
              </p>
            </div>

            {/* Platform pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-[#F3F4F6] border border-[#E3E0DD] text-xs font-mono text-[#423D38]">
                iOS 17+
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F3F4F6] border border-[#E3E0DD] text-xs font-mono text-[#423D38]">
                Android 14+
              </span>
              <span className="px-3 py-1 rounded-full bg-[#F3F4F6] border border-[#E3E0DD] text-xs font-mono text-[#423D38]">
                watchOS 10+
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FE6E00]/15 border border-[#FE6E00]/30 text-xs font-mono text-[#FE6E00] font-bold">
                Garmin inReach Bridge
              </span>
            </div>

            {/* Requirement text */}
            <p className="text-xs font-mono text-[#797067]">
              Compatible with Bluetooth 5.3 Low Energy mesh & LoRa 915MHz gateways. No SIM required.
            </p>

            {/* Evreghen Primary Button */}
            <div className="pt-2">
              <button
                onClick={onLaunchConsole}
                className="w-full sm:w-auto px-6 py-3 rounded-md bg-[#FE6E00] hover:bg-[#FF6B00] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-[#FE6E00]/25"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Launch Web Terminal (Instant Access)</span>
              </button>
            </div>
          </div>

          {/* Perspective device shot inside card */}
          <div className="relative mt-4 -mb-8 -mx-4 h-44 sm:h-52 bg-[#F3F4F6] rounded-xl border border-[#E3E0DD] p-4 overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#797067] border-b border-[#E3E0DD] pb-2">
              <span className="text-[#FE6E00] font-bold">SETU FIELD TERMINAL</span>
              <span className="text-[#016630] font-bold">BLE MESH SYNCED</span>
            </div>
            <div className="space-y-2 py-2">
              <div className="p-2.5 rounded-lg bg-white border border-[#E3E0DD] flex items-center justify-between text-xs shadow-xs">
                <div>
                  <div className="font-bold text-[#423D38]">Syabrubesi Bridge Alpha</div>
                  <div className="text-[10px] text-[#797067]">Choke-point Severed · 842 cut off</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#FB2C36]/20 text-[#FB2C36] border border-[#FB2C36]/30 text-[10px] font-mono font-bold">
                  CRITICAL
                </span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#797067] text-center">
              Offline Vector Storage: 1.4GB cached on-device
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
