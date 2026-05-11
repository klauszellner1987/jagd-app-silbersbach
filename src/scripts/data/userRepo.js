// ============================================================================
// userRepo.js
// ----------------------------------------------------------------------------
// Kapselt ALLE Firestore-Zugriffe auf die `users/{uid}` Collection.
// Heute ausschliesslich Presence-Felder (isOnline, lastSeen, displayName,
// photoURL). Spaeter auch Profil & Settings.
//
// Tenant-Vorbereitung: usersCollection() ist die einzige Stelle, an der der
// Firestore-Pfad bestimmt wird. Multi-Tenant -> hier umstellen, sonst nichts.
// ============================================================================

/**
 * Hardcoded Tenant fuer die Single-Tenant-Phase. Wird spaeter zu einem
 * Lookup aus auth.currentUser.customClaims.tenantId.
 */
export const TENANT_ID = 'silbersbach';

/**
 * Liefert die Firestore-Collection-Ref fuer User-Dokumente.
 *
 * Heute: `users`
 * Multi-Tenant-Zukunft: `tenants/${TENANT_ID}/users`
 *
 * Lazy lookup auf `window.firebase` - der Firebase-Compat-SDK wird im
 * Layout vor dem Modul-Bundle geladen, ist hier also garantiert verfuegbar.
 */
function usersCollection() {
    if (!window.firebase || typeof window.firebase.firestore !== 'function') {
        throw new Error('[userRepo] window.firebase.firestore() nicht verfuegbar');
    }
    const db = window.firebase.firestore();
    return db.collection('users');
}

/**
 * Liefert den Firestore FieldValue-Namespace (fuer serverTimestamp).
 */
function fieldValue() {
    return window.firebase.firestore.FieldValue;
}

export const userRepo = {
    TENANT_ID,

    /**
     * Schreibt den Presence-Status des aktuellen Users.
     * `merge: true` -> bestehende Felder (z.B. profile) bleiben erhalten.
     * Fehler werden geschluckt (kein Throw), damit ein Netzwerk-Hickser
     * den App-Flow nicht abbricht.
     *
     * @param {Object} user - Firebase-Auth-User (uid, displayName, photoURL)
     * @param {boolean} isOnline
     * @returns {Promise<void>}
     */
    async upsertPresence(user, isOnline) {
        if (!user || !user.uid) return;
        try {
            await usersCollection().doc(user.uid).set({
                uid: user.uid,
                displayName: user.displayName || 'Unbekannter Jäger',
                photoURL: user.photoURL || '',
                isOnline,
                lastSeen: fieldValue().serverTimestamp(),
            }, { merge: true });
        } catch (error) {
            console.warn('[userRepo] upsertPresence fehlgeschlagen:', error?.code || error?.message);
        }
    },

    /**
     * Best-effort offline-Marker fuer beforeunload-Handler.
     * Setzt isOnline=false. Wird synchron gestartet, das Promise wird vom
     * Browser nicht abgewartet - das ist ok, weil wir nur die Anzeige fuer
     * andere Clients aktualisieren.
     *
     * @param {string} uid
     * @returns {void}
     */
    upsertPresenceSync(uid) {
        if (!uid) return;
        try {
            usersCollection().doc(uid).set({
                isOnline: false,
                lastSeen: fieldValue().serverTimestamp(),
            }, { merge: true });
        } catch (_) {
            // best effort
        }
    },

    /**
     * Streamt die User-Liste (alle Mitglieder des Reviers).
     * Heute: `users`-Collection mit limit(50).
     *
     * @param {(docs: Array<Object>) => void} onSnap - erhaelt Array von doc.data()
     * @param {(error: Error) => void} [onErr]
     * @returns {() => void} Unsubscribe-Funktion
     */
    streamAll(onSnap, onErr) {
        return usersCollection()
            .limit(50)
            .onSnapshot(
                (snapshot) => {
                    const docs = snapshot.docs.map((d) => d.data());
                    try { onSnap(docs); } catch (e) {
                        console.error('[userRepo] streamAll callback error:', e);
                    }
                },
                (error) => {
                    console.error('[userRepo] Firestore Snapshot Error:', error);
                    if (typeof onErr === 'function') onErr(error);
                },
            );
    },
};
