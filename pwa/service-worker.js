const CACHE_NAME = "school-sms-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/login.html",
  "/dashboard.html",
  "/fees.html",
  "/css/style.css",
  "/js/app.js",
  "/js/auth.js",
  "/js/students.js",
  "/js/fees.js",
  "/pwa/manifest.json"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});

