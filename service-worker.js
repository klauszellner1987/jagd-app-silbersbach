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

const CACHE_NAME = 'revier-app-v32';

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", () => { });
