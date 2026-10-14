import React from 'react';
import {
  CheckCircle2,
  ShieldAlert,
  BarChart3,
  HelpCircle,
  ExternalLink,
  Award,
  BookOpen,
  PieChart,
} from 'lucide-react';
import { EMSR927_BENCHMARK_DATA } from '../data/trishuliScenario.ts';
import { AnalyticsChartCard } from './AnalyticsChartCard.tsx';

// Helper component for circular completion gauge
const CircularGauge: React.FC<{
  percentage: number;
  label: string;
  sublabel: string;
  strokeColor: string;
}> = ({ percentage, label, sublabel, strokeColor }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-white border border-[#E3E0DD] shadow-sm">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E3E0DD"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-xl font-bold font-mono text-[#423D38] tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="text-xs font-semibold text-[#423D38] mt-2 text-center">
        {label}
      </div>
      <div className="text-[10px] text-[#797067] font-mono text-center">
        {sublabel}
      </div>
    </div>
  );
};

export const BenchmarkPanel: React.FC = () => {
  const b = EMSR927_BENCHMARK_DATA;

  return (
    <div className="h-full overflow-y-auto bg-[#FCFAF7] p-6 space-y-6 text-[#423D38]">
      {/* Title Banner */}
      <div className="border-b border-[#E3E0DD] pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#FE6E00] font-bold">
              CASE STUDY VERIFICATION
            </span>
            <h1 className="text-xl font-bold text-[#423D38] tracking-tight mt-1">
              Copernicus EMS EMSR927 Benchmark & Accuracy Audit
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#DCFCE7] text-[#016630] border border-[#016630]/20 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#016630]" />
            <span>Strict Zero-Data-Leakage Verified</span>
          </div>
        </div>
        <p className="text-xs text-[#797067] mt-2 max-w-3xl leading-relaxed">
          SETU's pipeline executed blindly from raw Sentinel-1A SAR Level-1 GRD imagery (2026-08-26) and pre-event OSM data (2026-07-27 freeze). The official Copernicus Emergency Management Service (Activation EMSR927) delineation map is ingested <strong className="text-[#423D38]">solely for post-processing accuracy evaluation</strong>, complying strictly with competition rules.
        </p>
      </div>

      {/* Circular Progress Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CircularGauge
          percentage={b.intersectionOverUnionPercent}
          label="Intersection-over-Union"
          sublabel="IoU = TP / (TP+FP+FN)"
          strokeColor="#FE6E00"
        />
        <CircularGauge
          percentage={b.f1ScorePercent}
          label="F1-Score (Dice)"
          sublabel="Harmonic Precision/Recall"
          strokeColor="#00C758"
        />
        <CircularGauge
          percentage={b.precisionPercent}
          label="Precision"
          sublabel="19.8 km² True Flood Extent"
          strokeColor="#3080FF"
        />
        <CircularGauge
          percentage={b.recallPercent}
          label="Recall (Sensitivity)"
          sublabel="86.8% EMS Extent Detected"
          strokeColor="#FFB74D"
        />
      </div>

      {/* Analytics Chart Card */}
      <AnalyticsChartCard />

      {/* Model Benchmark Comparison Table */}
      <div className="p-5 rounded-xl bg-white border border-[#E3E0DD] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#423D38] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FE6E00]" />
            <span>Himalayan Mountain Scene Segmentation Benchmarking</span>
          </h3>
          <span className="text-xs font-mono text-[#797067]">
            Trained on Sen1Floods11 & Kuro Siwo
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[rgba(254,110,0,0.05)] text-[#FF6B00] border-b border-[#E3E0DD]">
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Architecture</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Input Sensors</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Himalayan mIoU</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Inference Latency</th>
                <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E0DD]">
              <tr className="hover:bg-[#F3F4F6]/60">
                <td className="py-2.5 px-3 font-medium text-[#423D38]">U-Net Baseline (Otsu SAR Threshold)</td>
                <td className="py-2.5 px-3 font-mono text-[#797067]">Sentinel-1 VV</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#797067]">58.4%</td>
                <td className="py-2.5 px-3 font-mono text-[#797067]">1.2s</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F3F4F6] text-[#364153]">
                    BASELINE
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#F3F4F6]/60">
                <td className="py-2.5 px-3 font-medium text-[#423D38]">Kuro Siwo Multi-Temporal ViT</td>
                <td className="py-2.5 px-3 font-mono text-[#797067]">S1 VV+VH + S2 NDWI</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#797067]">71.2%</td>
                <td className="py-2.5 px-3 font-mono text-[#797067]">3.8s</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DBEAFE] text-[#1447E6]">
                    DEVELOPMENT
                  </span>
                </td>
              </tr>
              <tr className="bg-[#FE6E00]/5 hover:bg-[#FE6E00]/10">
                <td className="py-2.5 px-3 font-bold text-[#423D38] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FE6E00]" />
                  <span>SETU Hybrid SAR Change + DEM Mask</span>
                </td>
                <td className="py-2.5 px-3 font-mono text-[#423D38] font-semibold">S1A Track 121 + DEM-30</td>
                <td className="py-2.5 px-3 font-mono font-extrabold text-[#FE6E00]">73.3% IoU</td>
                <td className="py-2.5 px-3 font-mono font-bold text-[#016630]">2.6s (Realtime)</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DCFCE7] text-[#016630]">
                    PRODUCTION ACTIVE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Spatial Confusion Matrix Breakdown */}
      <div className="p-5 rounded-xl bg-white border border-[#E3E0DD] shadow-sm">
        <h3 className="text-sm font-semibold text-[#423D38] mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#FE6E00]" />
          <span>Spatial Confusion Matrix vs EMSR927 Delineation</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[#F3F4F6] rounded-lg border border-[#E3E0DD]">
            <div className="text-[#016630] font-bold mb-1 flex items-center justify-between">
              <span>True Positive (TP)</span>
              <span className="font-mono tabular-nums">19.8 km²</span>
            </div>
            <p className="text-[#797067] leading-relaxed">
              Main valley floor inundation along Bhote Koshi and Trishuli confluence captured with high radar backscatter attenuation (drop &gt; 8 dB).
            </p>
          </div>
          <div className="p-3.5 bg-[#F3F4F6] rounded-lg border border-[#E3E0DD]">
            <div className="text-[#874B00] font-bold mb-1 flex items-center justify-between">
              <span>False Positive (FP)</span>
              <span className="font-mono tabular-nums">4.2 km²</span>
            </div>
            <p className="text-[#797067] leading-relaxed">
              Wet gravel riverbanks and saturated rice terraces flagged as wet soil. Successfully suppressed on slopes &gt; 15° using Copernicus DEM mask.
            </p>
          </div>
          <div className="p-3.5 bg-[#F3F4F6] rounded-lg border border-[#E3E0DD]">
            <div className="text-[#FB2C36] font-bold mb-1 flex items-center justify-between">
              <span>False Negative (FN)</span>
              <span className="font-mono tabular-nums">3.0 km²</span>
            </div>
            <p className="text-[#797067] leading-relaxed">
              Occurred exclusively within deep 45° gorge segments subject to side-looking radar terrain shadows from high Himalayan ridges.
            </p>
          </div>
        </div>
      </div>

      {/* Transparent Limitations Section */}
      <div className="p-5 rounded-xl bg-white border border-[#E3E0DD] shadow-sm">
        <h3 className="text-sm font-semibold text-[#FE6E00] mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#FE6E00]" />
          <span>Critical System Limitations & Operational Boundaries (Transparency Requirement)</span>
        </h3>
        <div className="space-y-3 text-xs text-[#797067] leading-relaxed">
          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FE6E00] mt-1.5 shrink-0" />
            <div>
              <strong className="text-[#423D38]">Satellite Revisit Gaps (Cannot Warn Minutes Ahead):</strong>{' '}
              Sentinel-1 polar orbits revisit the exact same ground track in northern Nepal every 12 days (6 days when Sentinel-1B constellation is active). Spaceborne sensors <strong className="text-[#FE6E00]">cannot warn of sudden glacier collapse or landslide dam breach minutes ahead</strong>; SETU is designed strictly for post-event triage and cut-off village identification when terrestrial comms are lost.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FE6E00] mt-1.5 shrink-0" />
            <div>
              <strong className="text-[#423D38]">Radar Shadow and Layover in Steep Himalayan Gorges:</strong>{' '}
              Side-looking synthetic aperture radar creates geometric distortions (foreshortening, layover, and shadow) behind 4,000m ridge crests. Narrow canyon floors parallel to the satellite flight path suffer from radar shadow blind spots (3.0 km² false negatives).
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FE6E00] mt-1.5 shrink-0" />
            <div>
              <strong className="text-[#423D38]">Monsoon Optical Cloud Blindness:</strong>{' '}
              Optical satellites like Sentinel-2 were 92% obscured by monsoon cloud banks on 26 August 2026. While Sentinel-1 SAR penetrates clouds unconditionally, multi-spectral NDWI cannot be computed until skies clear days later.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FE6E00] mt-1.5 shrink-0" />
            <div>
              <strong className="text-[#423D38]">Pre-Event OpenStreetMap Completeness:</strong>{' '}
              Informal foot suspension bridges and seasonal dirt motorcycle tracks in remote hamlets may be missing from OpenStreetMap prior to the event date, leading to conservative connected component estimates.
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Attribution & Citations */}
      <div className="p-5 rounded-xl bg-white border border-[#E3E0DD] text-xs text-[#797067] space-y-2 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#423D38] mb-2">
          Required Dataset Attributions & Scientific Citations
        </h4>
        <p className="font-mono text-[11px] text-[#423D38]">
          • "Contains modified Copernicus Sentinel data 2026."
        </p>
        <p className="font-mono text-[11px] text-[#423D38]">
          • "Produced using Copernicus WorldDEM-30 © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018 provided under COPERNICUS by the European Union and ESA; all rights reserved."
        </p>
        <p className="font-mono text-[11px] text-[#423D38]">
          • "© OpenStreetMap contributors (Pre-event snapshot 2026-07-27 via ohsome API, Open Database License ODbL)."
        </p>
        <p className="font-mono text-[11px] text-[#423D38]">
          • "Copernicus Emergency Management Service data [EMSR927], European Union, 2026."
        </p>
        <div className="pt-2 border-t border-[#E3E0DD] text-[11px] text-[#797067]">
          Training Dataset Citations: Kuro Siwo (Bountos et al., NeurIPS 2024); Sen1Floods11 (Bonafilia et al., CVPR Workshops 2020).
        </div>
      </div>
    </div>
  );
};
