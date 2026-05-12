/**
 * Repository fuer Firestore-Collection `entries` (Streckenliste/Abschuesse).
 * Tenant-Hook vorbereitet (heute noch flache Collection).
 */

export const TENANT_ID = 'silbersbach';

function entriesCollection() {
    if (!window.firebase || typeof window.firebase.firestore !== 'function') {
        throw new Error('[entriesRepo] window.firebase.firestore() nicht verfuegbar');
    }
    const db = window.firebase.firestore();
    return db.collection('entries');
}

function fieldValue() {
    return window.firebase.firestore.FieldValue;
}

export const entriesRepo = {
    TENANT_ID,

    /**
     * @param {Record<string, *>} data Rohdaten wie aus dem Modal-Formular
     * @returns {Promise<{ id: string }>}
     */
    async add(data) {
        const ref = await entriesCollection().add(data);
        return { id: ref.id };
    },

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        if (!id) return;
        await entriesCollection().doc(id).delete();
    },

    /**
     * Speichert ein komprimiertes Base64-JPEG fuer den Eintrag.
     * @param {string} id
     * @param {string} imageBase64 data-URL oder reiner Base64-String wie bisher in der App
     * @returns {Promise<void>}
     */
    async updateImageBase64(id, imageBase64) {
        if (!id) return;
        await entriesCollection().doc(id).update({ imageBase64 });
    },

    /**
     * Entfernt imageBase64 und imageUrl mittels FieldValue.delete()
     * @param {string} id
     * @returns {Promise<void>}
     */
    async clearImages(id) {
        if (!id) return;
        const fv = fieldValue();
        await entriesCollection().doc(id).update({
            imageBase64: fv.delete(),
            imageUrl: fv.delete(),
        });
    },

    /**
     * Live-Abo aller Eintraege, neuestes Datum zuerst.
     * @param {(items: Array<{ id: string } & Record<string,*>> ) => void} onSnap
     * @param {(err: Error) => void} [onErr]
     * @returns {function(): void}
     */
    streamByDatumDesc(onSnap, onErr) {
        return entriesCollection().orderBy('datum', 'desc').onSnapshot(
            (snapshot) => {
                const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                onSnap(items);
            },
            (err) => {
                console.error('[entriesRepo] Snapshot Error:', err);
                if (typeof onErr === 'function') onErr(err);
            },
        );
    },
};
