const CACHE_NAME = "fiikun-app-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./assets/fiikun_princess_favicon.png",
  "./assets/fiikun_princess_apple_touch.png",
  "./assets/fiikun_letter.png",
  "./assets/letter.png",
  "./assets/strawberry.png",
  "./assets/clock.png",
  "./assets/gift.png"
];

const NETWORK_FIRST_TYPES = new Set(["document", "script", "style", "manifest"]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    shouldUseNetworkFirst(event.request)
      ? networkFirst(event.request)
      : cacheFirst(event.request)
  );
});

function shouldUseNetworkFirst(request) {
  const url = new URL(request.url);
  return NETWORK_FIRST_TYPES.has(request.destination) ||
    url.pathname.endsWith("/") ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".json");
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match("./index.html");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

self.addEventListener("push", (event) => {
  const fallback = {
    title: "ふぃーくんからのお知らせ",
    body: "みおちゃん、ぼく呼んだよ。ちょっと会いに来てくれる？"
  };
  const data = event.data ? event.data.json() : fallback;

  event.waitUntil(
    self.registration.showNotification(data.title || fallback.title, {
      body: data.body || fallback.body,
      icon: "./assets/fiikun_princess_favicon.png",
      badge: "./assets/fiikun_princess_apple_touch.png",
      tag: data.tag || "fiikun-notification",
      data: {
        url: data.url || "./",
        type: data.type || "push"
      }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "./";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      return undefined;
    })
  );
});
