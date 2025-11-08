'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Star, MapPin, Phone, Clock, Copy, Navigation, CheckCircle2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/components/ui/utils';
import type { ProviderDetail } from '@/lib/api';

interface MarioProviderHospitalDetailProps {
  provider: ProviderDetail;
  onBookConcierge: () => void;
  onCall?: () => void;
  onBack?: () => void;
}

type TabType = 'overview' | 'costs' | 'location';

export function MarioProviderHospitalDetail({
  provider,
  onBookConcierge,
  onCall,
  onBack,
}: MarioProviderHospitalDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [proceduresPage, setProceduresPage] = useState(1);
  const proceduresPerPage = 8;
  const proceduresObserverRef = useRef<HTMLDivElement>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleCall = () => {
    if (provider.phone) {
      if (onCall) {
        onCall();
      } else {
        window.location.href = `tel:${provider.phone.replace(/\D/g, '')}`;
      }
    }
  };

  const handleCopyAddress = () => {
    const address = `${provider.address || ''}${provider.city ? `, ${provider.city}` : ''}${provider.state ? ` ${provider.state}` : ''}${provider.zip ? ` ${provider.zip}` : ''}`.trim();
    if (address) {
      navigator.clipboard.writeText(address);
      // Could show toast here
    }
  };

  const handleGetDirections = () => {
    const address = `${provider.address || ''}${provider.city ? `, ${provider.city}` : ''}${provider.state ? ` ${provider.state}` : ''}${provider.zip ? ` ${provider.zip}` : ''}`.trim();
    if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  // Infinite scroll for procedures
  useEffect(() => {
    if (!provider.procedures || provider.procedures.length <= proceduresPerPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const totalPages = Math.ceil((provider.procedures?.length || 0) / proceduresPerPage);
          if (proceduresPage < totalPages) {
            setProceduresPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (proceduresObserverRef.current) {
      observer.observe(proceduresObserverRef.current);
    }

    return () => {
      if (proceduresObserverRef.current) {
        observer.unobserve(proceduresObserverRef.current);
      }
    };
  }, [proceduresPage, provider.procedures]);

  const displayedProcedures = provider.procedures
    ? provider.procedures.slice(0, proceduresPage * proceduresPerPage)
    : [];

  // Format provider name (assume it might be "Dr. Name" or just "Name")
  const doctorName = provider.provider_name || 'Provider';
  const specialty = 'Healthcare Provider'; // Could be extracted from provider data if available
  const hospital = provider.city && provider.state ? `${provider.city}, ${provider.state}` : provider.address || 'Location';
  const rating = '4.9'; // Placeholder - could come from provider data
  const reviews = '95'; // Placeholder
  const network = 'In-Network'; // Placeholder
  const marioPick = false; // Placeholder

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32 md:pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#2E5077]" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-[#2E5077] truncate px-4">
            {doctorName}
          </h1>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="p-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isSaved ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#6B7280]'
              )}
            />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#2E5077] flex items-center justify-center mb-4 border-4 border-[#2E5077]">
              <User className="h-10 w-10 text-white" />
            </div>

            {/* Doctor Name */}
            <h2 className="text-2xl font-bold text-[#2E5077] mb-1">{doctorName}</h2>

            {/* Specialty */}
            <p className="text-base text-[#6B7280] mb-3">{specialty}</p>

            {/* Hospital */}
            <div className="flex items-center gap-1.5 mb-4">
              <MapPin className="h-4 w-4 text-[#4DA1A9]" />
              <p className="text-[15px] font-medium text-[#2E5077]">{hospital}</p>
            </div>

            {/* Rating + Reviews + Network */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                <span className="text-[15px] text-[#374151]">{rating}</span>
                <span className="text-[15px] text-[#6B7280]">({reviews} reviews)</span>
              </div>
              <span className="text-sm bg-[#79D7BE] text-white px-3 py-1 rounded-full">
                {network}
              </span>
            </div>

            {/* Mario's Pick Badge */}
            {marioPick && (
              <div className="bg-[#4DA1A9] text-white px-4 py-1.5 rounded-full text-sm font-medium">
                ⭐ Mario's Pick
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-16 z-30">
        <div className="max-w-4xl mx-auto">
          <div className="flex">
            {(['overview', 'costs', 'location'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 h-12 text-[15px] font-medium transition-colors capitalize',
                  activeTab === tab
                    ? 'text-[#2E5077] font-semibold border-b-3 border-[#2E5077]'
                    : 'text-[#6B7280] hover:text-[#2E5077]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Contact Information Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-base font-semibold text-[#2E5077] mb-4">Contact Information</h3>
              <div className="space-y-3">
                {provider.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#4DA1A9] mt-0.5 flex-shrink-0" />
                    <p className="text-[15px] text-[#374151] flex-1">
                      {provider.address}
                      {provider.city && `, ${provider.city}`}
                      {provider.state && ` ${provider.state}`}
                      {provider.zip && ` ${provider.zip}`}
                    </p>
                  </div>
                )}
                {provider.phone && (
                  <button
                    onClick={handleCall}
                    className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity"
                  >
                    <Phone className="h-5 w-5 text-[#2E5077] flex-shrink-0" />
                    <span className="text-[15px] text-[#374151]">{provider.phone}</span>
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#2E5077] flex-shrink-0" />
                  <span className="text-[15px] text-[#374151]">Mon-Fri: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* About Doctor Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-base font-semibold text-[#2E5077] mb-4">About {doctorName}</h3>
              <div className="space-y-2 text-[15px] text-[#374151]">
                <p>Experience: 10+ years</p>
                <p>Accepting New Patients: Yes</p>
                <p>Languages: English</p>
                {provider.email && (
                  <p>Email: {provider.email}</p>
                )}
                {provider.website && (
                  <p>
                    Website:{' '}
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E5077] hover:underline"
                    >
                      {provider.website}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Costs Tab */}
        {activeTab === 'costs' && (
          <>
            {/* Price Comparison Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-base font-semibold text-[#2E5077] mb-4">Price Comparison</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] text-[#374151]">This Provider</span>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-24 bg-[#2E5077] rounded"></div>
                    <span className="text-[15px] font-semibold text-[#2E5077]">$225</span>
                  </div>
                </div>
                {['Dr. Park - $235', 'Dr. Chen - $240', 'Dr. Wong - $245'].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-[15px] text-[#6B7280]">{item.split(' - ')[0]}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-20 bg-gray-300 rounded"></div>
                      <span className="text-[15px] text-[#6B7280]">{item.split(' - ')[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Pricing Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-base font-semibold text-[#2E5077] mb-4">Service Pricing</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[15px] text-[#374151]">Consultation</span>
                  <span className="text-[15px] font-semibold text-[#2E5077]">$225</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[15px] text-[#374151]">Follow-up</span>
                  <span className="text-[15px] font-semibold text-[#2E5077]">$150</span>
                </div>
              </div>
            </div>

            {/* Insurance Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-base font-semibold text-[#2E5077] mb-4">Insurance Accepted</h3>
              <div className="space-y-2">
                {['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth'].map((insurance) => (
                  <div key={insurance} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#79D7BE]" />
                    <span className="text-[15px] text-[#374151]">{insurance}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <>
            {/* Map Preview Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E5E7EB]">
              <div className="h-[200px] bg-gray-200 relative flex items-center justify-center">
                <MapPin className="h-12 w-12 text-[#4DA1A9]" />
                <button
                  onClick={handleGetDirections}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#2E5077] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1e3a5a] transition-colors"
                >
                  View Full Map
                </button>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 text-[#4DA1A9] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[15px] text-[#374151] mb-1">
                    {provider.address}
                    {provider.city && `, ${provider.city}`}
                    {provider.state && ` ${provider.state}`}
                    {provider.zip && ` ${provider.zip}`}
                  </p>
                  <p className="text-sm text-[#6B7280]">2.3 mi away</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyAddress}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#E5E7EB] rounded-md px-4 py-2 text-[15px] text-[#374151] hover:bg-gray-50 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  Copy Address
                </button>
                <button
                  onClick={handleGetDirections}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2E5077] text-white rounded-md px-4 py-2 text-[15px] font-medium hover:bg-[#1e3a5a] transition-colors"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </button>
              </div>
            </div>

            {/* Contact & Hours Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-base font-semibold text-[#2E5077] mb-4">Contact & Hours</h3>
              <div className="space-y-3">
                {provider.phone && (
                  <button
                    onClick={handleCall}
                    className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity"
                  >
                    <Phone className="h-5 w-5 text-[#2E5077] flex-shrink-0" />
                    <span className="text-[15px] text-[#374151]">{provider.phone}</span>
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#2E5077] flex-shrink-0" />
                  <span className="text-[15px] text-[#374151]">Mon-Fri: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Accessibility Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-base font-semibold text-[#2E5077] mb-4">Accessibility</h3>
              <div className="space-y-2">
                {['Parking available', 'Public transportation', 'Wheelchair accessible'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#79D7BE]" />
                    <span className="text-[15px] text-[#374151]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Procedures List (if available) - with pagination */}
        {provider.procedures && provider.procedures.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
            <h3 className="text-base font-semibold text-[#2E5077] mb-4">
              Available Procedures ({provider.procedures.length})
            </h3>
            <div className="space-y-3">
              {displayedProcedures.map((proc) => (
                <div
                  key={proc.procedure_id}
                  className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[15px] text-[#374151]">{proc.procedure_name}</span>
                  {proc.price && (
                    <span className="text-[15px] font-semibold text-[#2E5077]">{proc.price}</span>
                  )}
                </div>
              ))}
            </div>
            {provider.procedures.length > displayedProcedures.length && (
              <div ref={proceduresObserverRef} className="h-4 w-full mt-4 flex items-center justify-center">
                <p className="text-sm text-[#6B7280]">Loading more...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <footer className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={onBookConcierge}
              className="flex-1 bg-[#2E5077] text-white rounded-md px-6 py-3 text-[15px] font-medium hover:bg-[#1e3a5a] transition-colors min-h-[48px] flex items-center justify-center"
            >
              Book with Concierge
            </button>
            {provider.phone && (
              <button
                onClick={handleCall}
                className="flex-1 border-2 border-[#2E5077] text-[#2E5077] rounded-md px-6 py-3 text-[15px] font-medium hover:bg-[#2E5077] hover:text-white transition-colors min-h-[48px] flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Call {provider.phone}
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

