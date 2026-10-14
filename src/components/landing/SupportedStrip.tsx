import React from 'react';
import { ArrowRight, Satellite, Database, Map, Radio, Shield } from 'lucide-react';

interface SupportedStripProps {
  onConnectFeedClick?: () => void;
}

export const SupportedStrip: React.FC<SupportedStripProps> = ({
  onConnectFeedClick,
}) => {
  const integrations = [
    { name: 'Copernicus S-1A', tag: 'ESA SAR', icon: Satellite },
    { name: 'Nepal NDRRMA', tag: 'Gov Disaster Portal', icon: Shield },
    { name: 'OpenStreetMap', tag: 'ohsome API', icon: Map },
    { name: 'ICIMOD Hi-RISK', tag: 'Cryosphere Hub', icon: Radio },
    { name: 'WorldDEM-30', tag: 'DLR / Airbus', icon: Database },
    { name: 'WFP Logistics', tag: 'UN Choke-Points', icon: Map },
  ];

  return (
    <div className="w-full border-y border-[#E3E0DD] bg-[#F3F4F6] py-3.5 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Uppercase SUPPORTED label + Integration wordmarks */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 sm:gap-x-8 gap-y-3">
          <span className="text-[11px] font-mono tracking-widest text-[#797067] uppercase font-bold">
            FEEDS & INTEGRATIONS
          </span>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {integrations.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-xs font-mono text-[#797067] hover:text-[#423D38] transition-colors cursor-default"
                >
                  <Icon className="w-3.5 h-3.5 text-[#FE6E00]" />
                  <span className="font-semibold text-[#423D38]">{item.name}</span>
                  <span className="text-[10px] text-[#797067] hidden lg:inline">
                    ({item.tag})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Orange text link */}
        <a
          href="#get-started"
          onClick={onConnectFeedClick}
          className="text-xs font-mono font-bold text-[#FE6E00] hover:text-[#FF6B00] transition-colors flex items-center gap-1.5 shrink-0 group"
        >
          <span>Connect custom feeds</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};
