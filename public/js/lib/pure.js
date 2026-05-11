// ============================================================================
// pure.js - Reine Hilfsfunktionen ohne externe Abhaengigkeiten
// ----------------------------------------------------------------------------
// Diese Datei wird ausschliesslich von Vitest-Unit-Tests importiert.
// Die Funktionen sind 1:1 Kopien der Implementierungen aus public/js/app.js.
// Damit koennen wir Pure-Logic isoliert testen, ohne den Monolithen zu brechen.
// Bei Aenderungen IMMER beide Stellen synchron halten.
//
// Hinweis (v6 Refactor): Die presence-spezifischen Helper sind in
// `src/scripts/features/presence/presence.pure.js` umgezogen. Weitere
// Module folgen demselben Pattern und ziehen ihre Helper schrittweise
// hierher um.
// ============================================================================

/**
 * Parst einen "DD.MM" String zu einem Date im angegebenen Jahr (default: aktuelles).
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
 * @param {Date} [now] - optional, fuer Tests injizierbar
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
 * Liefert eine kurze Beschreibung der Jagdzeit fuer eine Wildart.
 */
export function getJagdzeitDatum(wildart) {
    if (wildart.keineJagdzeit) {
        return 'Keine Jagdzeit';
    }
    return `Jagdzeit: ${wildart.jagdzeitStart} - ${wildart.jagdzeitEnde}`;
}

/**
 * Komprimiert ein Bild auf maxWidth/maxHeight via Canvas.
 * Gibt einen Blob (image/jpeg, Quality 0.8) zurueck.
 */
export function compressImage(file, maxWidth = 400, maxHeight = 400) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Compression failed'));
                }, 'image/jpeg', 0.8);
            };
            img.onerror = () => reject(new Error('Image load error'));
        };
        reader.onerror = () => reject(new Error('File read error'));
    });
}

