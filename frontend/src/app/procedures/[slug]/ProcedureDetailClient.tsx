'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getProcedureOrgs, type Org } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Phone, Calendar, Star } from 'lucide-react';
import { toast } from 'sonner';
import { isFeatureEnabled } from '@/lib/flags';

export default function ProcedureDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const slug = params.slug as string;
  const [procedureName, setProcedureName] = useState<string>('');
  const [orgs, setOrgs] = useState<Org[]>([]);
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
        setOrgs(data.orgs);
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

  const handleOrgClick = (org: Org) => {
    // Route to hospital/org detail page with org data in query params
    const orgParam = encodeURIComponent(JSON.stringify(org));
    router.push(`/providers/hospital/${org.org_id}?org=${orgParam}`);
  };

  const handleBookClick = (e: React.MouseEvent, org: Org) => {
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

  const handleCallClick = (e: React.MouseEvent, org: Org) => {
    e.stopPropagation();
    // In a real app, this would be a tel: link
    toast.success(`Calling ${org.org_name}...`, {
      description: "This would open your phone dialer."
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-10">
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
                {orgs.length} {orgs.length === 1 ? 'facility' : 'facilities'} nearby
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
        ) : orgs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No facilities found for this procedure.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orgs.map((org) => (
              <Card
                key={org.org_id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleOrgClick(org)}
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
                        <h3 className="font-semibold text-lg truncate">{org.org_name}</h3>
                        {org.carrier_name && (
                          <p className="text-muted-foreground text-sm">{org.carrier_name}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-2xl font-bold text-primary">
                          ${typeof org.min_price === 'string' ? org.min_price : org.min_price.toFixed(0)}
                        </div>
                        {org.savings && (
                          <Badge variant="secondary" className="bg-accent/20 text-accent mt-1">
                            {org.savings}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                      {org.distance_miles !== null && org.distance_miles !== undefined && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{org.distance_miles.toFixed(1)} miles</span>
                        </div>
                      )}
                      {org.count_provider > 0 && (
                        <span>{org.count_provider} {org.count_provider === 1 ? 'provider' : 'providers'}</span>
                      )}
                      {org.in_network !== undefined && (
                        <Badge
                          variant={org.in_network ? "default" : "outline"}
                          className={org.in_network
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300"
                          }
                        >
                          {org.in_network ? "In-Network" : "Out-of-Network"}
                        </Badge>
                      )}
                    </div>

                    {(org.address || org.city || org.state) && (
                      <div className="text-sm text-muted-foreground mb-4 truncate">
                        <span>
                          {[org.address, org.city, org.state].filter(Boolean).join(', ')}
                          {org.zip_code && ` ${org.zip_code}`}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={(e) => handleCallClick(e, org)}
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 gap-2 mario-button-scale"
                        onClick={(e) => handleBookClick(e, org)}
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
