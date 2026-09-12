// Offline cache for the app shell only. Backend calls are never cached: they are
// POSTs, and the fetch handler below ignores anything that is not a GET of the shell.
// Bump CACHE on any shell edit, or an installed PWA keeps serving the old one.
const CACHE = 'pw-reset-v7';
const SHELL = [
  './',
  './reset.html',
  './zxing-reader.js',
  './zxing_reader.wasm',
  './vp-logo.png',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
