import React, { useState, useEffect } from 'react';
import { TopNav } from './TopNav.tsx';
import { HeroSection } from './HeroSection.tsx';
import { SupportedStrip } from './SupportedStrip.tsx';
import { FeaturesSection } from './FeaturesSection.tsx';
import { AppleWatchSection } from './AppleWatchSection.tsx';
import { DataSecuritySection } from './DataSecuritySection.tsx';
import { GetStartedSection } from './GetStartedSection.tsx';
import { FaqSection } from './FaqSection.tsx';
import { FooterHalftone } from './FooterHalftone.tsx';

interface SETULandingPageProps {
  onLaunchConsole: () => void;
}

export const SETULandingPage: React.FC<SETULandingPageProps> = ({
  onLaunchConsole,
}) => {
  const [lang, setLang] = useState<string>('en');
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Track scroll position to update active timeline ring node
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'watch', 'security', 'get-started', 'faq'];
      const scrollPos = window.scrollY + 250;

      for (const sectionId of sections) {
        if (sectionId === 'hero') continue;
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 400) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const timelineNodes = [
    { id: 'top', label: '00', title: 'Top / Hero', section: 'hero' },
    { id: 'features', label: '01', title: 'Features', section: 'features' },
    { id: 'watch', label: '02', title: 'Apple Watch', section: 'watch' },
    { id: 'security', label: '03', title: 'Security', section: 'security' },
    { id: 'get-started', label: '04', title: 'Get Started', section: 'get-started' },
    { id: 'faq', label: '05', title: 'FAQ', section: 'faq' },
  ];

  return (
    <div
      id="top"
      className="relative min-h-screen bg-[#FCFAF7] text-[#423D38] font-sans selection:bg-[#FE6E00]/30 selection:text-[#FE6E00] overflow-x-hidden"
    >
      {/* Top Navigation in Evreghen Frosted Shell */}
      <TopNav
        onLaunchConsole={onLaunchConsole}
        currentLang={lang}
        onLanguageChange={(newLang) => setLang(newLang)}
      />

      {/* Main Container with Left Margin Timeline Rail on Desktop */}
      <div className="relative">
        {/* Faint Dotted Vertical Rail with Small Ring Nodes down the left margin */}
        <aside
          aria-label="Section Timeline"
          className="hidden 2xl:flex fixed left-8 top-32 bottom-20 z-40 flex-col items-center justify-center pointer-events-none"
        >
          {/* Vertical Dotted Line */}
          <div className="absolute top-0 bottom-0 w-[1px] border-l border-dashed border-[#E3E0DD]" />

          {/* Interactive Ring Nodes */}
          <div className="relative flex flex-col justify-between h-[420px] pointer-events-auto">
            {timelineNodes.map((node) => {
              const isActive = activeSection === node.section;
              return (
                <a
                  key={node.id}
                  href={`#${node.id}`}
                  title={`${node.label} · ${node.title}`}
                  className="group flex items-center gap-3 relative transition-all"
                >
                  {/* Outer Ring Node */}
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 bg-[#FCFAF7] ${
                      isActive
                        ? 'border-[#FE6E00] ring-2 ring-[#FE6E00]/20 scale-125'
                        : 'border-[#D1D5DC] group-hover:border-[#797067]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isActive ? 'bg-[#FE6E00]' : 'bg-transparent group-hover:bg-[#797067]'
                      }`}
                    />
                  </span>

                  {/* Flyout Label on Hover or Active */}
                  <span
                    className={`text-[10px] font-mono tracking-wider transition-all uppercase whitespace-nowrap px-2 py-0.5 rounded bg-white border border-[#E3E0DD] shadow-sm ${
                      isActive
                        ? 'text-[#FE6E00] opacity-100 font-bold border-[#FE6E00]/40'
                        : 'text-[#797067] opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {node.label} · {node.title}
                  </span>
                </a>
              );
            })}
          </div>
        </aside>

        {/* Page Content Stream */}
        <main>
          {/* Hero Section */}
          <HeroSection onLaunchConsole={onLaunchConsole} lang={lang} />

          {/* Supported Strip */}
          <SupportedStrip onConnectFeedClick={onLaunchConsole} />

          {/* 01 · Features */}
          <FeaturesSection />

          {/* 02 · Apple Watch */}
          <AppleWatchSection />

          {/* 03 · Data & Security */}
          <DataSecuritySection />

          {/* 04 · Get Started */}
          <GetStartedSection onLaunchConsole={onLaunchConsole} />

          {/* 05 · FAQ */}
          <FaqSection />
        </main>
      </div>

      {/* Footer with Halftone Brand Signature */}
      <FooterHalftone
        currentLang={lang}
        onLanguageChange={(newLang) => setLang(newLang)}
      />
    </div>
  );
};
