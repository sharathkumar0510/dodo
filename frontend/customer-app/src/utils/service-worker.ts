'use client';

import { PWAService } from '@/services/pwa-service';

export async function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      // If workbox is available, use it
      if (window.workbox !== undefined) {
        const wb = window.workbox;

        // Add event listeners to handle any of PWA lifecycle events
        wb.addEventListener('installed', (event) => {
          console.log(
            `Service Worker installed: ${event.isUpdate ? 'updated' : 'new'}`
          );
        });

        wb.addEventListener('controlling', () => {
          console.log('Service Worker controlling');
        });

        wb.addEventListener('activated', (event) => {
          console.log(
            `Service Worker activated: ${event.isUpdate ? 'updated' : 'new'}`
          );

          // Sync offline actions when service worker is activated
          if (navigator.onLine) {
            syncOfflineActions();
          }
        });

        // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
        const promptNewVersionAvailable = (event) => {
          if (
            confirm(
              'A newer version of this app is available, reload to update?'
            )
          ) {
            wb.addEventListener('controlling', () => {
              window.location.reload();
            });

            // Send a message to the waiting service worker, instructing it to activate.
            wb.messageSkipWaiting();
          } else {
            console.log(
              'User rejected to reload the web app, keep using old version. New version will be automatically loaded when the app is reopened.'
            );
          }
        };

        wb.addEventListener('waiting', promptNewVersionAvailable);

        // Register the service worker after event listeners have been added
        wb.register();
      } else {
        // Fallback to standard service worker registration
        const registration = await navigator.serviceWorker.register(
          '/service-worker.js'
        );
        console.log(
          'Service Worker registered with scope:',
          registration.scope
        );

        // Fetch service worker config from backend
        try {
          const config = await PWAService.getServiceWorkerConfig();
          console.log('Service Worker config loaded:', config);

          // Send config to service worker
          if (registration.active) {
            registration.active.postMessage({
              type: 'CONFIG_UPDATE',
              payload: config,
            });
          }
        } catch (error) {
          console.error('Failed to fetch service worker config:', error);
        }
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Function to sync offline actions
async function syncOfflineActions() {
  try {
    // Check if there are any pending actions
    const response = await fetch('/api/offline-actions/?synced=false', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.count > 0) {
        // Sync actions
        await PWAService.syncOfflineActions();
        console.log(`Synced ${data.count} offline actions`);
      }
    }
  } catch (error) {
    console.error('Failed to sync offline actions:', error);
  }
}
