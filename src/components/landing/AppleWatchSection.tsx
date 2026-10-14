import React from 'react';
import { WatchMockup } from './WatchMockup.tsx';

export const AppleWatchSection: React.FC = () => {
  return (
    <section id="watch" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1200px] mx-auto bg-[#FCFAF7]">
      {/* Numbered Section Label Pattern */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="px-2 py-0.5 rounded bg-[#FE6E00]/15 text-[#FE6E00] font-mono text-xs font-bold border border-[#FE6E00]/30">
          02
        </span>
        <span className="text-xs font-mono tracking-widest text-[#797067] uppercase font-bold">
          TACTICAL WEARABLES
        </span>
      </div>

      {/* Split Header: Headline Left, Supporting Paragraph Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline mb-14">
        <div className="lg:col-span-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#423D38] leading-[1.15]">
            Just raise your wrist.
          </h2>
        </div>
        <div className="lg:col-span-6">
          <p className="text-base sm:text-lg text-[#797067] leading-relaxed">
            Search-and-rescue teams operating in torrential monsoon downpours cannot
            fumble with laptops or fragile tablets. SETU synchronizes critical flash-flood
            arrival countdowns, cut-off village queues, and one-tap mission authorizations
            directly to tactical watch faces over local radio mesh.
          </p>
        </div>
      </div>

      {/* Wide Rounded Panel with Four Watch Mockups Side-by-Side */}
      <div className="rounded-2xl bg-[#F3F4F6] border border-[#E3E0DD] p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-48 bg-[#FE6E00]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 justify-items-center">
          <WatchMockup
            screen="surge-warning"
            caption="01 · Flash-Flood Countdown"
          />
          <WatchMockup
            screen="settlement-status"
            caption="02 · Village Cut-Off Status"
          />
          <WatchMockup
            screen="approval-action"
            caption="03 · Dispatch Authorization"
          />
          <WatchMockup
            screen="quick-reply"
            caption="04 · Tactical Radio Reply"
          />
        </div>
      </div>

      {/* Contextual Sub-caption */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#797067] gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C758]" />
          <span className="text-[#423D38] font-medium">Low-Energy Always-On Tactical Display</span>
        </span>
        <span className="text-[#FE6E00] font-bold">
          Operates via peer-to-peer Bluetooth LE & offline LoRa bridges
        </span>
      </div>
    </section>
  );
};
