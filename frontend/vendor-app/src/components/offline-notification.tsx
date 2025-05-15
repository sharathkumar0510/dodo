'use client';

import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@/hooks/use-online-status';

export function OfflineNotification() {
  const isOnline = useOnlineStatus();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowNotification(true);
    } else {
      // When coming back online, show the notification for a moment before hiding it
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showNotification) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4 transition-all duration-300 ${isOnline ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
      <div className={`rounded-lg p-4 shadow-lg ${isOnline ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {isOnline ? (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">
              {isOnline ? 'You are back online!' : 'You are currently offline'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
