'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { getOrgDetail } from '@/lib/api';
import type { Org } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MapPin, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useUserPreferences } from '@/lib/hooks/useUserPreferences';
import { getEffectiveCarrier, getEffectiveZip } from '@/lib/user-locale';
import { getBundleEstimate, type BundleEstimateResponse } from '@/lib/api';

const PROCEDURE_TO_BUNDLE_MAP: Record<string, string> = {
  'knee-replacement': 'knee-replacement',
  'hip-replacement': 'hip-replacement',
};


export default function OrgDetailClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useAuth();
  const { preferences } = useUserPreferences();

  const [orgData, setOrgData] = useState<Org | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [estimate, setEstimate] = useState<BundleEstimateResponse | null>(null);

  // Extract org_id from URL path: /orgs/[id]
  const orgId = pathname?.split('/').filter(Boolean).pop() || '';

  // Extract procedure context from query params
  const procedureSlug = searchParams?.get('procedure') || '';
  const procedureNameFromParam = searchParams?.get('procedureName');

  // Humanize procedure name
  const procedureName = procedureNameFromParam ||
    (procedureSlug ? procedureSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '');

  // Handle back navigation
  const handleBack = () => {
    if (procedureSlug) {
      router.push(`/procedures/${procedureSlug}`);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    // Validate required parameters
    if (!orgId || orgId === 'placeholder') {
      setError('Invalid organization ID');
      setLoading(false);
      return;
    }

    if (!procedureSlug) {
      setError('Procedure information is required. Please navigate from a procedure search.');
      setLoading(false);
      return;
    }

    async function fetchOrg() {
      try {
        setLoading(true);
        setError(null);
        const effectiveZip = getEffectiveZip({
          profileZip: profile?.zipCode,
          preferenceZip: profile?.zipCode ? undefined : preferences?.default_zip,
        });
        const effectiveCarrier = getEffectiveCarrier({
          preferredCarrierIds: preferences?.preferred_insurance_carriers || [],
        });

        const data = await getOrgDetail(orgId, procedureSlug, {
          zip: effectiveZip,
          carrier_id: effectiveCarrier,
        });
        setOrgData(data);
      } catch (err) {
        console.error('Error fetching org:', err);
        setError(err instanceof Error ? err.message : 'Failed to load organization');
      } finally {
        setLoading(false);
      }
    }

    fetchOrg();
  }, [orgId, procedureSlug, profile?.zipCode, preferences?.default_zip, preferences?.preferred_insurance_carriers]);

  // Fetch Bundle Estimate if mapping exists and carrier is selected
  useEffect(() => {
    if (!orgData?.org_id || !procedureSlug) return;

    const bundleSlug = PROCEDURE_TO_BUNDLE_MAP[procedureSlug];
    if (!bundleSlug) return;

    // Determine effective carrier (plan) ID
    const carrierPlanId = getEffectiveCarrier({
      preferredCarrierIds: preferences?.preferred_insurance_carriers || [],
    });

    if (!carrierPlanId) {
      setEstimate(null);
      return;
    }

    async function fetchEst() {
      try {
        // Pass orgData.org_id as hospitalId, and carrierPlanId
        const res = await getBundleEstimate(bundleSlug, orgData!.org_id, carrierPlanId!);
        setEstimate(res);
      } catch (e) {
        console.error("Failed to fetch bundle estimate", e);
        setEstimate(null);
      }
    }
    fetchEst();

  }, [orgData?.org_id, procedureSlug, preferences?.preferred_insurance_carriers]);

  // Checking if we should show the "Select Insurance" empty state
  const shouldShowEstimateCard = !!PROCEDURE_TO_BUNDLE_MAP[procedureSlug];
  const hasCarrier = !!getEffectiveCarrier({ preferredCarrierIds: preferences?.preferred_insurance_carriers || [] });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orgData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-semibold text-red-600">
                Unable to Load Organization
              </h2>
              <p className="text-gray-500">
                {error || 'Organization not found'}
              </p>
              <Button onClick={handleBack}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hasAboutData = orgData.address || orgData.phone;
  const showPricing = orgData.min_price !== undefined && orgData.max_price !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* 1. Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="-ml-4 text-gray-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to results
          </Button>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{orgData.org_name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 text-sm text-gray-500">
              {(orgData.city || orgData.state) && (
                <span>{[orgData.city, orgData.state].filter(Boolean).join(', ')}</span>
              )}
              {procedureName && (
                <span className="font-medium text-blue-600">{procedureName}</span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Procedure Overview */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">About this procedure</h2>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm leading-relaxed">
                This diagnostic procedure provides detailed imaging or analysis of specific anatomical structures or
                physiological functions. It is a standardized medical test used to collect clinical data for evaluation.
              </p>
              <p className="text-[10px] text-gray-400 italic">
                Informational only. Not medical advice.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Primary Service Cost Card */}
        {shouldShowEstimateCard && (
          !hasCarrier ? (
            /* Empty State: No Insurance Selected */
            <Card className="bg-white border rounded-lg shadow-sm overflow-hidden mb-6 border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🛡️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">See Your Price</h3>
                <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                  Select your insurance plan to see a personalized case rate estimate for this specific facility.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/profile')}
                >
                  Select Insurance
                </Button>
              </CardContent>
            </Card>
          ) : estimate ? (
            /* Estimate Card */
            <Card className="bg-white border rounded-lg shadow-sm overflow-hidden mb-6">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 border rounded bg-gray-50">
                      <span className="text-gray-500">⚙️</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Primary Service Cost</h2>
                  </div>
                  <p className="text-sm text-gray-500">Estimated cost with associated fees.</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${Number(estimate.estimate.total.expected).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide font-medium border-b border-dotted border-gray-400 inline-block cursor-help">
                    Case Rate
                  </div>
                </div>
              </div>

              <CardContent className="p-0">
                {/* Breakdown Accordion */}
                {/* TODO: Future: split facility vs professional subtotals when backend pricing supports distinct buckets. */}
                <div className="border-b border-gray-100">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors list-none">
                      <div className="font-semibold text-gray-700">What&apos;s included in this estimate</div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">
                          {estimate.estimate.breakdown_by_group.filter(g => Number(g.subtotal.expected) > 0).length} Items
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                      </div>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50 border-t border-gray-50">
                      <p className="pt-3 pb-2 text-xs text-gray-500">
                        This estimate includes both facility and professional services commonly billed for this procedure.
                      </p>
                      <div className="space-y-1">
                        {estimate.estimate.breakdown_by_group.map(g => (Number(g.subtotal.expected) > 0 &&
                          <div key={g.group_id} className="flex justify-between py-2 border-b border-gray-200 last:border-0 border-dashed">
                            <span>{g.group_name}</span>
                            <span className="font-medium text-gray-900">
                              ${Number(g.subtotal.expected).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 text-xs text-gray-500 leading-relaxed border-t border-gray-100">
                  This is an estimate based on your insurance plan and historical claims data. Actual costs may vary based on specific medical needs and complications.
                  {estimate.metadata.pricing_coverage_percent < 100 && (
                    <span className="block mt-1 text-amber-600">
                      (Coverage: {estimate.metadata.pricing_coverage_percent}%)
                    </span>
                  )}
                </div>

              </CardContent>
            </Card>
          ) : null
        )}

        {/* 3. About This Imaging Center (Collapsed by default) */}
        {hasAboutData && (
          <Card>
            <button
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-lg"
            >
              <h2 className="text-lg font-semibold text-gray-900">About This Imaging Center</h2>
              {isAboutExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </button>
            {isAboutExpanded && (
              <CardContent className="px-6 pb-6 pt-0 space-y-4 border-t pt-4">
                <div className="space-y-3 pt-4">
                  {orgData.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="text-sm text-gray-600">
                        <p>{orgData.address}</p>
                        <p>{[orgData.city, orgData.state, orgData.zip_code].filter(Boolean).join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {orgData.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${orgData.phone}`} className="text-sm text-blue-600 hover:underline">
                        {orgData.phone}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* 4. Pricing summary */}
        {showPricing && (
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-blue-900">Estimated Pricing</h2>
                <div className="text-2xl font-bold text-blue-700">
                  ${Number(orgData.min_price).toLocaleString()} – ${Number(orgData.max_price).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

