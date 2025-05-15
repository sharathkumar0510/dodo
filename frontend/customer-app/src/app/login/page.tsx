'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OTPForm } from '@/components/auth/otp-form';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <OTPForm />
      </div>
    </div>
  );
}
