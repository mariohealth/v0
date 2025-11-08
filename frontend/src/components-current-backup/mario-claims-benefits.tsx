'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  Download,
  FileText,
  MessageSquare,
  CheckCircle,
  DollarSign,
  Clipboard,
  ChevronRight,
  ChevronDown,
  Calendar,
  AlertCircle,
  ClipboardCheck,
} from 'lucide-react';

interface Claim {
  id: string;
  claimNumber: string;
  provider: string;
  service: string;
  date: string;
  status: 'paid' | 'pending' | 'denied';
  billed: number;
  insurancePaid: number;
  youOwe: number;
  adjustments?: number;
  denialReason?: string;
  eobUrl?: string;
}

interface ClaimsBenefitsProps {
  onBack?: () => void;
  onOpenAI?: (prompt?: string) => void;
}

const mockClaims: Claim[] = [
  {
    id: '1',
    claimNumber: '12345',
    provider: 'Dr. Sarah Smith',
    service: 'Office Visit',
    date: 'Jan 15, 2025',
    status: 'paid',
    billed: 250,
    insurancePaid: 200,
    youOwe: 50,
    adjustments: 0,
  },
  {
    id: '2',
    claimNumber: '12346',
    provider: 'MRI Center Plus',
    service: 'MRI Scan - Lower Back',
    date: 'Jan 10, 2025',
    status: 'paid',
    billed: 1200,
    insurancePaid: 1080,
    youOwe: 120,
    adjustments: 0,
  },
  {
    id: '3',
    claimNumber: '12347',
    provider: 'Dr. Michael Chen',
    service: 'Physical Therapy Session',
    date: 'Jan 8, 2025',
    status: 'pending',
    billed: 180,
    insurancePaid: 0,
    youOwe: 0,
  },
  {
    id: '4',
    claimNumber: '12348',
    provider: 'LabCorp',
    service: 'Blood Test - Comprehensive',
    date: 'Dec 28, 2024',
    status: 'paid',
    billed: 320,
    insurancePaid: 300,
    youOwe: 20,
    adjustments: 0,
  },
  {
    id: '5',
    claimNumber: '12349',
    provider: 'Vision Care Center',
    service: 'Eye Exam & Prescription',
    date: 'Dec 15, 2024',
    status: 'denied',
    billed: 200,
    insurancePaid: 0,
    youOwe: 200,
    denialReason: 'Service not covered under current vision plan. Out-of-network provider.',
  },
];

