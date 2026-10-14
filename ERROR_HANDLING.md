# Error Handling Strategy: SETU

## 1. Client-Side Resilience
- **Offline / Local Fallback**: If the backend `/api/hydrology/trace` or `/api/copilot/query` is unreachable, the frontend automatically falls back to in-browser local calculation engines (`traceDownstreamValleyFlow` and deterministic verified ground truth responses).
- **Iframe Preview Resilience**: WebSocket reconnection events in embedded container previews are gracefully handled in `index.html`.

---

## 2. Server-Side Failure Scenarios
- **Gemini High Latency / Rate Limits**:
  - Protected with `generateWithTimeout(..., 8000)`.
  - On timeout or API error, seamlessly switches to `generateFallbackAnswer()` using verified ground truth stats.
  - The client still receives a 200 OK with fully audited statistics and a valid response.
- **Malformed Coordinates**:
  - Non-numeric or out-of-bounds coordinates return a descriptive 400 status with valid range limits.

---

## 3. UI Empty & Loading States
- **Recalculation Indicators**: System Latency badge displays rotating spinner and "Recalculating..." during slider drag.
- **Triage Queue Empty States**: Displays "All settlements connected" when no bridge cuts are active.
