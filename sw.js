/* Win It or Bin It service worker: the game always loads fresh when you're online, and from the last copy when you're not. */
const C='wibi-v2';
const CORE=['./','index.html','play.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).catch(()=>{}));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})
   .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match(r.mode==='navigate'?'play.html':r))));return;}
 if(/fonts\.(googleapis|gstatic)\.com$|^unpkg\.com$/.test(u.host)){
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res;})));}
});
