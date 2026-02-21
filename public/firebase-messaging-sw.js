importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDyMDljblBST0UTimxzfDFVR0RHBYJEkpk",
    authDomain: "jagd-app-silbersbach.firebaseapp.com",
    projectId: "jagd-app-silbersbach",
    storageBucket: "jagd-app-silbersbach.firebasestorage.app",
    messagingSenderId: "243860338509",
    appId: "1:243860338509:web:40aa7818742f594bc62904"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[SW] Hintergrund-Nachricht:', payload);

    // Falls die Nachricht bereits einen Benachrichtigungs-Block hat, 
    // zeigt Android/Chrome sie automatisch an. Wir zeigen sie nur manuell,
    // wenn es eine reine Daten-Nachricht ist, um Dopplungen zu vermeiden. (v3.1.0)
    if (payload.notification) {
        console.log('[SW] System übernimmt die Anzeige automatisch.');
        return;
    }

    const notificationTitle = 'Jagd-App Info';
    const notificationOptions = {
        body: payload.data?.message || 'Neuigkeit am Schwarzen Brett.',
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        tag: 'bulletin-notification',
        renotify: true
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Minimalistischer SW ohne Caching für maximale Zuverlässigkeit (v2.9.0)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => { }); // Nur Platzhalter
