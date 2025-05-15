'use client';

import { useEffect } from 'react';
import { initIndexedDB, registerOnlineListener } from '@/utils/background-sync';

export function BackgroundSyncInit() {
  useEffect(() => {
    const initSync = async () => {
      try {
        await initIndexedDB();
        registerOnlineListener();
        console.log('Background sync initialized');
      } catch (error) {
        console.error('Failed to initialize background sync:', error);
      }
    };

    initSync();
  }, []);

  return null;
}
