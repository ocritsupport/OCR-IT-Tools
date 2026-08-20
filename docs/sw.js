// Caché para que la libreta funcione sin cobertura, que es medio sótano de
// cliente. Estrategia: primero la red (para que una versión nueva llegue sola) y
// si no hay, lo guardado.
const CACHE = 'ocr-it-tools-libreta-v1';
const FICHEROS = [
  './',
  'index.html',
  'css/estilo.css',
  'js/app.js',
  'js/qr.js',
  'js/subred.js',
  'js/chuletas.js',
  'manifest.webmanifest',
  'iconos/icono-192.png',
  'iconos/icono-512.png',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FICHEROS)));
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(nombres.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;
  // Las consultas a Cloudflare no se guardan: una respuesta DNS vieja engaña.
  if (new URL(peticion.url).origin !== self.location.origin) return;

  evento.respondWith(
    fetch(peticion)
      .then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE).then((cache) => cache.put(peticion, copia));
        return respuesta;
      })
      .catch(() => caches.match(peticion).then((guardada) => guardada || caches.match('index.html')))
  );
});
