// JuliomaqOS — Service Worker para cache offline
// Versão: v2.2 — atualizar este número ao fazer mudanças no offline.html
var CACHE_NAME = 'juliomaq-offline-v2.2';
var FILES = [
  './offline.html'
];

// Instala e faz cache do arquivo
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      console.log('[SW] Cache instalado');
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

// Remove caches antigos ao ativar
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições — serve do cache, fallback para rede
self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(resp){
        // Armazena no cache se for do mesmo origem
        if(e.request.url.startsWith(self.location.origin)){
          var clone = resp.clone();
          caches.open(CACHE_NAME).then(function(c){ c.put(e.request, clone); });
        }
        return resp;
      }).catch(function(){
        // Offline e não está no cache — retorna offline.html como fallback
        return caches.match('./offline.html');
      });
    })
  );
});
