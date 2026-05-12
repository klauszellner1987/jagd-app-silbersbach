/**
 * Reine Hilfsfunktionen fuer Streckenliste (Statistik-Aggregate, Export-Zeilen).
 */

/**
 * Aggregiert Abschusszahlen nach Wildart.
 * @param {Array<{ wildart?: string }>} entries
 * @returns {Record<string, number>}
 */
export function aggregateWildartenCounts(entries) {
    if (!Array.isArray(entries)) return {};
    const m = {};
    for (const e of entries) {
        const w = e?.wildart;
        if (!w) continue;
        m[w] = (m[w] || 0) + 1;
    }
    return m;
}

/**
 * Aggregiert Unterarten nur fuer Eintraege mit wildart === "Rehwild".
 * @param {Array<{ wildart?: string, unterart?: string }>} entries
 * @returns {Record<string, number>}
 */
export function aggregateRehwildUnterarten(entries) {
    if (!Array.isArray(entries)) return {};
    const m = {};
    for (const e of entries) {
        if (e?.wildart !== 'Rehwild') continue;
        const k = e.unterart || 'Unbekannt';
        m[k] = (m[k] || 0) + 1;
    }
    return m;
}

/**
 * Zeilen fuer XLSX-Export (wie bisheriges Feldmapping der App).
 * @param {Array} entries
 * @returns {Array<Record<string, string>>}
 */
export function buildExcelExportRows(entries) {
    if (!Array.isArray(entries)) return [];
    return entries.map((e) => ({
        Datum: e.datum || '',
        Wildart: e.wildart || '',
        Unterart: e.unterart || '',
        Erleger: e.erleger || '',
        Bemerkung: e.bemerkung || '',
        Foto: (e.imageBase64 || e.imageUrl) ? 'Ja' : 'Nein',
    }));
}

/**
 * Desc-Sortierung nach String-Feld `datum` (YYYY-MM-DD aus input type=date).
 * @param {Array<{ datum?: string }>} items
 * @returns {Array}
 */
export function sortEntriesByDatumDesc(items) {
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => String(b?.datum || '').localeCompare(String(a?.datum || '')));
}

/**
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
