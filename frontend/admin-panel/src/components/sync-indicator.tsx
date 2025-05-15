'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SyncIndicatorProps {
  isSyncing?: boolean;
}

export function SyncIndicator({ isSyncing = false }: SyncIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [syncState, setSyncState] = useState<'syncing' | 'success' | 'error'>('syncing');
  const [message, setMessage] = useState('Syncing data...');

  useEffect(() => {
    if (isSyncing) {
      setIsVisible(true);
      setSyncState('syncing');
      setMessage('Syncing data...');
    } else {
      // If we were previously syncing, show success message
      if (isVisible && syncState === 'syncing') {
        setSyncState('success');
        setMessage('Data synced successfully');
        
        // Hide after 2 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isSyncing, isVisible, syncState]);

  // Listen for online events to show sync indicator
  useEffect(() => {
    const handleOnline = () => {
      setIsVisible(true);
      setSyncState('syncing');
      setMessage('Syncing data...');
      
      // Simulate sync completion after 1.5 seconds
      const timer = setTimeout(() => {
        setSyncState('success');
        setMessage('Data synced successfully');
        
        // Hide after 2 seconds
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 2000);
        
        return () => clearTimeout(hideTimer);
      }, 1500);
      
      return () => clearTimeout(timer);
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

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
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"
              />
            ) : syncState === 'success' ? (
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm font-medium text-gray-700">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
