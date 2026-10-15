/** Keep a divider position inside 0-100. Non-finite input falls back to the 50 default. */
export function clampPercent(n: number): number {
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 50;
}

const KEY_STEP = 2;
const KEY_STEP_LARGE = 10;

/** New divider position for a slider key press, or null if the key is not one the slider handles. */
export function stepPercent(current: number, key: string, shift = false): number | null {
  const step = shift ? KEY_STEP_LARGE : KEY_STEP;
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      return clampPercent(current - step);
    case 'ArrowRight':
    case 'ArrowUp':
      return clampPercent(current + step);
    case 'Home':
      return 0;
    case 'End':
      return 100;
    default:
      return null;
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-08-14' -> '14 Aug 2026'. Anything that is not an ISO date is returned unchanged. */
export function formatRadarDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  const month = m ? MONTHS[Number(m[2]) - 1] : undefined;
  return m && month ? `${Number(m[3])} ${month} ${m[1]}` : iso;
}

export interface MapViewMetrics {
  /** Rendered size of the map container in px. */
  width: number;
  height: number;
  /** SVG viewBox size. */
  viewWidth: number;
  viewHeight: number;
  /** Map zoom and horizontal pan (px), applied as translate(pan) scale(zoom) from the top-left. */
  zoom: number;
  panX: number;
}

/**
 * Convert a divider position (percent of the container width, fixed on screen) into SVG user-space X,
 * undoing the map's pan, zoom and the viewBox's "meet" letterboxing. The caller must pass a
 * non-zero width and height.
 */
export function percentToViewBoxX(percent: number, v: MapViewMetrics): number {
  const screenX = (clampPercent(percent) / 100) * v.width;
  const fit = Math.min(v.width / v.viewWidth, v.height / v.viewHeight);
  const letterboxX = (v.width - v.viewWidth * fit) / 2;
  return ((screenX - v.panX) / v.zoom - letterboxX) / fit;
}
