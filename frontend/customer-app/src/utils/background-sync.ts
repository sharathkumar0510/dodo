'use client';

import { v4 as uuidv4 } from 'uuid';

// Define the structure of a pending request
interface PendingRequest {
  id: string;
  url: string;
  method: string;
  data: any;
  timestamp: number;
}

// IndexedDB setup
const DB_NAME = 'dodo-offline-db';
const STORE_NAME = 'pending-requests';
let db: IDBDatabase | null = null;

// Initialize IndexedDB
export const initIndexedDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      console.error('IndexedDB not supported');
      reject('IndexedDB not supported');
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject('Error opening IndexedDB');
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      console.log('IndexedDB initialized successfully');
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        console.log('Object store created');
      }
    };
  });
};

// Save a request to be processed later
export const saveRequestForLater = async (
  url: string,
  method: string,
  data: any
): Promise<string> => {
  if (!db) {
    await initIndexedDB();
  }

  return new Promise((resolve, reject) => {
    if (!db) {
      reject('IndexedDB not initialized');
      return;
    }

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const requestId = uuidv4();
    const pendingRequest: PendingRequest = {
      id: requestId,
      url,
      method,
      data,
      timestamp: Date.now(),
    };

    const request = store.add(pendingRequest);

    request.onsuccess = () => {
      console.log('Request saved for later processing');
      resolve(requestId);
    };

    request.onerror = (event) => {
      console.error('Error saving request:', event);
      reject('Error saving request');
    };
  });
};

// Process all pending requests
export const processPendingRequests = async (): Promise<void> => {
  if (!db) {
    await initIndexedDB();
  }

  if (!navigator.onLine) {
    console.log('Still offline, cannot process pending requests');
    return;
  }

  return new Promise((resolve, reject) => {
    if (!db) {
      reject('IndexedDB not initialized');
      return;
    }

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = async () => {
      const pendingRequests: PendingRequest[] = request.result;
      console.log(`Processing ${pendingRequests.length} pending requests`);

      if (pendingRequests.length > 0) {
        try {
          // First, try to use the backend API to sync all actions at once
          const response = await fetch('/api/offline-actions/sync/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            // If the backend sync was successful, clear all pending requests
            const clearTransaction = db!.transaction([STORE_NAME], 'readwrite');
            const clearStore = clearTransaction.objectStore(STORE_NAME);

            for (const pendingRequest of pendingRequests) {
              clearStore.delete(pendingRequest.id);
            }

            console.log(
              `All ${pendingRequests.length} requests processed and removed via backend sync`
            );
            resolve();
            return;
          }
        } catch (error) {
          console.error(
            'Error using backend sync API, falling back to individual processing:',
            error
          );
        }

        // Fallback: Process each request individually
        for (const pendingRequest of pendingRequests) {
          try {
            // First, try to save the action to the backend offline actions store
            try {
              await fetch('/api/offline-actions/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                  action_type:
                    pendingRequest.method === 'POST'
                      ? 'create'
                      : pendingRequest.method === 'PUT'
                      ? 'update'
                      : pendingRequest.method === 'DELETE'
                      ? 'delete'
                      : 'create',
                  resource_type:
                    pendingRequest.url.split('/').pop() || 'unknown',
                  resource_id: pendingRequest.data?.id,
                  data: pendingRequest.data,
                }),
              });

              console.log(
                `Request ${pendingRequest.id} saved to backend offline actions store`
              );
            } catch (saveError) {
              console.error(
                `Error saving request ${pendingRequest.id} to backend:`,
                saveError
              );

              // If saving to backend fails, try direct processing
              await fetch(pendingRequest.url, {
                method: pendingRequest.method,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(pendingRequest.data),
              });
            }

            // Remove the request from the store after successful processing
            const deleteTransaction = db!.transaction(
              [STORE_NAME],
              'readwrite'
            );
            const deleteStore = deleteTransaction.objectStore(STORE_NAME);
            deleteStore.delete(pendingRequest.id);
            console.log(`Request ${pendingRequest.id} processed and removed`);
          } catch (error) {
            console.error(
              `Error processing request ${pendingRequest.id}:`,
              error
            );
          }
        }
      }

      resolve();
    };

    request.onerror = (event) => {
      console.error('Error getting pending requests:', event);
      reject('Error getting pending requests');
    };
  });
};

// Register for online events to process pending requests
export const registerOnlineListener = (): void => {
  window.addEventListener('online', async () => {
    console.log('Back online, processing pending requests');
    await processPendingRequests();
  });
};

// Offline-aware fetch function
export const offlineFetch = async (
  url: string,
  method: string = 'GET',
  data: any = null
): Promise<any> => {
  if (!navigator.onLine) {
    if (method === 'GET') {
      throw new Error('Cannot perform GET request while offline');
    }

    try {
      // First try to save to the backend offline actions store
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await fetch('/api/offline-actions/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              action_type:
                method === 'POST'
                  ? 'create'
                  : method === 'PUT'
                  ? 'update'
                  : method === 'DELETE'
                  ? 'delete'
                  : 'create',
              resource_type: url.split('/').pop() || 'unknown',
              resource_id: data?.id,
              data: {
                url,
                method,
                data,
              },
            }),
          });

          console.log('Action saved to backend offline actions store');

          return {
            offline: true,
            message: 'Request saved for later processing via backend',
          };
        }
      } catch (error) {
        console.error(
          'Failed to save to backend offline actions store, falling back to IndexedDB:',
          error
        );
      }

      // Fallback to IndexedDB if backend save fails or no token
      const requestId = await saveRequestForLater(url, method, data);
      return {
        offline: true,
        requestId,
        message: 'Request saved for later processing via IndexedDB',
      };
    } catch (error) {
      console.error('Failed to save offline action:', error);
      throw new Error('Failed to save offline action');
    }
  }

  // Online, perform the request normally
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  return await response.json();
};
