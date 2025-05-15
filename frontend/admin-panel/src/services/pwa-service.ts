'use client';

import { API_URL } from '@/config';

// Types
interface ManifestData {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  orientation: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose: string;
  }>;
  scope: string;
  dir: string;
  lang: string;
}

interface ServiceWorkerConfig {
  cache_name: string;
  urls_to_cache: string[];
  offline_page: string;
  cache_version: number;
}

interface WebPushConfig {
  public_key: string;
}

interface PushSubscriptionData {
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface OfflineActionData {
  action_type: 'create' | 'update' | 'delete';
  resource_type: string;
  resource_id?: string;
  data: any;
}

// Service
export const PWAService = {
  // Manifest
  async getManifest(): Promise<ManifestData> {
    const response = await fetch(`${API_URL}/admin/manifest.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch manifest');
    }
    return response.json();
  },

  // Service Worker Config
  async getServiceWorkerConfig(): Promise<ServiceWorkerConfig> {
    const response = await fetch(`${API_URL}/admin/sw-config.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch service worker config');
    }
    return response.json();
  },

  // Web Push Config
  async getWebPushConfig(): Promise<WebPushConfig> {
    const response = await fetch(`${API_URL}/webpush-config.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch web push config');
    }
    return response.json();
  },

  // Push Subscription
  async subscribeToPushNotifications(subscription: PushSubscriptionData): Promise<any> {
    const response = await fetch(`${API_URL}/api/push-subscriptions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(subscription),
    });
    
    if (!response.ok) {
      throw new Error('Failed to subscribe to push notifications');
    }
    
    return response.json();
  },

  async unsubscribeFromPushNotifications(subscriptionId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/push-subscriptions/${subscriptionId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to unsubscribe from push notifications');
    }
  },

  // Offline Actions
  async saveOfflineAction(action: OfflineActionData): Promise<any> {
    const response = await fetch(`${API_URL}/api/offline-actions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(action),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save offline action');
    }
    
    return response.json();
  },

  async syncOfflineActions(): Promise<any> {
    const response = await fetch(`${API_URL}/api/offline-actions/sync/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync offline actions');
    }
    
    return response.json();
  },

  // Offline-aware fetch
  async offlineFetch(url: string, method: string = 'GET', data: any = null): Promise<any> {
    if (!navigator.onLine) {
      if (method === 'GET') {
        throw new Error('Cannot perform GET request while offline');
      }

      // Save the request for later processing
      await this.saveOfflineAction({
        action_type: 'create',
        resource_type: url.split('/').pop() || 'unknown',
        data: {
          url,
          method,
          data,
        },
      });

      return {
        offline: true,
        message: 'Request saved for later processing',
      };
    }

    // Online, perform the request normally
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return response.json();
  },
};
