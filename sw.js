// Phabrika — offline support.
// After editing any file, bump VERSION so every device picks up the change.
const VERSION = 'v42-2026-11-28';
const CACHE = 'phabrika-' + VERSION;
const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'lib/three.min.js', 'lib/OrbitControls.js', 'lib/jszip.min.js', 'lib/jspdf.umd.min.js',
  "fonts/anton-latin-400-normal.woff2",
  "fonts/archivo-black-latin-400-normal.woff2",
  "fonts/bebas-neue-latin-400-normal.woff2",
  "fonts/fonts.css",
  "fonts/inter-latin-400-normal.woff2",
  "fonts/inter-latin-500-normal.woff2",
  "fonts/inter-latin-600-normal.woff2",
  "fonts/inter-tight-latin-600-normal.woff2",
  "fonts/inter-tight-latin-700-normal.woff2",
  "fonts/outfit-latin-600-normal.woff2",
  "fonts/permanent-marker-latin-400-normal.woff2",
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'img/logo.png', 'img/logo-print.png',
  'p/drip.jpg', 'p/tri.jpg'
];
// Shirt models: fetched in the background after install so every style works offline.
const MODELS = [
  "m/ph_mark.png",
  "m/fab_cotton.png",
  "m/fab_poly.png",
  "m/fab_drifit.png",
  "m4p/front.jpg",
  "m4p/front_uv.png",
  "m4p/front_sm.png",
  "m4p/left.jpg",
  "m4p/left_uv.png",
  "m4p/left_sm.png",
  "m4p/back.jpg",
  "m4p/back_uv.png",
  "m4p/back_sm.png",
  "m4p/right.jpg",
  "m4p/right_uv.png",
  "m4p/right_sm.png",
  "m4w/front.jpg",
  "m4w/front_uv.png",
  "m4w/front_sm.png",
  "m4w/left.jpg",
  "m4w/left_uv.png",
  "m4w/left_sm.png",
  "m4w/back.jpg",
  "m4w/back_uv.png",
  "m4w/back_sm.png",
  "m4w/right.jpg",
  "m4w/right_uv.png",
  "m4w/right_sm.png",
  "m4wp/front.jpg",
  "m4wp/front_uv.png",
  "m4wp/front_sm.png",
  "m4wp/left.jpg",
  "m4wp/left_uv.png",
  "m4wp/left_sm.png",
  "m4wp/back.jpg",
  "m4wp/back_uv.png",
  "m4wp/back_sm.png",
  "m4wp/right.jpg",
  "m4wp/right_uv.png",
  "m4wp/right_sm.png",
  "m4v/front.jpg",
  "m4v/front_uv.png",
  "m4v/front_sm.png",
  "m4v/left.jpg",
  "m4v/left_uv.png",
  "m4v/left_sm.png",
  "m4v/back.jpg",
  "m4v/back_uv.png",
  "m4v/back_sm.png",
  "m4v/right.jpg",
  "m4v/right_uv.png",
  "m4v/right_sm.png",
  "m4wv/front.jpg",
  "m4wv/front_uv.png",
  "m4wv/front_sm.png",
  "m4wv/left.jpg",
  "m4wv/left_uv.png",
  "m4wv/left_sm.png",
  "m4wv/back.jpg",
  "m4wv/back_uv.png",
  "m4wv/back_sm.png",
  "m4wv/right.jpg",
  "m4wv/right_uv.png",
  "m4wv/right_sm.png",
  "m4/front.jpg",
  "m4/front_uv.png",
  "m4/front_sm.png",
  "m4/left.jpg",
  "m4/left_uv.png",
  "m4/left_sm.png",
  "m4/back.jpg",
  "m4/back_uv.png",
  "m4/back_sm.png",
  "m4/right.jpg",
  "m4/right_uv.png",
  "m4/right_sm.png",
  "s/bjersey.json",
  "s/bjersey_knit.png",
  "s/polo.json",
  "s/polo_knit.png",
  "s/tee.json",
  "s/tee_cotton.png",
  "s/tee_drifit.png",
  "s/tee_knit.png",
  "s/tee_poly.png",
  "s/vjersey.json",
  "s/vjersey_knit.png",
  "s/wpolo.json",
  "s/wpolo_knit.png",
  "s/wtee.json",
  "s/wtee_knit.png",
  "s/wvjersey.json",
  "s/wvjersey_knit.png",
  "b/beach.jpg",
  "b/court.jpg",
  "b/grass.jpg",
  "b/indoor.jpg"
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
