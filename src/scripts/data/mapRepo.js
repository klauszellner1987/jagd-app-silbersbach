/** Firestore-Pfad: Root-Collection "hochsitze" */

function hochsitzeCol(db) {
    return db.collection('hochsitze');
}

export const mapRepo = {
    stream(db, onChange, onError) {
        return hochsitzeCol(db).onSnapshot(onChange, onError);
    },
    add(db, data) {
        return hochsitzeCol(db).add(data);
    },
    doc(db, id) {
        return hochsitzeCol(db).doc(id);
    },
};
