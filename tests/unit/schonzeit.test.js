import { describe, it, expect } from 'vitest';
import {
    istSchonzeit,
    getJagdzeitDatum,
    parseJagdzeit,
} from '../../public/js/lib/pure.js';
import {
    wildartenNachTabFilter,
    wildartenFuerSchonzeitAnsicht,
} from '../../src/scripts/features/schonzeit/schonzeit.pure.js';

const stockente = { id: 'stockente', name: 'Stockente', jagdzeitStart: '01.09', jagdzeitEnde: '15.01', iconClass: 'ente' };
const fasan = { id: 'fasan', name: 'Fasan', jagdzeitStart: '01.10', jagdzeitEnde: '31.12', iconClass: 'fasan' };
const wildkaninchen = { id: 'wildkaninchen', name: 'Wildkaninchen', ganzjaehrig: true, iconClass: 'rabbit' };
const krickente = { id: 'krickente', name: 'Krickente', keineJagdzeit: true, iconClass: 'ente' };
const rabenkraehe = { id: 'rabenkraehe', name: 'Rabenkraehe', jagdzeitStart: '16.07', jagdzeitEnde: '14.03', iconClass: 'crow' };

describe('istSchonzeit', () => {
    it('Stockente am 01.10. -> Jagdzeit (false)', () => {
        const date = new Date(2026, 9, 1); // Monat ist 0-indexed: 9 = Oktober
        expect(istSchonzeit(stockente, date)).toBe(false);
    });

    it('Stockente am 01.06. -> Schonzeit (true)', () => {
        const date = new Date(2026, 5, 1);
        expect(istSchonzeit(stockente, date)).toBe(true);
    });

    it('Stockente am 02.09. -> Jagdzeit (gerade angefangen)', () => {
        const date = new Date(2026, 8, 2);
        expect(istSchonzeit(stockente, date)).toBe(false);
    });

    it('Fasan am 31.12. -> Jagdzeit (letzter Tag)', () => {
        const date = new Date(2026, 11, 31);
        expect(istSchonzeit(fasan, date)).toBe(false);
    });

    it('Fasan am 01.01. -> Schonzeit', () => {
        const date = new Date(2026, 0, 1);
        expect(istSchonzeit(fasan, date)).toBe(true);
    });

    it('Wildkaninchen ganzjaehrig -> nie Schonzeit', () => {
        expect(istSchonzeit(wildkaninchen, new Date(2026, 0, 1))).toBe(false);
        expect(istSchonzeit(wildkaninchen, new Date(2026, 5, 15))).toBe(false);
        expect(istSchonzeit(wildkaninchen, new Date(2026, 11, 31))).toBe(false);
    });

    it('Krickente (keineJagdzeit) -> immer Schonzeit', () => {
        expect(istSchonzeit(krickente, new Date(2026, 9, 15))).toBe(true);
        expect(istSchonzeit(krickente, new Date(2026, 5, 1))).toBe(true);
    });

    describe('Wraparound (Rabenkraehe 16.07 - 14.03)', () => {
        it('am 01.08. -> Jagdzeit (innerhalb Wraparound)', () => {
            expect(istSchonzeit(rabenkraehe, new Date(2026, 7, 1))).toBe(false);
        });

        it('am 01.02. -> Jagdzeit (innerhalb Wraparound, neues Jahr)', () => {
            expect(istSchonzeit(rabenkraehe, new Date(2026, 1, 1))).toBe(false);
        });

        it('am 01.05. -> Schonzeit (zwischen Ende und Start)', () => {
            expect(istSchonzeit(rabenkraehe, new Date(2026, 4, 1))).toBe(true);
        });

        it('am 16.07. (Jagdzeit-Start) -> kein Schonzeit-Ergebnis mehr (Grenze)', () => {
            // Implementierung: heute > ende && heute < start
            // Am exakten Start-Tag ist now === start, also (now < start) = false
            // -> liefert false = "nicht Schonzeit" = effektiv Jagdzeit ab diesem Tag
            expect(istSchonzeit(rabenkraehe, new Date(2026, 6, 16))).toBe(false);
        });
    });
});

describe('getJagdzeitDatum', () => {
    it('liefert "Keine Jagdzeit" wenn keineJagdzeit gesetzt', () => {
        expect(getJagdzeitDatum(krickente)).toBe('Keine Jagdzeit');
    });

    it('liefert die Jagdzeit-Spanne fuer normale Wildarten', () => {
        expect(getJagdzeitDatum(stockente)).toBe('Jagdzeit: 01.09 - 15.01');
        expect(getJagdzeitDatum(fasan)).toBe('Jagdzeit: 01.10 - 31.12');
    });
});

describe('parseJagdzeit', () => {
    it('parst "DD.MM" korrekt', () => {
        const d = parseJagdzeit('15.10', 2026);
        expect(d.getFullYear()).toBe(2026);
        expect(d.getMonth()).toBe(9);
        expect(d.getDate()).toBe(15);
    });

    it('verwendet aktuelles Jahr ohne Parameter', () => {
        const d = parseJagdzeit('01.01');
        expect(d.getFullYear()).toBe(new Date().getFullYear());
    });
});

describe('wildartenNachTabFilter', () => {
    const juni = new Date(2026, 5, 1);
    const katalogMitUnbekannt = [
        stockente,
        { id: 'x', name: 'Nicht gelistet', iconClass: 'sonstwas', jagdzeitStart: '01.01', jagdzeitEnde: '31.12' },
    ];

    it('allowlist: sonstiges iconClass faellt raus', () => {
        const only = wildartenFuerSchonzeitAnsicht(katalogMitUnbekannt);
        expect(only.map((w) => w.id)).toEqual(['stockente']);
    });

    it('"schonzeit" filtert auf istSchonzeit', () => {
        const lst = wildartenNachTabFilter('schonzeit', [stockente], juni);
        expect(lst).toHaveLength(1);
        expect(lst[0].id).toBe('stockente');
    });

    it('"jagdzeit" zeigt Stockente im Juni nicht', () => {
        expect(wildartenNachTabFilter('jagdzeit', [stockente], juni)).toHaveLength(0);
    });
});
