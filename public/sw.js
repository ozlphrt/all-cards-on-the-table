// Service Worker for All Cards on the Table
const CACHE_NAME = 'all-cards-v3';
const BASE_PATH = '/all-cards-on-the-table';
// Don't cache specific JS/CSS files as they have hashed names that change
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Try to add each URL, but don't fail if some don't exist
      return Promise.allSettled(
        urlsToCache.map(url => 
          cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
            return null;
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Force all clients to reload
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }
  
  const url = new URL(event.request.url);
  
  // For hashed assets (JS/CSS with version hashes), always use network first
  // Don't cache them as they change with each build
  if (url.pathname.match(/\/assets\/.*-[a-zA-Z0-9]+\.(js|css)$/)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network fails completely, return a basic error response
        return new Response('Resource not available offline', { 
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
    return;
  }
  
  // For other resources, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses for non-hashed resources
        if (response.status === 200 && !url.pathname.match(/\/assets\/.*-[a-zA-Z0-9]+\.(js|css)$/)) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || new Response('Not found', { status: 404 });
        });
      })
  );
});

