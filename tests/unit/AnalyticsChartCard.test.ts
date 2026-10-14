import { describe, it, expect } from 'vitest';

interface DataPoint {
  label: string;
  seriesA: number;
  seriesB: number;
}

function calculateMaxTotal(data: DataPoint[]): number {
  const totals = data.map((d) => d.seriesA + d.seriesB);
  return Math.max(...totals, 1);
}

function computeBarPercentages(item: DataPoint, maxTotal: number) {
  const total = item.seriesA + item.seriesB;
  const columnHeightPercent = (total / maxTotal) * 100;
  const seriesAPercent = (item.seriesA / total) * 100;
  const seriesBPercent = (item.seriesB / total) * 100;
  return { columnHeightPercent, seriesAPercent, seriesBPercent };
}

describe('AnalyticsChartCard data scaling logic', () => {
  const sample7d = [
    { label: 'Mon', seriesA: 92, seriesB: 68 },
    { label: 'Tue', seriesA: 124, seriesB: 88 },
    { label: 'Wed', seriesA: 178, seriesB: 112 },
    { label: 'Thu', seriesA: 210, seriesB: 145 }, // largest total = 355
    { label: 'Fri', seriesA: 184, seriesB: 130 },
  ];

  it('calculates the maximum total correctly across columns', () => {
    const maxTotal = calculateMaxTotal(sample7d);
    expect(maxTotal).toBe(355);
  });

  it('scales the largest column to 100% height', () => {
    const maxTotal = calculateMaxTotal(sample7d);
    const largestItem = sample7d[3];
    const { columnHeightPercent } = computeBarPercentages(largestItem, maxTotal);
    expect(columnHeightPercent).toBe(100);
  });

  it('correctly partitions series A and B percentages summing to 100%', () => {
    const maxTotal = calculateMaxTotal(sample7d);
    const item = sample7d[0]; // 92 and 68 -> total 160
    const { seriesAPercent, seriesBPercent } = computeBarPercentages(item, maxTotal);
    expect(seriesAPercent + seriesBPercent).toBeCloseTo(100);
    expect(seriesAPercent).toBe((92 / 160) * 100);
    expect(seriesBPercent).toBe((68 / 160) * 100);
  });
});
