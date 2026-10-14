import { describe, it, expect } from 'vitest';
import {
  convertDevanagariToLatinDigits,
  validateCopilotText,
} from '../../src/services/validatorService.ts';
import { TRISHULI_STATS, SETTLEMENTS_DATA } from '../../src/data/trishuliScenario.ts';

describe('validatorService: Devanagari digit conversion', () => {
  it('converts Devanagari numbers to Latin numerals accurately', () => {
    expect(convertDevanagariToLatinDigits('२४.० वर्ग किमी')).toBe('24.0 वर्ग किमी');
    expect(convertDevanagariToLatinDigits('८६४० नागरिक')).toBe('8640 नागरिक');
    expect(convertDevanagariToLatinDigits('२०२६ अगस्ट २६')).toBe('2026 अगस्ट 26');
  });

  it('leaves Latin characters and digits untouched', () => {
    expect(convertDevanagariToLatinDigits('Sentinel-1 2026')).toBe('Sentinel-1 2026');
  });
});

describe('validatorService: Zero-hallucination numerical validation', () => {
  it('passes verified text matching ground truth figures in English', () => {
    const text = 'Across the corridor, 7 bridges were damaged and 8,640 residents in 7 settlements are cut off.';
    const audit = validateCopilotText(text, TRISHULI_STATS, SETTLEMENTS_DATA);
    expect(audit.passed).toBe(true);
    expect(audit.unverifiedNumbersCount).toBe(0);
    expect(audit.verdict).toBe('VERIFIED_ZERO_HALLUCINATION');
  });

  it('passes verified text in Nepali with Devanagari digits', () => {
    const text = 'भोटेकोशी करिडोरमा ७ पुलहरू र ७ बस्तीका ८६४० नागरिक सम्पर्कविहीन छन्।';
    const audit = validateCopilotText(text, TRISHULI_STATS, SETTLEMENTS_DATA);
    expect(audit.passed).toBe(true);
    expect(audit.verdict).toBe('VERIFIED_ZERO_HALLUCINATION');
  });

  it('flags unverified or hallucinated numbers', () => {
    const hallucinatedText = 'A total of 999 bridges collapsed and 77,777 people were evacuated.';
    const audit = validateCopilotText(hallucinatedText, TRISHULI_STATS, SETTLEMENTS_DATA);
    expect(audit.passed).toBe(false);
    expect(audit.unverifiedNumbersCount).toBeGreaterThan(0);
    expect(audit.verdict).toBe('FLAGGED_UNGROUNDED_NUMBERS');
  });
});
