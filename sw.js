var dataCacheName = 'foottableData';
var cacheName = 'foottable';
var filesToCache = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/materialize.min.js',
    '/css/inline.css',
    '/css/materialize.min.css',
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    
    var dataUrl = 'https://api.football-data.org/v2/';
    if (e.request.url.indexOf(dataUrl) > -1) {
        console.log('[Service Worker] Fetch', e.request.url);
        e.respondWith(
            caches.open(dataCacheName).then(function (cache) {
                return fetch('https://api.football-data.org/v2/competitions/2021/standings', {
                    headers: {
                        'X-Auth-Token': 'a75aa1e62d6c4c87bd9fc71f7de21358'
                    }
                })
                .then(function (response) {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } else {
        console.log('[Service Worker] Fetch', e.request.url);
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request);
            })
        );
    }
});
