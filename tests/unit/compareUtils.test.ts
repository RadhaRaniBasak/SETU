import { describe, it, expect } from 'vitest';
import {
  clampPercent,
  stepPercent,
  formatRadarDate,
  percentToViewBoxX,
  MapViewMetrics,
} from '../../src/utils/compareUtils.ts';
import { TRISHULI_SCENARIO } from '../../src/data/trishuliScenario.ts';

describe('compareUtils: clampPercent', () => {
  it('keeps values inside 0-100', () => {
    expect(clampPercent(-5)).toBe(0);
    expect(clampPercent(0)).toBe(0);
    expect(clampPercent(37.5)).toBe(37.5);
    expect(clampPercent(100)).toBe(100);
    expect(clampPercent(140)).toBe(100);
  });

  it('falls back to the 50 default for non-finite input', () => {
    expect(clampPercent(NaN)).toBe(50);
    expect(clampPercent(Infinity)).toBe(50);
  });
});

describe('compareUtils: stepPercent (keyboard)', () => {
  it('moves by 2 with arrow keys and by 10 with Shift', () => {
    expect(stepPercent(50, 'ArrowRight')).toBe(52);
    expect(stepPercent(50, 'ArrowUp')).toBe(52);
    expect(stepPercent(50, 'ArrowLeft')).toBe(48);
    expect(stepPercent(50, 'ArrowDown')).toBe(48);
    expect(stepPercent(50, 'ArrowRight', true)).toBe(60);
    expect(stepPercent(50, 'ArrowLeft', true)).toBe(40);
  });

  it('jumps to the ends with Home and End', () => {
    expect(stepPercent(50, 'Home')).toBe(0);
    expect(stepPercent(50, 'End')).toBe(100);
  });

  it('never leaves 0-100', () => {
    expect(stepPercent(1, 'ArrowLeft')).toBe(0);
    expect(stepPercent(98, 'ArrowRight', true)).toBe(100);
  });

  it('returns null for keys the slider does not handle', () => {
    expect(stepPercent(50, 'a')).toBeNull();
    expect(stepPercent(50, 'Tab')).toBeNull();
  });
});

describe('compareUtils: formatRadarDate', () => {
  it('formats ISO dates for labels', () => {
    expect(formatRadarDate('2026-08-14')).toBe('14 Aug 2026');
    expect(formatRadarDate('2026-08-05')).toBe('5 Aug 2026');
  });

  it('returns anything that is not an ISO date unchanged', () => {
    expect(formatRadarDate('14 Aug')).toBe('14 Aug');
    expect(formatRadarDate('2026-13-01')).toBe('2026-13-01');
    expect(formatRadarDate('')).toBe('');
  });

  it('labels the radar pair that is stored in the scenario data', () => {
    expect(formatRadarDate(TRISHULI_SCENARIO.orbitPair.preEventDate)).toBe('14 Aug 2026');
    expect(formatRadarDate(TRISHULI_SCENARIO.orbitPair.postEventDate)).toBe('26 Aug 2026');
  });
});

describe('compareUtils: percentToViewBoxX (screen divider -> SVG clip edge)', () => {
  const base: MapViewMetrics = {
    width: 1000,
    height: 500,
    viewWidth: 1000,
    viewHeight: 500,
    zoom: 1,
    panX: 0,
  };

  /** The map's own forward transform: SVG user x -> screen x. */
  const toScreen = (u: number, v: MapViewMetrics) => {
    const fit = Math.min(v.width / v.viewWidth, v.height / v.viewHeight);
    const letterboxX = (v.width - v.viewWidth * fit) / 2;
    return v.panX + v.zoom * (letterboxX + fit * u);
  };

  it('is the identity when the container matches the viewBox and the map is untouched', () => {
    expect(percentToViewBoxX(0, base)).toBe(0);
    expect(percentToViewBoxX(50, base)).toBe(500);
    expect(percentToViewBoxX(100, base)).toBe(1000);
  });

  it('keeps the centre at the centre when the viewBox is letterboxed', () => {
    expect(percentToViewBoxX(50, { ...base, width: 400, height: 800 })).toBeCloseTo(500);
    expect(percentToViewBoxX(50, { ...base, width: 1000, height: 200 })).toBeCloseTo(500);
  });

  it('undoes zoom and pan', () => {
    // 50% of 1000px = screen x 500; (500 - (-100)) / 2 = 300
    expect(percentToViewBoxX(50, { ...base, zoom: 2, panX: -100 })).toBe(300);
  });

  it('round-trips through the map transform for any view, zoom and pan', () => {
    const views: MapViewMetrics[] = [
      base,
      { ...base, width: 390, height: 591 },
      { ...base, width: 576, height: 736, zoom: 1.5, panX: 112 },
      { ...base, width: 1280, height: 400, zoom: 0.75, panX: -40 },
      { ...base, width: 390, height: 591, zoom: 3.5, panX: -600 },
    ];
    for (const v of views) {
      for (const pct of [0, 12.5, 50, 87, 100]) {
        const u = percentToViewBoxX(pct, v);
        expect(toScreen(u, v)).toBeCloseTo((pct / 100) * v.width, 6);
      }
    }
  });

  it('clamps an out-of-range percent', () => {
    expect(percentToViewBoxX(150, base)).toBe(1000);
    expect(percentToViewBoxX(-20, base)).toBe(0);
  });
});
