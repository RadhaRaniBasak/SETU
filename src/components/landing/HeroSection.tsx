import React from 'react';
import {
  Satellite,
  Play,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { FeltHeroStudioPreview } from './FeltHeroStudioPreview.tsx';

interface HeroSectionProps {
  onLaunchConsole: () => void;
  lang?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchConsole,
  lang = 'en',
}) => {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 px-4 sm:px-8 overflow-hidden bg-[#FCFAF7]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Mascot, Two-Tone Headline, Subline, CTAs */}
        <div className="lg:col-span-6 space-y-6 text-left">
          {/* Small Mascot Icon Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-[#E3E0DD] shadow-sm text-xs">
            <span className="w-5 h-5 rounded-md bg-[#FE6E00]/15 flex items-center justify-center text-[#FE6E00]">
              <Satellite className="w-3.5 h-3.5" />
            </span>
            <span className="font-mono text-[11px] text-[#423D38] font-bold">
              Copernicus SAR Radar Pipeline v3.2
            </span>
          </div>

          {/* Two-Tone Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.08] font-sans text-[#423D38]">
            <span className="block">
              {lang === 'ne'
                ? 'स्वायत्त विपद् उद्धार वर्गीकरण।'
                : 'Autonomous disaster triage.'}
            </span>
            <span className="text-[#797067] block mt-1">
              {lang === 'ne'
                ? 'अन्तरिक्षदेखि दुर्गम बस्तीसम्म।'
                : 'From orbit to the last mile.'}
            </span>
          </h1>

          {/* Subline */}
          <p className="text-base sm:text-lg text-[#797067] max-w-xl leading-relaxed font-normal">
            When Himalayan monsoon floods wash away roads and bridges, SETU combines
            Sentinel-1 radar change detection with road network topology to pinpoint
            isolated villages in under 4 minutes. Zero cloud cover blindness. Zero guesswork.
          </p>

          {/* Two CTAs: Evreghen Primary Orange Button & Warm Bordered Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={onLaunchConsole}
              className="px-6 py-3 rounded-md bg-[#FE6E00] hover:bg-[#FF6B00] text-white font-semibold text-sm transition-all transform active:scale-95 shadow-md shadow-[#FE6E00]/25 flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Command Center</span>
            </button>

            <a
              href="#features"
              className="px-6 py-3 rounded-md bg-white text-[#423D38] hover:bg-[#F3F4F6] border border-[#E3E0DD] text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Explore Architecture</span>
              <span className="text-[#FE6E00]">↓</span>
            </a>
          </div>

          {/* Micro validation strip */}
          <div className="pt-4 flex items-center gap-5 text-xs text-[#797067] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00C758]" />
              <span className="text-[#423D38] font-medium">Air-Gap Mesh Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00C758]" />
              <span className="text-[#423D38] font-medium">Verified 92.3% F1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#FE6E00]">✦</span>
              <span className="text-[#423D38] font-medium">GIS Vector Canvas & Notes</span>
            </div>
          </div>
        </div>

        {/* Right Column: Felt Interactive Map Studio Canvas */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[520px] sm:min-h-[580px] pt-4 lg:pt-0">
          {/* Ambient warm orange and soft glow behind canvas */}
          <div className="absolute w-96 h-96 rounded-full bg-[#FE6E00]/10 blur-[120px] pointer-events-none" />
          <div className="absolute w-72 h-72 rounded-full bg-[#FFB74D]/10 blur-[100px] pointer-events-none -bottom-10" />

          {/* Interactive Felt Map Studio Preview */}
          <div className="relative z-10 w-full flex flex-col items-center">
            <FeltHeroStudioPreview onOpenStudio={onLaunchConsole} />
          </div>
        </div>
      </div>
    </section>
  );
};
