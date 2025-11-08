'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  MessageSquare, 
  XCircle, 
  Clock, 
  CheckCircle,
  CalendarClock,
  Stethoscope,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { MarioToast } from './mario-toast-helper';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { MarioAIConciergeChat } from './mario-ai-concierge-chat';

// Status Badge Component
function ConciergeStatusBadge({ 
  status 
}: { 
  status: 'pending' | 'confirmed' | 'cancelled' 
}) {
  const configs = {
    pending: { 
      bg: '#FFA726', 
      icon: Clock, 
      text: 'Pending'
    },
    confirmed: { 
      bg: '#00AA66', 
      icon: CheckCircle, 
      text: 'Confirmed'
    },
    cancelled: { 
      bg: '#D32F2F', 
      icon: XCircle, 
      text: 'Canceled'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-white text-xs font-medium"
      style={{ backgroundColor: config.bg }}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.text}
    </div>
  );
}

// Enhanced Concierge Request Card
function EnhancedConciergeRequestCard({ 
  title,
  providerName,
  providerSpecialty,
  status,
  progress,
  expectedDate,
  requestedDate,
  onMessageConcierge,
  onCancelRequest
}: {
  title: string;
  providerName?: string;
  providerSpecialty?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  progress: number;
  expectedDate: string;
  requestedDate: string;
  onMessageConcierge?: () => void;
  onCancelRequest?: () => void;
}) {
  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Confirming with provider';
      case 'confirmed':
        return 'Confirmed – view details soon';
      case 'cancelled':
        return 'Canceled by user';
      default:
        return 'Processing request';
    }
  };

  return (
    <Card 
      className="p-4 mario-transition"
      style={{ 
        backgroundColor: status === 'cancelled' ? '#F5F5F5' : '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(46,80,119,0.08)',
        border: '1px solid #E8EAED',
        opacity: status === 'cancelled' ? 0.6 : 1
      }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 
              className="font-semibold mb-1"
              style={{ fontSize: '15px', color: '#2E5077' }}
            >
              {title}
            </h4>
            {providerName && (
              <div className="flex items-center gap-1.5 mb-2">
                <Stethoscope className="w-3.5 h-3.5" style={{ color: '#666666' }} />
                <p className="text-xs" style={{ color: '#666666' }}>
                  {providerName}
                  {providerSpecialty && ` · ${providerSpecialty}`}
                </p>
              </div>
            )}
          </div>
          <ConciergeStatusBadge status={status} />
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs" style={{ color: '#666666' }}>
            <span>{getStatusMessage()}</span>
            {status !== 'cancelled' && <span>{progress}%</span>}
          </div>
          <Progress 
            value={status === 'cancelled' ? 0 : progress} 
            className="h-2"
            style={{ 
              backgroundColor: '#DCE4EB',
            } as React.CSSProperties}
          />
        </div>

        {/* Date Information */}
        <div className="flex items-center justify-between text-xs" style={{ color: '#666666' }}>
          <div className="flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Expected: {expectedDate}</span>
          </div>
          <span>Requested {requestedDate}</span>
        </div>

        {/* Action Buttons */}
        {status !== 'cancelled' && onMessageConcierge && onCancelRequest && (
          <div className="flex pt-3 border-t" style={{ borderColor: '#E8EAED', gap: '8px', alignItems: 'center', height: 'auto', paddingBottom: '4px' }}>
            <Button
              className="mario-transition"
              style={{
                backgroundColor: '#2E5077',
                color: '#FFFFFF',
                borderRadius: '8px',
                height: '36px',
                paddingTop: '6px',
                paddingBottom: '6px',
                paddingLeft: '12px',
                paddingRight: '12px',
                outline: 'none',
                fontSize: '13px',
                fontWeight: '500',
                lineHeight: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #79D7BE';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#254260';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2E5077';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = '#1C3349';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = '#254260';
              }}
              onClick={onMessageConcierge}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message Concierge</span>
            </Button>

            <Button
              variant="outline"
              className="mario-transition"
              style={{
                borderColor: '#2E5077',
                borderWidth: '1px',
                color: '#2E5077',
                borderRadius: '8px',
                height: '36px',
                paddingTop: '6px',
                paddingBottom: '6px',
                paddingLeft: '12px',
                paddingRight: '12px',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                fontSize: '13px',
                fontWeight: '500',
                lineHeight: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid #79D7BE';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2E50770A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = '#2E507714';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = '#2E50770A';
              }}
              onClick={onCancelRequest}
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Request</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// Empty State Component
function ConciergeEmptyState({ 
  onAskConcierge 
}: { 
  onAskConcierge: () => void 
}) {
  return (
    <Card 
      className="text-center py-12"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(46,80,119,0.08)',
        border: '1px solid #E8EAED'
      }}
    >
      <div 
        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ backgroundColor: '#4DA1A910' }}
      >
        <MessageSquare className="h-10 w-10" style={{ color: '#4DA1A9' }} />
      </div>
      <h3 
        className="font-semibold mb-2"
        style={{ fontSize: '16px', color: '#2E5077' }}
      >
        No active concierge requests
      </h3>
      <p className="text-sm text-[#666666] mb-6 max-w-xs mx-auto">
        Need help scheduling? Our concierge can handle it for you.
      </p>
      <Button
        className="mario-transition active:scale-95"
        style={{
          backgroundColor: '#2E5077',
          color: '#FFFFFF',
          borderRadius: '8px',
          minHeight: '44px',
          outline: 'none'
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid #79D7BE';
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#274666';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2E5077';
        }}
        onClick={onAskConcierge}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Ask Mario Concierge
      </Button>
    </Card>
  );
}

