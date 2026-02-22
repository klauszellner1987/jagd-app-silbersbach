const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialisiere die Admin SDK
admin.initializeApp();

exports.sendBulletinNotification = functions.firestore
    .document('bulletinBoard/{docId}')
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        const messageText = newValue.message || 'Ein neuer Aushang wurde erstellt.';
        const senderInfo = newValue.sender || 'Jemand';
        const bodyText = `${senderInfo}: ${messageText}`;

        console.log(`Verarbeite neuen Aushang von ${senderInfo}.`);

        // Alle gespeicherten FCM Tokens abrufen
        const tokensSnapshot = await admin.firestore().collection('fcmTokens').get();

        if (tokensSnapshot.empty) {
            console.log('Keine FCM Tokens in der fcmTokens Collection gefunden.');
            return null;
        }

        const tokens = [];
        tokensSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.token) {
                tokens.push(data.token);
            }
        });

        if (tokens.length === 0) {
            console.log('FCM Tokens Collection ist nicht leer, enthält aber keine "token" Felder.');
            return null;
        }

        console.log(`${tokens.length} Token(s) gefunden. Sende Multicast...`);

        // Modern Multicast Message API with Link (v3.3.0)
        const message = {
            notification: {
                title: 'Neuer Aushang (Schwarzes Brett)',
                body: bodyText
            },
            android: {
                priority: 'high', // Wichtig: Weckt das Gerät aus dem Tiefschlaf
                notification: {
                    icon: 'stock_ticker_update',
                    color: '#2f6f4e',
                    sound: 'default'
                }
            },
            webpush: {
                headers: {
                    Urgency: 'high' // Priorität für Browser-Zustellung
                },
                fcm_options: {
                    link: 'https://klauszellner1987.github.io/jagd-app-silbersbach/'
                }
            },
            tokens: tokens
        };

        try {
            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`Ergebnis: ${response.successCount} erfolgreich, ${response.failureCount} fehlgeschlagen.`);

            if (response.failureCount > 0) {
                const tokensToRemove = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        const errorCode = resp.error.code;
                        console.error(`Fehler bei Token ${tokens[idx].substring(0, 10)}...: ${errorCode}`);

                        if (errorCode === 'messaging/invalid-registration-token' ||
                            errorCode === 'messaging/registration-token-not-registered') {
                            const tokenToDelete = tokens[idx];
                            tokensToRemove.push(
                                admin.firestore().collection('fcmTokens').doc(tokenToDelete).delete()
                            );
                        }
                    }
                });
                if (tokensToRemove.length > 0) {
                    await Promise.all(tokensToRemove);
                    console.log(`${tokensToRemove.length} ungültige Tokens bereinigt.`);
                }
            }
            return null;
        } catch (error) {
            console.error('Kritischer Fehler beim Multicast-Senden:', error);
            return null;
        }
    });
