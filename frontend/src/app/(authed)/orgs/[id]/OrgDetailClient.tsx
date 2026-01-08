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

export default function OrgDetailClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useAuth();
  const { preferences } = useUserPreferences();
  
  // Extract org_id from URL path: /orgs/[id]
  const orgId = pathname?.split('/').pop() || '';
  
  // Extract procedure context from query params
  const procedureSlug = searchParams?.get('procedure') || '';
  const procedureNameFromParam = searchParams?.get('procedureName');
  
  const [orgData, setOrgData] = useState<Org | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  
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
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="h-8" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !orgData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to results
          </Button>
          
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

