const CACHE_NAME = 'calendar-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch (cache first, then network)
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Push notification handler (for server-sent pushes)
self.addEventListener('push', e => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      tag: data.tag || 'calendar',
      vibrate: [200, 100, 200],
      requireInteraction: data.urgent || false,
      actions: [
        { action: 'open', title: '열기' },
        { action: 'dismiss', title: '닫기' }
      ],
      data: { url: data.url || '/' }
    })
  );
});

// Notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;

  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Background sync for offline event creation
self.addEventListener('sync', e => {
  if (e.tag === 'sync-events') {
    e.waitUntil(syncPendingEvents());
  }
});

async function syncPendingEvents() {
  // In a real app, this would sync pending offline events to Google Calendar
  const cache = await caches.open('pending-events');
  const keys = await cache.keys();
  for (const key of keys) {
    const res = await cache.match(key);
    const ev = await res.json();
    try {
      // POST to Google Calendar API
      await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ev)
      });
      await cache.delete(key);
    } catch (err) {
      console.error('Sync failed for event:', ev, err);
    }
  }
}