// Confirmation Modal Component
function CancelConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  requestTitle
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requestTitle: string;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent 
        className="max-w-sm mx-4"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E8EAED'
        }}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FEF2F2' }}
            >
              <AlertTriangle className="w-6 h-6" style={{ color: '#D32F2F' }} />
            </div>
            <AlertDialogTitle 
              className="font-semibold"
              style={{ fontSize: '16px', color: '#2E5077' }}
            >
              Cancel Concierge Request
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription 
            className="text-sm"
            style={{ color: '#666666' }}
          >
            Are you sure you want to cancel this appointment request?
            <div 
              className="mt-3 p-3 rounded-lg"
              style={{ backgroundColor: '#F5F5F5' }}
            >
              <p className="text-xs font-medium" style={{ color: '#2E5077' }}>
                {requestTitle}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col gap-2">
          <AlertDialogAction
            className="w-full mario-transition active:scale-95"
            style={{
              backgroundColor: '#D32F2F',
              color: '#FFFFFF',
              borderRadius: '8px',
              minHeight: '44px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #79D7BE';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B71C1C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#D32F2F';
            }}
            onClick={onConfirm}
          >
            Cancel Request
          </AlertDialogAction>
          <AlertDialogCancel
            className="w-full mario-transition active:scale-95 m-0"
            style={{
              borderColor: '#E8EAED',
              color: '#2E5077',
              borderRadius: '8px',
              minHeight: '44px',
              outline: 'none',
              backgroundColor: '#FFFFFF'
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #79D7BE';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Keep Request
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function MarioConciergeRequestsDemo() {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<{ id: string; title: string } | null>(null);

  const handleCancelClick = (title: string) => {
    setRequestToCancel(title);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      MarioToast.error('Request Canceled', 'Your concierge request was canceled.');
      setCancelModalOpen(false);
      setRequestToCancel(null);
    }
  };

  const handleMessageConcierge = (requestId: string, requestTitle: string) => {
    setCurrentRequest({ id: requestId, title: requestTitle });
    setChatOpen(true);
  };

  const handleAskConcierge = () => {
    setCurrentRequest({ id: 'new', title: 'New Appointment Request' });
    setChatOpen(true);
  };

  return (
    <>
      <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#FDFCFA' }}>
        {/* Header */}
        <div className="sticky top-0 z-40" style={{ backgroundColor: '#FDFCFA', borderBottom: '1px solid #E8EAED' }}>
          <div className="max-w-2xl mx-auto px-4 py-4">
            <button
              className="flex items-center gap-2 mb-3 mario-transition active:scale-95"
              style={{ color: '#2E5077' }}
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <div className="mb-2">
              <h1 
                className="font-semibold mb-1"
                style={{ 
                  fontSize: '20px',
                  color: '#2E5077',
                  fontWeight: '600'
                }}
              >
                Concierge Requests — V2 Demo
              </h1>
              <p 
                className="text-sm"
                style={{ color: '#666666' }}
              >
                Complete showcase of all state variants
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 pt-6 space-y-8">
          {/* Variant 1: Pending */}
          <section>
            <div className="mb-4">
              <h2 
                className="font-semibold mb-1"
                style={{ fontSize: '16px', color: '#2E5077' }}
              >
                🟠 Pending State
              </h2>
              <p className="text-xs" style={{ color: '#666666' }}>
                Orange badge (#FFA726), 50% progress bar, active action buttons
              </p>
            </div>
            <EnhancedConciergeRequestCard 
              title="MRI Booking Request"
              providerName="San Francisco Imaging Center"
              providerSpecialty="Radiology"
              status="pending"
              progress={50}
              expectedDate="Jan 10, 2025"
              requestedDate="Oct 28, 2025"
              onMessageConcierge={() => handleMessageConcierge('REQ001', 'MRI Booking Request')}
              onCancelRequest={() => handleCancelClick('MRI Booking Request')}
            />
          </section>

          {/* Variant 2: Confirmed */}
          <section>
            <div className="mb-4">
              <h2 
                className="font-semibold mb-1"
                style={{ fontSize: '16px', color: '#2E5077' }}
              >
                🟢 Confirmed State
              </h2>
              <p className="text-xs" style={{ color: '#666666' }}>
                Green badge (#00AA66), 100% progress bar, active action buttons
              </p>
            </div>
            <EnhancedConciergeRequestCard 
              title="Orthopedic Specialist Referral"
              providerName="Dr. Michael Chen, MD"
              providerSpecialty="Orthopedic Surgery"
              status="confirmed"
              progress={100}
              expectedDate="Nov 15, 2025"
              requestedDate="Oct 20, 2025"
              onMessageConcierge={() => handleMessageConcierge('REQ002', 'Orthopedic Specialist Referral')}
              onCancelRequest={() => handleCancelClick('Orthopedic Specialist Referral')}
            />
          </section>

          {/* Variant 3: Canceled */}
          <section>
            <div className="mb-4">
              <h2 
                className="font-semibold mb-1"
                style={{ fontSize: '16px', color: '#2E5077' }}
              >
                🔴 Canceled State
              </h2>
              <p className="text-xs" style={{ color: '#666666' }}>
                Red badge (#D32F2F), 0% gray progress, no action buttons, grayed out card
              </p>
            </div>
            <EnhancedConciergeRequestCard 
              title="Dermatology Consultation"
              providerName="NYC Skin & Laser Center"
              providerSpecialty="Dermatology"
              status="cancelled"
              progress={0}
              expectedDate="Nov 8, 2025"
              requestedDate="Oct 25, 2025"
            />
          </section>

          {/* Variant 4: Empty State */}
          <section>
            <div className="mb-4">
              <h2 
                className="font-semibold mb-1"
                style={{ fontSize: '16px', color: '#2E5077' }}
              >
                📭 Empty State
              </h2>
              <p className="text-xs" style={{ color: '#666666' }}>
                Teal icon, helpful message, and primary CTA button
              </p>
            </div>
            <ConciergeEmptyState onAskConcierge={handleAskConcierge} />
          </section>

          {/* Design System Notes */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#F5F5F5' }}>
            <h3 className="font-semibold mb-3" style={{ fontSize: '14px', color: '#2E5077' }}>
              ✅ Design System V2 Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#2E5077' }}>Visual</p>
                <ul className="text-xs space-y-1" style={{ color: '#666666' }}>
                  <li>✓ 12px border radius</li>
                  <li>✓ Subtle shadows (0 2px 8px)</li>
                  <li>✓ Support Green progress (#79D7BE)</li>
                  <li>✓ 8-point grid spacing</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#2E5077' }}>Interaction</p>
                <ul className="text-xs space-y-1" style={{ color: '#666666' }}>
                  <li>✓ 44×44px touch targets</li>
                  <li>✓ Teal focus outlines (#79D7BE)</li>
                  <li>✓ Confirmation modal</li>
                  <li>✓ Toast notifications</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#2E5077' }}>Status Colors</p>
                <ul className="text-xs space-y-1" style={{ color: '#666666' }}>
                  <li>🟠 Pending: #FFA726</li>
                  <li>🟢 Confirmed: #00AA66</li>
                  <li>🔴 Canceled: #D32F2F</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#2E5077' }}>Data</p>
                <ul className="text-xs space-y-1" style={{ color: '#666666' }}>
                  <li>✓ USD pricing format</li>
                  <li>✓ U.S. locations (SF, NYC)</li>
                  <li>✓ WCAG AA compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {requestToCancel && (
        <CancelConfirmationModal
          isOpen={cancelModalOpen}
          onClose={() => {
            setCancelModalOpen(false);
            setRequestToCancel(null);
          }}
          onConfirm={handleConfirmCancel}
          requestTitle={requestToCancel}
        />
      )}

      {/* MarioAI Concierge Chat */}
      {currentRequest && (
        <MarioAIConciergeChat
          isOpen={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setCurrentRequest(null);
          }}
          requestId={currentRequest.id}
          requestTitle={currentRequest.title}
        />
      )}
    </>
  );
}
