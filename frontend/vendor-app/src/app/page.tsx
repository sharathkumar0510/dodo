'use client';

import { VendorStructuredData } from '@/components/seo/vendor-structured-data';

export default function Home() {
  return (
    <>
      <VendorStructuredData />
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">
          Dodo Services - Vendor Portal
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome to the Dodo Services Vendor Portal. Manage your services,
          bookings, and customer interactions all in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">Bookings</h3>
            <p className="text-sm text-gray-500 mt-1">
              View and manage your upcoming service bookings
            </p>
            <button className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              View Bookings
            </button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">Services</h3>
            <p className="text-sm text-gray-500 mt-1">
              Manage your service offerings and availability
            </p>
            <button className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Manage Services
            </button>
          </div>

          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="font-medium">Earnings</h3>
            <p className="text-sm text-gray-500 mt-1">
              Track your earnings and payment history
            </p>
            <button className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              View Earnings
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Vendor Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Increased Visibility</h3>
              <p className="text-sm text-gray-600">
                Get discovered by thousands of potential customers in your area.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Flexible Schedule</h3>
              <p className="text-sm text-gray-600">
                Set your own availability and work on your terms.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-600">
                Get paid securely and on time for every service you provide.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Customer Management</h3>
              <p className="text-sm text-gray-600">
                Build your customer base and manage relationships effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
