# Security Guidelines: SETU System

## 1. Credentials & Secrets
- **Server-Side API Proxying**: The Gemini API key (`GEMINI_API_KEY`) is strictly confined to `server.ts`. It is never exposed in client bundles or public endpoints.
- **Environment Isolation**: `.env.example` documents required environment variables without committing live secrets.

---

## 2. API Input Validation & Guardrails
- **Geographic Bounds Checking**: `/api/hydrology/trace` bounds-checks incoming coordinate inputs to ensure values remain within the valid Himalayan corridor (27.5°N - 28.6°N, 84.8°E - 85.8°E). Out-of-bounds queries return `400 Bad Request`.
- **Request Timeouts**: Upstream AI calls enforce an 8-10 second timeout promise race to prevent connection exhaustion.
- **Payload Limits**: JSON body parsing limited to safe defaults.

---

## 3. Data Integrity & Competition Rules
- **No Data Leakage**: Copernicus EMS EMSR927 damage maps are strictly sequestered to the post-run evaluation benchmark (`/api/pipeline/run` benchmark payload). They are never fed into the change detection or cut-off graph analysis.
- **Pre-Event OSM Snapshot**: Road networks frozen as of 27 July 2026 via ohsome API snapshot date. Post-event edits are disallowed.
