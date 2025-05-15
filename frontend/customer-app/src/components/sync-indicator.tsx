'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { PWAService } from '@/services/pwa-service';

interface SyncIndicatorProps {
  isSyncing?: boolean;
}

export function SyncIndicator({
  isSyncing: propIsSyncing = false,
}: SyncIndicatorProps) {
  const isOnline = useOnlineStatus();
  const [isVisible, setIsVisible] = useState(false);
  const [syncState, setSyncState] = useState<'syncing' | 'success' | 'error'>(
    'syncing'
  );
  const [message, setMessage] = useState('Syncing data...');
  const [pendingActions, setPendingActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(propIsSyncing);

  // Check for pending offline actions
  useEffect(() => {
    const checkPendingActions = async () => {
      if (!isOnline) return;

      try {
        const response = await fetch('/api/offline-actions/?synced=false', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const count = data.count || 0;
          setPendingActions(count);

          // Auto-sync if there are pending actions and we're online
          if (count > 0 && isOnline && !isSyncing) {
            syncActions();
          }
        }
      } catch (error) {
        console.error('Failed to check pending actions:', error);
      }
    };

    // Check when coming online
    if (isOnline) {
      checkPendingActions();
    }

    // Set up periodic checking
    const intervalId = setInterval(() => {
      if (isOnline) {
        checkPendingActions();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [isOnline, isSyncing]);

  // Sync actions
  const syncActions = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    setIsVisible(true);
    setSyncState('syncing');
    setMessage(
      `Syncing ${pendingActions} ${pendingActions === 1 ? 'item' : 'items'}...`
    );

    try {
      await PWAService.syncOfflineActions();
      setPendingActions(0);
      setSyncState('success');
      setMessage('Data synced successfully');

      // Hide after 2 seconds
      setTimeout(() => {
        setIsVisible(false);
        setIsSyncing(false);
      }, 2000);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncState('error');
      setMessage('Sync failed. Try again later.');

      // Hide after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
        setIsSyncing(false);
      }, 3000);
    }
  };

  // Handle prop changes
  useEffect(() => {
    if (propIsSyncing) {
      setIsVisible(true);
      setIsSyncing(true);
      setSyncState('syncing');
      setMessage('Syncing data...');
    } else if (isSyncing !== propIsSyncing) {
      // If we were previously syncing, show success message
      if (isVisible && syncState === 'syncing') {
        setSyncState('success');
        setMessage('Data synced successfully');

        // Hide after 2 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
          setIsSyncing(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [propIsSyncing, isVisible, syncState, isSyncing]);

  // Listen for online events to show sync indicator
  useEffect(() => {
    const handleOnline = () => {
      // Only show sync indicator if there are pending actions
      if (pendingActions > 0) {
        syncActions();
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [pendingActions]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center space-x-2">
            {syncState === 'syncing' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
              />
            ) : syncState === 'success' ? (
              <svg
                className="w-4 h-4 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-red-500"
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
            )}
            <span className="text-sm font-medium text-gray-700">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
