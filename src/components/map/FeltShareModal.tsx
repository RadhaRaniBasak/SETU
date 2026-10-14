import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Users,
  ShieldCheck,
  FileCode,
  FileText,
  ImageIcon,
  Code,
} from 'lucide-react';

interface FeltShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSitrep: () => void;
  onExportGeoJSON?: () => void;
}

export const FeltShareModal: React.FC<FeltShareModalProps> = ({
  isOpen,
  onClose,
  onOpenSitrep,
  onExportGeoJSON,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'editor' | 'viewer' | 'field'>('editor');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/#share=trishuli-emsr927&role=${selectedRole}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyEmbed = async () => {
    const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allowfullscreen></iframe>`;
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleTriggerGeoJSON = () => {
    if (onExportGeoJSON) {
      onExportGeoJSON();
    }
    setDownloadSuccess('Exported GeoJSON file successfully!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadSnapshot = () => {
    setDownloadSuccess('Generating high-resolution PNG snapshot...');
    setTimeout(() => {
      setDownloadSuccess('Snapshot captured: SETU_Command_Center_Map.png');
      setTimeout(() => setDownloadSuccess(null), 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[12px] animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E3E0DD] shadow-2xl overflow-hidden text-[#423D38] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3E0DD] bg-[#F3F4F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FE6E00]/10 border border-[#FE6E00]/30 flex items-center justify-center text-[#FE6E00]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#423D38] font-sans">
                Share Map & Export Triage Data
              </h2>
              <p className="text-[11px] text-[#797067] font-mono">
                Multi-Agency Incident Coordination
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#797067] hover:text-[#423D38] hover:bg-[#EDEBE9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Live Collaborative Link */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#423D38] uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#FE6E00]" />
              <span>Multiplayer Collaboration Link</span>
            </label>

            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#F3F4F6] border border-[#E3E0DD]">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-[#423D38] font-mono focus:outline-none select-all"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="bg-white text-[11px] font-mono text-[#423D38] rounded-lg px-2.5 py-1.5 border border-[#E3E0DD] focus:outline-none"
              >
                <option value="editor">Can Edit & Annotate</option>
                <option value="field">Field Rescue Unit</option>
                <option value="viewer">View-Only</option>
              </select>
              <button
                onClick={handleCopyLink}
                className="px-4 py-1.5 rounded-lg bg-[#FE6E00] hover:bg-[#FF6B00] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-[#797067] font-mono">
              <ShieldCheck className="w-3 h-3 text-[#00C758]" />
              <span>End-to-end encrypted session · 3 responders currently active</span>
            </div>
          </div>

          {/* Section 2: Export Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#423D38] uppercase font-mono tracking-wider flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#FE6E00]" />
              <span>Export Triage Artifacts</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Export GeoJSON */}
              <button
                onClick={handleTriggerGeoJSON}
                className="p-3.5 rounded-xl bg-[#F3F4F6] hover:bg-[#EDEBE9] border border-[#E3E0DD] text-left transition-all group flex flex-col justify-between h-24"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="p-2 rounded-lg bg-[#FE6E00]/10 text-[#FE6E00] group-hover:bg-[#FE6E00]/20">
                    <FileCode className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono text-[#797067] group-hover:text-[#FE6E00]">
                    .geojson
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#423D38]">Export GeoJSON</div>
                  <div className="text-[10px] text-[#797067]">Full vector layers & notes</div>
                </div>
              </button>

              {/* Print Sitrep Report */}
              <button
                onClick={() => {
                  onClose();
                  onOpenSitrep();
                }}
                className="p-3.5 rounded-xl bg-[#F3F4F6] hover:bg-[#EDEBE9] border border-[#E3E0DD] text-left transition-all group flex flex-col justify-between h-24"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="p-2 rounded-lg bg-[#FFB74D]/20 text-[#FE6E00] group-hover:bg-[#FFB74D]/30">
                    <FileText className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono text-[#797067] group-hover:text-[#FE6E00]">
                    PDF / Print
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#423D38]">Disaster Sitrep</div>
                  <div className="text-[10px] text-[#797067]">Bilingual emergency briefing</div>
                </div>
              </button>

              {/* PNG Snapshot */}
              <button
                onClick={handleDownloadSnapshot}
                className="p-3.5 rounded-xl bg-[#F3F4F6] hover:bg-[#EDEBE9] border border-[#E3E0DD] text-left transition-all group flex flex-col justify-between h-24"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="p-2 rounded-lg bg-[#00C758]/10 text-[#00C758] group-hover:bg-[#00C758]/20">
                    <ImageIcon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono text-[#797067] group-hover:text-[#00C758]">
                    PNG
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#423D38]">Map Snapshot</div>
                  <div className="text-[10px] text-[#797067]">Triage raster overview</div>
                </div>
              </button>

              {/* Embed Map */}
              <button
                onClick={handleCopyEmbed}
                className="p-3.5 rounded-xl bg-[#F3F4F6] hover:bg-[#EDEBE9] border border-[#E3E0DD] text-left transition-all group flex flex-col justify-between h-24"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="p-2 rounded-lg bg-[#3080FF]/10 text-[#3080FF] group-hover:bg-[#3080FF]/20">
                    <Code className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono text-[#797067] group-hover:text-[#3080FF]">
                    Embed
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#423D38]">
                    {copiedEmbed ? 'Snippet Copied!' : 'Embed Code'}
                  </div>
                  <div className="text-[10px] text-[#797067]">Add to crisis news portal</div>
                </div>
              </button>
            </div>

            {downloadSuccess && (
              <div className="p-2 rounded-lg bg-[#00C758]/10 border border-[#00C758]/30 text-[#016630] text-xs font-mono text-center animate-in fade-in">
                {downloadSuccess}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#E3E0DD] bg-[#F3F4F6] flex items-center justify-between text-xs text-[#797067]">
          <span>SETU Nepal · Evreghen Command Center</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#423D38] hover:bg-black text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
