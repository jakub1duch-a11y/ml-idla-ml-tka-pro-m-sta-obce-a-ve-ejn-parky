// Minimal service worker: enables PWA install, network-first (never serves stale app code).
const OFFLINE_CACHE = 'mlzidla-admin-shell-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.mode !== 'navigate') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(OFFLINE_CACHE).then((cache) => cache.put('/admin', copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match('/admin'))
  );
});
