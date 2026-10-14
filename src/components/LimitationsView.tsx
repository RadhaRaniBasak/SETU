import React from 'react';
import {
  ShieldAlert,
  Clock,
  Mountain,
  CloudRain,
  MapPin,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const LimitationsView: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-[#FCFAF7] p-6 space-y-6 text-[#423D38]">
      <div className="border-b border-[#E3E0DD] pb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[#FE6E00] font-bold">
          Scientific Transparency & Honesty
        </span>
        <h1 className="text-xl font-bold text-[#423D38] tracking-tight mt-1">
          System Limitations, Sensor Gaps & Operational Scope
        </h1>
        <p className="text-xs text-[#797067] mt-2 max-w-3xl leading-relaxed">
          Effective disaster triage requires ruthless honesty about what remote sensing can and cannot achieve. This section documents the physical and algorithmic boundaries of the SETU system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Limitation 1 */}
        <div className="p-5 rounded-xl bg-white border border-[#E3E0DD] shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-[#FE6E00]">
            <Clock className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[#423D38]">
              1. Satellite Revisit Frequencies vs Immediate Early Warning
            </h3>
          </div>
          <p className="text-xs text-[#797067] leading-relaxed">
            Sentinel-1 polar-orbiting satellites operate on a strict 12-day repeat orbit (6 days with two-satellite constellation). When a glacial lake bursts or a high-altitude hanging glacier shears off, the flood wave transits mountain valleys at 15–25 km/h, reaching downstream villages in 20 to 90 minutes.
          </p>
          <div className="p-3 bg-[#F3F4F6] rounded-lg border border-[#E3E0DD] text-xs text-[#797067]">
            <strong className="text-[#FE6E00]">Operational Reality:</strong> Satellites <strong className="text-[#423D38]">cannot warn of a sudden glacier collapse minutes ahead</strong>. SETU is an <em>emergency triage and isolation mapping system</em> deployed hours to days after ground communications fail to coordinate rescue logistics, not an early warning siren.
          </div>
        </div>

        {/* Limitation 2 */}
        <div className="p-5 rounded-xl bg-white border border-[#E3E0DD] shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-[#FE6E00]">
            <Mountain className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[#423D38]">
              2. Radar Geometric Distortions in Steep Himalayan Gorges
            </h3>
          </div>
          <p className="text-xs text-[#797067] leading-relaxed">
            Synthetic Aperture Radar (SAR) is side-looking. In extreme Himalayan terrain where gorge slopes exceed 45°, radar pulses suffer severe geometric distortions:
          </p>
          <ul className="text-xs text-[#797067] list-disc list-inside space-y-1">
            <li><strong className="text-[#423D38]">Radar Shadow:</strong> Areas behind tall mountain ridges where no radar pulse reaches, appearing completely black (causing false-negative flood gaps).</li>
            <li><strong className="text-[#423D38]">Layover & Foreshortening:</strong> Mountain tops appear closer to the sensor than their bases, compressing signals.</li>
          </ul>
          <div className="p-3 bg-[#F3F4F6] rounded-lg border border-[#E3E0DD] text-xs text-[#797067]">
            <strong className="text-[#FE6E00]">Mitigation in SETU:</strong> We enforce same-orbit pair comparison (Orbit 121 ascending) to eliminate viewing-angle mismatch, and filter steep slopes (&gt;15°) using Copernicus WorldDEM-30.
          </div>
        </div>

        {/* Limitation 3 */}
        <div className="p-5 rounded-xl bg-white border border-[#E3E0DD] shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-[#FE6E00]">
            <CloudRain className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[#423D38]">
              3. Monsoon Cloud Cover Blindness on Optical Sensors
            </h3>
          </div>
          <p className="text-xs text-[#797067] leading-relaxed">
            During heavy monsoon downpours, optical satellites (Sentinel-2, Landsat) cannot see the ground due to dense cumulus clouds. In our 26 August 2026 Trishuli scene, optical cloud cover exceeded 92%.
          </p>
          <div className="p-3 bg-[#F3F4F6] rounded-lg border border-[#E3E0DD] text-xs text-[#797067]">
            <strong className="text-[#FE6E00]">Architectural Choice:</strong> SETU relies primarily on Sentinel-1 C-band Synthetic Aperture Radar, which penetrates clouds, rain, and darkness, using Sentinel-2 optical imagery only when clear sky windows open.
          </div>
        </div>

        {/* Limitation 4 */}
        <div className="p-5 rounded-xl bg-white border border-[#E3E0DD] shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-[#FE6E00]">
            <MapPin className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-[#423D38]">
              4. OpenStreetMap Road Network Completeness
            </h3>
          </div>
          <p className="text-xs text-[#797067] leading-relaxed">
            Our isolation algorithm uses pre-event road vectors from OpenStreetMap. In remote mountain wards, informal suspension bridges, mule tracks, and newly built village agricultural roads may not be mapped.
          </p>
          <div className="p-3 bg-[#F3F4F6] rounded-lg border border-[#E3E0DD] text-xs text-[#797067]">
            <strong className="text-[#FE6E00]">Field Safeguard:</strong> The copilot clearly states: <em>"Based on pre-event OpenStreetMap topology"</em>. Emergency teams are advised to corroborate single-access routes with local ward officials and amateur radio contacts.
          </div>
        </div>
      </div>
    </div>
  );
};
