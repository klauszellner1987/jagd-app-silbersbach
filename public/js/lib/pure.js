// ============================================================================
// pure.js - Reine Hilfsfunktionen ohne externe Abhaengigkeiten
// ----------------------------------------------------------------------------
// Wird von Vitest importiert. Schonzeit-/Jagdzeit-Logik liegt in
// src/scripts/features/schonzeit/schonzeit.pure.js (Single Source of Truth).
// compressImage bleibt hier bis Profil/Modul-Migration.
// ============================================================================

export {
    parseJagdzeit,
    istSchonzeit,
    getJagdzeitDatum,
} from '../../../src/scripts/features/schonzeit/schonzeit.pure.js';

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
