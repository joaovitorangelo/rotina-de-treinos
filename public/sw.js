// public/sw.js
self.addEventListener('push', function (event) {
  const data = event.data?.json()?.notification;
  const options = {
    body: data?.body,
    icon: data?.image || '/icon.png',
    data: {
      url: data?.click_action,
    },
  };
  event.waitUntil(
    self.registration.showNotification(data?.title || 'Nova Notificação', options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
