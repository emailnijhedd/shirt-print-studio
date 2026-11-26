// Shirt Print Studio — offline support.
// After editing any file, bump VERSION so every device picks up the change.
const VERSION = 'v1-2026-11-26';
const CACHE = 'shirt-studio-' + VERSION;
const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'lib/three.min.js', 'lib/OrbitControls.js', 'lib/jszip.min.js',
  "fonts/anton-latin-400-normal.woff2",
  "fonts/archivo-black-latin-400-normal.woff2",
  "fonts/bebas-neue-latin-400-normal.woff2",
  "fonts/fonts.css",
  "fonts/inter-latin-400-normal.woff2",
  "fonts/inter-latin-500-normal.woff2",
  "fonts/inter-latin-600-normal.woff2",
  "fonts/inter-tight-latin-600-normal.woff2",
  "fonts/inter-tight-latin-700-normal.woff2",
  "fonts/permanent-marker-latin-400-normal.woff2",
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  'p/drip.jpg', 'p/tri.jpg'
];
// Shirt models: fetched in the background after install so every style works offline.
const MODELS = [
  "s/bjersey.json",
  "s/bjersey_knit.png",
  "s/polo.json",
  "s/polo_knit.png",
  "s/tee.json",
  "s/tee_knit.png",
  "s/vjersey.json",
  "s/vjersey_knit.png",
  "s/wpolo.json",
  "s/wpolo_knit.png",
  "s/wtee.json",
  "s/wtee_knit.png",
  "s/wvjersey.json",
  "s/wvjersey_knit.png"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
    const c = await caches.open(CACHE);
    for (const m of MODELS) { if (!(await c.match(m))) { try { await c.add(m); } catch (_) {} } }
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // The page itself: network first so updates show up, cache when offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  // Everything else: serve from cache, refresh in the background.
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req);
    const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
