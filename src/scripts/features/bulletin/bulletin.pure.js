// ============================================================================
// bulletin.pure.js
// ----------------------------------------------------------------------------
// Reine Hilfsfunktionen fuer das Bulletin-Modul.
// Keine externen Abhaengigkeiten, keine DOM-Zugriffe, keine Firebase-Calls.
// Macht die Logik isoliert testbar via Vitest.
// ============================================================================

export const DASHBOARD_PREVIEW_LIMIT = 3;

/**
 * Formatiert einen Bulletin-Timestamp (Date.now()-Number) im de-DE Format
 * 'TT.MM., HH:MM'. Faellt auf den String 'Unbekannt' zurueck, wenn der
 * Wert fehlt.
 *
 * @param {number | null | undefined} ts
 * @returns {string}
 */
export function formatBulletinDate(ts) {
    if (!ts) return 'Unbekannt';
    return new Date(ts).toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Filtert offene (nicht erledigte) Aushaenge.
 *
 * @param {Array<{ isDone?: boolean }>} items
 * @returns {Array}
 */
export function filterOpenItems(items) {
    if (!Array.isArray(items)) return [];
    return items.filter((it) => !it?.isDone);
}

/**
 * Filtert erledigte Aushaenge (isDone === true).
 *
 * @param {Array<{ isDone?: boolean }>} items
 * @returns {Array}
 */
export function filterDoneItems(items) {
    if (!Array.isArray(items)) return [];
    return items.filter((it) => !!it?.isDone);
}

/**
 * Splittet eine Item-Liste in offene und erledigte Items.
 * Beide Teil-Listen sind nach `timestamp` (Erstellzeitpunkt) absteigend sortiert.
 * Anschliessend werden die erledigten Items zusaetzlich nach `doneAt` (falls
 * vorhanden) sortiert, sodass kuerzlich Erledigtes oben steht; Items ohne
 * `doneAt` (Legacy) werden ans Ende gehaengt.
 *
 * @param {Array} items
 * @returns {{ open: Array, done: Array }}
 */
export function splitOpenAndDone(items) {
    const sorted = sortByTimestampDesc(items);
    const open = sorted.filter((it) => !it?.isDone);
    const done = sorted.filter((it) => !!it?.isDone).sort((a, b) => {
        const aHas = typeof a?.doneAt === 'number';
        const bHas = typeof b?.doneAt === 'number';
        if (aHas && bHas) return b.doneAt - a.doneAt;
        if (aHas) return -1;
        if (bHas) return 1;
        return 0;
    });
    return { open, done };
}

/**
 * Formatiert den Erledigt-Zeitstempel. Akzeptiert eine Number (ms) oder einen
 * Firestore-Timestamp mit toMillis()/toDate(). Faellt auf 'unbekannt' zurueck,
 * wenn der Wert fehlt - so bleiben Legacy-Items (vor v6.1) lesbar.
 *
 * @param {number | { toMillis?: () => number, toDate?: () => Date } | null | undefined} ts
 * @returns {string}
 */
export function formatDoneDate(ts) {
    if (ts == null) return 'unbekannt';
    let ms = null;
    if (typeof ts === 'number') {
        ms = ts;
    } else if (typeof ts.toMillis === 'function') {
        ms = ts.toMillis();
    } else if (typeof ts.toDate === 'function') {
        const d = ts.toDate();
        if (d instanceof Date) ms = d.getTime();
    }
    if (ms == null || Number.isNaN(ms)) return 'unbekannt';
    return new Date(ms).toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Sortiert Items absteigend nach numerischem `timestamp`-Feld.
 * Nicht-mutierend (gibt eine neue Liste zurueck).
 *
 * @param {Array<{ timestamp?: number }>} items
 * @returns {Array}
 */
export function sortByTimestampDesc(items) {
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0));
}

/**
 * Escaped HTML-Sonderzeichen fuer sichere Einbettung in innerHTML.
 * Bulletin-eigene Kopie - cross-feature Imports vermeiden wir bewusst.
 *
 * @param {*} s
 * @returns {string}
 */
export function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }[c]));
}
