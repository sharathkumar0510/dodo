'use client';

// Check if the browser supports push notifications
export const isPushNotificationSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Request permission for push notifications
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (serverPublicKey: string): Promise<PushSubscription | null> => {
  if (!isPushNotificationSupported()) {
    console.error('Push notifications are not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Get the existing subscription if there is one
    let subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      return subscription;
    }
    
    // Otherwise, create a new subscription
    const applicationServerKey = urlBase64ToUint8Array(serverPublicKey);
    
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    
    // Send the subscription to your server
    await sendSubscriptionToServer(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

// Unsubscribe from push notifications
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  if (!isPushNotificationSupported()) {
    console.error('Push notifications are not supported in this browser');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      return true;
    }
    
    // Unsubscribe
    const success = await subscription.unsubscribe();
    
    if (success) {
      // Notify the server about the unsubscription
      await sendUnsubscriptionToServer(subscription);
    }
    
    return success;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
};

// Send a notification to the user
export const sendNotification = (title: string, options: NotificationOptions = {}): void => {
  if (!('Notification' in window)) {
    console.error('Notifications are not supported in this browser');
    return;
  }

  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, options);
    });
  } else {
    console.warn('Notification permission has not been granted');
  }
};

// Helper function to convert a base64 string to Uint8Array
// This is needed for the applicationServerKey
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
};

// Send the subscription to the server
const sendSubscriptionToServer = async (subscription: PushSubscription): Promise<void> => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }
    
    console.log('Subscription sent to server successfully');
  } catch (error) {
    console.error('Error sending subscription to server:', error);
    throw error;
  }
};

// Notify the server about the unsubscription
const sendUnsubscriptionToServer = async (subscription: PushSubscription): Promise<void> => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send unsubscription to server');
    }
    
    console.log('Unsubscription sent to server successfully');
  } catch (error) {
    console.error('Error sending unsubscription to server:', error);
    throw error;
  }
};
