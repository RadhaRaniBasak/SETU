# Testing Strategy: SETU Triage Platform

## 1. Testing Philosophy
In disaster triage systems, data corruption or faulty numerical outputs can mislead life-saving rescue logistics. Tests must ensure:
1. **Numerical Veracity**: Zero ungrounded or hallucinated statistics in bilingual situation reports.
2. **Hydrological Consistency**: Accurate downstream flow tracing, transit times, and settlement corridor containment.
3. **Chart & UI Math**: True-to-scale dynamic percentage computations.

---

## 2. Test Framework
- **Runner**: Vitest (`vitest run`).
- **Commands**:
  - Run tests: `npm test`
  - Run linting: `npm run lint` (`tsc --noEmit`)
  - Run build verification: `npm run build`

---

## 3. Test Suites

### Unit Tests (`tests/unit/`)
- `validatorService.test.ts`:
  - Devanagari digit conversion (`०-९` -> `0-9`).
  - Strict zero-hallucination verification against `TRISHULI_STATS` and `SETTLEMENTS_DATA`.
  - Detection and rejection of fabricated casualty/bridge statistics.
- `hydrologyService.test.ts`:
  - Haversine distance calculations across mountain terrain.
  - Steepest-descent river corridor sliced path tracing.
  - Increasing ETA minutes monotonically along downstream settlements.
- `AnalyticsChartCard.test.ts`:
  - Maximum total calculation across variable range periods (7d / 30d / 90d).
  - 100% height scaling for the dominant column group.
  - Proper series A and series B stacked proportion math.

---

## 4. Definition of Done
- All Vitest unit tests pass with zero failures.
- TypeScript compiler (`tsc --noEmit`) reports zero errors.
- Production build succeeds (`npm run build`).
