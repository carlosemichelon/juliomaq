// JuliomaqOS — Service Worker Online (network-first)
// Sempre busca versão atualizada da rede; só usa cache se offline
var CACHE = 'juliomaq-online-v2.5';

self.addEventListener('install', function(e){
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE && k !== 'juliomaq-offline-v2.5'; })
            .map(function(k){ return caches.delete(k); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

// Network-first: tenta rede, fallback para cache
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  if(!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request, {cache: 'no-store'})
      .then(function(resp){
        var clone = resp.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        return resp;
      })
      .catch(function(){
        return caches.match(e.request);
      })
  );
});
