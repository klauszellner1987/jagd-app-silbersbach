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
    const notificationTitle = payload.notification?.title || 'Jagd-App Info';
    const notificationOptions = {
        body: payload.notification?.body || 'Neuigkeit am Schwarzen Brett.',
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        tag: 'bulletin-notification',
        renotify: true
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Minimalistischer SW ohne Caching für maximale Zuverlässigkeit (v2.8.0)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => { }); // Nur Platzhalter
