import Link from 'next/link';
import { getApiBaseUrl } from '@/lib/api-base';
import SpecialtyProvidersClient, {
  SpecialtyProvidersResponse,
} from './SpecialtyProvidersClient';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: { slug: string };
  searchParams: {
    zip_code?: string;
    radius_miles?: string;
    offset?: string;
    limit?: string;
  };
};

function parseNumber(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function fetchSpecialtyProviders(
  slug: string,
  searchParams: PageProps['searchParams']
): Promise<SpecialtyProvidersResponse> {
  const base = getApiBaseUrl();
  const params = new URLSearchParams();
  if (searchParams.zip_code) params.set('zip_code', searchParams.zip_code);
  if (searchParams.radius_miles) params.set('radius_miles', searchParams.radius_miles);
  params.set('offset', searchParams.offset ?? '0');
  params.set('limit', searchParams.limit ?? '20');

  const url = `${base}/specialties/${slug}/providers?${params.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (res.status === 404) {
    throw new Error('Specialty not found');
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch providers (${res.status})`);
  }

  return res.json();
}

export default async function SpecialtyPage({ params, searchParams }: PageProps) {
  const { slug } = params;

  const offset = parseNumber(searchParams.offset, 0);
  const limit = parseNumber(searchParams.limit, 20);
  const radius = parseNumber(searchParams.radius_miles, 25);

  let data: SpecialtyProvidersResponse | null = null;
  let error: string | null = null;

  try {
    data = await fetchSpecialtyProviders(slug, searchParams);
  } catch (err: any) {
    error = err?.message || 'Failed to load providers';
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="max-w-lg text-center space-y-3">
          <h1 className="text-xl font-semibold text-foreground">Unable to load specialty providers</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link href="/" className="text-primary text-sm underline">
            Go back home
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <SpecialtyProvidersClient
      data={data}
      params={{ slug }}
      searchParams={{
        zip_code: searchParams.zip_code,
        radius_miles: radius,
        offset,
        limit,
      }}
    />
  );
}

