const CACHE_NAME = "revier-app-v14";

const ASSETS = [
  "./",
  "./index.html",
  "./style/main.css",
  "./js/app.js",
  "./manifest.json"
];

// Install - cache new assets (NICHT automatisch skipWaiting - warten auf User-Bestätigung)
self.addEventListener("install", event => {
  console.log("[SW] Neue Version wird installiert...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate - delete old caches
self.addEventListener("activate", event => {
  console.log("[SW] Neue Version aktiviert!");
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Message Handler - für Update-Trigger von der App
self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") {
    console.log("[SW] SKIP_WAITING empfangen - aktiviere neue Version");
    self.skipWaiting();
  }
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
