
import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  TRISHULI_SCENARIO,
  TRISHULI_STATS,
  SETTLEMENTS_DATA,
  DAMAGED_BRIDGES,
  SUBMERGED_ROADS,
  HAZARD_POLYGONS,
  EMSR927_BENCHMARK_DATA,
} from './src/data/trishuliScenario.ts';
import { traceDownstreamValleyFlow } from './src/services/hydrologyService.ts';
import { validateCopilotText } from './src/services/validatorService.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Grounded NLP intelligence service client
const apiKey = process.env.GEMINI_API_KEY || process.env.NLP_API_KEY || '';
let nlpClient: GoogleGenAI | null = null;
if (apiKey) {
  nlpClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'SETU-Disaster-Command-Center/1.0',
      },
    },
  });
}

// Resilient request wrapper with 8s bounded timeout
async function generateWithTimeout(
  params: Parameters<NonNullable<typeof nlpClient>['models']['generateContent']>[0],
  timeoutMs = 8000
) {
  if (!nlpClient) return null;
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Inference request timeout exceeded')), timeoutMs)
  );
  return Promise.race([nlpClient.models.generateContent(params), timeoutPromise]);
}

// 1. System Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    nlpEngineReady: !!nlpClient,
    version: '1.0.0',
  });
});

// 2. Disaster Scenarios
app.get('/api/scenarios', (_req, res) => {
  res.json({
    scenarios: [TRISHULI_SCENARIO],
    activeId: TRISHULI_SCENARIO.id,
  });
});

// 3. Run Pipeline
app.post('/api/pipeline/run', (req, res) => {
  const { radarConfidenceThreshold = 0.65, slopeFilterDegrees = 15.0 } = req.body || {};

  // Filter hazard polygons by confidence
  const filteredPolygons = HAZARD_POLYGONS.filter(
    (p) => p.confidence >= radarConfidenceThreshold && p.slopeDegrees <= slopeFilterDegrees
  );

  res.json({
    scenario: TRISHULI_SCENARIO,
    stats: TRISHULI_STATS,
    settlements: SETTLEMENTS_DATA,
    damagedBridges: DAMAGED_BRIDGES,
    submergedRoads: SUBMERGED_ROADS,
    hazardPolygons: filteredPolygons,
    benchmarkEMSR927: EMSR927_BENCHMARK_DATA,
    pipelineParameters: {
      radarConfidenceThreshold,
      slopeFilterDegrees,
      sensor: 'Sentinel-1A C-band SAR',
      orbitTrack: 'Relative Orbit 121 (Ascending)',
      preDate: '2026-08-14',
      postDate: '2026-08-26',
      osmSnapshotDate: '2026-07-27T00:00:00Z (pre-event freeze)',
    },
  });
});

// 4. Hydrology Trace
app.post('/api/hydrology/trace', (req, res) => {
  const { startLat = 28.28, startLng = 85.388 } = req.body || {};
  const lat = Number(startLat);
  const lng = Number(startLng);

  if (isNaN(lat) || isNaN(lng) || lat < 27.5 || lat > 28.6 || lng < 84.8 || lng > 85.8) {
    res.status(400).json({
      error: 'Coordinates are out of bounds for the Trishuli-Bhote Koshi corridor (27.5°N - 28.6°N, 84.8°E - 85.8°E)',
    });
    return;
  }

  const traceResult = traceDownstreamValleyFlow(lat, lng, SETTLEMENTS_DATA);
  res.json(traceResult);
});

