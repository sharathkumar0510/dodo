'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';

export function NetworkStatus() {
  const isOnline = useOnlineStatus();

  return (
    <div className="fixed top-0 right-0 m-4 z-50">
      <div 
        className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        <span 
          className={`w-2 h-2 rounded-full mr-1.5 ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        {isOnline ? 'Online' : 'Offline'}
      </div>
    </div>
  );
}
