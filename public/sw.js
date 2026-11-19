// Network-only navigation: never cache public pages or authenticated admin HTML.
// Old code cached any visited URL under /admin and could show the wrong page offline.
const LEGACY_CACHE = 'mlzidla-admin-shell-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await caches.delete(LEGACY_CACHE);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || req.mode !== 'navigate') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req).catch(() => new Response(
      '<!doctype html><html lang="cs"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MLŽIDLA.cz – připojení není dostupné</title><main style="font:16px system-ui,sans-serif;max-width:35rem;margin:12vh auto;padding:2rem"><h1>Stránka není momentálně dostupná</h1><p>Zkontrolujte připojení a zkuste načíst stránku znovu.</p><button style="padding:.7rem 1.2rem;cursor:pointer" onclick="location.reload()">Zkusit znovu</button></main></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
    ))
  );
});
