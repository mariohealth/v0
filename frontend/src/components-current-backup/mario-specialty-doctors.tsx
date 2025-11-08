'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Gift,
  SlidersHorizontal,
  Map,
  ChevronDown,
  User
} from 'lucide-react';
import { 
  getSpecialtyById, 
  getProviderHospitalPairingsBySpecialty,
  getUniqueHospitalCount,
  type ProviderHospitalPairing 
} from '@/lib/data/mario-doctors-data';

interface MarioSpecialtyDoctorsProps {
  specialtyId: string;
  onBack: () => void;
  onBookAppointment: (pairingId: string) => void;
  onDoctorClick: (pairingId: string) => void;
}

type SortOption = 'mario-pick' | 'best-price' | 'top-rated' | 'nearest';

export function MarioSpecialtyDoctors({ 
  specialtyId, 
  onBack, 
  onBookAppointment,
  onDoctorClick 
}: MarioSpecialtyDoctorsProps) {
  const [activeSortOption, setActiveSortOption] = useState<SortOption | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const specialty = getSpecialtyById(specialtyId);
  const allPairings = getProviderHospitalPairingsBySpecialty(specialtyId);
  const hospitalCount = getUniqueHospitalCount(specialtyId);

  if (!specialty) {
    return <div className="p-4">Specialty not found</div>;
  }

  // Sort pairings based on active sort option
  const sortedPairings = [...allPairings].sort((a, b) => {
    switch (activeSortOption) {
      case 'mario-pick':
        if (a.marioPick && !b.marioPick) return -1;
        if (!a.marioPick && b.marioPick) return 1;
        return 0;
      case 'best-price':
        const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
        const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
        return priceA - priceB;
      case 'top-rated':
        return parseFloat(b.rating) - parseFloat(a.rating);
      case 'nearest':
        const distA = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
        const distB = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
        return distA - distB;
      default:
        // Default: Mario's Pick first, then by rating
        if (a.marioPick && !b.marioPick) return -1;
        if (!a.marioPick && b.marioPick) return 1;
        return parseFloat(b.rating) - parseFloat(a.rating);
    }
  });

  const handleCardClick = (pairingId: string) => {
    onDoctorClick(pairingId);
  };

  const handleBookClick = (e: React.MouseEvent, pairingId: string) => {
    e.stopPropagation(); // Prevent card click
    onBookAppointment(pairingId);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-8">
      {/* Header */}
      <div 
        className="bg-white sticky top-0 z-10"
        style={{
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: '#2E5077' }} />
            </button>
            <div className="flex-1">
              <h1 
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2E5077'
                }}
              >
                {specialty.name} near you
              </h1>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                {sortedPairings.length} providers across {hospitalCount} hospital{hospitalCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Filter & Sort Row */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg mario-transition hover:bg-gray-100"
              style={{
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                color: '#374151'
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <div className="flex-1 overflow-x-auto flex gap-2" style={{ scrollbarWidth: 'none' }}>
              {/* Sort Pills */}
              {[
                { id: 'mario-pick' as SortOption, label: "Mario's Pick", icon: '⭐' },
                { id: 'best-price' as SortOption, label: 'Best Price', icon: '💰' },
                { id: 'top-rated' as SortOption, label: 'Top Rated', icon: '⭐' },
                { id: 'nearest' as SortOption, label: 'Nearest', icon: '📍' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveSortOption(
                    activeSortOption === option.id ? null : option.id
                  )}
                  className="flex items-center gap-1 px-3 py-2 rounded-full whitespace-nowrap mario-transition"
                  style={{
                    border: `1px solid ${activeSortOption === option.id ? '#4DA1A9' : '#E5E7EB'}`,
                    backgroundColor: activeSortOption === option.id ? '#E6F7F8' : 'white',
                    fontSize: '14px',
                    color: activeSortOption === option.id ? '#2E5077' : '#374151'
                  }}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                  {activeSortOption === option.id && (
                    <ChevronDown className="w-3 h-3" style={{ color: '#4DA1A9' }} />
                  )}
                </button>
              ))}
            </div>

            <button
              className="p-2 rounded-lg mario-transition hover:bg-gray-100"
              style={{
                border: '1px solid #E5E7EB',
                color: '#374151'
              }}
              aria-label="Map view"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Provider-Hospital Pairings List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedPairings.map((pairing) => (
            <Card
              key={pairing.id}
              onClick={() => handleCardClick(pairing.id)}
              className="p-4 mario-transition hover:shadow-md cursor-pointer relative overflow-hidden"
              style={{
                borderRadius: '12px',
                border: pairing.marioPick 
                  ? '2px solid #4DA1A9' 
                  : '1px solid #E5E7EB'
              }}
            >
              {/* Mario's Pick Accent Bar */}
              {pairing.marioPick && (
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: '#4DA1A9' }}
                />
              )}

              <div className="space-y-3">
                {/* Provider Info */}
                <div className="flex items-start gap-3">
                  {/* Provider Icon */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: '#F3F4F6',
                      border: '2px solid #E5E7EB'
                    }}
                  >
                    <User className="w-6 h-6" style={{ color: '#6B7280' }} />
                  </div>

                  {/* Name & Hospital */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="truncate"
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#2E5077'
                          }}
                        >
                          {pairing.doctorName}
                        </h3>
                        <p 
                          className="truncate"
                          style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            marginTop: '2px'
                          }}
                        >
                          {pairing.hospital}
                        </p>
                      </div>

                      {/* Mario's Pick Badge */}
                      {pairing.marioPick && (
                        <Badge 
                          className="flex-shrink-0"
                          style={{
                            backgroundColor: '#4DA1A9',
                            color: 'white',
                            fontSize: '11px',
                            padding: '2px 8px'
                          }}
                        >
                          Mario's Pick
                        </Badge>
                      )}
                    </div>

                    {/* Specialty */}
                    <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
                      {pairing.specialty}
                    </p>
                  </div>
                </div>

                {/* Distance & Network */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" style={{ color: '#6B7280' }} />
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>
                      {pairing.distance}
                    </span>
                  </div>

                  {pairing.network === 'In-Network' && (
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#79D7BE' }} />
                      <span style={{ fontSize: '13px', color: '#79D7BE' }}>
                        In-Network
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" style={{ color: '#FBBF24' }} />
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      {pairing.rating} ({pairing.reviews})
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-2">
                  <span 
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#4DA1A9'
                    }}
                  >
                    {pairing.price}
                  </span>
                  <span 
                    style={{
                      fontSize: '13px',
                      color: '#79D7BE',
                      fontWeight: '500'
                    }}
                  >
                    {pairing.savings}
                  </span>
                </div>

                {/* MarioPoints */}
                {pairing.marioPoints && (
                  <div 
                    className="flex items-center gap-1 py-1 px-2 rounded"
                    style={{
                      backgroundColor: '#FEF3C7',
                      width: 'fit-content'
                    }}
                  >
                    <Gift className="w-3 h-3" style={{ color: '#F59E0B' }} />
                    <span style={{ fontSize: '12px', color: '#92400E' }}>
                      +{pairing.marioPoints} MarioPoints
                    </span>
                  </div>
                )}

                {/* Book Button */}
                <Button
                  onClick={(e) => handleBookClick(e, pairing.id)}
                  className="w-full mario-transition hover:opacity-90 active:scale-98"
                  style={{
                    backgroundColor: '#2E5077',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    height: '40px'
                  }}
                >
                  Book Appointment
                </Button>

                {/* Next Available (if exists) */}
                {pairing.nextAvailable && (
                  <p 
                    className="text-center"
                    style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      marginTop: '-8px'
                    }}
                  >
                    Next available: {pairing.nextAvailable}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {sortedPairings.length === 0 && (
          <div className="text-center py-12">
            <p style={{ fontSize: '16px', color: '#6B7280' }}>
              No providers found for this specialty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
