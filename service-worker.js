const CACHE_NAME = "footballpwaV3";
var urlsToCache = [
    "/",
    "/index.html",
    "/nav.html",
    "/team.html",
    "/pages/home.html",
    "/pages/ranking.html",
    "/pages/saved.html",
    "/css/materialize.css",
    "/css/materialize.min.css",
    "/js/api.js",
    "/js/materialize.min.js",
    "/js/nav.js",
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener("install", function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(urlsToCache);
      })
    );
  });
  
  self.addEventListener("fetch", function(event) {
    event.respondWith(
      caches
        .match(event.request, { cacheName: CACHE_NAME })
        .then(function(response) {
          if (response) {
            console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
            return response;
          }
   
          console.log(
            "ServiceWorker: Memuat aset dari server: ",
            event.request.url
          );
          return fetch(event.request);
        })
    );
  });
  
  self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });