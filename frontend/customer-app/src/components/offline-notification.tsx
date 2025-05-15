'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { PWAService } from '@/services/pwa-service';

export function OfflineNotification() {
  const isOnline = useOnlineStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [pendingActions, setPendingActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for pending offline actions when coming back online
    const checkPendingActions = async () => {
      if (isOnline) {
        try {
          const response = await fetch('/api/offline-actions/?synced=false', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPendingActions(data.count || 0);
          }
        } catch (error) {
          console.error('Failed to check pending actions:', error);
        }
      }
    };

    if (!isOnline) {
      setShowNotification(true);
    } else {
      // When coming back online, check for pending actions and show notification
      checkPendingActions();
      setShowNotification(true);

      // Hide the notification after 5 seconds if there are no pending actions
      const timer = setTimeout(() => {
        if (pendingActions === 0) {
          setShowNotification(false);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingActions]);

  // Handle sync button click
  const handleSync = async () => {
    if (!isOnline) {
      return;
    }

    setIsSyncing(true);

    try {
      await PWAService.syncOfflineActions();
      setPendingActions(0);

      // Hide notification after successful sync
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Don't show anything if we're already on the offline page
  if (
    typeof window !== 'undefined' &&
    window.location.pathname === '/offline'
  ) {
    return null;
  }

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4 z-50">
      <div
        className={`rounded-lg p-4 shadow-lg ${
          isOnline ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {isOnline ? (
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {isOnline
                  ? 'You are back online!'
                  : 'You are currently offline'}
              </p>
              {pendingActions > 0 && isOnline && (
                <p className="text-xs mt-1">
                  You have {pendingActions} pending action
                  {pendingActions !== 1 ? 's' : ''} to sync
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {pendingActions > 0 && isOnline && (
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="mr-2 text-xs px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
              >
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            )}

            {!isOnline && (
              <button
                onClick={() => router.push('/offline')}
                className="mr-2 text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
              >
                Details
              </button>
            )}

            <button
              onClick={() => setShowNotification(false)}
              className="text-xs p-1 rounded-full hover:bg-opacity-10 hover:bg-black"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
