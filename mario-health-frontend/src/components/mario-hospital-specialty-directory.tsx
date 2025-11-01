'use client'
import { ArrowLeft, Phone, MapPin, Clock, Building2, CheckCircle2, User, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { ProviderHospitalPairing } from '../data/mario-doctors-data';

interface HospitalInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  insuranceAccepted: string[];
  lat: number;
  lng: number;
}

interface MarioHospitalSpecialtyDirectoryProps {
  hospitalId: string;
  specialtyId: string;
  specialtyName: string;
  hospitalInfo: HospitalInfo;
  providers: ProviderHospitalPairing[];
  onBack: () => void;
  onProviderClick: (pairingId: string) => void;
}

// About text for specialties
const specialtyAbout: Record<string, string> = {
  cardiology: 'Our cardiology department provides comprehensive heart care services, from preventive screenings to advanced interventional procedures. Our team of board-certified cardiologists uses the latest technology to diagnose and treat cardiovascular conditions.',
  dermatology: 'Our dermatology department offers complete skin care services, treating conditions from acne to skin cancer. Our dermatologists are experts in both medical and cosmetic dermatology.',
  orthopedics: 'Our orthopedic specialists provide comprehensive care for bone, joint, and muscle conditions. From sports injuries to joint replacement, we offer advanced surgical and non-surgical treatments.',
  pediatrics: 'Our pediatric department provides comprehensive healthcare for children from birth through adolescence. Our pediatricians focus on preventive care, development, and treating childhood illnesses.',
  'internal-medicine': 'Our internal medicine physicians provide comprehensive adult healthcare, managing chronic conditions and promoting preventive health. We focus on whole-person care.',
  gastroenterology: 'Our gastroenterology department specializes in digestive health, from routine screenings to advanced procedures. We treat conditions affecting the GI tract, liver, and pancreas.',
  neurology: 'Our neurology department provides expert care for conditions affecting the brain, spinal cord, and nervous system. We use advanced diagnostic tools and treatment methods.',
  oncology: 'Our oncology department provides comprehensive cancer care, from diagnosis through treatment and survivorship. Our team uses cutting-edge therapies and personalized treatment plans.',
  psychiatry: 'Our psychiatry department provides mental health care for a range of conditions. Our psychiatrists offer medication management, therapy, and holistic treatment approaches.',
  obgyn: 'Our OB/GYN department provides comprehensive women\'s health services, from routine care to high-risk pregnancy management. We support women through all life stages.',
  ent: 'Our ENT (Ear, Nose, and Throat) specialists provide comprehensive care for conditions affecting the head and neck. We offer both medical and surgical treatments.',
  ophthalmology: 'Our ophthalmology department provides complete eye care services, from routine exams to complex surgical procedures. We treat conditions affecting vision and eye health.'
};

// Other specialties at each hospital
const hospitalSpecialties: Record<string, Array<{ id: string; name: string }>> = {
  ucsf: [
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'orthopedics', name: 'Orthopedics' },
    { id: 'neurology', name: 'Neurology' },
    { id: 'oncology', name: 'Oncology' },
    { id: 'gastroenterology', name: 'Gastroenterology' }
  ],
  stanford: [
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'dermatology', name: 'Dermatology' },
    { id: 'pediatrics', name: 'Pediatrics' },
    { id: 'ent', name: 'ENT' },
    { id: 'ophthalmology', name: 'Ophthalmology' }
  ],
  kaiser_mission_bay: [
    { id: 'internal-medicine', name: 'Internal Medicine' },
    { id: 'pediatrics', name: 'Pediatrics' },
    { id: 'obgyn', name: 'OB/GYN' },
    { id: 'dermatology', name: 'Dermatology' }
  ],
  cpmc_van_ness: [
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'orthopedics', name: 'Orthopedics' },
    { id: 'gastroenterology', name: 'Gastroenterology' },
    { id: 'psychiatry', name: 'Psychiatry' }
  ],
  sutter_cpmc: [
    { id: 'internal-medicine', name: 'Internal Medicine' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'neurology', name: 'Neurology' }
  ]
};

export function MarioHospitalSpecialtyDirectory({
  hospitalId,
  specialtyId,
  specialtyName,
  hospitalInfo,
  providers,
  onBack,
  onProviderClick
}: MarioHospitalSpecialtyDirectoryProps) {
  const handleCall = () => {
    window.location.href = `tel:${hospitalInfo.phone}`;
  };

  const otherSpecialties = hospitalSpecialties[hospitalId]?.filter(s => s.id !== specialtyId) || [];
  const aboutText = specialtyAbout[specialtyId] || 'Expert care from our specialized medical team.';

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
              {specialtyName} at {hospitalInfo.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
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
                  className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: '#2E5077'
                  }}
                >
                  <Building2 className="w-8 h-8 text-white" />
                </div>

                {/* Hospital Info */}
                <div className="flex-1">
                  <h2 
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#2E5077',
                      marginBottom: '8px'
                    }}
                  >
                    {hospitalInfo.name}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#6B7280' }} />
                      <p style={{ fontSize: '14px', color: '#6B7280' }}>
                        {hospitalInfo.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                      <p style={{ fontSize: '14px', color: '#6B7280' }}>
                        {hospitalInfo.hours}
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
                Call {hospitalInfo.phone}
              </Button>
            </Card>

            {/* About Department */}
            <Card 
              className="p-6"
              style={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <h3 
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '12px'
                }}
              >
                About this department
              </h3>
              <p 
                style={{
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.6'
                }}
              >
                {aboutText}
              </p>
            </Card>

            {/* Our Doctors */}
            <div>
              <h3 
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '16px'
                }}
              >
                Our {specialtyName} Specialists
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
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

                        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                          {provider.yearsExperience} years experience
                        </p>

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
              </div>

              {providers.length === 0 && (
                <Card 
                  className="p-8 text-center"
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white'
                  }}
                >
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>
                    No providers currently available in this specialty.
                  </p>
                </Card>
              )}
            </div>

            {/* Other Specialties - Mobile */}
            {otherSpecialties.length > 0 && (
              <div className="lg:hidden">
                <h3 
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '12px'
                  }}
                >
                  See other specialties at {hospitalInfo.name}
                </h3>
                
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                  {otherSpecialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      className="flex-shrink-0 px-4 py-2 rounded-full mario-transition hover:shadow-md"
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        color: '#2E5077',
                        fontSize: '14px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={() => console.log('Navigate to:', specialty.id)}
                    >
                      {specialty.name}
                    </button>
                  ))}
                </div>
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
                  height: '160px',
                  backgroundColor: '#E5E7EB',
                  backgroundImage: 'linear-gradient(45deg, #D1D5DB 25%, transparent 25%, transparent 75%, #D1D5DB 75%, #D1D5DB), linear-gradient(45deg, #D1D5DB 25%, transparent 25%, transparent 75%, #D1D5DB 75%, #D1D5DB)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
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

              <p style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
                {hospitalInfo.address}
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
                  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospitalInfo.address)}`;
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
                    href={`tel:${hospitalInfo.phone}`}
                    style={{ fontSize: '14px', color: '#2E5077', textDecoration: 'underline' }}
                  >
                    {hospitalInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" style={{ color: '#6B7280' }} />
                  <p style={{ fontSize: '14px', color: '#374151' }}>
                    {hospitalInfo.hours}
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
                {hospitalInfo.insuranceAccepted.map((insurance, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#79D7BE' }} />
                    <span style={{ fontSize: '13px', color: '#374151' }}>
                      {insurance}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Other Specialties - Desktop */}
            {otherSpecialties.length > 0 && (
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
                  Other Specialties
                </h4>

                <div className="space-y-2">
                  {otherSpecialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      className="w-full flex items-center justify-between p-2 rounded-lg mario-transition hover:bg-gray-50"
                      onClick={() => console.log('Navigate to:', specialty.id)}
                    >
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        {specialty.name}
                      </span>
                      <ChevronRight className="w-4 h-4" style={{ color: '#6B7280' }} />
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
