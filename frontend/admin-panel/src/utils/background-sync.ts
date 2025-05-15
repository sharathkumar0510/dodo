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
const DB_NAME = 'dodo-admin-offline-db';
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
export const saveRequestForLater = async (url: string, method: string, data: any): Promise<string> => {
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

      for (const pendingRequest of pendingRequests) {
        try {
          await fetch(pendingRequest.url, {
            method: pendingRequest.method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(pendingRequest.data),
          });

          // Remove the request from the store after successful processing
          const deleteTransaction = db!.transaction([STORE_NAME], 'readwrite');
          const deleteStore = deleteTransaction.objectStore(STORE_NAME);
          deleteStore.delete(pendingRequest.id);
          console.log(`Request ${pendingRequest.id} processed and removed`);
        } catch (error) {
          console.error(`Error processing request ${pendingRequest.id}:`, error);
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
export const offlineFetch = async (url: string, method: string = 'GET', data: any = null): Promise<any> => {
  if (!navigator.onLine) {
    if (method === 'GET') {
      throw new Error('Cannot perform GET request while offline');
    }

    // Save the request for later processing
    const requestId = await saveRequestForLater(url, method, data);
    return {
      offline: true,
      requestId,
      message: 'Request saved for later processing',
    };
  }

  // Online, perform the request normally
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  return await response.json();
};
