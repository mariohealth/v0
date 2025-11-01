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
  User
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MarioAIBookingChat } from './mario-ai-booking-chat';
import type { Doctor } from '../data/mario-search-service';

interface MarioDoctorDetailProps {
  doctor: Doctor;
  onBack: () => void;
  onBookAppointment: () => void;
}

// Hospital locations data (using default UCSF for doctors without specific hospital)
const hospitalLocations: Record<string, {
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}> = {
  default: {
    address: '505 Parnassus Ave, San Francisco, CA 94143',
    phone: '(415) 476-1000',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    lat: 37.7626,
    lng: -122.4574
  },
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
  }
};

// Comparison data for cost chart
const costComparisonData = [
  { name: 'This Provider', cost: 225, color: '#2E5077' },
  { name: 'Dr. Park (UCSF)', cost: 235, color: '#E5E7EB' },
  { name: 'Dr. Chen (CPMC)', cost: 240, color: '#E5E7EB' },
  { name: 'Dr. Wong (Stanford)', cost: 245, color: '#E5E7EB' }
];

export function MarioDoctorDetail({ 
  doctor, 
  onBack, 
  onBookAppointment 
}: MarioDoctorDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [showBookingChat, setShowBookingChat] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Use default location (UCSF) as fallback
  const location = hospitalLocations.default;
  
  // Extract hospital name from doctor data if available, otherwise use default
  const hospitalName = 'UCSF Medical Center'; // Default hospital
  const distance = '2.3 mi'; // Default distance

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(location.address);
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
  const currentCost = parseInt(doctor.price.replace(/[^0-9]/g, ''));
  const savingsPercent = parseInt(doctor.savings.replace(/[^0-9]/g, ''));

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
              {doctor.name}
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
              {doctor.name}
            </h2>
            <p 
              style={{
                fontSize: '16px',
                color: '#6B7280',
                marginBottom: '8px'
              }}
            >
              {doctor.specialty}
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
                {hospitalName}
              </p>
            </div>

            {/* Rating & Network */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" style={{ color: '#FBBF24' }} />
                <span style={{ fontSize: '15px', color: '#374151', fontWeight: '500' }}>
                  {doctor.rating}
                </span>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>
                  ({doctor.reviews} reviews)
                </span>
              </div>

              {doctor.network === 'In-Network' && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#79D7BE' }} />
                  <span style={{ fontSize: '14px', color: '#79D7BE', fontWeight: '500' }}>
                    In-Network
                  </span>
                </div>
              )}
            </div>

            {/* Mario's Pick Badge */}
            {doctor.marioPick && (
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
            <TabsContent value="overview" className="px-4 py-6 space-y-4">
              {/* Contact Information */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  Contact Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#2E5077' }} />
                    <div>
                      <p style={{ fontSize: '15px', color: '#374151' }}>
                        {location.address}
                      </p>
                      <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>
                        {distance} away
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#2E5077' }} />
                    <a 
                      href={`tel:${location.phone}`}
                      style={{ fontSize: '15px', color: '#2E5077', fontWeight: '500' }}
                    >
                      {location.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#2E5077' }} />
                    <p style={{ fontSize: '15px', color: '#374151' }}>
                      {location.hours}
                    </p>
                  </div>
                </div>
              </Card>

              {/* About Doctor */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  About {doctor.name.split(' ')[0]}. {doctor.name.split(' ').slice(-1)[0]}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Experience</span>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>10+ years</span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Accepting New Patients</span>
                    <span style={{ fontSize: '14px', color: '#79D7BE', fontWeight: '500' }}>Yes</span>
                  </div>

                  <div className="flex justify-between">
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Languages</span>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>English</span>
                  </div>

                  <div style={{ paddingTop: '8px', borderTop: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                      {doctor.name.split(' ')[0]}. {doctor.name.split(' ').slice(-1)[0]} is a board-certified {doctor.specialty.toLowerCase()} physician with extensive experience in comprehensive patient care. Specializes in evidence-based treatment approaches and prioritizes clear communication with patients.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Costs Tab */}
            <TabsContent value="costs" className="px-4 py-6 space-y-4">
              {/* Price Comparison */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  Price Comparison
                </h3>
                
                <div className="space-y-3">
                  {costComparisonData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span style={{ fontSize: '14px', color: index === 0 ? '#2E5077' : '#6B7280', fontWeight: index === 0 ? '600' : '400' }}>
                          {index === 0 ? doctor.name : item.name}
                        </span>
                        <span style={{ fontSize: '14px', color: index === 0 ? '#2E5077' : '#374151', fontWeight: index === 0 ? '600' : '500' }}>
                          ${index === 0 ? currentCost : item.cost}
                        </span>
                      </div>
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          backgroundColor: '#F3F4F6',
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          style={{
                            width: `${((index === 0 ? currentCost : item.cost) / maxCost) * 100}%`,
                            height: '100%',
                            backgroundColor: item.color,
                            borderRadius: '9999px'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div 
                  className="mt-4 p-3 rounded-lg"
                  style={{ backgroundColor: '#F0F9FF' }}
                >
                  <p style={{ fontSize: '13px', color: '#2E5077', fontWeight: '500' }}>
                    💰 Save {savingsPercent}% with this provider
                  </p>
                </div>
              </Card>

              {/* Service Pricing */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  Service Pricing
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Initial Consultation</span>
                    <span style={{ fontSize: '14px', color: '#2E5077', fontWeight: '600' }}>{doctor.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Follow-up Visit</span>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>$180</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Telehealth Consultation</span>
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>$150</span>
                  </div>
                </div>
              </Card>

              {/* Insurance */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  Insurance Accepted
                </h3>
                
                <div className="space-y-2">
                  {['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealth', 'Medicare'].map((insurance, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#79D7BE' }} />
                      <span style={{ fontSize: '14px', color: '#374151' }}>{insurance}</span>
                    </div>
                  ))}
                </div>
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
                  {/* Placeholder map */}
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
                      {distance} away
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
                      fontWeight: '500',
                      minHeight: '44px'
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </Card>

              {/* Contact & Hours */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  Contact & Hours
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#2E5077' }} />
                    <a 
                      href={`tel:${location.phone}`}
                      style={{ fontSize: '15px', color: '#2E5077', fontWeight: '500' }}
                    >
                      {location.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#2E5077' }} />
                    <p style={{ fontSize: '15px', color: '#374151' }}>
                      {location.hours}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Accessibility */}
              <Card 
                className="p-4"
                style={{
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  Accessibility
                </h3>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#79D7BE' }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Street parking and nearby parking garage available
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#79D7BE' }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Accessible via public transportation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#79D7BE' }} />
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
        doctorName={doctor.name}
        hospital={hospitalName}
        specialty={doctor.specialty}
        onComplete={onBookAppointment}
        isDesktop={isDesktop}
      />
    </div>
  );
}
