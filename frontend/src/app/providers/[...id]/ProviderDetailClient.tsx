'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';

interface ProviderDetail {
  provider_id: string;
  provider_name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  website?: string;
  procedures?: Array<{
    procedure_id: string;
    procedure_name: string;
    procedure_slug: string;
    price: string;
  }>;
}

export default function ProviderDetailClient() {
  const params = useParams();
  const providerId = Array.isArray(params.id) ? params.id.join('/') : params.id || '';
  const { user, loading: authLoading } = useAuth();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!providerId) return;

      setLoading(true);
      setError(null);

      try {
        // Note: This endpoint may not exist yet in the backend
        // For now, we'll show a placeholder
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-gateway-x5pghxd.uc.gateway.dev';
        const url = `${API_BASE_URL}/api/v1/providers/${providerId}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError('Provider not found. This endpoint may not be implemented yet.');
          } else {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setProvider(data as ProviderDetail);
        }
      } catch (err) {
        console.error('Error fetching provider:', err);
        setError('Failed to load provider details. This endpoint may not be implemented yet.');
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchProvider();
    }
  }, [providerId]);

  if (authLoading || loading) {
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
          <h1 className="text-3xl font-bold">Provider Details</h1>
          <p className="text-gray-600">Please log in to view provider details.</p>
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

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-yellow-50 p-4 text-yellow-800">
            {error}
          </div>
          <Link
            href="/search"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            ← Back to Search
          </Link>
        </div>
      </main>
    );
  }

  if (!provider) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-gray-50 p-8 text-center">
            <p className="text-gray-600">Provider not found.</p>
            <Link
              href="/search"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              ← Back to Search
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/search"
          className="mb-4 inline-block text-blue-600 hover:text-blue-800"
        >
          ← Back to Search
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{provider.provider_name}</h1>

          <div className="mt-6 space-y-4">
            {provider.address && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Address</h3>
                <p className="mt-1 text-gray-900">
                  {provider.address}
                  {provider.city && `, ${provider.city}`}
                  {provider.state && ` ${provider.state}`}
                  {provider.zip && ` ${provider.zip}`}
                </p>
              </div>
            )}

            {provider.phone && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Phone</h3>
                <p className="mt-1 text-gray-900">{provider.phone}</p>
              </div>
            )}

            {provider.email && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Email</h3>
                <p className="mt-1 text-gray-900">{provider.email}</p>
              </div>
            )}

            {provider.website && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Website</h3>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 hover:text-blue-800"
                >
                  {provider.website}
                </a>
              </div>
            )}
          </div>

          {provider.procedures && provider.procedures.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Procedures
              </h2>
              <div className="space-y-3">
                {provider.procedures.map((proc) => (
                  <Link
                    key={proc.procedure_id}
                    href={`/procedures/${proc.procedure_slug}`}
                    className="block rounded-lg border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{proc.procedure_name}</h3>
                      </div>
                      {proc.price && (
                        <div className="text-lg font-bold text-green-600">
                          ${proc.price}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

