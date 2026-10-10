const CACHE_NAME = "copper-pipe-calc-v2.2.1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
  "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css",
  "https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font@v3.4.0/dist/font-face.css",
  "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/ttf/Vazirmatn-Regular.ttf",
  "https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font@v3.4.0/dist/Sahel-Bold.ttf",
];

// نصب سرویس ورکر و ذخیره فایل‌ها در کش
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("کش جدید نصب شد");
      return cache.addAll(urlsToCache);
    })
  );
  // فعال‌سازی سریع سرویس ورکر جدید
  self.skipWaiting();
});

// فعال‌سازی سرویس ورکر و حذف کش‌های قدیمی
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            console.log("حذف کش قدیمی:", cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  // اعمال سرویس ورکر جدید روی تمام تب‌های باز
  event.waitUntil(clients.claim());
});

// استراتژی شبکه اول، سپس کش
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // اگر درخواست موفق بود
        if (response && response.status === 200 && response.type === "basic") {
          // پاسخ را کلون کن
          const responseToCache = response.clone();
          // پاسخ را در کش ذخیره کن
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // اگر شبکه در دسترس نبود، از کش استفاده کن
        return caches.match(event.request);
      })
  );
});
