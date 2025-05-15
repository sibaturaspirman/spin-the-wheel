const CACHE_NAME = "spin-wheel-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/wheel.js",
  "/manifest.json",
  "/assets/bg.jpg",
  "/assets/bulet.png",
  "/assets/WHEEL-BG.png",
  "/assets/BTN-START.png",
  "/assets/tick.mp3",
  "/assets/icon-192.png",
  "/assets/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
