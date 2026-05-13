/**
 * Reine Schonzeit-/Jagdzeit-Logik (Bayern-Katalog).
 */

/**
 * Parst einen "DD.MM" String zu einem Date im angegebenen Jahr (default: aktuelles).
 * @param {string} dateStr
 * @param {number} [year]
 * @returns {Date}
 */
export function parseJagdzeit(dateStr, year = new Date().getFullYear()) {
    const [day, month] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Liefert true, wenn die Wildart aktuell Schonzeit hat.
 * Beruecksichtigt: ganzjaehrige Schonzeit, ganzjaehrig bejagbar,
 * normale Jagdzeit und Jahreswechsel-Wraparound (z.B. 16.07 - 14.03).
 *
 * @param {Object} wildart
 * @param {Date} [now]
 */
export function istSchonzeit(wildart, now = new Date()) {
    if (wildart.keineJagdzeit) return true;
    if (wildart.ganzjaehrig) return false;

    const year = now.getFullYear();
    const start = parseJagdzeit(wildart.jagdzeitStart, year);
    const ende = parseJagdzeit(wildart.jagdzeitEnde, year);

    if (start > ende) {
        return now > ende && now < start;
    }
    return now < start || now > ende;
}

/**
 * Jagdzeit-Zeitraum als eine Zeile (nur wenn weder ganzjaehrig noch keineJagdzeit).
 * @param {Object} wildart
 * @returns {string}
 */
export function formatJagdzeitSpanne(wildart) {
    const s = wildart?.jagdzeitStart;
    const e = wildart?.jagdzeitEnde;
    const sOk = s != null && String(s).trim() !== '';
    const eOk = e != null && String(e).trim() !== '';
    if (!sOk || !eOk) {
        return 'Jagdzeit: siehe Verordnung';
    }
    return `Jagdzeit: ${s} - ${e}`;
}

/**
 * Kurze Beschreibung der Jagdzeit (ohne Schonzeit-Zwischenstatus).
 * @param {Object} wildart
 * @returns {string}
 */
export function getJagdzeitDatum(wildart) {
    if (wildart.keineJagdzeit) {
        return 'Keine Jagdzeit';
    }
    if (wildart.ganzjaehrig) {
        return 'Ganzjährig bejagbar';
    }
    return formatJagdzeitSpanne(wildart);
}

/** iconClass-Werte der Wildarten, die in der Schonzeit-Ansicht erscheinen (wie Legacy). */
export const SCHONZEIT_LISTE_ICON_CLASSES = [
    'rehbock', 'reh', 'wildschwein', 'gams', 'muffelwild', 'dachs', 'marder', 'iltis',
    'hermelin', 'mauswiesel', 'ente', 'fasan', 'deer', 'crow', 'eichelhaeher', 'fox', 'rabbit',
];

const allowSet = new Set(SCHONZEIT_LISTE_ICON_CLASSES);

/**
 * @param {Array<{ iconClass?: string }>} wildarten
 * @returns {Array}
 */
export function wildartenFuerSchonzeitAnsicht(wildarten) {
    if (!Array.isArray(wildarten)) return [];
    return wildarten.filter((w) => allowSet.has(w.iconClass));
}

/**
 * @param {'alle'|'schonzeit'|'jagdzeit'} tabFilter
 * @param {Array} wildarten Katalog (z.B. jagdzeitenBayern)
 * @param {Date} [now]
 * @returns {Array}
 */
export function wildartenNachTabFilter(tabFilter, wildarten, now = new Date()) {
    let list = wildartenFuerSchonzeitAnsicht(wildarten);
    if (tabFilter === 'schonzeit') {
        list = list.filter((w) => istSchonzeit(w, now));
    } else if (tabFilter === 'jagdzeit') {
        list = list.filter((w) => !istSchonzeit(w, now));
    }
    return list;
}

/**
 * Wildarten mit Jagdzeit im Sinne des Dashboard-Rotators (Schonzeit zaehlt nicht, keineJagdzeit ausgeschlossen).
 * @param {Array} wildarten
 * @param {Date} [now]
 * @returns {Array}
 */
export function filterWildartenMitJagdzeitWidget(wildarten, now = new Date()) {
    if (!Array.isArray(wildarten)) return [];
    return wildarten.filter((w) => !istSchonzeit(w, now) && !w.keineJagdzeit);
}
