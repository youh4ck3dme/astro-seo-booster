// Service Worker for AstroSEOBooster PWA (v2)
// Strategy: Network-First for HTML, Stale-While-Revalidate for Assets
const CACHE_NAME = 'vimo-cache-v2';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/favicon.png',
    '/icons/favicon-32x32.png',
    '/icons/android-chrome-192x192.png',
    '/offline.html', // Make sure to create this or fallback to /
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(err => console.error('SW Cache Error', err));
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. Navigation (HTML) -> Network First, Fallback to Cache
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    return caches.match(event.request).then((response) => {
                        return response || caches.match('/');
                    });
                })
        );
        return;
    }

    // 2. Assets (CSS, JS, Images, Fonts) -> Stale While Revalidate
    if (
        url.pathname.match(/\.(css|js|png|jpg|jpeg|webp|svg|woff2?|json)$/) ||
        url.href.includes('fonts.googleapis.com') ||
        url.href.includes('fonts.gstatic.com')
    ) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    if (networkResponse.ok) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return networkResponse;
                });
                return cachedResponse || fetchPromise;
            })
        );
        return;
    }
});
