// Service worker: guarda la demo para que abra aunque no haya internet.
const CACHE='agenda-demo-v1';
const ARCHIVOS=['./','./index.html','./manifest.json','./offline.html','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARCHIVOS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return res})
      .catch(()=>caches.match('./index.html').then(x=>x||caches.match('./offline.html'))));return;}
  e.respondWith(caches.match(r).then(x=>x||fetch(r).then(res=>{if(res.ok&&(r.url.startsWith(self.location.origin)||r.url.includes('fonts.g'))){const c=res.clone();caches.open(CACHE).then(k=>k.put(r,c))}return res})));
});
