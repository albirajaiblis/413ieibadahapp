const CACHE_NAME = 'prayer-app-v4';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/variables.css',
  './css/main.css',
  './css/components.css',
  './js/app.js',
  './js/store.js',
  './js/geoEngine.js',
  './js/quizData.js',
  './js/quizEngine.js',
  './js/prayerEngine.js',
  './js/cityData.js',
  './js/tasbihEngine.js',
  './js/dzikirData.js',
  './js/qiblaEngine.js',
  './js/radioData.js',
  './js/radioEngine.js',
  './js/views/homeView.js',
  './js/views/prayerView.js',
  './js/views/worshipView.js',
  './js/views/quizView.js',
  './js/views/progressView.js',
  './js/views/settingsView.js',
  './assets/icons/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell including Radio Sunnah');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Pass radio audio stream requests straight to network
  if (event.request.url.includes('stream') || event.request.url.includes('live') || event.request.url.includes('8000')) {
    return;
  }

  // Cache-first strategy for app static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
