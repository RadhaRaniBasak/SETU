import React, { useState, useMemo } from 'react';
import { TrendingUp, Info } from 'lucide-react';

export type RangeKey = '7d' | '30d' | '90d';

export interface DataPoint {
  label: string;
  seriesA: number;
  seriesB: number;
}

export interface RangeDataset {
  range: RangeKey;
  totalDisplay: string;
  deltaDisplay: string;
  deltaPeriod: string;
  data: DataPoint[];
}

interface AnalyticsChartCardProps {
  title?: string;
  seriesAName?: string;
  seriesBName?: string;
  seriesAColor?: string;
  seriesBColor?: string;
  datasets?: Record<RangeKey, RangeDataset>;
  className?: string;
}

// Built-in emergency triage and sensor throughput datasets
const DEFAULT_DATASETS: Record<RangeKey, RangeDataset> = {
  '7d': {
    range: '7d',
    totalDisplay: '1,482 actions',
    deltaDisplay: '+14.8%',
    deltaPeriod: 'vs last 7 days',
    data: [
      { label: 'Mon', seriesA: 92, seriesB: 68 },
      { label: 'Tue', seriesA: 124, seriesB: 88 },
      { label: 'Wed', seriesA: 178, seriesB: 112 },
      { label: 'Thu', seriesA: 210, seriesB: 145 },
      { label: 'Fri', seriesA: 184, seriesB: 130 },
      { label: 'Sat', seriesA: 142, seriesB: 95 },
      { label: 'Sun', seriesA: 110, seriesB: 76 },
    ],
  },
  '30d': {
    range: '30d',
    totalDisplay: '6,840 actions',
    deltaDisplay: '+21.3%',
    deltaPeriod: 'vs prior 30 days',
    data: [
      { label: 'W1 (Sep 14)', seriesA: 640, seriesB: 420 },
      { label: 'W2 (Sep 21)', seriesA: 820, seriesB: 560 },
      { label: 'W3 (Sep 28)', seriesA: 1150, seriesB: 780 },
      { label: 'W4 (Oct 05)', seriesA: 980, seriesB: 690 },
      { label: 'W5 (Oct 12)', seriesA: 720, seriesB: 510 },
    ],
  },
  '90d': {
    range: '90d',
    totalDisplay: '22,450 actions',
    deltaDisplay: '+34.2%',
    deltaPeriod: 'vs prior 90 days',
    data: [
      { label: 'Jul H2', seriesA: 1650, seriesB: 1120 },
      { label: 'Aug H1', seriesA: 1980, seriesB: 1340 },
      { label: 'Aug H2 (Flood)', seriesA: 3420, seriesB: 2450 },
      { label: 'Sep H1', seriesA: 2890, seriesB: 2110 },
      { label: 'Sep H2', seriesA: 2140, seriesB: 1530 },
      { label: 'Oct H1', seriesA: 1780, seriesB: 1240 },
    ],
  },
};

