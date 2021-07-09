self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('cache').then(function(cache) {
        return cache.addAll([
            "/index.html",
            "/style.css",
            "/script.js",
            "/data/underlords.json",
            "/manifest.json",
            "/android-chrome-192x192.png",
            "/android-chrome-512x512.png",
            "/favicon.ico",
            "/images/arrow_upward-24px.svg",
         ]);
      })
     );
  });


  self.addEventListener('fetch', function(event) {
    event.respondWith(async function() {
       try{
         var res = await fetch(event.request);
         var cache = await caches.open('cache');
         cache.put(event.request.url, res.clone());
         return res;
       }
       catch(error){
         return caches.match(event.request);
        }
      }());
  });
