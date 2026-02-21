const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialisiere die Admin SDK
admin.initializeApp();

exports.sendBulletinNotification = functions.firestore
    .document('bulletinBoard/{docId}')
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        // Fallback-Nachricht, falls der Text fehlt
        const messageText = newValue.message || 'Ein neuer Aushang wurde erstellt.';
        const senderInfo = newValue.sender || 'Jemand';

        const bodyText = `${senderInfo}: ${messageText}`;

        // Alle gespeicherten FCM Tokens abrufen
        const tokensSnapshot = await admin.firestore().collection('fcmTokens').get();

        if (tokensSnapshot.empty) {
            console.log('Keine FCM Tokens gefunden. Senden abgebrochen.');
            return null;
        }

        const tokens = [];
        const tokenDocs = []; // Referenz auf die Dokumente behalten für späteres Löschen

        tokensSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.token) {
                tokens.push(data.token);
                tokenDocs.push(doc); // Gleicher Index wie im tokens Array
            }
        });

        if (tokens.length === 0) {
            console.log('FCM Tokens Collection existiert, ist aber leer.');
            return null;
        }

        // Notification Payload
        // Achtung: Auf iOS wird das icon oft ignoriert, aber Android nutzt es
        const payload = {
            notification: {
                title: 'Neuer Aushang (Schwarzes Brett)',
                body: bodyText,
                icon: 'https://klauszellner1987.github.io/jagd-app-silbersbach/icons/icon-192.png'
            }
        };

        try {
            // Sende Multicast an alle Geräte in einem Rutsch
            const response = await admin.messaging().sendToDevice(tokens, payload);
            console.log(`Erfolgreich gesendet an ${response.successCount} Geräte.`);

            // Bereinigen ungültiger Tokens (z. B. wenn die App deinstalliert wurde)
            const tokensToRemove = [];
            response.results.forEach((result, index) => {
                const error = result.error;
                if (error) {
                    console.error('Fehler beim Senden an Token:', tokens[index], error);
                    // Entferne ungültige Registrierungstokens aus der Datenbank
                    if (error.code === 'messaging/invalid-registration-token' ||
                        error.code === 'messaging/registration-token-not-registered') {
                        tokensToRemove.push(tokenDocs[index].ref.delete());
                    }
                }
            });

            return Promise.all(tokensToRemove);

        } catch (error) {
            console.error('Genereller Fehler beim Versenden der Multicast-Nachricht:', error);
            return null;
        }
    });
