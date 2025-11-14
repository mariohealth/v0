'use client'
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Clock, 
  Copy,
  Navigation,
  Gift,
  ChevronRight,
  User
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MarioAIBookingChat } from './mario-ai-booking-chat';
import type { ProviderHospitalPairing } from '@/lib/data/mario-doctors-data';

interface MarioProviderHospitalDetailProps {
  pairing: ProviderHospitalPairing;
  onBack: () => void;
  onBookConcierge: () => void;
}

// Hospital locations data
const hospitalLocations: Record<string, {
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}> = {
  ucsf: {
    address: '505 Parnassus Ave, San Francisco, CA 94143',
    phone: '(415) 476-1000',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    lat: 37.7626,
    lng: -122.4574
  },
  stanford: {
    address: '300 Pasteur Dr, Stanford, CA 94305',
    phone: '(650) 498-3333',
    hours: 'Mon-Fri: 7:00 AM - 6:00 PM',
    lat: 37.4419,
    lng: -122.1711
  },
  kaiser_mission_bay: {
    address: '1600 Owens St, San Francisco, CA 94158',
    phone: '(415) 833-2000',
    hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
    lat: 37.7697,
    lng: -122.3933
  },
  cpmc_van_ness: {
    address: '1101 Van Ness Ave, San Francisco, CA 94109',
    phone: '(415) 600-6000',
    hours: 'Mon-Fri: 8:30 AM - 5:30 PM',
    lat: 37.7876,
    lng: -122.4213
  },
  sutter_cpmc: {
    address: '45 Castro St, San Francisco, CA 94114',
    phone: '(415) 600-6000',
    hours: 'Mon-Fri: 9:00 AM - 5:00 PM',
    lat: 37.7626,
    lng: -122.4351
  }
};

// Comparison data for cost chart
const costComparisonData = [
  { name: 'This Provider', cost: 225, color: '#2E5077' },
  { name: 'Dr. Park (UCSF)', cost: 235, color: '#E5E7EB' },
  { name: 'Dr. Chen (CPMC)', cost: 240, color: '#E5E7EB' },
  { name: 'Dr. Wong (Stanford)', cost: 245, color: '#E5E7EB' }
];

