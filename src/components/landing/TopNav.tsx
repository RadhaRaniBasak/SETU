import React, { useState } from 'react';
import {
  Satellite,
  ChevronDown,
  Github,
  Globe,
  Terminal,
  ExternalLink,
  Smartphone,
  Play,
  Check,
} from 'lucide-react';

interface TopNavProps {
  onLaunchConsole: () => void;
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onLaunchConsole,
  currentLang = 'en',
  onLanguageChange,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/70 backdrop-blur-[12px] border-b border-white/10 px-4 sm:px-8 py-3 transition-all text-white">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Mascot Mark + Wordmark */}
        <a href="#top" className="flex items-center gap-3 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#FE6E00] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Satellite className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-white/90">
              SETU
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-[#FFB74D] font-semibold tracking-wider">
              EVREGHEN COMMAND
            </span>
          </div>
        </a>

        {/* Center: Anchor Links */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-7 text-[13px] font-medium text-white/70">
          <a
            href="#features"
            className="hover:text-white transition-colors duration-150"
          >
            Features
          </a>
          <a
            href="#watch"
            className="hover:text-white transition-colors duration-150"
          >
            Watch
          </a>
          <a
            href="#security"
            className="hover:text-white transition-colors duration-150"
          >
            Security
          </a>
          <a
            href="#get-started"
            className="hover:text-white transition-colors duration-150"
          >
            Get Started
          </a>
          <a
            href="#faq"
            className="hover:text-white transition-colors duration-150"
          >
            FAQ
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* GitHub Source Repo */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            title="View Source on GitHub"
            className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Language Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs text-white/80 hover:text-white hover:border-white/20 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-white/60" />
              <span className="font-mono uppercase text-[11px]">
                {currentLang === 'ne' ? 'नेपाली' : 'EN'}
              </span>
              <ChevronDown className="w-3 h-3 text-white/60" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-black/90 backdrop-blur-[12px] border border-white/15 p-1 shadow-2xl z-50 text-xs">
                <button
                  onClick={() => {
                    onLanguageChange && onLanguageChange('en');
                    setIsLangOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors ${
                    currentLang === 'en'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span>English</span>
                  {currentLang === 'en' && <Check className="w-3 h-3 text-[#FE6E00]" />}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange && onLanguageChange('ne');
                    setIsLangOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors ${
                    currentLang === 'ne'
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span>नेपाली (NP)</span>
                  {currentLang === 'ne' && <Check className="w-3 h-3 text-[#FE6E00]" />}
                </button>
              </div>
            )}
          </div>

          {/* Launch Mission Console Button */}
          <button
            onClick={onLaunchConsole}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#FE6E00] hover:bg-[#FF6B00] text-white font-semibold text-xs transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Console</span>
          </button>
        </div>
      </div>
    </header>
  );
};
