'use client';

import { useState, useEffect } from 'react';
import { 
  isPushNotificationSupported, 
  requestNotificationPermission,
  subscribeToPushNotifications
} from '@/utils/push-notifications';

export function NotificationPermission() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Mock server public key - in a real app, this would come from your server
  const serverPublicKey = 'BLVYBGDLxjDYZQmjjSRFLbNXUZQrLCzwpUzOhsHkUCd_OGJbK_Ye-OtFLFcv7y7OKerY2JUKmLi-yW6fjbQKAps';

  useEffect(() => {
    // Check if push notifications are supported
    const supported = isPushNotificationSupported();
    setIsSupported(supported);

    if (supported) {
      // Check current permission status
      setPermission(Notification.permission);

      // Check if already subscribed
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      });

      // Only show the banner if permission is not granted and not denied
      if (Notification.permission === 'default') {
        // Delay showing the banner to not overwhelm the user immediately
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleRequestPermission = async () => {
    try {
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        const subscription = await subscribeToPushNotifications(serverPublicKey);
        setIsSubscribed(!!subscription);
      }
      
      setShowBanner(false);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  if (!isSupported || permission === 'denied' || permission === 'granted' || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-medium">Enable Notifications</h3>
          <p className="text-sm text-gray-600">Get updates on platform activities and alerts</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => setShowBanner(false)}
          >
            Not Now
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleRequestPermission}
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}
