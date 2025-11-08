'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';

export default function SearchPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="text-gray-600">Please log in to use search.</p>
          <Link
            href="/login"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-3xl font-bold text-center">Search</h1>
        <p className="text-center text-gray-600">
          Search for healthcare procedures and prices
        </p>
        <p className="text-center text-sm text-gray-500">
          Logged in as: {user.displayName || user.email}
        </p>
        {/* Search functionality will be added here */}
      </div>
    </main>
  );
}

