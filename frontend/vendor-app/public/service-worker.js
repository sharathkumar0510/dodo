// Service Worker for Dodo Services Vendor App

// Cache name and version
const CACHE_NAME = 'dodo-vendor-cache-v1';

// Default URLs to cache
const DEFAULT_URLS_TO_CACHE = [
  '/',
  '/offline',
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/images/logo.png',
  '/manifest.json'
];

// Fetch the configuration from the server
async function fetchConfig() {
  try {
    const response = await fetch('/vendor/sw-config.json');
    if (response.ok) {
      const config = await response.json();
      return config;
    }
  } catch (error) {
    console.error('Failed to fetch service worker config:', error);
  }
  
  // Return default config if fetch fails
  return {
    cache_name: CACHE_NAME,
    urls_to_cache: DEFAULT_URLS_TO_CACHE,
    offline_page: '/offline',
    cache_version: 1
  };
}

// Install event - cache assets
self.addEventListener('install', async (event) => {
  event.waitUntil(
    (async () => {
      const config = await fetchConfig();
      const cache = await caches.open(config.cache_name);
      console.log('Service Worker: Caching files');
      await cache.addAll(config.urls_to_cache);
      await self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', async (event) => {
  event.waitUntil(
    (async () => {
      const config = await fetchConfig();
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== config.cache_name)
          .map(name => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      try {
        // Try to fetch from network first
        const networkResponse = await fetch(event.request);
        
        // Cache the response for future use
        cache.put(event.request, networkResponse.clone());
        
        return networkResponse;
      } catch (error) {
        // Network failed, try to serve from cache
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If the request is for a page, serve the offline page
        if (event.request.mode === 'navigate') {
          const config = await fetchConfig();
          return cache.match(config.offline_page);
        }
        
        // Otherwise, return a 404
        return new Response('Not found', { status: 404 });
      }
    })()
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'New notification',
    icon: data.icon || '/static/images/icons/icon-192x192.png',
    badge: data.badge || '/static/images/icons/badge-72x72.png',
    data: {
      url: data.url || '/'
    }
  };
  
  if (data.image) {
    options.image = data.image;
  }
  
  if (data.actions) {
    options.actions = data.actions;
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Dodo Services', options)
  );
});

// Notification click event - open the URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Sync event - handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-actions') {
    event.waitUntil(
      fetch('/api/offline-actions/sync/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    );
  }
});
