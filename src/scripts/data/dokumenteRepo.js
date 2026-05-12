/** Firestore Pfad users/{uid}/documents/{categoryId} */

function documentsCol(uid) {
    if (!window.firebase || typeof window.firebase.firestore !== 'function') {
        throw new Error('[dokumenteRepo] firebase.firestore nicht verfuegbar');
    }
    return window.firebase.firestore().collection('users').doc(uid).collection('documents');
}

function fieldValue() {
    return window.firebase.firestore.FieldValue;
}

export const dokumenteRepo = {
    /**
     * @param {string} uid
     * @returns {Promise<Record<string, Record<string, *>>>}
     */
    async listAll(uid) {
        const snap = await documentsCol(uid).get();
        const out = {};
        snap.forEach((d) => { out[d.id] = d.data(); });
        return out;
    },

    /**
     * @param {string} uid
     * @param {string} catId
     * @returns {Promise<{ images?: Array<{ url: string, name: string, uploadedAt: number }> } | null>}
     */
    async getCategory(uid, catId) {
        const snap = await documentsCol(uid).doc(catId).get();
        if (!snap.exists) return null;
        return snap.data();
    },

    /**
     * Schreibt `images` + serverTimestamp fuer updatedAt.
     * @param {string} uid
     * @param {string} catId
     * @param {Array} images
     */
    async setCategoryImages(uid, catId, images) {
        await documentsCol(uid).doc(catId).set({
            images,
            updatedAt: fieldValue().serverTimestamp(),
        }, { merge: true });
    },
};
