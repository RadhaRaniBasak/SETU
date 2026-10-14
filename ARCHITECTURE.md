# Architecture: SETU Geospatial Triage System

## 1. System Overview
SETU operates as a full-stack geospatial disaster triage application built on Express and React 19 with Vite, integrating Copernicus Sentinel-1/2 data, Copernicus WorldDEM-30 elevation data, pre-event OpenStreetMap snapshots via ohsome API, and a server-side Gemini 3.8 Flash copilot guarded by a zero-hallucination numerical AST validator.

---

## 2. Technology Stack
- Frontend: React 19, TypeScript, Tailwind CSS 4, Lucide React, Motion.
- Backend / API: Express 4, tsx, Node.js.
- AI Model: `@google/genai` with `gemini-3.8-flash` (Server-Side ONLY).
- Geospatial & Analytics:
  - Copernicus Data Space STAC / OData query client.
  - Sentinel-1 GRD SAR log-ratio change detection engine.
  - Copernicus DEM D8 hydrological steepest-descent path router.
  - NetworkX-style topological road network graph with Dijkstra connected components.
  - Strict AST numerical validator (Devanagari & Latin digit parser).

---

## 3. Data Flow
1. User selects AOI (Trishuli Corridor or custom bounding box) and event date (2026-08-26).
2. Engine retrieves same-orbit Sentinel-1 radar pairs (Pre: 2026-08-14, Post: 2026-08-26) to eliminate mountain angle distortion.
3. Radar log-ratio change mask is filtered with Copernicus DEM slope (>15°) and radar layover mask.
4. Pre-event OSM infrastructure (2026-07-27 snapshot) is intersected to identify breached bridges and inundated highways.
5. Road connectivity graph is pruned of severed edges; connected components identifies cut-off villages and identifies isolating choke points.
6. Copilot generates bilingual briefing strictly verified against computed ground truth facts.

---

## 4. Security & Compliance
- API keys are stored server-side only in environment variables (`GEMINI_API_KEY` or `NLP_API_KEY`).
- No sensitive keys or ungrounded statistics exposed to client.
