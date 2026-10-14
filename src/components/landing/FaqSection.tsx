import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How does Sentinel-1 radar see through monsoon cloud cover?',
      answer:
        'Unlike optical satellites (Sentinel-2, Landsat) which are blocked by clouds, Sentinel-1 emits active C-band Synthetic Aperture Radar (SAR) microwaves at 5.405 GHz (5.6 cm wavelength). These waves pass freely through water droplets, dense clouds, precipitation, and nighttime darkness. Smooth standing water creates specular reflection scattering radar pulses away from the sensor, producing a sharp dark signature (-18 dB to -22 dB) compared to surrounding rough Himalayan terrain.',
    },
    {
      question: 'How do you prevent false positives on steep Himalayan mountainsides?',
      answer:
        'Steep mountain terrain causes geometric radar distortion, including radar shadow and foreshortening/layover. SETU integrates 30-meter Copernicus WorldDEM to mask out any slope steeper than 15°. Standing water cannot pool on steep slopes; by enforcing a topographic slope ceiling and strict log-ratio coherence thresholds, mountainous false positives are eliminated with a 92.3% verified F1 score against Copernicus EMSR927.',
    },
    {
      question: 'What happens if field rescue teams lose internet connectivity completely?',
      answer:
        'SETU is designed from the ground up for air-gapped deployment. The entire Trishuli corridor—including vector road networks, bridge choke-points, offline DEM elevation grids, and bilingual situation report templates—is cached on-device. Field units communicate via peer-to-peer LoRa radio mesh (915 MHz) and Bluetooth Low Energy, allowing dispatch authorizations and triage status updates without any cellular tower or cloud connectivity.',
    },
    {
      question: 'How does the bilingual Copilot avoid making up statistics or locations?',
      answer:
        'The SETU Copilot runs a dual-layer AST verification engine. It is strictly constrained to the ground-truth GIS database and pipeline metrics (e.g. 24.0 km² hazard area, 7 severed bridges, 3,420 isolated civilians across 7 villages). Before any response is rendered in Nepali or English, an automated auditor cross-checks every single numeral and village name against the system data structure; if any number is ungrounded, the response is regenerated.',
    },
    {
      question: 'Can SETU trace glacial lake outburst floods (GLOF) upstream in real time?',
      answer:
        'Yes. Users or field coordinators can click any upstream coordinate (such as a glacial lake moraine or tributary junction). SETU executes a deterministic D8 steepest descent hydrological flow routing down the valley, calculating peak surge velocity (e.g., 6.2 m/s), total elevation descent, transit hours to reach each downstream settlement, and bridges at risk of hydrodynamic scour.',
    },
    {
      question: 'How do SETU metrics compare with official Copernicus EMS activations?',
      answer:
        'In our August 2026 Trishuli flood case study benchmarked against Copernicus Emergency Management Service activation EMSR927, SETU identified 24.0 km² total hazard extent versus EMSR927’s 22.8 km² (92.3% F1 score, 91.5% IoU). Crucially, SETU’s automated topological analysis computed cut-off settlements in 3.8 seconds, compared to the 14-hour manual photo-interpretation delay of standard emergency activations.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1200px] mx-auto bg-[#FCFAF7]">
      {/* Numbered Section Label Pattern */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="px-2 py-0.5 rounded bg-[#FE6E00]/15 text-[#FE6E00] font-mono text-xs font-bold border border-[#FE6E00]/30">
          05
        </span>
        <span className="text-xs font-mono tracking-widest text-[#797067] uppercase font-bold">
          FAQ & TECHNICAL PRINCIPLES
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Headline "Good to know." + Context */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#423D38] leading-[1.15]">
            Good to know.
          </h2>
          <p className="text-base text-[#797067] leading-relaxed">
            Everything you need to know about SAR physics, tactical offline synchronization, and disaster field operations.
          </p>
          <div className="pt-4 text-xs font-mono text-[#797067]">
            Have a specialized tactical integration question?{' '}
            <a
              href="#get-started"
              className="text-[#FE6E00] hover:text-[#FF6B00] font-bold hover:underline"
            >
              Contact the engineering team →
            </a>
          </div>
        </div>

        {/* Right Column: Single-column accordion with hairline dividers and circular toggles */}
        <div className="lg:col-span-7 divide-y divide-[#E3E0DD] border-t border-b border-[#E3E0DD]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-5 transition-colors">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-4 text-left group"
                >
                  <span
                    className={`text-base font-bold transition-colors ${
                      isOpen ? 'text-[#423D38]' : 'text-[#423D38]/80 group-hover:text-[#423D38]'
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Circular + / - toggle */}
                  <span
                    className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen
                        ? 'bg-[#FE6E00] text-white border-[#FE6E00]'
                        : 'bg-white text-[#797067] border-[#E3E0DD] group-hover:border-[#FE6E00] group-hover:text-[#FE6E00]'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-3.5 pr-8 text-sm text-[#797067] leading-relaxed font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
