'use client';

import { motion } from 'framer-motion';

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <motion.div
        className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );
}
