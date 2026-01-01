'use client';

import { useEffect, useMemo, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';

import SpecialtyProvidersClient, {
  SpecialtyProvidersResponse,
} from './SpecialtyProvidersClient';
import { getApiBaseUrl } from '@/lib/api-base';

type SearchParamsRecord = {
  zip_code?: string;
  radius_miles?: number;
  offset?: number;
  limit?: number;
};

function parseNumber(value: string | null, fallback: number) {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function isValidZip(zip: string | null | undefined): zip is string {
  if (!zip) return false;
  // US ZIP code: 5 digits, optionally -4 digits
  return /^\d{5}(-\d{4})?$/.test(zip.trim());
}

interface ZipPromptProps {
  onSubmit: (zip: string) => void;
}

function ZipPrompt({ onSubmit }: ZipPromptProps) {
  const [zip, setZip] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = zip.trim();
    if (!isValidZip(trimmed)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }
    // Store for future use
    try {
      localStorage.setItem('userZipCode', trimmed);
    } catch { /* ignore */ }
    onSubmit(trimmed);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Enter your ZIP code
        </h1>
        <p className="text-sm text-muted-foreground">
          We need your location to find nearby providers.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            placeholder="e.g. 10001"
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
              setError('');
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-center text-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            autoFocus
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Find Providers
          </button>
        </form>
        <Link href="/" className="text-sm text-primary underline">
          Go back home
        </Link>
      </div>
    </main>
  );
}

function buildQueryParams(params: string) {
  const searchParams = new URLSearchParams(params);
  const normalized: SearchParamsRecord = {
    zip_code: searchParams.get('zip_code') ?? undefined,
    radius_miles: parseNumber(searchParams.get('radius_miles'), 25),
    offset: parseNumber(searchParams.get('offset'), 0),
    limit: parseNumber(searchParams.get('limit'), 20),
  };
  return { searchParams, normalized };
}

async function fetchSpecialtyProviders(
  slug: string,
  searchParams: URLSearchParams,
  signal?: AbortSignal
): Promise<SpecialtyProvidersResponse> {
  const base = getApiBaseUrl();
  const path = `/api/v1/specialties/${slug}/providers`;
  const url = base.startsWith('http')
    ? new URL(path, base).toString()
    : path;

  const zip = searchParams.get('zip_code');
  const radius = parseNumber(searchParams.get('radius_miles'), 25);
  const offset = parseNumber(searchParams.get('offset'), 0);
  const limit = parseNumber(searchParams.get('limit'), 20);

  if (zip) url.searchParams.set('zip_code', zip);
  if (radius) url.searchParams.set('radius_miles', String(radius));
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString(), {
    cache: 'no-store',
    signal,
  });

  if (res.status === 404) {
    throw new Error('Specialty not found');
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch providers (${res.status})`);
  }

  return res.json();
}

type Props = {
  slug: string;
};

export default function SpecialtyProvidersPageClient({ slug }: Props) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const queryKey = searchParamsHook?.toString() ?? '';
  const [state, setState] = useState<{
    data: SpecialtyProvidersResponse | null;
    error: string | null;
    loading: boolean;
  }>({ data: null, error: null, loading: true });

  const { searchParams, normalized } = useMemo(
    () => buildQueryParams(queryKey),
    [queryKey]
  );

  // Check if zip_code is missing or invalid
  const hasValidZip = isValidZip(normalized.zip_code);

  // Handler when user submits ZIP from prompt
  const handleZipSubmit = (zip: string) => {
    const params = new URLSearchParams(queryKey);
    params.set('zip_code', zip);
    router.push(`/specialties/${encodeURIComponent(slug)}?${params.toString()}`);
  };

  useEffect(() => {
    // Don't fetch if zip is missing/invalid - will show prompt instead
    if (!hasValidZip) {
      setState({ data: null, error: null, loading: false });
      return;
    }

    const controller = new AbortController();

    async function load() {
      try {
        setState({ data: null, error: null, loading: true });
        const result = await fetchSpecialtyProviders(slug, searchParams, controller.signal);
        setState({ data: result, error: null, loading: false });
      } catch (err) {
        if (controller.signal.aborted) return;
        setState({
          data: null,
          error: err instanceof Error ? err.message : 'Failed to load providers',
          loading: false,
        });
      }
    }

    load();
    return () => controller.abort();
  }, [slug, searchParams, hasValidZip]);

  // Show ZIP prompt if missing or invalid
  if (!hasValidZip) {
    return <ZipPrompt onSubmit={handleZipSubmit} />;
  }

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="space-y-4 max-w-xl w-full">
          <div className="h-6 w-44 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
          <div className="h-72 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (state.error || !state.data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-3">
          <h1 className="text-xl font-semibold text-foreground">Unable to load specialty providers</h1>
          <p className="text-sm text-muted-foreground">{state.error || 'Failed to load providers'}</p>
          <Link href="/" className="text-primary text-sm underline">
            Go back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <SpecialtyProvidersClient
      data={state.data}
      params={{ slug }}
      searchParams={{
        zip_code: normalized.zip_code,
        radius_miles: normalized.radius_miles,
        offset: normalized.offset,
        limit: normalized.limit,
      }}
    />
  );
}

