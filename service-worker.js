// === CONFIGURACIÓN DE CACHE ===
const CACHE_NAME = "healthyhabits-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/assets/icon-192x192.png",
  "/assets/icon-512x512.png",
  "/assets/images/bell.png",
  "/assets/images/health.png",
  "/assets/images/heart.png",
  "/assets/sounds/beep.mp3",
  "/assets/sounds/chime.mp3",
  "/assets/sounds/soft.mp3"
];

// === EVENTO: INSTALACIÓN ===
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache creada y lista: ", CACHE_NAME);
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activar inmediatamente el Service Worker
});

// === EVENTO: ACTIVACIÓN ===
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Cache antigua eliminada: ", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Tomar control inmediato
});

// === EVENTO: FETCH ===
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Devolver desde la caché
      }
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Guardar en la caché para futuras solicitudes
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      // Página offline predeterminada
      if (event.request.mode === "navigate") {
        return caches.match("/index.html");
      }
    })
  );
});

// === EVENTO: PUSH NOTIFICATIONS ===
self.addEventListener("push", (event) => {
  const data = event.data ? JSON.parse(event.data.text()) : { title: "¡HealthyHabits!", body: "Recuerda mantener tus hábitos saludables." };
  
  const options = {
    body: data.body,
    icon: "/assets/icon-192x192.png",
    badge: "/assets/icon-192x192.png",
    sound: `/assets/sounds/${data.sound || "beep"}.mp3`
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// === EVENTO: CLICK EN NOTIFICACIONES ===
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Cerrar la notificación
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus(); // Enfocar la ventana abierta
      }
      return clients.openWindow("/"); // Abrir una nueva ventana
    })
  );
});

// === EVENTO: SYNC (SINCRONIZACIÓN EN SEGUNDO PLANO) ===
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-reminders") {
    event.waitUntil(
      fetch("/sync-reminders").then(() => {
        console.log("Recordatorios sincronizados con el servidor.");
      }).catch((error) => {
        console.error("Error sincronizando recordatorios: ", error);
      })
    );
  }
});

