// ============================================================================
// bulletinRepo.js
// ----------------------------------------------------------------------------
// Kapselt ALLE Firestore-Zugriffe auf die `bulletinBoard` Collection
// (Schwarzes Brett). Felder pro Dokument: message, sender, timestamp (Number,
// Date.now()), isDone (boolean).
//
// Tenant-Vorbereitung: bulletinCollection() ist die einzige Stelle, an der
// der Firestore-Pfad bestimmt wird. Multi-Tenant -> hier umstellen, sonst
// nichts.
// ============================================================================

/**
 * Hardcoded Tenant fuer die Single-Tenant-Phase. Wird spaeter zu einem
 * Lookup aus auth.currentUser.customClaims.tenantId.
 */
export const TENANT_ID = 'silbersbach';

/**
 * Liefert die Firestore-Collection-Ref fuer Bulletin-Dokumente.
 *
 * Heute: `bulletinBoard`
 * Multi-Tenant-Zukunft: `tenants/${TENANT_ID}/bulletinBoard`
 */
function bulletinCollection() {
    if (!window.firebase || typeof window.firebase.firestore !== 'function') {
        throw new Error('[bulletinRepo] window.firebase.firestore() nicht verfuegbar');
    }
    const db = window.firebase.firestore();
    return db.collection('bulletinBoard');
}

export const bulletinRepo = {
    TENANT_ID,

    /**
     * Fuegt einen neuen Aushang hinzu.
     * `timestamp` wird als Date.now() Number gesetzt (1:1 wie heute, damit
     * bestehende Dokumente kompatibel bleiben).
     *
     * @param {Object} payload
     * @param {string} payload.message
     * @param {string} payload.sender
     * @returns {Promise<DocumentReference>}
     */
    async add({ message, sender }) {
        return await bulletinCollection().add({
            message,
            sender: sender || 'Unbekannt',
            timestamp: Date.now(),
            isDone: false,
        });
    },

    /**
     * Markiert einen Aushang als erledigt (isDone=true). Der Eintrag bleibt
     * in der Collection erhalten, wird aber von filterOpenItems() entfernt.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async markDone(id) {
        if (!id) return;
        await bulletinCollection().doc(id).update({ isDone: true });
    },

    /**
     * Loescht einen Aushang unwiderruflich.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async delete(id) {
        if (!id) return;
        await bulletinCollection().doc(id).delete();
    },

    /**
     * Streamt alle Aushaenge nach timestamp DESC sortiert.
     *
     * @param {(items: Array<Object>) => void} onSnap - Array von { id, ...data }
     * @param {(error: Error) => void} [onErr]
     * @returns {() => void} Unsubscribe-Funktion
     */
    streamAll(onSnap, onErr) {
        return bulletinCollection()
            .orderBy('timestamp', 'desc')
            .onSnapshot(
                (snapshot) => {
                    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                    try { onSnap(items); } catch (e) {
                        console.error('[bulletinRepo] streamAll callback error:', e);
                    }
                },
                (error) => {
                    console.error('[bulletinRepo] Firestore Snapshot Error:', error);
                    if (typeof onErr === 'function') onErr(error);
                },
            );
    },
};
