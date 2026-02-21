const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'jagd-app-silbersbach'
    });
}

const db = admin.firestore();

async function checkTokens() {
    console.log('Prüfe fcmTokens Collection...');
    const snapshot = await db.collection('fcmTokens').get();
    if (snapshot.empty) {
        console.log('KEINE TOKENS GEFUNDEN.');
    } else {
        console.log(`${snapshot.size} Token(s) gefunden:`);
        snapshot.forEach(doc => {
            console.log(`- ${doc.id} (User: ${doc.data().userName}, Version: ${doc.data().version})`);
        });
    }
}

checkTokens().catch(console.error);