// 5. Copilot Query (Strictly Validated)
app.post('/api/copilot/query', async (req, res) => {
  const { prompt, language = 'en' } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  const structuredGrounding = {
    eventDate: '26 August 2026',
    corridor: 'Bhote Koshi–Trishuli River Valley, Nepal',
    floodedAreaKm2: TRISHULI_STATS.floodedAreaKm2,
    debrisAreaKm2: TRISHULI_STATS.debrisAreaKm2,
    totalHazardAreaKm2: TRISHULI_STATS.totalHazardAreaKm2,
    damagedBridgesCount: TRISHULI_STATS.damagedBridgesCount,
    submergedRoadKm: TRISHULI_STATS.submergedRoadKm,
    impactedBuildingsCount: TRISHULI_STATS.impactedBuildingsCount,
    isolatedSettlementsCount: TRISHULI_STATS.isolatedSettlementsCount,
    isolatedPopulationCount: TRISHULI_STATS.isolatedPopulationCount,
    connectedSettlementsCount: TRISHULI_STATS.connectedSettlementsCount,
    severedBridgesList: DAMAGED_BRIDGES.map((b) => `${b.name} (${b.status})`),
    cutoffVillagesList: SETTLEMENTS_DATA.filter((s) => s.isCutOff).map(
      (s) => `${s.name} (${s.nameNepali}, pop ${s.estimatedPopulation}, blocked by ${s.isolationCause?.primarySeveredBridge})`
    ),
  };

  const systemInstruction = `You are SETU Copilot, an emergency triage intelligence system for the 26 August 2026 Trishuli flood in Nepal.
CRITICAL MANDATE:
1. Every single number, count, distance, area, and population figure you state MUST come exclusively from this VERIFIED GROUND TRUTH JSON. NEVER invent, estimate, or extrapolate any numbers.
GROUND TRUTH JSON:
${JSON.stringify(structuredGrounding, null, 2)}

2. If the user asks in English, provide a clear, tactical answer in English.
3. If requested in Nepali or bilingual, also provide accurate Nepali (नेपाली) translation using official disaster terminology (बाढी, पहिरो, सम्पर्कविहीन, पुल बगाएको).
4. Clearly state which bridge or road failure isolated which village.
5. Keep answers concise, factual, and actionable for rescue coordinators.`;

  let responseText = '';

  if (nlpClient) {
    try {
      const response = await generateWithTimeout({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.1, // Near-deterministic for maximum factual rigor
        },
      }, 8000);
      responseText = response?.text || '';
    } catch (err: unknown) {
      console.warn('NLP copilot query fallback triggered:', err instanceof Error ? err.message : String(err));
      responseText = generateFallbackAnswer(prompt, language, structuredGrounding);
    }
  } else {
    responseText = generateFallbackAnswer(prompt, language, structuredGrounding);
  }

  // Run the zero-hallucination numerical validator
  const auditReport = validateCopilotText(responseText, TRISHULI_STATS, SETTLEMENTS_DATA);

  res.json({
    answer: responseText,
    language,
    auditReport,
  });
});

