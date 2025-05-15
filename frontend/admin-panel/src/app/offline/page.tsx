'use client';

import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          It seems you're currently offline. Please check your internet connection and try again.
        </p>
        <div className="space-y-4">
          <button 
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => router.push('/')}
          >
            Try Again
          </button>
          <p className="text-sm text-gray-500">
            Some features may be available offline if you've visited them before.
          </p>
        </div>
      </div>
    </div>
  );
}
