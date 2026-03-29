const CACHE_NAME = 'neuro-clinic-cache-v1';

// Install Event: This fires the first time the user visits the site.
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Forces the service worker to activate immediately
});

// Fetch Event: This intercepts all network requests.
// We use a "Network-First, Fallback to Cache" strategy. 
// This ensures you always get the latest code if you have internet, but loads the cached version if you are offline.
self.addEventListener('fetch', (event) => {
    // Only cache GET requests (Ignore Firebase POST/Database requests)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If the internet works, save a fresh copy of the file to the cache, then return the file.
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // IF OFFLINE: The fetch failed. Look for the file in the cache instead!
                return caches.match(event.request);
            })
    );
});