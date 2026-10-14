import React from 'react';
import { Satellite, ArrowUp } from 'lucide-react';

interface FooterHalftoneProps {
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
}

export const FooterHalftone: React.FC<FooterHalftoneProps> = ({
  currentLang = 'en',
  onLanguageChange,
}) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ne', name: 'नेपाली' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ja', name: '日本語' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-black/90 backdrop-blur-[12px] pt-16 pb-0 overflow-hidden text-white/70 select-none">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Footer Row: Wordmark Left, Back to Top Right */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FE6E00]/20 border border-[#FE6E00]/40 flex items-center justify-center text-[#FE6E00]">
                <Satellite className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SETU</span>
              <span className="text-xs font-mono text-[#FFB74D] font-bold">
                EVREGHEN COMMAND
              </span>
            </div>
            <p className="text-xs text-white/60 max-w-md">
              Satellite Emergency Triage for Unreachable Villages. Rapid SAR radar flood
              cut-off mapping and tactical decision workflows.
            </p>
          </div>

          {/* Right-aligned "Back to Top ↑" */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white transition-all group shrink-0"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Wrapped Row of Language Links with Current Highlighted */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono">
          <span className="text-white/50 uppercase text-[10px] font-semibold mr-1">
            Language:
          </span>
          {languages.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onLanguageChange && onLanguageChange(lang.code)}
                className={`transition-colors ${
                  isSelected
                    ? 'text-[#FE6E00] font-bold underline underline-offset-4'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {lang.name}
              </button>
            );
          })}
        </div>

        {/* Row of Legal / Product Links */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/50">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#features" className="hover:text-white transition-colors">
              Documentation
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Cryptographic Audit
            </a>
            <a href="#get-started" className="hover:text-white transition-colors">
              Copernicus Sentinel Data Terms
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              NDRRMA Protocol Interoperability
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Privacy & Local Retention
            </a>
          </div>

          <div className="text-[11px] text-white/50">
            © 2026 SETU Project · Evreghen Command Center Architecture.
          </div>
        </div>
      </div>

      {/* Oversized Halftone / Dotted Rendition of Brand Name "SETU" Cropped by Page Edge */}
      <div className="w-full overflow-hidden mt-12 pointer-events-none select-none flex justify-center opacity-40 hover:opacity-60 transition-opacity">
        <svg
          viewBox="0 0 1200 240"
          className="w-full max-w-[1400px] h-32 sm:h-44 md:h-56 translate-y-6 sm:translate-y-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="halftone-pattern"
              x="0"
              y="0"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="8" cy="8" r="3.2" fill="#262626" />
              <circle cx="8" cy="8" r="1.4" fill="#FE6E00" fillOpacity="0.5" />
            </pattern>
            <mask id="setu-text-mask">
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                fontSize="220"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, sans-serif"
                fill="white"
                letterSpacing="12"
              >
                SETU
              </text>
            </mask>
          </defs>

          {/* Halftone patterned text fill */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#halftone-pattern)"
            mask="url(#setu-text-mask)"
          />

          {/* Faint ambient hairline border contour around masked letters */}
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            fontSize="220"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.5"
            fill="none"
            letterSpacing="12"
          >
            SETU
          </text>
        </svg>
      </div>
    </footer>
  );
};
