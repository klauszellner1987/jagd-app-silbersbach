const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'jagd-app-silbersbach'
    });
}

const db = admin.firestore();

async function createTestBulletin() {
    console.log('Erstelle Test-Aushang...');
    await db.collection('bulletinBoard').add({
        message: 'Test von Antigravity! Hörst du was? 🐗🔔',
        sender: 'System-Check',
        type: 'info',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Test-Aushang erstellt. Die Cloud Function sollte jetzt feuern.');
}

createTestBulletin().catch(console.error);
