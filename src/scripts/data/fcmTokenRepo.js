// ============================================================================
// fcmTokenRepo.js
// ----------------------------------------------------------------------------
// Kapselt ALLE Firestore-Zugriffe auf die `fcmTokens` Collection.
// Dokument-ID = FCM-Token. Felder: token, userId, userName, device, version,
// updatedAt (serverTimestamp).
//
// Tenant-Vorbereitung: fcmTokensCollection() ist die einzige Stelle, an der
// der Firestore-Pfad bestimmt wird. Multi-Tenant -> hier umstellen, sonst
// nichts.
// ============================================================================

/**
 * Hardcoded Tenant fuer die Single-Tenant-Phase. Wird spaeter zu einem
 * Lookup aus auth.currentUser.customClaims.tenantId.
 */
export const TENANT_ID = 'silbersbach';

/**
 * Liefert die Firestore-Collection-Ref fuer FCM-Tokens.
 *
 * Heute: `fcmTokens`
 * Multi-Tenant-Zukunft: `tenants/${TENANT_ID}/fcmTokens`
 */
function fcmTokensCollection() {
    if (!window.firebase || typeof window.firebase.firestore !== 'function') {
        throw new Error('[fcmTokenRepo] window.firebase.firestore() nicht verfuegbar');
    }
    const db = window.firebase.firestore();
    return db.collection('fcmTokens');
}

/**
 * Liefert den Firestore FieldValue-Namespace (fuer serverTimestamp).
 */
function fieldValue() {
    return window.firebase.firestore.FieldValue;
}

export const fcmTokenRepo = {
    TENANT_ID,

    /**
     * Schreibt/Aktualisiert ein FCM-Token. `merge: true` -> falls das Token
     * bereits existiert, werden nur die uebergebenen Felder ueberschrieben.
     *
     * @param {Object} payload
     * @param {string} payload.token       FCM Token (auch Doc-ID)
     * @param {string} payload.userId      Firebase Auth UID oder 'anon'
     * @param {string} payload.userName    Anzeigename / Email-Prefix
     * @param {string} payload.device      User-Agent Snippet oder Plattform
     * @param {string} payload.version     APP_VERSION String
     * @returns {Promise<void>}
     */
    async upsertToken({ token, userId, userName, device, version }) {
        if (!token) return;
        await fcmTokensCollection().doc(token).set({
            token,
            userId: userId || 'anon',
            userName: userName || 'Unbekannt',
            device: device || 'unknown',
            version: version || '',
            updatedAt: fieldValue().serverTimestamp(),
        }, { merge: true });
    },
};