export function MarioClaimsBenefits({ onBack, onOpenAI }: ClaimsBenefitsProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'pending' | 'denied'>('all');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  // Calculate deductible progress
  const deductibleTotal = 2000;
  const deductibleMet = 850;
  const deductibleRemaining = deductibleTotal - deductibleMet;
  const deductiblePercent = (deductibleMet / deductibleTotal) * 100;

  // Calculate summary metrics
  const totalPaid = mockClaims
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.insurancePaid, 0);
  
  const totalYouOwe = mockClaims
    .reduce((sum, c) => sum + c.youOwe, 0);
  
  const claimsThisYear = mockClaims.length;

  // Filter claims
  const filteredClaims = mockClaims.filter(claim => {
    if (activeFilter === 'all') return true;
    return claim.status === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: '#00AA66', text: '#FFFFFF' };
      case 'pending':
        return { bg: '#FFA726', text: '#1A1A1A' };
      case 'denied':
        return { bg: '#D32F2F', text: '#FFFFFF' };
      default:
        return { bg: '#E0E0E0', text: '#666666' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'denied':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleDisputeClaim = (claim: Claim) => {
    setSelectedClaim(null);
    if (onOpenAI) {
      onOpenAI(`I need help disputing claim #${claim.claimNumber} for ${claim.service} with ${claim.provider}. The claim was denied with reason: "${claim.denialReason}"`);
    }
    toast.success('🤖 Opening MarioAI', {
      description: 'Our concierge will help you dispute this claim.',
    });
  };

  const handleDownloadEOB = (claim: Claim) => {
    toast.success('📎 Downloading EOB', {
      description: `Claim #${claim.claimNumber} Explanation of Benefits`,
    });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#F6F4F0' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 -ml-2 mario-button-scale"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
              Claims & Benefits
            </h1>
          </div>
          <p style={{ fontSize: '14px', color: '#666666' }}>
            Track what's paid, pending, or denied.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Deductible Tracker Card */}
        <Card 
          className="p-4 transition-shadow duration-200"
          style={{ 
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>
                  Deductible Progress
                </h3>
                <p style={{ fontSize: '14px', color: '#666666' }}>
                  ${deductibleMet.toLocaleString()} of ${deductibleTotal.toLocaleString()} met
                </p>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#79D7BE' }}>
                {Math.round(deductiblePercent)}%
              </div>
            </div>

            <Progress 
              value={deductiblePercent} 
              className="h-2"
              style={{
                backgroundColor: '#E0E0E0',
              }}
            />

            <div className="flex items-center justify-between">
              <p style={{ fontSize: '14px', color: '#666666' }}>
                ${deductibleRemaining.toLocaleString()} remaining until deductible met
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto hover:bg-transparent mario-button-scale"
                style={{ fontSize: '14px', color: '#2E5077', fontWeight: 500 }}
                onClick={() => setActiveFilter('all')}
              >
                View All Claims →
              </Button>
            </div>
          </div>
        </Card>

        {/* Filter Row */}
        <div className="sticky top-[116px] z-30 bg-[#F6F4F0] py-2 -mx-4 px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['all', 'paid', 'pending', 'denied'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  // Smooth scroll to top of claims list
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="mario-transition flex-shrink-0"
                style={{
                  padding: '8px 16px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  backgroundColor: activeFilter === filter ? '#2E5077' : '#E0E0E0',
                  color: activeFilter === filter ? '#FFFFFF' : '#666666',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
            <button
              className="mario-transition flex-shrink-0"
              style={{
                padding: '8px 12px',
                borderRadius: '16px',
                backgroundColor: '#E0E0E0',
                color: '#666666',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => {
                toast.info('📅 Date Range Filter', {
                  description: 'Date filter coming soon',
                });
              }}
            >
              <Calendar className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Summary Metrics Row */}
        <div className="grid grid-cols-3 gap-3">
          <Card 
            className="p-3 text-center"
            style={{ 
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <CheckCircle className="h-5 w-5 mb-1" style={{ color: '#79D7BE' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A' }}>
                ${totalPaid.toLocaleString()}
              </p>
              <p style={{ fontSize: '12px', color: '#666666' }}>
                Total Paid
              </p>
            </div>
          </Card>

          <Card 
            className="p-3 text-center"
            style={{ 
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <DollarSign className="h-5 w-5 mb-1" style={{ color: '#2E5077' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A' }}>
                ${totalYouOwe.toLocaleString()}
              </p>
              <p style={{ fontSize: '12px', color: '#666666' }}>
                You Owe
              </p>
            </div>
          </Card>

          <Card 
            className="p-3 text-center"
            style={{ 
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <Clipboard className="h-5 w-5 mb-1" style={{ color: '#4DA1A9' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A' }}>
                {claimsThisYear}
              </p>
              <p style={{ fontSize: '12px', color: '#666666' }}>
                Claims This Year
              </p>
            </div>
          </Card>
        </div>

        {/* Claims List */}
        {filteredClaims.length > 0 ? (
          <div className="space-y-4">
            {filteredClaims.map((claim) => {
              const statusColor = getStatusColor(claim.status);
              return (
                <Card
                  key={claim.id}
                  className="p-4 cursor-pointer mario-transition hover:shadow-lg"
                  style={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'all 200ms ease',
                  }}
                  onClick={() => setSelectedClaim(claim)}
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A' }}>
                            Claim #{claim.claimNumber}
                          </span>
                          {/* Status Dot */}
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: statusColor.bg,
                            }}
                          />
                        </div>
                        <p style={{ fontSize: '14px', color: '#666666' }}>
                          {claim.provider} — {claim.service}
                        </p>
                        <p style={{ fontSize: '14px', color: '#666666' }}>
                          {claim.date}
                        </p>
                      </div>
                      <Badge
                        className="flex items-center gap-1"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          border: 'none',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: 500,
                        }}
                      >
                        {getStatusIcon(claim.status)}
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: '#E0E0E0' }} />

                    {/* Cost Summary */}
                    <div className="space-y-2" style={{ fontSize: '14px' }}>
                      <div className="flex justify-between">
                        <span style={{ color: '#666666' }}>Billed:</span>
                        <span style={{ color: '#1A1A1A', fontWeight: 500 }}>
                          ${claim.billed.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#666666' }}>Insurance Paid:</span>
                        <span style={{ color: '#1A1A1A', fontWeight: 500 }}>
                          ${claim.insurancePaid.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#1A1A1A', fontWeight: 600 }}>You Owe:</span>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#2E5077' }}>
                          ${claim.youOwe.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', backgroundColor: '#E0E0E0' }} />

                    {/* View Details Button */}
                    <div className="flex items-center justify-center gap-1 text-sm" style={{ color: '#2E5077', fontWeight: 500 }}>
                      View Details
                      <ChevronRight className="h-4 w-4 mario-transition" style={{ transform: 'translateX(0)' }} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <ClipboardCheck 
              className="h-20 w-20 mb-4" 
              style={{ color: '#4DA1A9', opacity: 0.6 }}
              strokeWidth={1.5}
            />
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>
              No claims yet
            </h3>
            <p style={{ fontSize: '14px', color: '#666666', marginBottom: '24px', maxWidth: '300px' }}>
              Your future visits will appear here once processed.
            </p>
            <Button
              variant="outline"
              className="mario-button-scale"
              style={{ borderColor: '#2E5077', color: '#2E5077' }}
              onClick={() => {
                if (onBack) onBack();
              }}
            >
              Explore Procedures
            </Button>
          </div>
        )}
      </div>

      {/* Claim Detail Modal */}
      <Dialog open={!!selectedClaim} onOpenChange={(open) => !open && setSelectedClaim(null)}>
        <DialogContent 
          className="max-w-lg"
          style={{
            borderRadius: '16px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {selectedClaim && (
            <>
              <DialogHeader>
                <DialogTitle style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A' }}>
                  Claim #{selectedClaim.claimNumber} — {selectedClaim.service}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Provider, Service, Date */}
                <div className="space-y-2" style={{ fontSize: '14px' }}>
                  <div className="flex justify-between">
                    <span style={{ color: '#666666' }}>Provider:</span>
                    <span style={{ color: '#1A1A1A', fontWeight: 500 }}>
                      {selectedClaim.provider}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#666666' }}>Service:</span>
                    <span style={{ color: '#1A1A1A', fontWeight: 500 }}>
                      {selectedClaim.service}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#666666' }}>Date:</span>
                    <span style={{ color: '#1A1A1A', fontWeight: 500 }}>
                      {selectedClaim.date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#666666' }}>Status:</span>
                    <Badge
                      style={{
                        backgroundColor: getStatusColor(selectedClaim.status).bg,
                        color: getStatusColor(selectedClaim.status).text,
                        border: 'none',
                      }}
                    >
                      {selectedClaim.status.charAt(0).toUpperCase() + selectedClaim.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Cost Breakdown Accordion */}
                <Collapsible open={breakdownOpen} onOpenChange={setBreakdownOpen}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      style={{ borderColor: '#E0E0E0' }}
                    >
                      <span style={{ fontWeight: 600 }}>Cost Breakdown</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${breakdownOpen ? 'rotate-180' : ''}`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-2" style={{ fontSize: '14px' }}>
                    <div className="flex justify-between py-2 border-b">
                      <span style={{ color: '#666666' }}>Billed</span>
                      <span style={{ fontWeight: 500 }}>
                        ${selectedClaim.billed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span style={{ color: '#666666' }}>Insurance Paid</span>
                      <span style={{ fontWeight: 500, color: '#79D7BE' }}>
                        -${selectedClaim.insurancePaid.toLocaleString()}
                      </span>
                    </div>
                    {selectedClaim.adjustments !== undefined && selectedClaim.adjustments > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span style={{ color: '#666666' }}>Adjustments</span>
                        <span style={{ fontWeight: 500 }}>
                          -${selectedClaim.adjustments.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2">
                      <span style={{ fontWeight: 600 }}>You Owe</span>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#2E5077' }}>
                        ${selectedClaim.youOwe.toLocaleString()}
                      </span>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Denial Reason (if applicable) */}
                {selectedClaim.status === 'denied' && selectedClaim.denialReason && (
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: '#FFF3E0', border: '1px solid #FFB74D' }}
                  >
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: '#F57C00' }} />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>
                          Denial Reason
                        </p>
                        <p style={{ fontSize: '14px', color: '#666666' }}>
                          {selectedClaim.denialReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start mario-button-scale"
                    style={{ borderColor: '#2E5077', color: '#2E5077' }}
                    onClick={() => handleDownloadEOB(selectedClaim)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download EOB (PDF)
                  </Button>

                  {selectedClaim.status === 'denied' && (
                    <Button
                      className="w-full justify-start mario-button-scale text-white"
                      style={{ backgroundColor: '#2E5077' }}
                      onClick={() => handleDisputeClaim(selectedClaim)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Dispute with Concierge
                    </Button>
                  )}
                </div>

                {/* MarioPoints Callout (optional) */}
                {selectedClaim.status === 'denied' && (
                  <div 
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: '#E8F5F7', border: '1px solid #4DA1A9' }}
                  >
                    <p style={{ fontSize: '14px', color: '#1A1A1A' }}>
                      <span style={{ fontWeight: 600, color: '#4DA1A9' }}>+25 MarioPoints</span>
                      {' '}for resolving a denied claim via concierge
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-row gap-2 sm:gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClaim(null)}
                  className="flex-1 mario-button-scale"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (onOpenAI) {
                      onOpenAI(`I have a question about claim #${selectedClaim.claimNumber} for ${selectedClaim.service}.`);
                    }
                    setSelectedClaim(null);
                  }}
                  className="flex-1 mario-button-scale text-white"
                  style={{ backgroundColor: '#4DA1A9' }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Concierge
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
