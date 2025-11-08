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
  AlertTriangle
} from 'lucide-react';
import { MarioToast } from './mario-toast-helper';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

// Status Badge Component with exact V2 colors
function ConciergeStatusBadge({ 
  status 
}: { 
  status: 'pending' | 'confirmed' | 'cancelled' 
}) {
  const configs = {
    pending: { 
      bg: '#FFA726', 
      icon: Clock, 
      text: 'Pending',
      emoji: '🟠'
    },
    confirmed: { 
      bg: '#00AA66', 
      icon: CheckCircle, 
      text: 'Confirmed',
      emoji: '🟢'
    },
    cancelled: { 
      bg: '#D32F2F', 
      icon: XCircle, 
      text: 'Canceled',
      emoji: '🔴'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div 
      className="inline-flex items-center text-white font-medium"
      style={{ 
        backgroundColor: config.bg,
        borderRadius: '12px',
        padding: '4px 8px',
        fontSize: '12px',
        height: '24px',
        gap: '6px'
      }}
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
  onMessageConcierge: () => void;
  onCancelRequest: () => void;
}) {
  // Status-specific messages
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
      className="mario-transition group"
      style={{ 
        backgroundColor: status === 'cancelled' ? '#F5F5F5' : '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #E8EAED',
        opacity: status === 'cancelled' ? 0.6 : 1,
        padding: '16px',
        transition: 'box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Header */}
        <div className="flex items-start justify-between" style={{ gap: '12px' }}>
          <div className="flex-1">
            <h4 
              className="font-semibold"
              style={{ fontSize: '16px', color: '#1A1A1A', marginBottom: '4px' }}
            >
              {title}
            </h4>
            {providerName && (
              <div className="flex items-center" style={{ gap: '8px', marginTop: '4px' }}>
                <Stethoscope className="w-4 h-4" style={{ color: '#666666' }} />
                <p style={{ fontSize: '14px', color: '#666666' }}>
                  {providerName}
                  {providerSpecialty && ` · ${providerSpecialty}`}
                </p>
              </div>
            )}
          </div>
          <ConciergeStatusBadge status={status} />
        </div>

        {/* Progress Bar - Show for all states with different styles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div className="flex items-center justify-between" style={{ fontSize: '12px', color: '#666666' }}>
            <span>{getStatusMessage()}</span>
            {status !== 'cancelled' && <span>{progress}%</span>}
          </div>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            backgroundColor: '#E0E0E0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${status === 'cancelled' ? 0 : progress}%`,
              height: '100%',
              backgroundColor: '#79D7BE',
              transition: 'width 0.3s ease',
              borderRadius: '4px'
            }} />
          </div>
        </div>

        {/* Date Information */}
        <div className="flex items-center justify-between" style={{ fontSize: '12px', color: '#999999' }}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Expected: {expectedDate}</span>
          </div>
          <span>Requested {requestedDate}</span>
        </div>

        {/* Action Buttons - Only show for active requests */}
        {status !== 'cancelled' && (
          <div className="flex" style={{ gap: '8px', paddingTop: '12px', paddingBottom: '4px', borderTop: '1px solid #E8EAED', alignItems: 'center', height: 'auto' }}>
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
    <div className="text-center" style={{ padding: '48px 16px' }}>
      <div 
        className="mx-auto flex items-center justify-center"
        style={{ 
          width: '80px',
          height: '80px',
          borderRadius: '40px',
          backgroundColor: '#4DA1A910',
          marginBottom: '16px'
        }}
      >
        <MessageSquare className="h-10 w-10" style={{ color: '#4DA1A9' }} />
      </div>
      <h3 
        className="font-semibold"
        style={{ fontSize: '16px', color: '#1A1A1A', marginBottom: '8px' }}
      >
        No active concierge requests
      </h3>
      <p style={{ fontSize: '14px', color: '#666666', marginBottom: '24px', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>
        Need help scheduling? Our concierge can handle it for you.
      </p>
      <Button
        className="mario-transition active:scale-95"
        style={{
          backgroundColor: '#2E5077',
          color: '#FFFFFF',
          borderRadius: '8px',
          height: '48px',
          outline: 'none',
          fontSize: '14px',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '0 24px'
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
        <MessageSquare className="w-4 h-4" />
        <span>Ask Mario Concierge</span>
      </Button>
    </div>
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
          <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
            <div 
              className="flex items-center justify-center"
              style={{ 
                width: '48px',
                height: '48px',
                borderRadius: '24px',
                backgroundColor: '#FEF2F2' 
              }}
            >
              <AlertTriangle className="w-6 h-6" style={{ color: '#D32F2F' }} />
            </div>
            <AlertDialogTitle 
              className="font-semibold"
              style={{ fontSize: '16px', color: '#1A1A1A' }}
            >
              Cancel Concierge Request
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription 
            style={{ fontSize: '14px', color: '#666666' }}
          >
            Are you sure you want to cancel this appointment request?
            <div 
              style={{ 
                backgroundColor: '#F5F5F5',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '12px'
              }}
            >
              <p className="font-medium" style={{ fontSize: '12px', color: '#2E5077' }}>
                {requestTitle}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col" style={{ gap: '12px' }}>
          <AlertDialogAction
            className="w-full mario-transition active:scale-95"
            style={{
              backgroundColor: '#D32F2F',
              color: '#FFFFFF',
              borderRadius: '8px',
              height: '48px',
              outline: 'none',
              fontSize: '14px',
              fontWeight: '500'
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
              height: '48px',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '500'
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

// Main Component
export function MarioConciergeRequests({
  onMessageConcierge,
  onAskConcierge
}: {
  onMessageConcierge?: (requestId: string) => void;
  onAskConcierge?: () => void;
}) {
  // Sample concierge request data with U.S. locations and USD
  const [requests, setRequests] = useState([
    {
      id: 'REQ001',
      title: 'MRI Booking Request',
      providerName: 'San Francisco Imaging Center',
      providerSpecialty: 'Radiology',
      status: 'pending' as const,
      progress: 50,
      expectedDate: 'Jan 10, 2025',
      requestedDate: 'Oct 28, 2025'
    },
    {
      id: 'REQ002',
      title: 'Orthopedic Specialist Referral',
      providerName: 'Dr. Michael Chen',
      providerSpecialty: 'Orthopedic Surgery',
      status: 'confirmed' as const,
      progress: 100,
      expectedDate: 'Nov 15, 2025',
      requestedDate: 'Oct 20, 2025'
    },
    {
      id: 'REQ003',
      title: 'Insurance Pre-Authorization',
      status: 'pending' as const,
      progress: 50,
      expectedDate: 'Nov 5, 2025',
      requestedDate: 'Oct 30, 2025'
    }
  ]);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<{ id: string; title: string } | null>(null);

  const handleMessageConcierge = (requestId: string) => {
    if (onMessageConcierge) {
      onMessageConcierge(requestId);
    } else {
      MarioToast.info('Opening Chat', 'Connecting you with Mario Concierge...');
    }
  };

  const handleCancelClick = (requestId: string, title: string) => {
    setRequestToCancel({ id: requestId, title });
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      // Update the request status to cancelled
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestToCancel.id 
            ? { ...req, status: 'cancelled' as const } 
            : req
        )
      );
      MarioToast.error('Request Canceled', 'Your concierge request was canceled.');
      setCancelModalOpen(false);
      setRequestToCancel(null);
    }
  };

  const handleAskConcierge = () => {
    if (onAskConcierge) {
      onAskConcierge();
    } else {
      MarioToast.info('Opening Chat', 'Starting conversation with Mario Concierge...');
    }
  };

  const activeRequests = requests.filter(req => req.status !== 'cancelled');

  return (
    <>
      <section id="concierge-requests" className="scroll-mt-40" style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 
            className="font-semibold"
            style={{ 
              fontSize: '16px',
              color: '#1A1A1A',
              fontWeight: '600',
              marginBottom: '4px'
            }}
          >
            Pending Concierge Requests
          </h2>
          <p style={{ fontSize: '12px', color: '#999999' }}>
            Track your active booking and support requests
          </p>
        </div>
        
        {activeRequests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeRequests.map((request, index) => (
              <div key={request.id}>
                <EnhancedConciergeRequestCard 
                  title={request.title}
                  providerName={request.providerName}
                  providerSpecialty={request.providerSpecialty}
                  status={request.status}
                  progress={request.progress}
                  expectedDate={request.expectedDate}
                  requestedDate={request.requestedDate}
                  onMessageConcierge={() => handleMessageConcierge(request.id)}
                  onCancelRequest={() => handleCancelClick(request.id, request.title)}
                />
                {index < activeRequests.length - 1 && (
                  <div style={{ 
                    height: '1px', 
                    backgroundColor: '#E0E0E0',
                    marginTop: '16px'
                  }} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <ConciergeEmptyState onAskConcierge={handleAskConcierge} />
        )}
      </section>

      {/* Cancel Confirmation Modal */}
      {requestToCancel && (
        <CancelConfirmationModal
          isOpen={cancelModalOpen}
          onClose={() => {
            setCancelModalOpen(false);
            setRequestToCancel(null);
          }}
          onConfirm={handleConfirmCancel}
          requestTitle={requestToCancel.title}
        />
      )}
    </>
  );
}
