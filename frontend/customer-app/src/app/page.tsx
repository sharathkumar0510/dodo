'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { HomeStructuredData } from '@/components/seo/home-structured-data';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <>
      <HomeStructuredData />
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">
          Dodo Services - Home Services Booking
        </h1>
        <h2 className="text-xl font-semibold mb-4">Available Services</h2>
        <p className="text-gray-600 mb-6">
          Browse and book home services like cleaning, plumbing, electrical, and
          more. Our professional service providers are vetted and ready to help
          with all your home maintenance needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service cards will be added here */}
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">Home Cleaning</h3>
            <p className="text-sm text-gray-500 mt-1">
              Professional cleaning services for your home
            </p>
            <Button className="mt-4 w-full" size="sm">
              Book Now
            </Button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">Plumbing</h3>
            <p className="text-sm text-gray-500 mt-1">
              Expert plumbing services for repairs and installations
            </p>
            <Button className="mt-4 w-full" size="sm">
              Book Now
            </Button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">Electrical</h3>
            <p className="text-sm text-gray-500 mt-1">
              Professional electrical services for your home
            </p>
            <Button className="mt-4 w-full" size="sm">
              Book Now
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Why Choose Dodo Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Trusted Professionals</h3>
              <p className="text-sm text-gray-600">
                All our service providers are thoroughly vetted and
                background-checked for your peace of mind.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Satisfaction Guaranteed</h3>
              <p className="text-sm text-gray-600">
                If you're not completely satisfied with the service, we'll make
                it right or refund your money.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-600">
                Book services in just a few clicks and get instant confirmation.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">
                Our customer support team is available around the clock to
                assist you with any issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
