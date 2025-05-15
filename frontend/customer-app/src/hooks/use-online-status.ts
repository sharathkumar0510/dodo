'use client';

import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Check connection status using fetch
    const checkConnection = async () => {
      try {
        // Try to fetch a small file to check real connectivity
        // Use a timestamp to prevent caching
        const response = await fetch('/api/health-check?_=' + Date.now(), {
          method: 'HEAD',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        });

        setIsOnline(response.ok);
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Initial check
    if (typeof window !== 'undefined') {
      checkConnection();
    }

    // Set up event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        handleOnline();
        checkConnection(); // Verify actual connectivity
      });
      window.addEventListener('offline', handleOffline);

      // Periodically check connection when online
      const intervalId = setInterval(() => {
        if (navigator.onLine) {
          checkConnection();
        }
      }, 30000); // Check every 30 seconds

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(intervalId);
      };
    }
  }, []);

  return isOnline;
}