// 6. Sitrep Generator (Bilingual with Strict Numerical Validator)
app.post('/api/copilot/sitrep', async (req, res) => {
  const structuredGrounding = {
    eventDate: '26 August 2026',
    corridor: 'Bhote Koshi–Trishuli River Valley (Rasuwa & Nuwakot Districts)',
    floodedAreaKm2: TRISHULI_STATS.floodedAreaKm2,
    debrisAreaKm2: TRISHULI_STATS.debrisAreaKm2,
    totalHazardAreaKm2: TRISHULI_STATS.totalHazardAreaKm2,
    damagedBridgesCount: TRISHULI_STATS.damagedBridgesCount,
    submergedRoadKm: TRISHULI_STATS.submergedRoadKm,
    impactedBuildingsCount: TRISHULI_STATS.impactedBuildingsCount,
    isolatedSettlementsCount: TRISHULI_STATS.isolatedSettlementsCount,
    isolatedPopulationCount: TRISHULI_STATS.isolatedPopulationCount,
    connectedSettlementsCount: TRISHULI_STATS.connectedSettlementsCount,
    satellitePair: 'Sentinel-1A (Relative Orbit 121, 2026-08-14 vs 2026-08-26)',
    osmBaselineDate: '2026-07-27',
  };

  const sitrepPrompt = `Draft an official One-Page Disaster Situation Report (SITREP-001) for NDRRMA and search-and-rescue teams regarding the 26 August 2026 Bhote Koshi–Trishuli event.
You must output a JSON object with two fields:
"summaryEn": A 3-paragraph executive tactical summary in English.
"summaryNe": The exact equivalent 3-paragraph tactical summary in Nepali (नेपाली).

STRICT RULE: Only use numbers from this verified dataset:
- Total hazard area: 24.0 km² (14.8 km² flood water, 9.2 km² debris flow)
- 7 damaged bridges (Larcha Bailey Bridge, Friendship Bridge, Syaphrubesi Bridge, Chilime Bridge, Mailung Bridge, Somdang Bridge, Betrawati Bridge)
- 38.4 km of submerged or debris-blocked highway (Pasang Lhamu Highway)
- 312 impacted building structures
- 7 cut-off settlements: Rasuwagadhi (pop 640), Timure (pop 1420), Tatopani (pop 580), Larcha (pop 980), Gatlang (pop 1820), Thambuchet (pop 760), Syaphrubesi (pop 2440)
- Total isolated population: 8640 residents
Do not invent any other numbers.`;

  let summaryEn = '';
  let summaryNe = '';

  if (nlpClient) {
    try {
      const response = await generateWithTimeout({
        model: 'gemini-3.8-flash',
        contents: sitrepPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }, 10000);
      const parsed = JSON.parse(response?.text || '{}');
      summaryEn = parsed.summaryEn || '';
      summaryNe = parsed.summaryNe || '';
    } catch (err) {
      console.warn('Sitrep inference fallback triggered:', err instanceof Error ? err.message : String(err));
    }
  }

  if (!summaryEn || !summaryNe) {
    summaryEn = `On 26 August 2026, an upstream high-altitude ice-rock avalanche triggered catastrophic debris and flood surges down the Bhote Koshi–Trishuli corridor. Spaceborne Sentinel-1 radar change detection delineates 24.0 km² of total hazard extent, comprising 14.8 km² of deep valley inundation and 9.2 km² of high-velocity debris fans.

Pre-event OpenStreetMap topology analysis reveals devastating infrastructure damage: 7 critical bridges have been severed or impassable, alongside 38.4 km of submerged highway on the Pasang Lhamu corridor and 312 impacted building structures. The loss of Larcha Bailey Bridge and Syaphrubesi Bridge has severed all ground vehicle access to northern Rasuwa.

Consequently, 7 mountain settlements—Rasuwagadhi, Timure, Tatopani, Larcha, Gatlang, Thambuchet, and Syaphrubesi—are completely cut off with an estimated 8640 isolated residents facing severe isolation. Immediate helicopter evacuation and foot-trail triage are required for high-urgency medical cases.`;

    summaryNe = `२०२६ अगस्ट २६ मा माथिल्लो उच्च हिमाली क्षेत्रमा हिमपहिरो र गेग्रान बहावका कारण भोटेकोशी–त्रिशूली करिडोरमा भीषण बाढी आएको छ। सेन्टिनेल-१ रडार परिवर्तन विश्लेषण अनुसार कुल २४.० वर्ग किलोमिटर क्षेत्र प्रभावित भएको छ, जसमा १४.८ वर्ग किलोमिटर जलमग्न र ९.२ वर्ग किलोमिटर लेदो तथा गेग्रान थुप्रिएको छ।

विपद् पूर्वको ओपनस्ट्रिटम्याप सडक सञ्जाल विश्लेषण अनुसार ७ वटा प्रमुख पुलहरू बगेका छन् र पासाङ ल्हामु राजमार्गको ३८.४ किलोमिटर सडक खण्ड अवरुद्ध भएको छ। ३१२ वटा घर संरचनामा क्षति पुगेको छ। लार्छा मोटर पुल र स्याफ्रुबेँसी पुल बग्दा उत्तरी रसुवातर्फको सम्पूर्ण सडक सम्पर्क विच्छेद भएको छ।

यसबाट रसुवागढी, टिमुरे, तातोपानी, लार्छा, गत्लाङ, थाम्बुचेत र स्याफ्रुबेँसी गरी ७ वटा बस्तीहरू पूर्ण रूपमा सम्पर्कविहीन भएका छन्, जहाँ ८६४० नागरिकहरू अलपत्र परेका छन्। गम्भीर बिरामीहरूको उद्धारका लागि तत्काल हेलिकप्टर उडान परिचालन गर्न सिफारिस गरिएको छ।`;
  }

  const auditReportEn = validateCopilotText(summaryEn, TRISHULI_STATS, SETTLEMENTS_DATA);
  const auditReportNe = validateCopilotText(summaryNe, TRISHULI_STATS, SETTLEMENTS_DATA);

  res.json({
    reportId: 'SETU-SITREP-2026-001',
    timestamp: new Date().toISOString(),
    eventDate: '2026-08-26',
    aoiName: 'Bhote Koshi–Trishuli Corridor',
    authorAgency: 'SETU Emergency Triage Taskforce (NDRRMA / Copernicus Partner)',
    summaryEn,
    summaryNe,
    stats: TRISHULI_STATS,
    damagedBridges: DAMAGED_BRIDGES,
    isolatedSettlements: SETTLEMENTS_DATA.filter((s) => s.isCutOff),
    audit: {
      english: auditReportEn,
      nepali: auditReportNe,
      overallPassed: auditReportEn.passed && auditReportNe.passed,
    },
    attributions: [
      'Contains modified Copernicus Sentinel data 2026.',
      'Produced using Copernicus WorldDEM-30 © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018 provided under COPERNICUS by the European Union and ESA; all rights reserved.',
      '© OpenStreetMap contributors (Pre-event snapshot 2026-07-27 via ohsome API).',
      'Copernicus Emergency Management Service data [EMSR927], European Union, 2026 (Validation reference only).',
      'Training datasets: Kuro Siwo (Bountos et al., NeurIPS 2024); Sen1Floods11 (Bonafilia et al., CVPRW 2020).',
    ],
  });
});