export function MarioProviderHospitalDetail({ 
  pairing, 
  onBack, 
  onBookConcierge 
}: MarioProviderHospitalDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [showBookingChat, setShowBookingChat] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Guard against undefined pairing
  if (!pairing) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-gray-600">Provider information not available.</p>
      </div>
    );
  }

  const location = hospitalLocations[pairing.hospitalId] || hospitalLocations.ucsf;
  
  // User's approximate location (for map)
  const userLat = 37.7749;
  const userLng = -122.4194;

  // Generate static map URL (Mapbox Static Images API)
  const mapboxToken = 'pk.eyJ1IjoibWFyaW9oZWFsdGgiLCJhIjoiY2x1MXh5emQwMDFwZDJqbzFqZ2VicXVvZCJ9.example'; // Placeholder
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s-hospital+2E5077(${location.lng},${location.lat}),pin-s-circle+4DA1A9(${userLng},${userLat})/${location.lng},${location.lat},13,0/600x400@2x?access_token=${mapboxToken}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(location.address);
      // Could add a toast notification here
      console.log('Address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleGetDirections = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${location.phone}`;
  };

  const maxCost = Math.max(...costComparisonData.map(d => d.cost));
  const currentCost = parseInt(pairing.price.replace(/[^0-9]/g, ''));
  const savingsPercent = parseInt(pairing.savings.replace(/[^0-9]/g, ''));

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32 md:pb-8">
      {/* Header */}
      <div 
        className="bg-white sticky top-0 z-20"
        style={{
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: '#2E5077' }} />
            </button>
            
            <h1 
              className="flex-1 truncate text-center"
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2E5077'
              }}
            >
              {pairing.doctorName}
            </h1>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={isSaved ? 'Remove from saved' : 'Save provider'}
            >
              <Heart 
                className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}
                style={{ color: isSaved ? '#EF4444' : '#6B7280' }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{
                backgroundColor: '#F3F4F6',
                border: '3px solid #2E5077'
              }}
            >
              <User className="w-10 h-10" style={{ color: '#2E5077' }} />
            </div>

            {/* Name & Specialty */}
            <h2 
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#2E5077',
                marginBottom: '4px'
              }}
            >
              {pairing.doctorName}
            </h2>
            <p 
              style={{
                fontSize: '16px',
                color: '#6B7280',
                marginBottom: '8px'
              }}
            >
              {pairing.specialty}
            </p>

            {/* Hospital Name */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4" style={{ color: '#4DA1A9' }} />
              <p 
                style={{
                  fontSize: '15px',
                  color: '#2E5077',
                  fontWeight: '500'
                }}
              >
                {pairing.hospital}
              </p>
            </div>

            {/* Rating & Network */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" style={{ color: '#FBBF24' }} />
                <span style={{ fontSize: '15px', color: '#374151', fontWeight: '500' }}>
                  {pairing.rating}
                </span>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>
                  ({pairing.reviews} reviews)
                </span>
              </div>

              {pairing.network === 'In-Network' && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#79D7BE' }} />
                  <span style={{ fontSize: '14px', color: '#79D7BE', fontWeight: '500' }}>
                    In-Network
                  </span>
                </div>
              )}
            </div>

            {/* Mario's Pick Badge */}
            {pairing.marioPick && (
              <Badge 
                className="mt-4"
                style={{
                  backgroundColor: '#4DA1A9',
                  color: 'white',
                  fontSize: '13px',
                  padding: '6px 16px'
                }}
              >
                ⭐ Mario's Pick
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white" style={{ borderTop: '1px solid #E5E7EB' }}>
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList 
              className="w-full grid grid-cols-3 h-auto bg-transparent p-0"
              style={{ borderRadius: 0 }}
            >
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-transparent rounded-none h-12"
                style={{
                  borderBottom: activeTab === 'overview' ? '3px solid #2E5077' : '3px solid transparent',
                  color: activeTab === 'overview' ? '#2E5077' : '#6B7280',
                  fontWeight: activeTab === 'overview' ? '600' : '400',
                  fontSize: '15px'
                }}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="costs"
                className="data-[state=active]:bg-transparent rounded-none h-12"
                style={{
                  borderBottom: activeTab === 'costs' ? '3px solid #2E5077' : '3px solid transparent',
                  color: activeTab === 'costs' ? '#2E5077' : '#6B7280',
                  fontWeight: activeTab === 'costs' ? '600' : '400',
                  fontSize: '15px'
                }}
              >
                Costs
              </TabsTrigger>
              <TabsTrigger 
                value="location"
                className="data-[state=active]:bg-transparent rounded-none h-12"
                style={{
                  borderBottom: activeTab === 'location' ? '3px solid #2E5077' : '3px solid transparent',
                  color: activeTab === 'location' ? '#2E5077' : '#6B7280',
                  fontWeight: activeTab === 'location' ? '600' : '400',
                  fontSize: '15px'
                }}
              >
                Location
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="px-4 py-6 space-y-6">
              {/* Contact Info */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '16px'
                  }}
                >
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                    <div className="flex-1">
                      <p style={{ fontSize: '14px', color: '#374151' }}>
                        {location.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#6B7280' }} />
                    <a 
                      href={`tel:${location.phone}`}
                      style={{ fontSize: '14px', color: '#2E5077', textDecoration: 'underline' }}
                    >
                      {location.phone}
                    </a>
                  </div>

                  {/* Hours */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#6B7280' }} />
                    <p style={{ fontSize: '14px', color: '#374151' }}>
                      {location.hours}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Provider Info */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '16px'
                  }}
                >
                  About {pairing.doctorName}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Experience</span>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      {pairing.yearsExperience} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Accepting New Patients</span>
                    <span style={{ fontSize: '14px', color: pairing.acceptingNewPatients ? '#79D7BE' : '#EF4444', fontWeight: '500' }}>
                      {pairing.acceptingNewPatients ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {pairing.nextAvailable && (
                    <div className="flex justify-between">
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>Next Available</span>
                      <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                        {pairing.nextAvailable}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Costs Tab */}
            <TabsContent value="costs" className="px-4 py-6 space-y-6">
              {/* Estimated Cost Card */}
              <Card 
                className="p-5"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #4DA1A9',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  backgroundColor: '#F0FAFB'
                }}
              >
                <div className="text-center">
                  <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                    Your Estimated Cost
                  </p>
                  <p 
                    style={{
                      fontSize: '40px',
                      fontWeight: '700',
                      color: '#2E5077',
                      marginBottom: '12px'
                    }}
                  >
                    {pairing.price}
                  </p>

                  {/* Savings Badge */}
                  <Badge 
                    style={{
                      backgroundColor: '#4DA1A9',
                      color: 'white',
                      fontSize: '14px',
                      padding: '6px 16px',
                      marginBottom: '12px'
                    }}
                  >
                    You Save {savingsPercent}%
                  </Badge>

                  {/* MarioPoints */}
                  {pairing.marioPoints && (
                    <div 
                      className="inline-flex items-center gap-2 py-2 px-4 rounded-lg mt-2"
                      style={{
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #FDE68A'
                      }}
                    >
                      <Gift className="w-5 h-5" style={{ color: '#F59E0B' }} />
                      <span style={{ fontSize: '15px', color: '#92400E', fontWeight: '600' }}>
                        +{pairing.marioPoints} MarioPoints
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Cost Comparison Chart */}
              <Card 
                className="p-5"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '20px'
                  }}
                >
                  Cost Comparison
                </h3>

                <div className="space-y-4">
                  {costComparisonData.map((item, idx) => {
                    const barWidth = (item.cost / maxCost) * 100;
                    const isCurrentProvider = idx === 0;

                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span 
                            style={{ 
                              fontSize: '13px', 
                              color: isCurrentProvider ? '#2E5077' : '#6B7280',
                              fontWeight: isCurrentProvider ? '600' : '400'
                            }}
                          >
                            {item.name}
                          </span>
                          <span 
                            style={{ 
                              fontSize: '14px', 
                              color: isCurrentProvider ? '#2E5077' : '#374151',
                              fontWeight: '600'
                            }}
                          >
                            ${item.cost}
                          </span>
                        </div>
                        <div 
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: '#F3F4F6' }}
                        >
                          <div 
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${barWidth}%`,
                              backgroundColor: isCurrentProvider ? '#79D7BE' : item.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p 
                  className="mt-4 text-center"
                  style={{
                    fontSize: '12px',
                    color: '#6B7280'
                  }}
                >
                  Based on your insurance plan
                </p>
              </Card>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="px-4 py-6 space-y-4">
              {/* Static Map Preview */}
              <div className="relative">
                <div 
                  className="w-full overflow-hidden bg-gray-200"
                  style={{
                    height: '200px',
                    borderRadius: '12px'
                  }}
                >
                  {/* Placeholder map - in production, use actual Mapbox/Google Static Maps */}
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#E5E7EB',
                      backgroundImage: 'linear-gradient(45deg, #D1D5DB 25%, transparent 25%, transparent 75%, #D1D5DB 75%, #D1D5DB), linear-gradient(45deg, #D1D5DB 25%, transparent 25%, transparent 75%, #D1D5DB 75%, #D1D5DB)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 10px 10px'
                    }}
                  >
                    {/* Hospital Marker */}
                    <div className="relative">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: '#2E5077',
                          border: '3px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Full Map Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    className="mario-transition hover:opacity-90"
                    style={{
                      backgroundColor: 'white',
                      color: '#2E5077',
                      border: '2px solid #2E5077',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '8px 16px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    View Full Map
                  </Button>
                </div>
              </div>

              {/* Address Card */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#2E5077' }} />
                  <div className="flex-1">
                    <p style={{ fontSize: '15px', color: '#374151', fontWeight: '500' }}>
                      {location.address}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
                      {pairing.distance} away
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleCopyAddress}
                    variant="outline"
                    className="mario-transition hover:bg-gray-50"
                    style={{
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      minHeight: '44px'
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Address
                  </Button>
                  <Button
                    onClick={handleGetDirections}
                    className="mario-transition hover:opacity-90"
                    style={{
                      backgroundColor: '#2E5077',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      minHeight: '44px'
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </Card>

              {/* Parking & Access Info */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '12px'
                  }}
                >
                  Getting Here
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4DA1A9' }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Parking available in garage on level P1-P3
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4DA1A9' }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Public transit accessible via Muni lines 5, 33, 43
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4DA1A9' }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Wheelchair accessible entrance on main floor
                    </span>
                  </li>
                </ul>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sticky Footer - Above bottom nav */}
      <div 
        className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white z-10 px-4 py-3"
        style={{
          borderTop: '1px solid #E5E7EB',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Book with Concierge - Primary */}
          <Button
            onClick={() => setShowBookingChat(true)}
            className="mario-transition hover:opacity-90 active:scale-98"
            style={{
              backgroundColor: '#2E5077',
              color: 'white',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              minHeight: '48px',
              order: 1
            }}
          >
            Book with Concierge
          </Button>

          {/* Call - Secondary */}
          <Button
            onClick={handleCall}
            variant="outline"
            className="mario-transition hover:bg-gray-50"
            style={{
              borderRadius: '8px',
              border: '2px solid #2E5077',
              color: '#2E5077',
              fontSize: '15px',
              fontWeight: '600',
              minHeight: '48px',
              order: 2
            }}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call {location.phone}
          </Button>
        </div>
      </div>

      {/* MarioAI Booking Chat */}
      <MarioAIBookingChat
        isOpen={showBookingChat}
        onClose={() => setShowBookingChat(false)}
        doctorName={pairing.doctorName}
        hospital={pairing.hospital}
        specialty={pairing.specialty}
        onComplete={onBookConcierge}
        isDesktop={isDesktop}
      />
    </div>
  );
}