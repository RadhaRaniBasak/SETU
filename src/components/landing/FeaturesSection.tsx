import React, { useState } from 'react';
import {
  ChevronRight,
} from 'lucide-react';
import { PhoneMockup, PhoneScreenType } from './PhoneMockup.tsx';

interface FeatureItem {
  number: string;
  title: string;
  description: string;
  screen: PhoneScreenType;
  badge: string;
}

export const FeaturesSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const features: FeatureItem[] = [
    {
      number: '01',
      title: 'Dual-Date SAR Backscatter Analysis',
      description:
        'Sentinel-1 C-band Synthetic Aperture Radar penetrates 100% monsoon cloud cover and smoke, computing calibrated log-ratio coherence deltas across a 12-day orbital baseline.',
      screen: 'sar-alert',
      badge: 'Pass 14B Verified',
    },
    {
      number: '02',
      title: 'Road Cut-Off Topology Graph',
      description:
        'Overlays detected flood and landslide polygons directly onto OpenStreetMap road vectors to calculate network reachability and isolate cut-off mountain villages.',
      screen: 'triage-queue',
      badge: '7 Cut-Off Identified',
    },
    {
      number: '03',
      title: 'Upstream DEM Flash-Flood Tracer',
      description:
        'Executes deterministic D8 flow routing over 30m Copernicus elevation contours to forecast downstream peak surge velocities, water depth, and bridge hydrodynamic scour.',
      screen: 'flow-tracer',
      badge: '22.4 km Corridor',
    },
    {
      number: '04',
      title: 'Air-Gapped Approval Workflows',
      description:
        'Facilitates rapid tactical decisions. Field coordinators can approve helicopter supply drops or reroute rescue columns with zero internet reliance.',
      screen: 'approval-card',
      badge: 'Offline Authorized',
    },
    {
      number: '05',
      title: 'Zero-Hallucination Bilingual Copilot',
      description:
        'Constrained strictly to validated geospatial ground truth. Generates situational summaries and answers operational questions fluently in Nepali and English.',
      screen: 'sitrep-preview',
      badge: 'NDRRMA Compliant',
    },
    {
      number: '06',
      title: '1-Page Standardized Situation Reports',
      description:
        'Compiles high-level executive summaries formatted to UN OCHA and Nepal Disaster Risk Portal standards, ready for instant thermal field printing or PDF export.',
      screen: 'sitrep-preview',
      badge: 'Field Ready',
    },
  ];

  const secondaryFeatures = [
    'GIS Vector Canvas',
    'Spatial Field Notes',
    'Live Multiplayer Cursors',
    'Mountain Transit Ruler',
    'Before/After Split Swipe',
    'GeoJSON FeatureCollection',
    'Devanagari Numerals',
    'Sub-4s Pipeline Latency',
  ];

  const currentFeature = features[activeIdx];

  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1200px] mx-auto bg-[#FCFAF7]">
      {/* Numbered Section Label Pattern */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="px-2 py-0.5 rounded bg-[#FE6E00]/15 text-[#FE6E00] font-mono text-xs font-bold border border-[#FE6E00]/30">
          01
        </span>
        <span className="text-xs font-mono tracking-widest text-[#797067] uppercase font-bold">
          CORE CAPABILITIES
        </span>
      </div>

      {/* Full-width Statement Headline */}
      <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#423D38] max-w-4xl leading-[1.15] mb-14">
        Autonomous SAR change detection. Zero-latency triage.
      </h2>

      {/* Two Column Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: 6 Numbered Feature Rows */}
        <div className="lg:col-span-7 space-y-3">
          {features.map((feature, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={feature.number}
                onClick={() => setActiveIdx(idx)}
                className={`cursor-pointer transition-all duration-200 rounded-xl p-5 border text-left ${
                  isActive
                    ? 'bg-white border-[#FE6E00] shadow-md ring-1 ring-[#FE6E00]/30'
                    : 'bg-white/80 border-[#E3E0DD] hover:bg-white hover:border-[#D1D5DC]'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Large ghost-gray numeral */}
                  <span
                    className={`text-2xl sm:text-3xl font-mono font-bold leading-none select-none transition-colors ${
                      isActive ? 'text-[#FE6E00]' : 'text-[#D1D5DC]'
                    }`}
                  >
                    {feature.number}
                  </span>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                          isActive ? 'text-[#423D38]' : 'text-[#423D38]/85'
                        }`}
                      >
                        {feature.title}
                      </h3>
                      {isActive && (
                        <span className="text-[11px] font-mono text-[#FE6E00] flex items-center gap-1 font-bold">
                          Active View
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm leading-relaxed transition-colors ${
                        isActive ? 'text-[#423D38]' : 'text-[#797067]'
                      }`}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Rounded Panel holding one large phone mockup that updates */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-28">
          <div className="w-full rounded-2xl bg-[#F3F4F6] border border-[#E3E0DD] p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FE6E00]/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Top Device Header Tag */}
            <div className="w-full flex items-center justify-between text-xs font-mono text-[#797067] mb-6 pb-3 border-b border-[#E3E0DD]">
              <span className="flex items-center gap-1.5 text-[#423D38] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C758]" />
                Live Mobile View
              </span>
              <span className="text-[#FE6E00] font-bold">
                Feature {currentFeature.number}
              </span>
            </div>

            {/* Interactive Phone Mockup */}
            <PhoneMockup
              screen={currentFeature.screen}
              badge={currentFeature.badge}
              className="transform hover:scale-[1.01] transition-transform"
            />
          </div>
        </div>
      </div>

      {/* "Also:" Row of Outline Chips */}
      <div className="mt-16 pt-8 border-t border-[#E3E0DD] space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-mono uppercase text-[#797067] font-bold mr-1">
            Also:
          </span>
          {secondaryFeatures.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full bg-white border border-[#E3E0DD] text-xs font-mono text-[#423D38] hover:border-[#FE6E00] transition-colors cursor-default shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Gray fine print */}
        <p className="text-xs text-[#797067] font-mono">
          Full functionality deployed across Chromium, Safari, iOS 17+, Android 14+, watchOS 10+, and air-gapped Linux/Docker mission servers.
        </p>
      </div>
    </section>
  );
};
