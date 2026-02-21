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
  console.log('[SW] Background Message Received:', payload);
  const notificationTitle = payload.notification?.title || 'Neue Aushang';
  const notificationOptions = {
    body: payload.notification?.body || 'Es gibt Neuigkeiten auf dem Schwarzen Brett.',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = 'revier-app-v23';

const ASSETS = [
  "./",
  "./index.html",
  "./style/main.css",
  "./js/app.js",
  "./manifest.json"
];

// Install - cache new assets
self.addEventListener("install", event => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate - delete old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch - network first, fallback to cache (only for GET requests)
self.addEventListener("fetch", event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone and cache the response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
