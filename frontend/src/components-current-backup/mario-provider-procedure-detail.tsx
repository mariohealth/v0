'use client'
import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, MapPin, Clock, Phone, Globe, Star, Award, TrendingDown, Gift, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { MarioTestDetailModal } from './mario-test-detail-modal';

interface TestOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  network: 'In-Network' | 'Out-of-Network';
  priceRange: string;
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  savingsPercentage: number;
  points: number;
  details?: {
    facilityFee: string;
    professionalFee: string;
    medianCost: string;
    includes: string[];
  };
}

interface ProviderInfo {
  name: string;
  network: 'In-Network' | 'Out-of-Network';
  distance: string;
  address: string;
  hours: string;
  phone: string;
  website: string;
  accreditation: string[];
  staff: string;
}

interface Review {
  rating: number;
  text: string;
  author: string;
  date: string;
}

interface MarioProviderProcedureDetailProps {
  providerId: string;
  procedureName: string;
  onBack: () => void;
  onBookConcierge?: (testId: string) => void;
}

export function MarioProviderProcedureDetail({
  providerId,
  procedureName,
  onBack,
  onBookConcierge
}: MarioProviderProcedureDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestOption | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock provider data
  const providerInfo: ProviderInfo = {
    name: 'LabFast Diagnostics',
    network: 'In-Network',
    distance: '2.1 mi',
    address: '123 Health Ave, Kuala Lumpur',
    hours: 'Mon–Fri 8AM–6PM, Sat 9AM–1PM',
    phone: '(555) 123-4567',
    website: 'www.labfastdiagnostics.com',
    accreditation: ['CAP', 'CLIA', 'ISO 15189'],
    staff: 'Board-certified pathologists, licensed technicians'
  };

  // Mock test options
  const testOptions: TestOption[] = [
    {
      id: 'basic-panel',
      name: 'Basic Panel (CBC + CMP)',
      icon: '💉',
      description: 'Complete Blood Count + Comprehensive Metabolic Panel',
      network: 'In-Network',
      priceRange: '$45 – $70',
      priceMin: 45,
      priceMax: 70,
      rating: 4.8,
      reviewCount: 50,
      savingsPercentage: 47,
      points: 30,
      details: {
        facilityFee: '$35',
        professionalFee: '$10',
        medianCost: '$85',
        includes: [
          'Complete Blood Count (CBC)',
          'Comprehensive Metabolic Panel (CMP)',
          'Glucose, Calcium, Electrolytes',
          'Kidney & Liver Function Tests',
          'Results within 24 hours'
        ]
      }
    },
    {
      id: 'lipid-glucose',
      name: 'Lipid Panel + Glucose',
      icon: '🧪',
      description: 'Cholesterol screening with fasting glucose',
      network: 'In-Network',
      priceRange: '$60 – $95',
      priceMin: 60,
      priceMax: 95,
      rating: 4.6,
      reviewCount: 34,
      savingsPercentage: 38,
      points: 28,
      details: {
        facilityFee: '$45',
        professionalFee: '$15',
        medianCost: '$120',
        includes: [
          'Total Cholesterol',
          'HDL & LDL Cholesterol',
          'Triglycerides',
          'Fasting Glucose',
          'Results within 48 hours'
        ]
      }
    },
    {
      id: 'comprehensive-panel',
      name: 'Comprehensive Blood Work (Full Panel)',
      icon: '🩸',
      description: 'Complete health screening with all major markers',
      network: 'Out-of-Network',
      priceRange: '$90 – $120',
      priceMin: 90,
      priceMax: 120,
      rating: 4.5,
      reviewCount: 28,
      savingsPercentage: 22,
      points: 25,
      details: {
        facilityFee: '$75',
        professionalFee: '$15',
        medianCost: '$150',
        includes: [
          'Complete Blood Count (CBC)',
          'Comprehensive Metabolic Panel (CMP)',
          'Lipid Panel (Full)',
          'Thyroid Function (TSH, T4)',
          'Vitamin D & B12 Levels',
          'Iron Panel',
          'Results within 72 hours'
        ]
      }
    },
    {
      id: 'thyroid-complete',
      name: 'Thyroid Function Complete',
      icon: '🔬',
      description: 'Full thyroid panel with antibodies',
      network: 'In-Network',
      priceRange: '$75 – $110',
      priceMin: 75,
      priceMax: 110,
      rating: 4.7,
      reviewCount: 42,
      savingsPercentage: 35,
      points: 32,
      details: {
        facilityFee: '$60',
        professionalFee: '$15',
        medianCost: '$140',
        includes: [
          'TSH (Thyroid Stimulating Hormone)',
          'Free T4 & Free T3',
          'Thyroid Antibodies (TPO, TG)',
          'Results within 48 hours'
        ]
      }
    }
  ];

  // Mock reviews
  const reviews: Review[] = [
    {
      rating: 5,
      text: 'Fast service, results in 24 hours. Staff was professional and the facility was very clean.',
      author: 'Sarah M.',
      date: 'Oct 15, 2024'
    },
    {
      rating: 5,
      text: 'Professional staff, clean facility. Price transparency appreciated!',
      author: 'James K.',
      date: 'Oct 10, 2024'
    },
    {
      rating: 4,
      text: 'Great experience overall. Easy scheduling and quick turnaround on results.',
      author: 'Lisa R.',
      date: 'Oct 5, 2024'
    }
  ];

  const avgRating = 4.8;
  const totalReviews = 50;
  const maxSavings = Math.max(...testOptions.map(t => t.savingsPercentage));
  const maxPoints = Math.max(...testOptions.map(t => t.points));

  const handleViewDetails = (test: TestOption) => {
    setSelectedTest(test);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-0">
      {/* Sticky Header */}
      <div 
        className="sticky top-0 z-50 bg-white"
        style={{ 
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 mario-transition hover:opacity-70 mario-focus-ring"
              style={{ color: '#2E5077' }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span style={{ fontSize: '16px', fontWeight: '600' }}>
                {providerInfo.name}
              </span>
            </button>
            
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
              aria-label={isSaved ? "Unsave provider" : "Save provider"}
            >
              <Heart 
                className={`w-5 h-5 ${isSaved ? 'fill-[#E63946] text-[#E63946]' : 'text-gray-400'}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Procedure Title */}
        <div>
          <h1 
            style={{ 
              fontSize: '24px',
              fontWeight: '700',
              color: '#2E5077',
              marginBottom: '8px'
            }}
          >
            {procedureName}
          </h1>
          <div className="flex items-center gap-2">
            <Badge
              style={{
                backgroundColor: providerInfo.network === 'In-Network' 
                  ? 'rgba(121, 215, 190, 0.15)' 
                  : 'rgba(255, 167, 38, 0.15)',
                color: '#2E5077',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '999px'
              }}
            >
              {providerInfo.network}
            </Badge>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>
              • {providerInfo.distance} from current location
            </span>
          </div>
        </div>

        {/* Savings Summary Card */}
        <Card
          className="border-none"
          style={{
            backgroundColor: 'rgba(77, 161, 169, 0.12)',
            borderRadius: '16px',
            padding: '16px'
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-full"
              style={{ backgroundColor: 'rgba(46, 80, 119, 0.1)' }}
            >
              <TrendingDown className="w-5 h-5" style={{ color: '#2E5077' }} />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '4px' }}>
                You could save up to {maxSavings}% below average
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" style={{ color: '#4DA1A9' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  Earn up to +{maxPoints} MarioPoints per test
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Available Test Options */}
        <div>
          <h2 
            style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: '#2E5077',
              marginBottom: '16px'
            }}
          >
            Available Test Options
          </h2>
          
          <div className="space-y-3">
            {testOptions.map((test) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="border mario-transition hover:mario-shadow-elevated cursor-pointer"
                  style={{
                    borderColor: '#E5E7EB',
                    borderRadius: '16px',
                    padding: '16px',
                    backgroundColor: 'white'
                  }}
                >
                  <div className="space-y-3">
                    {/* Test Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span style={{ fontSize: '24px' }}>{test.icon}</span>
                        <div className="flex-1">
                          <h3 
                            style={{ 
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#2E5077',
                              marginBottom: '4px'
                            }}
                          >
                            {test.name}
                          </h3>
                          <p style={{ fontSize: '14px', color: '#6B7280' }}>
                            {test.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Test Metadata */}
                    <div className="flex flex-wrap items-center gap-3" style={{ fontSize: '14px' }}>
                      <Badge
                        style={{
                          backgroundColor: test.network === 'In-Network' 
                            ? 'rgba(121, 215, 190, 0.15)' 
                            : 'rgba(255, 167, 38, 0.15)',
                          color: '#2E5077',
                          border: 'none',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '12px'
                        }}
                      >
                        {test.network}
                      </Badge>
                      <span style={{ color: '#2E5077', fontWeight: '600' }}>
                        {test.priceRange}
                      </span>
                      <span style={{ color: '#6B7280' }}>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" style={{ color: '#FFA726', fill: '#FFA726' }} />
                        <span style={{ color: '#2E5077', fontWeight: '600' }}>
                          {test.rating}
                        </span>
                        <span style={{ color: '#6B7280' }}>
                          ({test.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Savings & Points */}
                    <div className="flex items-center gap-4" style={{ fontSize: '14px' }}>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-4 h-4" style={{ color: '#79D7BE' }} />
                        <span style={{ color: '#2E5077', fontWeight: '600' }}>
                          {test.savingsPercentage}% below avg
                        </span>
                      </div>
                      <span style={{ color: '#6B7280' }}>|</span>
                      <div className="flex items-center gap-1">
                        <Gift className="w-4 h-4" style={{ color: '#4DA1A9' }} />
                        <span style={{ color: '#2E5077', fontWeight: '500' }}>
                          +{test.points} MarioPoints
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => onBookConcierge?.(test.id)}
                        className="flex-1 mario-focus-ring"
                        style={{
                          borderColor: '#2E5077',
                          color: '#2E5077',
                          borderRadius: '12px',
                          height: '40px'
                        }}
                      >
                        Book with Concierge
                      </Button>
                      <Button
                        onClick={() => handleViewDetails(test)}
                        className="flex-1 mario-focus-ring"
                        style={{
                          backgroundColor: '#2E5077',
                          color: 'white',
                          borderRadius: '12px',
                          height: '40px'
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Provider Information */}
        <div>
          <h2 
            style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: '#2E5077',
              marginBottom: '16px'
            }}
          >
            About {providerInfo.name}
          </h2>

          <Card
            className="border"
            style={{
              borderColor: '#E5E7EB',
              borderRadius: '16px',
              padding: '20px',
              backgroundColor: 'white'
            }}
          >
            <div className="space-y-4">
              {/* Network Status */}
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-full mt-1"
                  style={{ backgroundColor: 'rgba(121, 215, 190, 0.15)' }}
                >
                  <Award className="w-5 h-5" style={{ color: '#2E5077' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>
                    Network Status
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    ✅ {providerInfo.network}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-full mt-1"
                  style={{ backgroundColor: 'rgba(77, 161, 169, 0.15)' }}
                >
                  <MapPin className="w-5 h-5" style={{ color: '#2E5077' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>
                    Location
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    {providerInfo.address}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>
                    {providerInfo.distance} from current location
                  </div>
                </div>
              </div>

              {/* Mini Map Placeholder */}
              <div 
                className="rounded-lg overflow-hidden"
                style={{ 
                  height: '200px',
                  backgroundColor: '#E5E7EB',
                  position: 'relative'
                }}
              >
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ 
                    backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6), linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                  }}
                >
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2" style={{ color: '#E63946' }} />
                    <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
                      {providerInfo.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-full mt-1"
                  style={{ backgroundColor: 'rgba(121, 215, 190, 0.15)' }}
                >
                  <Clock className="w-5 h-5" style={{ color: '#2E5077' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>
                    Hours
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    {providerInfo.hours}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-full mt-1"
                  style={{ backgroundColor: 'rgba(77, 161, 169, 0.15)' }}
                >
                  <Phone className="w-5 h-5" style={{ color: '#2E5077' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>
                    Contact
                  </div>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    {providerInfo.phone}
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-full mt-1"
                  style={{ backgroundColor: 'rgba(121, 215, 190, 0.15)' }}
                >
                  <Globe className="w-5 h-5" style={{ color: '#2E5077' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>
                    Website
                  </div>
                  <a 
                    href={`https://${providerInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mario-transition hover:opacity-70 mario-focus-ring"
                    style={{ fontSize: '14px', color: '#4DA1A9', textDecoration: 'underline' }}
                  >
                    {providerInfo.website}
                  </a>
                </div>
              </div>

              {/* Accreditation */}
              <div className="pt-2 border-t" style={{ borderTopColor: '#E5E7EB' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077', marginBottom: '8px' }}>
                  Accreditation
                </div>
                <div className="flex flex-wrap gap-2">
                  {providerInfo.accreditation.map((cert, idx) => (
                    <Badge
                      key={idx}
                      style={{
                        backgroundColor: 'rgba(46, 80, 119, 0.1)',
                        color: '#2E5077',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Staff */}
              <div className="pt-2 border-t" style={{ borderTopColor: '#E5E7EB' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077', marginBottom: '4px' }}>
                  Staff
                </div>
                <div style={{ fontSize: '14px', color: '#374151' }}>
                  {providerInfo.staff}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Reviews Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 
              style={{ 
                fontSize: '18px',
                fontWeight: '700',
                color: '#2E5077'
              }}
            >
              Reviews
            </h2>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" style={{ color: '#FFA726', fill: '#FFA726' }} />
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#2E5077' }}>
                {avgRating}
              </span>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>
                ({totalReviews} Reviews)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((review, idx) => (
              <Card
                key={idx}
                className="border"
                style={{
                  borderColor: '#E5E7EB',
                  borderRadius: '12px',
                  padding: '16px',
                  backgroundColor: 'white'
                }}
              >
                <div className="flex items-start gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      style={{
                        color: i < review.rating ? '#FFA726' : '#E5E7EB',
                        fill: i < review.rating ? '#FFA726' : '#E5E7EB'
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px', lineHeight: '1.5' }}>
                  "{review.text}"
                </p>
                <div className="flex items-center gap-2" style={{ fontSize: '12px', color: '#6B7280' }}>
                  <span style={{ fontWeight: '500' }}>{review.author}</span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
              </Card>
            ))}
          </div>

          <button
            className="mt-4 w-full py-3 rounded-lg mario-transition hover:bg-gray-50 mario-focus-ring"
            style={{
              border: '1px solid #E5E7EB',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2E5077',
              backgroundColor: 'white'
            }}
            onClick={() => console.log('View all reviews')}
          >
            View all reviews
            <ChevronRight className="inline-block w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Test Details Modal */}
      <MarioTestDetailModal
        test={selectedTest}
        provider={providerInfo}
        procedureName={procedureName}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onBookConcierge={onBookConcierge}
      />
    </div>
  );
}