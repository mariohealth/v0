'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
  const url = new URL(`/api/v1/specialties/${slug}/providers`, base);

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

  useEffect(() => {
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
  }, [slug, searchParams]);

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

