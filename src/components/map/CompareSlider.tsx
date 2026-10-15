import React, { useRef } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { clampPercent, stepPercent } from '../../utils/compareUtils.ts';

interface CompareSliderProps {
  /** Divider position, percent of the map width (0-100). */
  position: number;
  onChange: (percent: number) => void;
  beforeDate?: string;
  afterDate?: string;
}

const stopMapEvent = (e: React.SyntheticEvent) => e.stopPropagation();

export const CompareSlider: React.FC<CompareSliderProps> = ({
  position,
  onChange,
  beforeDate,
  afterDate,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  // Distance (px) between the pointer and the divider centre when a drag starts, so the handle doesn't jump.
  const grabOffset = useRef(0);

  const rounded = Math.round(position);

  const moveTo = (clientX: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect && rect.width > 0) {
      onChange(clampPercent(((clientX - grabOffset.current - rect.left) / rect.width) * 100));
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = rootRef.current?.getBoundingClientRect();
    grabOffset.current = rect ? e.clientX - (rect.left + (position / 100) * rect.width) : 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const next = stepPercent(position, e.key, e.shiftKey);
    if (next !== null) {
      e.preventDefault();
      onChange(next);
    }
  };

  const pill =
    'absolute top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg border text-[10px] font-mono leading-tight shadow-lg backdrop-blur-[12px]';

  return (
    <div ref={rootRef} className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 z-10">
        {/* Each label is clipped to its own side so it never spills across the divider. */}
        <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${position}%` }}>
          <div className={`${pill} right-8 bg-black/80 border-white/20 text-white`}>
            <div className="font-bold">Before</div>
            {beforeDate && <div className="text-white/70">{beforeDate}</div>}
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 overflow-hidden" style={{ width: `${100 - position}%` }}>
          <div className={`${pill} left-8 bg-[#FE6E00] border-[#FF6B00] text-white`}>
            <div className="font-bold">After</div>
            {afterDate && <div className="text-white/80">{afterDate}</div>}
          </div>
        </div>

        <div className="absolute inset-y-0 w-0" style={{ left: `${position}%` }}>
          <div className="absolute inset-y-0 -left-px w-0.5 bg-[#FE6E00] shadow-[0_0_8px_rgba(254,110,0,0.7)]" />
        </div>
      </div>

      {/* The handle sits above the map HUD cards so it can never be covered and stays reachable. */}
      <div className="absolute inset-y-0 w-0 z-30" style={{ left: `${position}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Compare before and after"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          aria-valuetext={`Divider at ${rounded}%. Left shows before${
            beforeDate ? `, ${beforeDate}` : ''
          }. Right shows after${afterDate ? `, ${afterDate}` : ''}.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onKeyDown={onKeyDown}
          // The map pans on mouse-down and runs the active tool on click; keep both away from the handle.
          onMouseDown={stopMapEvent}
          onClick={stopMapEvent}
          className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FE6E00] border-2 border-white text-white flex items-center justify-center shadow-lg pointer-events-auto cursor-ew-resize touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <ChevronsLeftRight className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
