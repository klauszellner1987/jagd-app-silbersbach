import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    isUserCurrentlyOnline,
    formatRelativeTime,
    ONLINE_THRESHOLD_MS,
} from '../../public/js/lib/pure.js';

/**
 * Hilfsfunktion: simuliert die Firestore-Timestamp Schnittstelle.
 * Echte Firestore-Timestamps haben eine .toDate() Methode.
 */
function fakeTimestamp(date) {
    return { toDate: () => date };
}

describe('isUserCurrentlyOnline', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-11T10:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('liefert true wenn isOnline=true und lastSeen frisch ist', () => {
        const data = { isOnline: true, lastSeen: fakeTimestamp(new Date('2026-05-11T09:59:55Z')) }; // 5s
        expect(isUserCurrentlyOnline(data)).toBe(true);
    });

    it('liefert false wenn lastSeen aelter als ONLINE_THRESHOLD_MS ist (Stale-Detection)', () => {
        const stale = new Date(Date.now() - ONLINE_THRESHOLD_MS - 1000);
        const data = { isOnline: true, lastSeen: fakeTimestamp(stale) };
        expect(isUserCurrentlyOnline(data)).toBe(false);
    });

    it('liefert false wenn isOnline=false', () => {
        const data = { isOnline: false, lastSeen: fakeTimestamp(new Date()) };
        expect(isUserCurrentlyOnline(data)).toBe(false);
    });

    it('liefert false bei null', () => {
        expect(isUserCurrentlyOnline(null)).toBe(false);
        expect(isUserCurrentlyOnline(undefined)).toBe(false);
    });

    it('liefert false wenn lastSeen fehlt', () => {
        expect(isUserCurrentlyOnline({ isOnline: true })).toBe(false);
    });

    it('liefert false wenn lastSeen kein Firestore-Timestamp-Objekt ist', () => {
        expect(isUserCurrentlyOnline({ isOnline: true, lastSeen: '2026-05-11' })).toBe(false);
        expect(isUserCurrentlyOnline({ isOnline: true, lastSeen: new Date() })).toBe(false);
    });

    it('Grenzfall: genau auf der Schwelle liefert false', () => {
        const exact = new Date(Date.now() - ONLINE_THRESHOLD_MS);
        const data = { isOnline: true, lastSeen: fakeTimestamp(exact) };
        expect(isUserCurrentlyOnline(data)).toBe(false);
    });
});

describe('formatRelativeTime', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-11T12:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('liefert "Gerade eben" fuer Zeiten unter 60s', () => {
        expect(formatRelativeTime(new Date(Date.now() - 30 * 1000))).toBe('Gerade eben');
        expect(formatRelativeTime(new Date(Date.now() - 1000))).toBe('Gerade eben');
    });

    it('liefert "Vor X Min." fuer Zeiten unter 1h', () => {
        expect(formatRelativeTime(new Date(Date.now() - 5 * 60 * 1000))).toBe('Vor 5 Min.');
        expect(formatRelativeTime(new Date(Date.now() - 59 * 60 * 1000))).toBe('Vor 59 Min.');
    });

    it('liefert "Vor X Std." fuer Zeiten unter 24h', () => {
        expect(formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000))).toBe('Vor 2 Std.');
        expect(formatRelativeTime(new Date(Date.now() - 23 * 60 * 60 * 1000))).toBe('Vor 23 Std.');
    });

    it('liefert ein deutsches Datum fuer Zeiten ueber 24h', () => {
        const result = formatRelativeTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
        expect(result).toMatch(/\d{2}\.\d{2}/);
    });
});
