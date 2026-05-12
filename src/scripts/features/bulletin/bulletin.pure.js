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