export const AnalyticsChartCard: React.FC<AnalyticsChartCardProps> = ({
  title = 'Triage & Sensor Throughput',
  seriesAName = 'Radar Change Detections',
  seriesBName = 'Cut-off Route Dispatches',
  datasets = DEFAULT_DATASETS,
  className = '',
}) => {
  const [selectedRange, setSelectedRange] = useState<RangeKey>('7d');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const ranges: RangeKey[] = ['7d', '30d', '90d'];
  const currentDataset = datasets[selectedRange];

  const maxTotal = useMemo(() => {
    const totals = currentDataset.data.map((d) => d.seriesA + d.seriesB);
    return Math.max(...totals, 1);
  }, [currentDataset]);

  return (
    <div
      className={`bg-white border border-[#E3E0DD] rounded-xl p-5 shadow-sm text-[#423D38] flex flex-col justify-between ${className}`}
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E0DD]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-tight text-[#423D38] uppercase font-mono">
              {title}
            </h3>
            <span
              className="text-[#797067] hover:text-[#423D38] transition-colors cursor-help"
              title="Continuous tally of SAR change detections & rescue route dispatch allocations"
            >
              <Info className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#423D38] tracking-tight tabular-nums">
              {currentDataset.totalDisplay}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#016630] bg-[#DCFCE7] border border-[#016630]/20 px-2 py-0.5 rounded-full font-mono">
              <TrendingUp className="w-3 h-3 text-[#016630]" />
              <span>{currentDataset.deltaDisplay}</span>
            </span>
            <span className="text-[11px] text-[#797067] font-medium">
              {currentDataset.deltaPeriod}
            </span>
          </div>
        </div>

        {/* Segmented Range Picker */}
        <div
          role="tablist"
          aria-label="Time range selector"
          className="relative inline-flex items-center bg-[#EDEBE9] p-0.5 rounded-lg border border-[#E3E0DD] self-start sm:self-center"
        >
          {ranges.map((range) => {
            const isActive = selectedRange === range;
            return (
              <button
                key={range}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedRange(range)}
                className={`relative px-3 py-1 text-xs font-mono font-semibold rounded-md transition-all duration-200 z-10 ${
                  isActive
                    ? 'bg-[#FE6E00] text-white shadow-sm'
                    : 'text-[#797067] hover:text-[#423D38]'
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Body */}
      <div className="pt-6 pb-2">
        <div className="flex row items-end justify-between gap-2 sm:gap-4 h-48 sm:h-56 w-full px-1">
          {currentDataset.data.map((item, index) => {
            const total = item.seriesA + item.seriesB;
            const columnHeightPercent = (total / maxTotal) * 100;
            const seriesAPercent = (item.seriesA / total) * 100;
            const seriesBPercent = (item.seriesB / total) * 100;

            const isHovered = hoveredIndex === index;
            const exactTooltip = `${item.label}: Total ${total} (${seriesAName}: ${item.seriesA}, ${seriesBName}: ${item.seriesB})`;

            return (
              <div
                key={item.label}
                title={exactTooltip}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative"
              >
                {/* Floating Tooltip Pill on Hover */}
                {isHovered && (
                  <div className="absolute -top-11 z-30 bg-black/90 border border-[#FE6E00] rounded-lg px-2.5 py-1 shadow-2xl text-center pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-bold text-white font-mono">
                      {item.label}: <span className="text-[#FFB74D]">{total}</span>
                    </div>
                    <div className="text-[9px] text-white/70 font-mono">
                      {item.seriesA} / {item.seriesB}
                    </div>
                  </div>
                )}

                {/* Column */}
                <div
                  className="w-full max-w-[28px] sm:max-w-[42px] flex flex-col justify-end items-end rounded-t-sm overflow-hidden transition-all duration-500 ease-out group-hover:brightness-110"
                  style={{ height: `${Math.max(columnHeightPercent, 4)}%` }}
                >
                  {/* Top Div: Series A */}
                  <div
                    className="w-full bg-[#FE6E00] transition-all duration-500"
                    style={{ height: `${seriesAPercent}%` }}
                  />

                  {/* Bottom Div: Series B (rgba(254, 110, 0, 0.60)) */}
                  <div
                    className="w-full bg-[#FE6E00]/60 transition-all duration-500"
                    style={{ height: `${seriesBPercent}%` }}
                  />
                </div>

                {/* X-Axis Label */}
                <span
                  className={`text-[10px] sm:text-xs font-mono mt-2 truncate max-w-full text-center transition-colors duration-150 ${
                    isHovered ? 'text-[#FE6E00] font-semibold' : 'text-[#797067]'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Row */}
      <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 mt-2 border-t border-[#E3E0DD] text-xs text-[#797067] font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#FE6E00]" />
          <span className="text-[#423D38]">{seriesAName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-xs bg-[#FE6E00]/60" />
          <span className="text-[#423D38]">{seriesBName}</span>
        </div>
      </div>
    </div>
  );
};
