'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedVendor');
    
    if (hasVisited) {
      // If the user has visited before, hide the splash screen immediately
      setIsVisible(false);
    } else {
      // If this is the first visit, show the splash screen for 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem('hasVisitedVendor', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">DV</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Dodo Vendor</h1>
            <p className="text-gray-600 mt-2">Manage Your Services</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
