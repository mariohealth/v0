'use client';

import { useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProviderCard } from '@/components/mario-card';
import { EmptyResults } from './EmptyResults';
import { BackButton } from '@/components/navigation/BackButton';

export interface SpecialtyProviderLocation {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  distance_miles?: number | null;
}

export interface SpecialtyProviderPricing {
  min_price: number;
  max_price: number;
  avg_price: number;
}

export interface SpecialtyProviderItem {
  provider_id: string;
  provider_name: string;
  location: SpecialtyProviderLocation;
  pricing: SpecialtyProviderPricing | null;
}

export interface SpecialtyInfo {
  id: string;
  name: string;
  slug: string;
}

export interface SpecialtyProvidersMetadata {
  total_providers_found: number;
  providers_returned: number;
  search_radius: number;
  providers_with_pricing: number;
  pricing_coverage_pct: number;
}

export interface SpecialtyProvidersResponse {
  specialty: SpecialtyInfo;
  providers: SpecialtyProviderItem[];
  metadata: SpecialtyProvidersMetadata;
}

// Runtime guard to keep UX graceful on malformed API data.
function coerceMetadata(
  incoming: Partial<SpecialtyProvidersMetadata> | undefined
): SpecialtyProvidersMetadata {
  const fallback: SpecialtyProvidersMetadata = {
    total_providers_found: 0,
    providers_returned: 0,
    search_radius: 25,
    providers_with_pricing: 0,
    pricing_coverage_pct: 0,
  };

  const meta = incoming || {};

  // Dev-only console warning; never throw for users.
  const warn = (msg: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[specialty-search] ${msg}`, { incoming });
    }
  };

  const asNumber = (v: unknown, field: keyof SpecialtyProvidersMetadata) => {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    warn(`Invalid or missing ${field}, using fallback ${fallback[field]}`);
    return fallback[field];
  };

  return {
    total_providers_found: asNumber(meta.total_providers_found, 'total_providers_found'),
    providers_returned: asNumber(meta.providers_returned, 'providers_returned'),
    search_radius: asNumber(meta.search_radius, 'search_radius'),
    providers_with_pricing: asNumber(meta.providers_with_pricing, 'providers_with_pricing'),
    pricing_coverage_pct: asNumber(meta.pricing_coverage_pct, 'pricing_coverage_pct'),
  };
}

interface Props {
  data: SpecialtyProvidersResponse;
  params: {
    slug: string;
  };
  searchParams: {
    zip_code?: string;
    radius_miles?: number;
    offset?: number;
    limit?: number;
  };
}

function normalizeSearchParams(input: Props['searchParams']) {
  // Ensure consistent numeric values; defaults applied only when absent.
  const toNumber = (value: number | undefined, fallback: number) =>
    typeof value === 'number' && Number.isFinite(value) ? value : fallback;

  return {
    zip: input.zip_code,
    radius: toNumber(input.radius_miles, 25),
    offset: toNumber(input.offset, 0),
    limit: toNumber(input.limit, 20),
  };
}

function formatDistance(distance?: number | null) {
  if (distance === null || distance === undefined) return '—';
  return `${distance.toFixed(1)} mi`;
}

function formatPrice(pricing: SpecialtyProviderPricing | null) {
  if (!pricing) return { price: 'Pricing unavailable', compared: '—' };
  return {
    price: `$${Number(pricing.avg_price).toFixed(0)}`,
    compared: `Range $${Number(pricing.min_price).toFixed(0)}–${Number(pricing.max_price).toFixed(0)}`,
  };
}

export default function SpecialtyProvidersClient({ data, searchParams }: Props) {
  const router = useRouter();
  // Runtime guards to keep UX graceful if API shape drifts.
  const metadata = coerceMetadata(data.metadata);
  const providers = Array.isArray(data.providers) ? data.providers : [];
  if (!Array.isArray(data.providers) && process.env.NODE_ENV !== 'production') {
    console.warn('[specialty-search] Invalid providers array, falling back to empty', {
      providers: data.providers,
    });
  }
  const { specialty } = data;
  const { offset, limit, zip, radius } = normalizeSearchParams(searchParams);
  const [isPending, startTransition] = useTransition();

  const hasPartialPricing = metadata.pricing_coverage_pct < 100;
  const hasResults = providers.length > 0;

  const rangeText = useMemo(() => {
    if (!hasResults) return null;
    const start = offset + 1;
    const end = offset + metadata.providers_returned;
    return `Showing ${start}–${end} of ${metadata.total_providers_found} providers`;
  }, [offset, metadata.providers_returned, metadata.total_providers_found, hasResults]);

  const queryWith = (nextOffset: number) => {
    const params = new URLSearchParams();
    params.set('offset', String(nextOffset));
    params.set('limit', String(limit));
    if (zip) params.set('zip_code', zip);
    if (radius) params.set('radius_miles', String(radius));
    return params.toString();
  };

  const nextOffset = offset + limit;
  const hasNext = nextOffset < metadata.total_providers_found;
  const hasPrev = offset > 0;

  const handlePageChange = (next: number) => {
    startTransition(() => {
      router.push(`?${queryWith(next)}`);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-semibold">{specialty.name}</h1>
        </div>
        {rangeText && <p className="text-sm text-muted-foreground">{rangeText}</p>}
        <p className="text-xs text-muted-foreground">
          Pricing is shown at the facility (organization) level. Providers at the same location may share the same pricing.
        </p>
        {hasPartialPricing && (
          <p className="text-sm text-muted-foreground">
            Pricing available for {metadata.providers_with_pricing} of {metadata.total_providers_found} providers.
          </p>
        )}
      </header>

      {!hasResults ? (
        <EmptyResults
          specialtyName={specialty.name}
          searchRadius={metadata.search_radius}
        />
      ) : (
        <div className="space-y-4">
          {providers.map((p) => {
            const distance = formatDistance(p.location.distance_miles);
            return (
              <ProviderCard
                key={p.provider_id}
                name={p.provider_name}
                specialty={specialty.name}
                distance={distance}
                inNetwork={false}
                pricing={p.pricing}
                savingsText={p.pricing ? undefined : 'Pricing unavailable'}
                addressLine={p.location.address || undefined}
                city={p.location.city || undefined}
                state={p.location.state || undefined}
                zip={p.location.zip_code || undefined}
                linkHref={`/providers/${p.provider_id}`}
                onBook={() => router.push(`/providers/${p.provider_id}`)}
              />
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          Page size {limit}. Total {metadata.total_providers_found}.
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!hasPrev || isPending}
            onClick={() => hasPrev && handlePageChange(Math.max(0, offset - limit))}
            className={`px-3 py-2 rounded-md text-sm border ${hasPrev ? 'text-foreground' : 'text-muted-foreground cursor-not-allowed opacity-60'
              }`}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!hasNext || isPending}
            onClick={() => hasNext && handlePageChange(nextOffset)}
            className={`px-3 py-2 rounded-md text-sm border ${hasNext ? 'text-foreground' : 'text-muted-foreground cursor-not-allowed opacity-60'
              }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

