self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("sms-cache").then(cache =>
      cache.addAll([
        "/",
        "/index.html",
        "/css/style.css"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
