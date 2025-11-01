'use client'
import { ArrowLeft, Phone, MapPin, Clock, Building2, ChevronRight, User, CheckCircle2, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useState } from 'react';
import type { HospitalInfo, ProviderHospitalPairing } from '../data/mario-doctors-data';

interface MarioHospitalDirectoryProps {
  hospital: HospitalInfo;
  specialties: Array<{
    id: string;
    name: string;
    doctorCount: number;
  }>;
  allProviders: ProviderHospitalPairing[];
  onBack: () => void;
  onSpecialtyClick: (specialtyId: string) => void;
  onProviderClick: (pairingId: string) => void;
}

export function MarioHospitalDirectory({
  hospital,
  specialties,
  allProviders,
  onBack,
  onSpecialtyClick,
  onProviderClick
}: MarioHospitalDirectoryProps) {
  const [activeTab, setActiveTab] = useState<'specialties' | 'doctors'>('specialties');
  const [searchQuery, setSearchQuery] = useState('');

  const handleCall = () => {
    window.location.href = `tel:${hospital.phone}`;
  };

  // Filter providers based on search
  const filteredProviders = searchQuery
    ? allProviders.filter(p =>
        p.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allProviders;

  // Filter specialties based on search
  const filteredSpecialties = searchQuery
    ? specialties.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : specialties;

  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      {/* Header */}
      <div 
        className="bg-white sticky top-0 z-20"
        style={{
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: '#2E5077' }} />
            </button>
            
            <h1 
              className="flex-1"
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2E5077'
              }}
            >
              {hospital.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hospital Hero Card */}
            <Card 
              className="p-6"
              style={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                {/* Hospital Logo Placeholder */}
                <div 
                  className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: '#2E5077'
                  }}
                >
                  <Building2 className="w-10 h-10 text-white" />
                </div>

                {/* Hospital Info */}
                <div className="flex-1">
                  <h2 
                    style={{
                      fontSize: '24px',
                      fontWeight: '600',
                      color: '#2E5077',
                      marginBottom: '8px'
                    }}
                  >
                    {hospital.name}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                      <p style={{ fontSize: '14px', color: '#6B7280' }}>
                        {hospital.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                      <p style={{ fontSize: '14px', color: '#6B7280' }}>
                        {hospital.hours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Button */}
              <Button
                onClick={handleCall}
                className="w-full md:w-auto"
                style={{
                  backgroundColor: '#2E5077',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  minHeight: '44px',
                  padding: '0 24px'
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call {hospital.phone}
              </Button>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3">
              <Card 
                className="p-4 text-center"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: 'white'
                }}
              >
                <div 
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#2E5077',
                    marginBottom: '4px'
                  }}
                >
                  {specialties.length}
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                  Specialties
                </p>
              </Card>

              <Card 
                className="p-4 text-center"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: 'white'
                }}
              >
                <div 
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#2E5077',
                    marginBottom: '4px'
                  }}
                >
                  {allProviders.length}
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                  Doctors
                </p>
              </Card>

              <Card 
                className="p-4 text-center"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: 'white'
                }}
              >
                <div 
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#79D7BE',
                    marginBottom: '4px'
                  }}
                >
                  {allProviders.filter(p => p.network === 'In-Network').length}
                </div>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                  In-Network
                </p>
              </Card>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('specialties')}
                className="px-4 py-3 relative"
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: activeTab === 'specialties' ? '#2E5077' : '#6B7280'
                }}
              >
                Specialties
                {activeTab === 'specialties' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#2E5077' }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('doctors')}
                className="px-4 py-3 relative"
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: activeTab === 'doctors' ? '#2E5077' : '#6B7280'
                }}
              >
                All Doctors
                {activeTab === 'doctors' && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#2E5077' }}
                  />
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{ color: '#6B7280' }}
              />
              <Input
                type="text"
                placeholder={activeTab === 'specialties' ? 'Search specialties...' : 'Search doctors...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '15px',
                  minHeight: '44px'
                }}
              />
            </div>

            {/* Content Based on Active Tab */}
            {activeTab === 'specialties' ? (
              /* Specialties Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredSpecialties.map((specialty) => (
                  <Card
                    key={specialty.id}
                    className="p-4 cursor-pointer mario-transition hover:shadow-lg"
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                    onClick={() => onSpecialtyClick(specialty.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 
                          style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#2E5077',
                            marginBottom: '4px'
                          }}
                        >
                          {specialty.name}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#6B7280' }}>
                          {specialty.doctorCount} {specialty.doctorCount === 1 ? 'doctor' : 'doctors'}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: '#6B7280' }} />
                    </div>
                  </Card>
                ))}

                {filteredSpecialties.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <p style={{ fontSize: '14px', color: '#6B7280' }}>
                      No specialties found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Doctors List */
              <div className="space-y-3">
                {filteredProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className="p-4 cursor-pointer mario-transition hover:shadow-lg"
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }}
                    onClick={() => onProviderClick(provider.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: '#F3F4F6',
                          border: '2px solid #2E5077'
                        }}
                      >
                        <User className="w-6 h-6" style={{ color: '#2E5077' }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <h4 
                              className="truncate"
                              style={{
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#2E5077'
                              }}
                            >
                              {provider.doctorName}
                            </h4>
                            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                              {provider.specialty}
                            </p>
                          </div>
                          {provider.marioPick && (
                            <Badge 
                              style={{
                                backgroundColor: '#4DA1A9',
                                color: 'white',
                                fontSize: '11px',
                                padding: '2px 8px',
                                flexShrink: 0
                              }}
                            >
                              ⭐ Mario's Pick
                            </Badge>
                          )}
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                              ⭐ {provider.rating}
                            </span>
                            <span style={{ fontSize: '12px', color: '#6B7280' }}>
                              ({provider.reviews})
                            </span>
                          </div>
                          
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>
                            {provider.yearsExperience} yrs exp
                          </span>

                          {provider.network === 'In-Network' && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" style={{ color: '#79D7BE' }} />
                              <span style={{ fontSize: '12px', color: '#79D7BE', fontWeight: '500' }}>
                                In-Network
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price & Points */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span 
                              style={{
                                fontSize: '16px',
                                fontWeight: '700',
                                color: '#2E5077'
                              }}
                            >
                              {provider.price}
                            </span>
                            {provider.savings && (
                              <span 
                                style={{
                                  fontSize: '12px',
                                  color: '#79D7BE',
                                  fontWeight: '600',
                                  marginLeft: '8px'
                                }}
                              >
                                {provider.savings}
                              </span>
                            )}
                          </div>

                          {provider.marioPoints && (
                            <span 
                              style={{
                                fontSize: '12px',
                                color: '#F59E0B',
                                fontWeight: '600'
                              }}
                            >
                              +{provider.marioPoints} pts
                            </span>
                          )}
                        </div>

                        {provider.nextAvailable && (
                          <p 
                            className="mt-2"
                            style={{ 
                              fontSize: '12px', 
                              color: '#6B7280' 
                            }}
                          >
                            Next available: {provider.nextAvailable}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredProviders.length === 0 && (
                  <Card 
                    className="p-8 text-center"
                    style={{
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      backgroundColor: 'white'
                    }}
                  >
                    <p style={{ fontSize: '14px', color: '#6B7280' }}>
                      No doctors found matching "{searchQuery}"
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-6">
            {/* Map */}
            <Card 
              className="p-4"
              style={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <h4 
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '12px'
                }}
              >
                Location
              </h4>
              
              {/* Map Placeholder */}
              <div 
                className="w-full rounded-lg overflow-hidden mb-3"
                style={{
                  height: '200px',
                  backgroundColor: '#E5E7EB',
                  backgroundImage: 'linear-gradient(45deg, #D1D5DB 25%, transparent 25%, transparent 75%, #D1D5DB 75%, #D1D5DB), linear-gradient(45deg, #D1D5DB 25%, transparent 25%, transparent 75%, #D1D5DB 75%, #D1D5DB)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#2E5077',
                      border: '3px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
                {hospital.address}
              </p>

              <Button
                variant="outline"
                className="w-full"
                style={{
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '500',
                  minHeight: '36px'
                }}
                onClick={() => {
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`;
                  window.open(mapsUrl, '_blank');
                }}
              >
                Get Directions
              </Button>
            </Card>

            {/* Contact Info */}
            <Card 
              className="p-4"
              style={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <h4 
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '12px'
                }}
              >
                Contact
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                  <a 
                    href={`tel:${hospital.phone}`}
                    style={{ fontSize: '14px', color: '#2E5077', textDecoration: 'underline' }}
                  >
                    {hospital.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                  <p style={{ fontSize: '14px', color: '#374151' }}>
                    {hospital.hours}
                  </p>
                </div>
              </div>
            </Card>

            {/* Insurance Accepted */}
            <Card 
              className="p-4"
              style={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <h4 
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '12px'
                }}
              >
                Insurance Accepted
              </h4>

              <div className="space-y-2">
                {hospital.insuranceAccepted.map((insurance, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#79D7BE' }} />
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      {insurance}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
