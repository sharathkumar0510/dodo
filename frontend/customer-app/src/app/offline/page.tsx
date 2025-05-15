'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PWAService } from '@/services/pwa-service';

export default function OfflinePage() {
  const router = useRouter();
  const [pendingActions, setPendingActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Set initial online status
    setIsOnline(typeof navigator !== 'undefined' && navigator.onLine);

    // Check for pending offline actions
    const checkPendingActions = async () => {
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
    };

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      checkPendingActions();
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      checkPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const handleSync = async () => {
    if (!isOnline) {
      alert('You are still offline. Please connect to the internet to sync.');
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      const result = await PWAService.syncOfflineActions();
      setSyncResult(result);
      setPendingActions(0);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncResult({ error: 'Sync failed. Please try again.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          You're Offline
        </h1>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            It looks like you're currently offline. Some features may not be
            available until you reconnect to the internet.
          </p>

          <div className="flex items-center justify-center mb-4">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></div>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {pendingActions > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-md">
            <h2 className="font-semibold mb-2">Pending Actions</h2>
            <p className="text-sm text-gray-600 mb-4">
              You have {pendingActions} pending action
              {pendingActions !== 1 ? 's' : ''} that will be synced when you're
              back online.
            </p>

            {isOnline && (
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full"
              >
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
            )}
          </div>
        )}

        {syncResult && (
          <div
            className={`mb-6 p-4 rounded-md ${
              syncResult.error ? 'bg-red-50' : 'bg-green-50'
            }`}
          >
            <p className="text-sm">
              {syncResult.error ||
                `Successfully synced ${
                  syncResult.synced_count || 0
                } action(s).`}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Button className="w-full" onClick={() => router.push('/')}>
            Try Again
          </Button>
          <p className="text-sm text-gray-500">
            Some features may be available offline if you've visited them
            before.
          </p>
        </div>
      </div>
    </div>
  );
}
