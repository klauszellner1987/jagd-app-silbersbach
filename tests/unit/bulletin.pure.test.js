// ============================================================================
// bulletin.pure.test.js
// ----------------------------------------------------------------------------
// Tests fuer die reinen Helper aus features/bulletin/bulletin.pure.js.
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    formatBulletinDate,
    filterOpenItems,
    sortByTimestampDesc,
    escapeHtml,
    DASHBOARD_PREVIEW_LIMIT,
} from '../../src/scripts/features/bulletin/bulletin.pure.js';

describe('formatBulletinDate', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-11T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('liefert "Unbekannt" fuer null/undefined/0', () => {
        expect(formatBulletinDate(null)).toBe('Unbekannt');
        expect(formatBulletinDate(undefined)).toBe('Unbekannt');
        expect(formatBulletinDate(0)).toBe('Unbekannt');
    });

    it('liefert deutschen Datum/Zeit-String fuer einen Date.now()-Wert', () => {
        const ts = new Date('2026-05-11T08:30:00Z').getTime();
        const out = formatBulletinDate(ts);
        // tt.MM., HH:MM (Locale de-DE) - wir pruefen Format, nicht TZ
        expect(out).toMatch(/\d{2}\.\d{2}\.,\s*\d{2}:\d{2}/);
    });
});

describe('filterOpenItems', () => {
    it('entfernt items mit isDone=true', () => {
        const out = filterOpenItems([
            { id: 'a', isDone: false },
            { id: 'b', isDone: true },
            { id: 'c' },
        ]);
        expect(out.map((i) => i.id)).toEqual(['a', 'c']);
    });

    it('liefert leeres Array fuer non-array input', () => {
        expect(filterOpenItems(null)).toEqual([]);
        expect(filterOpenItems(undefined)).toEqual([]);
        expect(filterOpenItems('foo')).toEqual([]);
    });
});

describe('sortByTimestampDesc', () => {
    it('sortiert absteigend nach timestamp ohne Original zu mutieren', () => {
        const original = [
            { id: 'a', timestamp: 100 },
            { id: 'b', timestamp: 300 },
            { id: 'c', timestamp: 200 },
        ];
        const sorted = sortByTimestampDesc(original);
        expect(sorted.map((i) => i.id)).toEqual(['b', 'c', 'a']);
        expect(original.map((i) => i.id)).toEqual(['a', 'b', 'c']);
    });

    it('haelt items ohne timestamp am Ende', () => {
        const sorted = sortByTimestampDesc([
            { id: 'a' },
            { id: 'b', timestamp: 50 },
            { id: 'c', timestamp: 100 },
        ]);
        expect(sorted.map((i) => i.id)).toEqual(['c', 'b', 'a']);
    });

    it('liefert leeres Array fuer non-array', () => {
        expect(sortByTimestampDesc(null)).toEqual([]);
    });
});

describe('escapeHtml', () => {
    it('escaped die 5 wichtigen HTML-Zeichen', () => {
        expect(escapeHtml('<script>"\'&</script>')).toBe(
            '&lt;script&gt;&quot;&#39;&amp;&lt;/script&gt;',
        );
    });

    it('haelt normale Strings unveraendert', () => {
        expect(escapeHtml('Klaus Zellner')).toBe('Klaus Zellner');
    });

    it('liefert Stringform auch fuer null/undefined/Zahlen', () => {
        expect(escapeHtml(null)).toBe('');
        expect(escapeHtml(undefined)).toBe('');
        expect(escapeHtml(42)).toBe('42');
    });
});

describe('DASHBOARD_PREVIEW_LIMIT', () => {
    it('ist 3 (max. Eintraege im Dashboard-Widget)', () => {
        expect(DASHBOARD_PREVIEW_LIMIT).toBe(3);
    });
});
