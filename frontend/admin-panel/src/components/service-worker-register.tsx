'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/utils/service-worker';

export function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
