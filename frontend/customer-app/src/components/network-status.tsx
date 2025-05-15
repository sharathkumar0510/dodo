'use client';

import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Wifi, WifiOff } from 'lucide-react';

export function NetworkStatus() {
  const isOnline = useOnlineStatus();
  const [showIndicator, setShowIndicator] = useState(true);
  const [lastStatus, setLastStatus] = useState(isOnline);

  useEffect(() => {
    // Always show the indicator when the status changes
    if (lastStatus !== isOnline) {
      setShowIndicator(true);
      setLastStatus(isOnline);

      // Hide the indicator after 5 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, lastStatus]);

  // Hide after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!showIndicator) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-md transition-all duration-300 ${
          isOnline
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}
      >
        {isOnline ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Online</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Offline</span>
          </>
        )}
      </div>
    </div>
  );
}
