const CACHE = "takeshima-static-v1";
const PRECACHE = ["/", "/faq/", "/access/", "/offline/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // ハッシュ付きアセットはキャッシュ優先
  if (url.pathname.startsWith("/_astro/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((res) => {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(request, copy));
              return res;
            })
            .catch(() => cached)
      )
    );
    return;
  }

  // その他のページ遷移はネットワーク優先、失敗時はキャッシュ
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/offline/")))
    );
    return;
  }

  // その他はネットワーク優先、失敗時はキャッシュ
  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((r) => r || fetch(request)))
  );
});
