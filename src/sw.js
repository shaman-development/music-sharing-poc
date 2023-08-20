import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

const NOTIFICATION_DELAY = 1000 * 21600; // 6 hours

async function suggestPostingNotification() {
  if (!(
      self.Notification &&
      self.Notification.permission === 'granted'
  )) {
    return;
  }
  const notifTitle = 'MusicMind'
  const notifBody = `Whats playing in your mind? Share with your friends`
  const notifImg = `public/logo.svg`
  const options = {
    body: notifBody,
    icon: notifImg
  }

  await self.registration.showNotification(notifTitle, options);
  setTimeout(suggestPostingNotification, NOTIFICATION_DELAY)
}

suggestPostingNotification();

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  self.clients.openWindow(import.meta.env.BASE_URL + '#/create-post');
})