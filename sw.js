/*0351 */
var cacheName = 'moneh-watcher';
var filesToCache = [
  'index.html',
  'css/style.css',
  'js/index.js',
  'js/googleSheet.js',
  'libs/bootstrap/5.0.2/css/bootstrap.min.css',
  'libs/jquery/3.6.0/jquery-3.6.0.min.js',
  'libs/NoSleep/0.12.0/NoSleep.min.js',
  'libs/date-fns/1.30.1/date_fns.min.js',
  'libs/bootstrap/5.0.2/js/bootstrap.bundle.min.js',
  'libs/handlebars/4.7.7/handlebars.min.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
