// Самоуничтожающийся service worker: снимает старую регистрацию и чистит кэш.
// Нужен, чтобы браузеры, поймавшие прежнюю версию, освободились от неё.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.registration.unregister()
      const clientsList = await self.clients.matchAll()
      clientsList.forEach((client) => client.navigate(client.url))
    })()
  )
})