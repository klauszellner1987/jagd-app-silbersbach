// ============================================================================
// bulletin.pure.test.js
// ----------------------------------------------------------------------------
// Tests fuer die reinen Helper aus features/bulletin/bulletin.pure.js.
// ============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    formatBulletinDate,
    formatDoneDate,
    filterOpenItems,
    filterDoneItems,
    splitOpenAndDone,
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

describe('filterDoneItems', () => {
    it('liefert nur items mit isDone=true', () => {
        const out = filterDoneItems([
            { id: 'a', isDone: true },
            { id: 'b', isDone: false },
            { id: 'c' },
            { id: 'd', isDone: true },
        ]);
        expect(out.map((i) => i.id)).toEqual(['a', 'd']);
    });

    it('liefert [] fuer non-array', () => {
        expect(filterDoneItems(null)).toEqual([]);
        expect(filterDoneItems('x')).toEqual([]);
    });
});

describe('splitOpenAndDone', () => {
    it('splittet in offen + erledigt; offen sortiert nach timestamp desc', () => {
        const items = [
            { id: 'o1', timestamp: 100, isDone: false },
            { id: 'd1', timestamp: 300, isDone: true, doneAt: 999 },
            { id: 'o2', timestamp: 200 },
            { id: 'd2', timestamp: 400, isDone: true, doneAt: 1500 },
        ];
        const { open, done } = splitOpenAndDone(items);
        expect(open.map((i) => i.id)).toEqual(['o2', 'o1']);
        // done sortiert nach doneAt desc (1500 > 999)
        expect(done.map((i) => i.id)).toEqual(['d2', 'd1']);
    });

    it('Legacy-Items ohne doneAt landen am Ende der done-Liste', () => {
        const items = [
            { id: 'a', timestamp: 100, isDone: true }, // legacy
            { id: 'b', timestamp: 200, isDone: true, doneAt: 500 },
            { id: 'c', timestamp: 300, isDone: true }, // legacy, neuer timestamp
        ];
        const { done } = splitOpenAndDone(items);
        // 'b' hat doneAt -> zuerst; 'a' und 'c' legacy -> Reihenfolge nach timestamp desc von sortByTimestampDesc
        expect(done[0].id).toBe('b');
        expect(done.slice(1).map((i) => i.id).sort()).toEqual(['a', 'c']);
    });

    it('liefert leere Listen fuer non-array', () => {
        expect(splitOpenAndDone(null)).toEqual({ open: [], done: [] });
    });
});

describe('formatDoneDate', () => {
    it('liefert "unbekannt" fuer null/undefined', () => {
        expect(formatDoneDate(null)).toBe('unbekannt');
        expect(formatDoneDate(undefined)).toBe('unbekannt');
    });

    it('formatiert eine Number wie ein Date-Stempel', () => {
        const ts = new Date('2026-05-11T08:30:00Z').getTime();
        const out = formatDoneDate(ts);
        expect(out).toMatch(/\d{2}\.\d{2}\.,\s*\d{2}:\d{2}/);
    });

    it('akzeptiert Firestore-Timestamp mit toMillis()', () => {
        const fakeTs = { toMillis: () => new Date('2026-05-11T08:30:00Z').getTime() };
        expect(formatDoneDate(fakeTs)).toMatch(/\d{2}\.\d{2}\.,\s*\d{2}:\d{2}/);
    });

    it('akzeptiert Firestore-Timestamp mit toDate()', () => {
        const fakeTs = { toDate: () => new Date('2026-05-11T08:30:00Z') };
        expect(formatDoneDate(fakeTs)).toMatch(/\d{2}\.\d{2}\.,\s*\d{2}:\d{2}/);
    });

    it('liefert "unbekannt" wenn weder Number noch toMillis/toDate vorhanden', () => {
        expect(formatDoneDate({ foo: 'bar' })).toBe('unbekannt');
    });
});
