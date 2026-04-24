const CACHE_NAME = "byronz-shell-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./app-config.js",
  "./manifest.webmanifest",
  "./assets/byronz-identity.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isAppAsset = APP_SHELL.some((asset) => url.pathname.endsWith(asset.replace(/^\.\//, "/")));
  const isNavigation = request.mode === "navigate";
  const isApiRequest = /^\/(models|ambient-location|ask-stream|ask-stream-upload|ask|chat|coding|business|reset|reset-db|health)$/.test(url.pathname);

  if (isApiRequest) {
    return;
  }

  if (isNavigation || (isSameOrigin && isAppAsset)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200 && isSameOrigin) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
    );
  }
});
