'use client';

import { useEffect, useState } from 'react';
import { PWAService } from '@/services/pwa-service';

export function ServiceWorkerRegistration() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service worker registered successfully', reg);
          setIsRegistered(true);
          setRegistration(reg);
          
          // Check if push is supported
          const pushSupport = 'PushManager' in window;
          setPushSupported(pushSupport);
          
          if (pushSupport && reg.pushManager) {
            // Check if already subscribed
            const subscription = await reg.pushManager.getSubscription();
            setPushEnabled(!!subscription);
          }
        } catch (error) {
          console.error('Service worker registration failed:', error);
        }
      }
    };

    registerServiceWorker();
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = async () => {
    if (!registration || !pushSupported) return;
    
    try {
      // Get VAPID public key
      const webPushConfig = await PWAService.getWebPushConfig();
      
      // Convert base64 string to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(webPushConfig.public_key);
      
      // Subscribe
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      
      // Send subscription to server
      const subscriptionJson = subscription.toJSON();
      await PWAService.subscribeToPushNotifications({
        endpoint: subscriptionJson.endpoint!,
        p256dh: subscriptionJson.keys!.p256dh,
        auth: subscriptionJson.keys!.auth,
      });
      
      setPushEnabled(true);
      console.log('Push notification subscription successful');
    } catch (error) {
      console.error('Push notification subscription failed:', error);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribeFromPush = async () => {
    if (!registration) return;
    
    try {
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Unsubscribe locally
        await subscription.unsubscribe();
        
        // Unsubscribe on server
        // Note: You would need the subscription ID from the server
        // This is a simplified example
        // await PWAService.unsubscribeFromPushNotifications(subscriptionId);
        
        setPushEnabled(false);
        console.log('Push notification unsubscription successful');
      }
    } catch (error) {
      console.error('Push notification unsubscription failed:', error);
    }
  };

  // Helper function to convert base64 to Uint8Array
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  };

  // This component doesn't render anything visible
  return null;
}