function generateFallbackAnswer(prompt: string, language: string, data: Record<string, unknown>): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('bridge') || lower.includes('पुल')) {
    return language === 'ne'
      ? `भोटेकोशी–त्रिशूली करिडोरमा कुल ७ वटा पुलहरू क्षतिग्रस्त भएका छन्। लार्छा मोटर पुल, मितेरी पुल (रसुवागढी), र स्याफ्रुबेँसी पुल पूर्ण रूपमा बगेका छन्। यसै कारण माथिल्लो भेगका ७ बस्तीहरू सम्पर्कविहीन भएका हुन्।`
      : `Across the corridor, 7 bridges have been damaged or severed. The collapse of the Larcha Bailey Bridge and Syaphrubesi Trishuli Bridge are the primary single-points-of-failure isolating the 7 northern settlements.`;
  }

  if (lower.includes('cut off') || lower.includes('isolated') || lower.includes('सम्पर्कविहीन')) {
    return language === 'ne'
      ? `कुल ७ वटा बस्तीहरू पूर्ण रूपमा सम्पर्कविहीन छन्: रसुवागढी (जनसंख्या ६४०), टिमुरे (१४२०), तातोपानी (५८०), लार्छा (९८०), गत्लाङ (१८२०), थाम्बुचेत (७६०), र स्याफ्रुबेँसी (२४४०)। जम्मा ८६४० नागरिक सडक सम्पर्कबाट विच्छेद छन्।`
      : `A total of 7 settlements are completely cut off: Rasuwagadhi (pop 640), Timure (pop 1420), Tatopani (pop 580), Larcha (pop 980), Gatlang (pop 1820), Thambuchet (pop 760), and Syaphrubesi (pop 2440). An estimated 8640 residents are isolated with zero vehicular road connection.`;
  }

  if (lower.includes('area') || lower.includes('km') || lower.includes('क्षेत्रफल')) {
    return language === 'ne'
      ? `सेन्टिनेल-१ रडार विश्लेषण अनुसार कुल २४.० वर्ग किलोमिटर क्षेत्र प्रभावित भएको छ। यसमध्ये १४.८ वर्ग किलोमिटर बाढीले जलमग्न र ९.२ वर्ग किलोमिटर गेग्रान बहाव रहेको छ। ३८.४ किमी सडक खण्ड अवरुद्ध छ।`
      : `Sentinel-1 radar change detection delineates 24.0 km² of total hazard area (14.8 km² flooded water and 9.2 km² debris deposits). 38.4 km of highway is submerged or blocked.`;
  }

  return language === 'ne'
    ? `२०२६ अगस्ट २६ को त्रिशूली विपद्मा २४.० वर्ग किलोमिटर क्षेत्र प्रभावित भएको छ। ७ पुलहरू बग्दा ७ बस्तीका ८६४० नागरिक सम्पर्कविहीन छन्। ३८.४ किमी सडक र ३१२ भवनहरू क्षतिग्रस्त छन्।`
    : `Summary for the 26 August 2026 event: 24.0 km² total hazard area mapped from orbit, 7 severed bridges, 38.4 km submerged road, 312 impacted buildings, and 7 cut-off settlements isolating 8640 residents.`;
}

// Dev: Vite middleware. Production: serve the built dist/ folder.
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV === 'production') {
    const dist = path.join(process.cwd(), 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`SETU Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
