/* KRYPTAA service worker — order alerts only.
   Deliberately does NOT cache anything: the dashboard must always show live data. */
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (event) {
  var data = { title: 'KRYPTAA', body: 'New activity on the store.', url: '/orders.html' };
  if (event.data) {
    try { data = Object.assign(data, event.data.json()); }
    catch (err) { data.body = event.data.text() || data.body; }
  }
  event.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/imgs/app/icon-192.png',
    badge: '/imgs/app/icon-192.png',
    tag: data.tag || 'kryptaa',
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || '/orders.html' },
  }));
});

/* Tapping the notification focuses the dashboard if it is already open, else opens it. */
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var target = (event.notification.data && event.notification.data.url) || '/orders.html';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].url.indexOf('/orders.html') !== -1 && 'focus' in list[i]) return list[i].focus();
    }
    return self.clients.openWindow(target);
  }));
});
