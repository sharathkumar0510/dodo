'use client';

import { useEffect, useState } from 'react';
import { registerServiceWorker } from '@/utils/service-worker';
import { useOnlineStatus } from '@/hooks/use-online-status';

export function ServiceWorkerRegister() {
  const isOnline = useOnlineStatus();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const register = async () => {
      try {
        await registerServiceWorker();
        setIsRegistered(true);
      } catch (error) {
        console.error('Failed to register service worker:', error);
      }
    };

    register();
  }, []);

  // Re-register when coming back online
  useEffect(() => {
    if (isOnline && !isRegistered) {
      const register = async () => {
        try {
          await registerServiceWorker();
          setIsRegistered(true);
        } catch (error) {
          console.error('Failed to register service worker:', error);
        }
      };

      register();
    }
  }, [isOnline, isRegistered]);

  return null;
}
