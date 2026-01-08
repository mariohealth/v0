"use client";

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getProcedureOrgs, type Org } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Filter, Map } from 'lucide-react';
import { toast } from 'sonner';
import { isFeatureEnabled } from '@/lib/flags';
import { OrgCard } from '@/components/OrgCard';
import { BackButton } from '@/components/navigation/BackButton';
import { useUserPreferences } from '@/lib/hooks/useUserPreferences';
import { getEffectiveCarrier, getEffectiveZip } from '@/lib/user-locale';

// Grouping interface
interface OrgGroup {
  org_id: string;
  org_name: string;
  carrier_name?: string;
  min_price: number | string;
  savings?: string;
  distance_miles?: number;
  count_provider: number;
  in_network?: boolean;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  price_range: { min: number; max: number };
  providers: Org[];
}

// Helper function to calculate Mario Price Score (MPS)
function calculateMPS(price: number, avgPrice: number): number {
  if (!avgPrice || avgPrice <= 0) return 75;

  const ratio = price / avgPrice;

  let score = 0;
  if (ratio <= 0.6) {
    score = 90 + (1 - ratio / 0.6) * 10;
  } else if (ratio <= 0.9) {
    score = 75 + (1 - (ratio - 0.6) / 0.3) * 15;
  } else if (ratio <= 1.1) {
    score = 60 + (1 - (ratio - 0.9) / 0.2) * 15;
  } else if (ratio <= 1.5) {
    score = 40 + (1 - (ratio - 1.1) / 0.4) * 20;
  } else {
    score = Math.max(10, 40 - ((ratio - 1.5) / 1.0) * 30);
  }

  return Math.round(score);
}

// Helper function to group items for the UI
function mapOrgsToGroups(items: Org[]): OrgGroup[] {
  return items.map(item => ({
    org_name: item.org_name || 'Unknown Organization',
    org_id: item.org_id,
    carrier_name: item.carrier_name,
    address: item.address,
    city: item.city,
    state: item.state,
    zip_code: item.zip_code,
    count_provider: item.count_provider,
    in_network: item.in_network,
    distance_miles: item.distance_miles,
    min_price: typeof item.min_price === 'string' ? parseFloat(item.min_price.replace(/[^0-9.]/g, '')) : item.min_price,
    price_range: {
      min: typeof item.min_price === 'string' ? parseFloat(item.min_price.replace(/[^0-9.]/g, '')) : item.min_price,
      max: typeof item.max_price === 'string' ? parseFloat(item.max_price.replace(/[^0-9.]/g, '')) : Number(item.max_price || 0)
    },
    providers: [],
    savings: item.savings
  }));
}

