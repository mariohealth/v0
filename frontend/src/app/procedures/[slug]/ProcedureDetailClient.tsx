'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getProcedureOrgs, type Org } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Phone, Calendar, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { isFeatureEnabled } from '@/lib/flags';

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

  // Scoring logic:
  // < 0.6x avg = 90-100
  // 0.6x - 0.9x avg = 75-90
  // 0.9x - 1.1x avg = 60-75
  // 1.1x - 1.5x avg = 40-60
  // > 1.5x avg = 10-40

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

// Function to get color for MPS
function getMPSColor(score: number): { text: string, bg: string, border: string } {
  if (score >= 85) return { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' };
  if (score >= 70) return { text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
  if (score >= 50) return { text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' };
  return { text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
}

// Helper function to group providers/orgs
function groupProvidersByOrg(items: Org[]): OrgGroup[] {
  const grouped = items.reduce((acc, item) => {
    const orgName = item.org_name || 'Unknown Organization';

    if (!acc[orgName]) {
      acc[orgName] = {
        org_name: orgName,
        org_id: item.org_id || orgName,
        carrier_name: item.carrier_name,
        address: item.address,
        city: item.city,
        state: item.state,
        zip_code: item.zip_code,
        count_provider: 0,
        in_network: item.in_network,
        distance_miles: item.distance_miles,
        min_price: typeof item.min_price === 'string' ? parseFloat(item.min_price.replace(/[^0-9.]/g, '')) : item.min_price,
        price_range: { min: Infinity, max: -Infinity },
        providers: [],
        // Keep other fields from first item as representative
        savings: item.savings
      };
    }

    acc[orgName].providers.push(item);
    acc[orgName].count_provider += 1; // Count actual providers in this group

    // Update price range
    const price = typeof item.min_price === 'string' ? parseFloat(item.min_price.replace(/[^0-9.]/g, '')) : item.min_price;
    if (!isNaN(price)) {
      acc[orgName].price_range.min = Math.min(acc[orgName].price_range.min, price);
      acc[orgName].price_range.max = Math.max(acc[orgName].price_range.max, price);

      // Update group min_price to be the absolute minimum
      if (typeof acc[orgName].min_price === 'number') {
        acc[orgName].min_price = Math.min(acc[orgName].min_price, price);
      } else {
        acc[orgName].min_price = price;
      }
    }

    return acc;
  }, {} as Record<string, OrgGroup>);

  // Convert to array and fix infinite values if no prices found
  return Object.values(grouped).map(g => {
    if (g.price_range.min === Infinity) g.price_range.min = 0;
    if (g.price_range.max === -Infinity) g.price_range.max = 0;
    return g;
  });
}

export default function ProcedureDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const slug = params.slug as string;
  const [procedureName, setProcedureName] = useState<string>('');
  const [groupedOrgs, setGroupedOrgs] = useState<OrgGroup[]>([]);
  const [avgPrice, setAvgPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProcedureOrgs = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);
      try {
        const data = await getProcedureOrgs(slug);
        setProcedureName(data.procedure_name);

        // Group the "orgs" (which are effectively providers)
        const groups = groupProvidersByOrg(data.orgs);
        setGroupedOrgs(groups);

        // Calculate average price for MPS baseline
        const prices = groups.map((g: OrgGroup) => typeof g.min_price === 'number' ? g.min_price : 0).filter((p: number) => p > 0);
        if (prices.length > 0) {
          const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
          setAvgPrice(avg);
        }
      } catch (error) {
        console.error('Error fetching procedure orgs:', error);
        setError('Failed to load facilities. Please try again.');
        // Fallback to slug-based name
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
  }, [slug]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const handleBack = () => {
    router.push('/procedures');
  };

  const handleOrgClick = (group: OrgGroup) => {
    // Route to provider detail page - use the first provider's ID or group ID
    // If the group represents a single org/location, this ID works.
    // Ideally we should route to a "Provider Group" page or just the first provider if they are same.
    // The previous code routed to /providers/[id]. 
    // We will route to the first 'provider' in the group to maintain detail view behavior.
    if (group.providers.length > 0) {
      router.push(`/providers/${group.providers[0].org_id}`);
    } else {
      router.push(`/providers/${group.org_id}`);
    }
  };

  const handleBookClick = (e: React.MouseEvent, group: OrgGroup) => {
    e.stopPropagation();
    if (isFeatureEnabled('ENABLE_BOOKING')) {
      // Navigate to booking flow
      toast.success("Starting booking flow...");
    } else {
      toast.info("Online booking is coming soon!", {
        description: "For now, please call the facility directly."
      });
    }
  };

  const handleCallClick = (e: React.MouseEvent, group: OrgGroup) => {
    e.stopPropagation();
    // In a real app, this would be a tel: link
    toast.success(`Calling ${group.org_name}...`, {
      description: "This would open your phone dialer."
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 md:top-16 bg-background border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{procedureName || slug}</h1>
              <p className="text-sm text-muted-foreground">
                {groupedOrgs.length} {groupedOrgs.length === 1 ? 'organization' : 'organizations'} nearby
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto p-4">
        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : groupedOrgs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No facilities found for this procedure.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedOrgs.map((group) => (
              <Card
                key={group.org_id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleOrgClick(group)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#4DA1A9'
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                      <circle cx="20" cy="10" r="2" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg truncate">{group.org_name}</h3>
                        {group.carrier_name && (
                          <p className="text-muted-foreground text-sm">{group.carrier_name}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-2xl font-bold text-primary">
                          ${typeof group.min_price === 'string' ? group.min_price : group.min_price.toFixed(0)}
                        </div>
                        {/* Show price range if strict min/max differ */}
                        {group.price_range.min !== group.price_range.max && group.price_range.max > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Avg: ${Math.round((group.price_range.min + group.price_range.max) / 2)}
                          </p>
                        )}
                        {group.savings && (
                          <Badge variant="secondary" className="bg-accent/20 text-accent mt-1">
                            {group.savings}
                          </Badge>
                        )}

                        {/* MPS Badge */}
                        {avgPrice > 0 && (
                          <div className="mt-2">
                            {(() => {
                              const score = calculateMPS(Number(group.min_price), avgPrice);
                              const colors = getMPSColor(score);
                              return (
                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${colors.bg} ${colors.text} ${colors.border}`}>
                                  <Sparkles className="h-3.5 w-3.5" />
                                  <span className="text-xs font-bold leading-none">MPS: {score}</span>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                      {group.distance_miles !== null && group.distance_miles !== undefined && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{group.distance_miles.toFixed(1)} miles</span>
                        </div>
                      )}
                      {group.count_provider > 0 && (
                        <span>{group.count_provider} {group.count_provider === 1 ? 'provider' : 'providers'}</span>
                      )}
                      {group.in_network !== undefined && (
                        <Badge
                          variant={group.in_network ? "default" : "outline"}
                          className={group.in_network
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300"
                          }
                        >
                          {group.in_network ? "In-Network" : "Out-of-Network"}
                        </Badge>
                      )}
                    </div>

                    {(group.address || group.city || group.state) && (
                      <div className="text-sm text-muted-foreground mb-4 truncate">
                        <span>
                          {[group.address, group.city, group.state].filter(Boolean).join(', ')}
                          {group.zip_code && ` ${group.zip_code}`}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={(e) => handleCallClick(e, group)}
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 gap-2 mario-button-scale"
                        onClick={(e) => handleBookClick(e, group)}
                      >
                        <Calendar className="h-4 w-4" />
                        Book Online
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
