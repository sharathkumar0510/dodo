'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RegistrationForm } from '@/components/auth/registration-form';
import { useAuth } from '@/contexts/auth-context';

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = searchParams.get('mobile');

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
    
    // If no mobile number is provided, redirect to login
    if (!mobile && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, mobile, router]);

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
        <RegistrationForm />
      </div>
    </div>
  );
}