export default function ProcedureDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading, profile } = useAuth();
  const { preferences } = useUserPreferences();
  const [procedureName, setProcedureName] = useState<string>('');
  const [groupedOrgs, setGroupedOrgs] = useState<OrgGroup[]>([]);
  const [avgPrice, setAvgPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const paramSlug = params.slug as string;
    if (paramSlug && paramSlug !== 'placeholder') {
      setSlug(paramSlug);
    } else if (typeof window !== 'undefined') {
      const pathMatch = window.location.pathname.match(/\/procedures\/([^/?]+)/);
      if (pathMatch && pathMatch[1] && pathMatch[1] !== 'placeholder') {
        setSlug(pathMatch[1]);
      }
    }
  }, [params.slug]);

  // Fetch procedure data regardless of auth status (public teaser)
  useEffect(() => {
    const fetchProcedureOrgs = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);
      try {
        const effectiveZip = getEffectiveZip({
          profileZip: profile?.zipCode,
          preferenceZip: preferences?.default_zip,
        });
        const effectiveCarrier = getEffectiveCarrier({
          preferredCarrierIds: preferences?.preferred_insurance_carriers || [],
        });

        const data = await getProcedureOrgs(slug, {
          zip: effectiveZip,
          carrier_id: effectiveCarrier,
        });
        setProcedureName(data.procedure_name);

        const groups = mapOrgsToGroups(data.orgs);
        setGroupedOrgs(groups);

        const prices = groups.map((g: OrgGroup) => typeof g.min_price === 'number' ? g.min_price : 0).filter((p: number) => p > 0);
        if (prices.length > 0) {
          const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
          setAvgPrice(avg);
        }
      } catch (error) {
        console.error('Error fetching procedure orgs:', error);
        setError('Failed to load facilities. Please try again.');
        setProcedureName(slug.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '));
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProcedureOrgs();
    }
  }, [slug, profile?.zipCode, preferences?.default_zip, preferences?.preferred_insurance_carriers]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-600 font-medium">Loading search results...</p>
      </main>
    );
  }

  // Teaser mode when logged out: show limited results (Rule 1 acceptable)
  // TODO: Rule 2 - only fetch slice from API, not full list
  const isLoggedOut = !user;
  const displayOrgs = isLoggedOut ? groupedOrgs.slice(0, 3) : groupedOrgs;

  // Removed local handleBack, using shared BackButton instead

  const handleOrgClick = (group: OrgGroup) => {
    // Navigate to org detail page with procedure context
    const params = new URLSearchParams({
      procedure: slug || '',
      ...(procedureName && { procedureName: procedureName })
    });
    router.push(`/orgs/${group.org_id}?${params.toString()}`);
  };

  const handleBookClick = () => {
    if (isFeatureEnabled('ENABLE_BOOKING')) {
      toast.success("Starting booking flow...");
    } else {
      toast.info("Online booking is coming soon!", {
        description: "For now, please call the facility directly."
      });
    }
  };

  const handleCallClick = (orgName: string) => {
    toast.success(`Calling ${orgName}...`, {
      description: "This would open your phone dialer."
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 md:pb-0">
      {/* Redesigned Header */}
      <div className="sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#2E5077]">{procedureName || slug}</h1>
              <p className="text-sm text-[#4DA1A9] font-medium">
                {isLoggedOut && groupedOrgs.length > 3
                  ? `Showing 3 of ${groupedOrgs.length} options`
                  : `${groupedOrgs.length} options nearby`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="flex-1 max-w-[160px] h-11 bg-white border-gray-100 text-[#2E5077] font-bold shadow-sm flex items-center gap-2 rounded-xl"
            onClick={() => toast.info("Filters coming soon!")}
          >
            <Filter className="h-4 w-4 text-[#4DA1A9]" />
            Filter & Sort
          </Button>

          <div className="flex-1" /> {/* Spacer */}

          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 bg-white border-gray-100 text-[#2E5077] shadow-sm rounded-xl"
            onClick={() => toast.info("Map view coming soon!")}
          >
            <Map className="h-5 w-5 text-[#4DA1A9]" />
          </Button>
        </div>
      </div>

      {/* Redesigned Results List */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {error ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm p-8 mt-4">
            <p className="text-destructive mb-4 font-medium">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : groupedOrgs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm p-8 mt-4">
            <p className="text-muted-foreground font-medium">No facilities found for this procedure.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayOrgs.map((group, index) => {
                const price = typeof group.min_price === 'number' ? group.min_price : 0;
                const originalPrice = avgPrice > price ? avgPrice : undefined;
                const savingsPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined;
                const mpsScore = avgPrice > 0 ? calculateMPS(price, avgPrice) : undefined;

                // Simulate "Mario's Pick" for the first result or if MPS is high
                const isMariosPick = index === 0 && (mpsScore || 0) > 80;

                return (
                  <OrgCard
                    key={group.org_id}
                    orgName={group.org_name}
                    procedureName={procedureName}
                    price={price}
                    originalPrice={originalPrice}
                    savingsPercentage={savingsPercentage}
                    distance={group.distance_miles?.toFixed(1)}
                    inNetwork={group.in_network}
                    mpsScore={mpsScore}
                    address={[group.address, group.city, group.state].filter(Boolean).join(', ')}
                    mariosPick={isMariosPick}
                    onClick={() => handleOrgClick(group)}
                    onBook={handleBookClick}
                    onCall={() => handleCallClick(group.org_name)}
                  />
                );
              })}
            </div>

            {/* Login CTA for logged-out users (teaser gate) */}
            {isLoggedOut && groupedOrgs.length > 3 && (
              <div className="mt-6 bg-gradient-to-br from-[#2E5077] to-[#4DA1A9] rounded-3xl shadow-lg p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-2">See {groupedOrgs.length - 3} More Options</h3>
                <p className="text-white/90 mb-6">
                  Sign in to compare all facilities and find the best price for your procedure.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-[#2E5077] hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-xl"
                  onClick={() => {
                    const returnUrl = encodeURIComponent(window.location.pathname);
                    router.push(`/login?returnUrl=${returnUrl}`);
                  }}
                >
                  Sign In to See All Options
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
