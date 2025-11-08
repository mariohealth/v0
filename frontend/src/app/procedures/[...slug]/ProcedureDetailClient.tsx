'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import { getProcedureProviders, getProcedureBySlug, type SearchResult, type Provider } from '@/lib/api';
import { MarioAIBookingChat } from '@/components/mario-ai-booking-chat';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function ProcedureDetailClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug || '';
  const { user, loading: authLoading } = useAuth();
  const [procedure, setProcedure] = useState<SearchResult | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingChat, setShowBookingChat] = useState(false);
  const [selectedProviderName, setSelectedProviderName] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch procedure details
        const procedureData = await getProcedureBySlug(slug);
        if (procedureData) {
          setProcedure(procedureData);
        }

        // Fetch providers for this procedure
        try {
          const providersData = await getProcedureProviders(slug);
          setProviders(providersData.providers || []);
        } catch (providerError) {
          console.error('Error fetching providers:', providerError);
          // If providers endpoint doesn't exist, we'll show a message
          setProviders([]);
        }
      } catch (err) {
        console.error('Error fetching procedure data:', err);
        setError('Failed to load procedure details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

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
          <h1 className="text-3xl font-bold">Procedure Details</h1>
          <p className="text-gray-600">Please log in to view procedure details.</p>
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
          <div className="rounded-md bg-red-50 p-4 text-red-800">{error}</div>
          <Link
            href="/procedures"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            ← Back to Procedures
          </Link>
        </div>
      </main>
    );
  }

  if (!procedure) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-gray-50 p-8 text-center">
            <p className="text-gray-600">Procedure not found.</p>
            <Link
              href="/procedures"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              ← Back to Procedures
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

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{procedure.procedure_name}</h1>
          <p className="mt-2 text-gray-600">
            {procedure.category_name} • {procedure.family_name}
          </p>
          <div className="mt-4 flex items-center gap-6">
            <div>
              <div className="text-sm text-gray-500">Best Price</div>
              <div className="text-2xl font-bold text-green-600">${procedure.best_price}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Average Price</div>
              <div className="text-xl font-semibold text-gray-900">
                ${parseFloat(procedure.avg_price).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Price Range</div>
              <div className="text-sm text-gray-600">{procedure.price_range}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Providers</div>
              <div className="text-lg font-semibold text-gray-900">
                {procedure.provider_count}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => {
                setSelectedProviderName(procedure.procedure_name);
                setShowBookingChat(true);
              }}
              className="w-full rounded-md bg-[#2E5077] px-4 py-2 text-white hover:bg-[#1e3a5a] focus:outline-none focus:ring-2 focus:ring-[#2E5077] focus:ring-offset-2 transition-colors"
            >
              Book with Concierge
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Providers ({providers.length})
          </h2>
        </div>

        {providers.length > 0 ? (
          <div className="space-y-3">
            {providers.map((provider) => (
              <Link
                key={provider.provider_id}
                href={`/providers/${provider.provider_id}?from_procedure=${encodeURIComponent(slug)}`}
                className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {provider.provider_name}
                    </h3>
                    {provider.address && (
                      <p className="mt-1 text-sm text-gray-600">
                        {provider.address}
                        {provider.city && `, ${provider.city}`}
                        {provider.state && ` ${provider.state}`}
                        {provider.zip && ` ${provider.zip}`}
                      </p>
                    )}
                    {provider.phone && (
                      <p className="mt-1 text-sm text-gray-500">{provider.phone}</p>
                    )}
                    {provider.distance_miles !== null && provider.distance_miles !== undefined && (
                      <p className="mt-1 text-sm text-gray-500">
                        {provider.distance_miles.toFixed(1)} miles away
                      </p>
                    )}
                  </div>
                  {provider.price && (
                    <div className="ml-4 text-right">
                      <div className="text-xl font-bold text-green-600">
                        ${provider.price}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md bg-gray-50 p-8 text-center">
            <p className="text-gray-600">
              No provider details available. Provider list endpoint may not be implemented yet.
            </p>
          </div>
        )}
      </div>
      <BottomNav />
      <MarioAIBookingChat
        open={showBookingChat}
        onClose={() => setShowBookingChat(false)}
        providerName={selectedProviderName || procedure.procedure_name}
        procedureName={procedure.procedure_name}
      />
    </main>
  );
}

