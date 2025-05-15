'use client';

import { useState, useEffect } from 'react';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { Button } from '@/components/ui/button';

export function InstallPrompt() {
  const { isInstallable, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show the prompt after a delay to avoid annoying users immediately
    if (isInstallable && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // 5 seconds delay
      
      return () => clearTimeout(timer);
    } else {
      setShowPrompt(false);
    }
  }, [isInstallable, dismissed]);

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-medium">Install Dodo Services</h3>
          <p className="text-sm text-gray-600">Add to your home screen for a better experience</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setDismissed(true)}>
            Not Now
          </Button>
          <Button onClick={installApp}>
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}
