'use client'
import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Globe, Star, Award, TrendingDown, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

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

interface MarioTestDetailModalProps {
  test: TestOption | null;
  provider: ProviderInfo;
  procedureName: string;
  isOpen: boolean;
  onClose: () => void;
  onBookConcierge?: (testId: string) => void;
}

export function MarioTestDetailModal({
  test,
  provider,
  procedureName,
  isOpen,
  onClose,
  onBookConcierge
}: MarioTestDetailModalProps) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!test || !test.details) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={isDesktop ? "max-w-3xl" : "max-w-lg"}
        style={{
          borderRadius: '16px',
          padding: 0,
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{ padding: isDesktop ? '24px 32px' : '20px', borderBottom: '1px solid #E0E0E0' }}>
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <DialogTitle className="flex items-center gap-2" style={{ fontSize: '20px', fontWeight: '700', color: '#2E5077', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{test.icon}</span>
                  {test.name}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2" style={{ fontSize: '14px', color: '#6B7280' }}>
                  <span style={{ fontWeight: '500', color: '#2E5077' }}>{provider.name}</span>
                  <span>•</span>
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
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" style={{ color: '#FFA726', fill: '#FFA726' }} />
                    <span style={{ fontWeight: '600', color: '#2E5077' }}>
                      {test.rating}
                    </span>
                    <span style={{ color: '#6B7280' }}>
                      ({test.reviewCount})
                    </span>
                  </div>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content with Two-Column Layout */}
        <div style={{
          padding: isDesktop ? '32px' : '20px',
          maxHeight: 'calc(90vh - 180px)',
          overflowY: 'auto'
        }}>
          <div className={isDesktop ? "grid grid-cols-2 gap-8" : "space-y-6"}>
            {/* LEFT COLUMN - Cost & Comparison */}
            <div className="space-y-6">
              {/* Cost Breakdown Table */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  Your Estimated Costs
                </h3>
                <div className="space-y-0">
                  <div
                    className="flex justify-between items-center"
                    style={{ borderBottom: '1px solid #E0E0E0', height: '40px' }}
                  >
                    <span style={{ fontSize: '14px', color: '#1A1A1A' }}>Facility Fee</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>
                      {test.details.facilityFee}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center"
                    style={{ borderBottom: '1px solid #E0E0E0', height: '40px' }}
                  >
                    <span style={{ fontSize: '14px', color: '#1A1A1A' }}>Professional Fee</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>
                      {test.details.professionalFee}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center"
                    style={{ borderBottom: '1px solid #E0E0E0', height: '40px' }}
                  >
                    <span style={{ fontSize: '14px', color: '#1A1A1A' }}>Supplies & Processing</span>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                      Included
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center"
                    style={{ height: '40px', paddingTop: '8px' }}
                  >
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A1A' }}>
                      Total Estimated
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#2E5077' }}>
                      ${test.priceMin}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparison Chart */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '4px' }}>
                  Compared to Average
                </h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
                  Versus area average for {procedureName}
                </p>

                <div className="space-y-4">
                  {/* Provider Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#2E5077' }}>
                        {provider.name}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#4DA1A9' }}>
                        ${test.priceMin}
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '36px',
                        backgroundColor: '#E0E0E0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(test.priceMin / parseInt(test.details.medianCost.replace('$', ''))) * 100}%`
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                        style={{
                          height: '100%',
                          backgroundColor: '#4DA1A9',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Area Average Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                        Area Average
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#6B7280' }}>
                        {test.details.medianCost}
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '36px',
                        backgroundColor: '#E0E0E0',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    />
                  </div>
                </div>

                {/* Scale Labels */}
                <div className="flex justify-between mt-3" style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>$0</span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>$25</span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>$50</span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>$75</span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>$100</span>
                </div>
              </div>

              {/* What's Included - Desktop Only in Left Column */}
              {isDesktop && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {test.details.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span style={{ color: '#79D7BE', marginTop: '2px', fontSize: '16px', fontWeight: '700' }}>✓</span>
                        <span style={{ fontSize: '14px', color: '#374151' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Provider Info & Highlights */}
            <div className="space-y-6">
              {/* Provider Highlights */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  Provider Highlights
                </h3>
                <div className="space-y-3" style={{ fontSize: '14px' }}>
                  <div className="flex items-start gap-2">
                    <span style={{ color: '#79D7BE', marginTop: '2px' }}>✅</span>
                    <div>
                      <span style={{ fontWeight: '600', color: '#2E5077' }}>Network: </span>
                      <span style={{ color: '#374151' }}>{provider.network}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#4DA1A9' }} />
                    <div>
                      <span style={{ fontWeight: '600', color: '#2E5077' }}>Address: </span>
                      <span style={{ color: '#374151' }}>{provider.address}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5" style={{ color: '#4DA1A9' }} />
                    <div>
                      <span style={{ fontWeight: '600', color: '#2E5077' }}>Hours: </span>
                      <span style={{ color: '#374151' }}>{provider.hours}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5" style={{ color: '#4DA1A9' }} />
                    <div>
                      <span style={{ fontWeight: '600', color: '#2E5077' }}>Contact: </span>
                      <span style={{ color: '#374151' }}>{provider.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="w-4 h-4 mt-0.5" style={{ color: '#4DA1A9' }} />
                    <div>
                      <span style={{ fontWeight: '600', color: '#2E5077' }}>Website: </span>
                      <a
                        href={`https://${provider.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mario-transition hover:opacity-70"
                        style={{ color: '#4DA1A9', textDecoration: 'underline' }}
                      >
                        {provider.website}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 mt-0.5" style={{ color: '#4DA1A9' }} />
                    <div>
                      <span style={{ fontWeight: '600', color: '#2E5077' }}>Accreditation: </span>
                      <span style={{ color: '#374151' }}>
                        Certified by {provider.accreditation.join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 mt-0.5" style={{ color: '#4DA1A9' }} />
                    <div>
                      <span style={{ fontWeight: '600', color: '#2E5077' }}>Staff: </span>
                      <span style={{ color: '#374151' }}>{provider.staff}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Map */}
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  height: '160px',
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
                    <MapPin className="w-10 h-10 mx-auto mb-2" style={{ color: '#E63946' }} />
                    <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
                      {provider.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Savings Summary Card */}
              <div
                className="p-4"
                style={{
                  backgroundColor: 'rgba(77, 161, 169, 0.12)',
                  borderRadius: '16px'
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <TrendingDown className="w-5 h-5 mt-0.5" style={{ color: '#2E5077' }} />
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>
                      You're saving {test.savingsPercentage}% below average
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gift className="w-6 h-6 mt-0.5" style={{ color: '#4DA1A9' }} />
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>
                      Earn +{test.points} MarioPoints for this test
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Highlights */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5" style={{ color: '#FFA726', fill: '#FFA726' }} />
                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#2E5077' }}>
                    {test.rating}
                  </span>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>
                    ({test.reviewCount} reviews)
                  </span>
                </div>
                <div className="space-y-2" style={{ fontSize: '14px', color: '#374151' }}>
                  <p style={{ fontStyle: 'italic' }}>
                    "Fast turnaround, clean facility."
                  </p>
                  <p style={{ fontStyle: 'italic' }}>
                    "Transparent pricing and friendly staff."
                  </p>
                  <button
                    className="mario-transition hover:opacity-70 mario-focus-ring"
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#4DA1A9',
                      textDecoration: 'underline'
                    }}
                    onClick={() => console.log('View all reviews')}
                  >
                    View all reviews →
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div
                className="p-4"
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div className="space-y-2" style={{ fontSize: '13px', color: '#374151' }}>
                  <p>
                    ✓ Performed by board-certified pathologists in accredited facilities.
                  </p>
                  <p>
                    ✓ Results available within 24 hours.
                  </p>
                  <button
                    className="mario-transition hover:opacity-70 mario-focus-ring mt-2"
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#4DA1A9',
                      textDecoration: 'underline'
                    }}
                    onClick={() => console.log('Learn more about test')}
                  >
                    Learn more about this test →
                  </button>
                </div>
              </div>
            </div>

            {/* What's Included - Mobile Only */}
            {!isDesktop && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077', marginBottom: '12px' }}>
                  What's Included
                </h3>
                <ul className="space-y-2">
                  {test.details.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span style={{ color: '#79D7BE', marginTop: '2px', fontSize: '16px', fontWeight: '700' }}>✓</span>
                      <span style={{ fontSize: '14px', color: '#374151' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div
          style={{
            padding: isDesktop ? '16px 32px' : '16px 20px',
            borderTop: '1px solid #E0E0E0',
            backgroundColor: 'white',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="mario-focus-ring"
              style={{
                borderColor: '#E5E7EB',
                color: '#6B7280',
                borderRadius: '12px',
                height: '44px',
                paddingLeft: '20px',
                paddingRight: '20px'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onClose();
                onBookConcierge?.(test.id);
              }}
              className="mario-focus-ring"
              style={{
                backgroundColor: '#2E5077',
                color: 'white',
                borderRadius: '12px',
                height: '44px',
                paddingLeft: '20px',
                paddingRight: '20px'
              }}
            >
              Book with Concierge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
