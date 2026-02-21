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
  if (payload.notification) return; // System zeigt es an

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

// Notification Click Event - App öffnen (v3.3.0)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = self.registration.scope;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

const CACHE_NAME = 'revier-app-v34';

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", () => { });
