const CACHE_NAME = "copper-pipe-calc-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css",
  "https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font@v3.4.0/dist/font-face.css",
];

// نصب سرویس ورکر و ذخیره فایل‌ها در کش
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("کش باز شد");
      return cache.addAll(urlsToCache);
    })
  );
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
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// استراتژی کش اول، سپس شبکه
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // اگر در کش موجود بود، آن را برگردان
      if (response) {
        return response;
      }

      // در غیر این صورت، درخواست را به شبکه ارسال کن
      return fetch(event.request).then((response) => {
        // اگر پاسخ معتبر نبود، آن را برگردان
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // پاسخ را کلون کن (چون stream است و فقط یک بار می‌توان آن را مصرف کرد)
        const responseToCache = response.clone();

        // پاسخ را در کش ذخیره کن
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
