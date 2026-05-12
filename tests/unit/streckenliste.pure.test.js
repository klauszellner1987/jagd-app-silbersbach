// ============================================================================
// streckenliste.pure.test.js
// ============================================================================

import { describe, it, expect } from 'vitest';
import {
    aggregateWildartenCounts,
    aggregateRehwildUnterarten,
    buildExcelExportRows,
    sortEntriesByDatumDesc,
    escapeHtml,
} from '../../src/scripts/features/streckenliste/streckenliste.pure.js';

describe('aggregateWildartenCounts', () => {
    it('zaehlt nur gesetzte wildart', () => {
        expect(aggregateWildartenCounts([])).toEqual({});
        expect(aggregateWildartenCounts(null)).toEqual({});
        expect(aggregateWildartenCounts([
            { wildart: 'Rehwild' },
            { wildart: 'Rehwild' },
            { wildart: 'Schwarzwild' },
            {},
        ])).toEqual({ Rehwild: 2, Schwarzwild: 1 });
    });
});

describe('aggregateRehwildUnterarten', () => {
    it('aggregiert Unterarten fuer Rehwild inkl. Unbekannt-Fallback', () => {
        expect(aggregateRehwildUnterarten([
            { wildart: 'Rehwild', unterart: 'Bock' },
            { wildart: 'Schwarzwild', unterart: 'Keiler' },
            { wildart: 'Rehwild' },
        ])).toEqual({ Bock: 1, Unbekannt: 1 });
    });
});

describe('buildExcelExportRows', () => {
    it('mapped Felder fuer XLSX', () => {
        expect(buildExcelExportRows([
            {
                datum: '2026-01-02',
                wildart: 'R',
                unterart: 'U',
                erleger: 'E',
                bemerkung: 'B',
                imageBase64: 'x',
            },
            { imageUrl: 'http://x' },
        ])).toEqual([
            { Datum: '2026-01-02', Wildart: 'R', Unterart: 'U', Erleger: 'E', Bemerkung: 'B', Foto: 'Ja' },
            { Datum: '', Wildart: '', Unterart: '', Erleger: '', Bemerkung: '', Foto: 'Ja' },
        ]);
    });
});

describe('sortEntriesByDatumDesc', () => {
    it('sortiert nach datum String absteigend', () => {
        const s = sortEntriesByDatumDesc([
            { datum: '2026-01-01' },
            { datum: '2026-03-01' },
            { datum: '2026-02-01' },
        ]);
        expect(s.map((x) => x.datum)).toEqual(['2026-03-01', '2026-02-01', '2026-01-01']);
    });
});

describe('escapeHtml', () => {
    it('escaped Sonderzeichen', () => {
        expect(escapeHtml('<a>&"\'</a>')).toBe('&lt;a&gt;&amp;&quot;&#39;&lt;/a&gt;');
    });
});
