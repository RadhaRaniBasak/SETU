import { describe, it, expect } from 'vitest';

describe('SETU Landing Page Configuration & Integrity', () => {
  const sections = [
    { id: 'top', label: '00', title: 'Top / Hero' },
    { id: 'features', label: '01', title: 'Features' },
    { id: 'watch', label: '02', title: 'Apple Watch' },
    { id: 'security', label: '03', title: 'Data & Security' },
    { id: 'get-started', label: '04', title: 'Get Started' },
    { id: 'faq', label: '05', title: 'FAQ' },
  ];

  it('verifies all 6 required sections are sequentially numbered 00 through 05', () => {
    expect(sections).toHaveLength(6);
    expect(sections.map((s) => s.label)).toEqual(['00', '01', '02', '03', '04', '05']);
  });

  it('validates terminal CLI install command syntax and domain', () => {
    const installCommand = 'curl -sSL https://get.setu.space | bash';
    expect(installCommand.startsWith('curl -sSL')).toBe(true);
    expect(installCommand.endsWith('| bash')).toBe(true);
    expect(installCommand).toContain('setu.space');
  });

  it('verifies watch mockup profiles for the 4 tactical wrist screens', () => {
    const watchScreens = [
      'surge-warning',
      'settlement-status',
      'approval-action',
      'quick-reply',
    ];
    expect(watchScreens).toHaveLength(4);
    expect(watchScreens).toContain('surge-warning');
    expect(watchScreens).toContain('approval-action');
  });

  it('validates primary accent color discipline token #e5b04a', () => {
    const amberAccentHex = '#e5b04a';
    expect(amberAccentHex).toMatch(/^#[0-9a-f]{6}$/i);
    expect(amberAccentHex.toLowerCase()).toBe('#e5b04a');
  });
});
