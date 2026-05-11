// ============================================================================
// presence.pure.js
// ----------------------------------------------------------------------------
// Reine Hilfsfunktionen + Konstanten fuer das Presence-Modul.
// Keine externen Abhaengigkeiten, keine DOM-Zugriffe, keine Firebase-Calls.
// Macht die Logik isoliert testbar via Vitest.
// ============================================================================

export const HEARTBEAT_INTERVAL_MS = 30_000;          // alle 30s lastSeen aktualisieren
export const ONLINE_THRESHOLD_MS = 90_000;            // > 90s ohne Heartbeat = offline
export const PRESENCE_RENDER_REFRESH_MS = 30_000;     // alle 30s Online-Liste neu rendern

/**
 * Liefert true, wenn der User innerhalb der letzten ONLINE_THRESHOLD_MS einen
 * Heartbeat geschrieben hat UND isOnline=true gesetzt ist.
 *
 * @param {{ isOnline?: boolean, lastSeen?: { toDate(): Date } } | null | undefined} data
 * @returns {boolean}
 */
export function isUserCurrentlyOnline(data) {
    if (!data) return false;
    if (!data.isOnline) return false;
    const lastSeen = data.lastSeen && typeof data.lastSeen.toDate === 'function'
        ? data.lastSeen.toDate()
        : null;
    if (!lastSeen) return false;
    return (Date.now() - lastSeen.getTime()) < ONLINE_THRESHOLD_MS;
}

/**
 * Wandelt ein Date in einen relativen deutschen Zeit-String um.
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Gerade eben';
    if (diff < 3600) return `Vor ${Math.floor(diff / 60)} Min.`;
    if (diff < 86400) return `Vor ${Math.floor(diff / 3600)} Std.`;
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

/**
 * Escaped HTML-Sonderzeichen fuer sichere Einbettung in innerHTML.
 *
 * @param {*} s
 * @returns {string}
 */
export function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }[c]));
}
