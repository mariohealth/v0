'use client'
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Calendar, 
  Clock, 
  Shield, 
  MessageSquare,
  Video,
  CheckCircle,
  AlertCircle,
  XCircle,
  CalendarPlus,
  RefreshCw,
  Gift,
  WifiOff
} from 'lucide-react';
import { MarioStatusButton } from './mario-status-button';
import { MarioAIPanel } from './mario-ai-panel';
import { MarioAIBookingChat } from './mario-ai-booking-chat';
import { MarioAIAppointmentSupport } from './mario-ai-appointment-support';
import { MarioToast } from './mario-toast-helper';
import { MarioConciergeRequests } from './mario-concierge-requests';
import { MarioAIConciergeChat } from './mario-ai-concierge-chat';
import { useAuth } from '@/lib/contexts/AuthContext';
import { 
  fetchHealthHubData, 
  getAppointments, 
  getClaims, 
  getConciergeRequests,
  type Appointment,
  type Claim,
  type ConciergeRequest,
  type Message,
  type DeductibleProgress
} from '@/lib/api';
import {
  mockUpcomingAppointments,
  mockPastAppointments,
  mockConciergeRequests,
  mockRecentClaims,
  mockMessages,
  mockDeductibleProgress
} from '@/mock/archive/health-rewards-v1/health-hub-mock-data';

// Section Navigation Component with Scroll Sync
function SectionNav({ 
  activeSection, 
  onSectionChange 
}: { 
  activeSection: string; 
  onSectionChange: (section: string) => void;
}) {
  const sections = [
    { id: 'appointments', label: 'Appointments' },
    { id: 'concierge-requests', label: 'Concierge' },
    { id: 'claims', label: 'Claims' },
    { id: 'messages', label: 'Messages' }
  ];

  const scrollToSection = (sectionId: string) => {
    onSectionChange(sectionId);
    const headerElement = document.getElementById(`${sectionId}-header`);
    
    if (headerElement) {
      // Get the sticky header heights dynamically
      const stickyHeaderHeight = 120; // Main "Health Hub" header
      const tabNavHeight = 60; // Tab navigation bar
      const totalOffset = stickyHeaderHeight + tabNavHeight + 8; // Total sticky elements + small margin
      
      // Calculate position to show the section header just below sticky elements
      const headerPosition = headerElement.getBoundingClientRect().top;
      const offsetPosition = headerPosition + window.pageYOffset - totalOffset;

      // Smooth scroll animation
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className="sticky top-[120px] z-30 pb-3 mb-6"
      style={{ 
        backgroundColor: '#FDFCFA',
        borderBottom: '1px solid #E8EAED'
      }}
    >
      <div className="flex gap-6 overflow-x-auto py-3">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`font-medium whitespace-nowrap pb-2 border-b-2 mario-transition ${
              activeSection === section.id
                ? 'border-[#2E5077]'
                : 'border-transparent hover:border-[#2E5077]/30'
            }`}
            style={{
              fontSize: '15px',
              color: activeSection === section.id ? '#2E5077' : 'rgba(46, 80, 119, 0.65)',
              fontWeight: '500',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #79D7BE';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
            onClick={() => scrollToSection(section.id)}
            aria-label={`${section.label} section`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Status Chip Component
function StatusChip({ status }: { status: 'confirmed' | 'pending' | 'cancelled' | 'paid' | 'denied' | 'in-progress' | 'completed' }) {
  const configs = {
    confirmed: { bg: '#79D7BE', icon: CheckCircle, text: 'Confirmed' },
    pending: { bg: '#4DA1A9', icon: Clock, text: 'Pending' },
    cancelled: { bg: '#E57373', icon: XCircle, text: 'Cancelled' },
    paid: { bg: '#79D7BE', icon: CheckCircle, text: 'Paid' },
    denied: { bg: '#E57373', icon: XCircle, text: 'Denied' },
    'in-progress': { bg: '#4DA1A9', icon: AlertCircle, text: 'In Progress' },
    completed: { bg: '#79D7BE', icon: CheckCircle, text: 'Completed' }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div 
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-medium"
      style={{ backgroundColor: config.bg }}
    >
      <Icon className="w-3 h-3" />
      {config.text}
    </div>
  );
}

// Appointment Card with Actions
function AppointmentCard({ 
  provider, 
  specialty, 
  date, 
  time, 
  status,
  marioPoints,
  isPast,
  onViewDetails,
  onAddToCalendar,
  onReschedule,
  onMessageConcierge
}: {
  provider: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  marioPoints?: number;
  isPast?: boolean;
  onViewDetails: () => void;
  onAddToCalendar: () => void;
  onReschedule: () => void;
  onMessageConcierge: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="p-4 mario-transition"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(46,80,119,0.08)',
        border: '1px solid #E8EAED'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 
              className="font-medium mb-1"
              style={{ fontSize: '15px', color: '#2E5077' }}
            >
              {provider}
            </h4>
            <p className="text-sm text-[#666666] mb-2">{specialty}</p>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm text-[#2E5077] font-medium">{date}, {time}</span>
              <StatusChip status={status} />
            </div>
            
            {/* MarioPoints */}
            {marioPoints && (
              <div className="flex items-center gap-1 mt-2">
                <Gift className="w-3.5 h-3.5" style={{ color: '#4DA1A9' }} />
                <span className="text-xs" style={{ color: '#666666' }}>
                  {isPast ? `${marioPoints} points earned` : `Earn ${marioPoints} points`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Only show for upcoming appointments */}
        {!isPast && status !== 'cancelled' && (
          <div className="grid grid-cols-3 gap-2 pt-3 border-t" style={{ borderColor: '#E8EAED' }}>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2 px-2 gap-1 mario-transition hover:bg-[#F5F5F5] active:scale-95"
              style={{
                borderColor: '#E8EAED',
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
              onClick={(e) => {
                e.stopPropagation();
                onAddToCalendar();
              }}
            >
              <CalendarPlus className="h-4 w-4" style={{ color: '#2E5077' }} />
              <span className="text-xs" style={{ color: '#2E5077' }}>Add to Cal</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2 px-2 gap-1 mario-transition hover:bg-[#F5F5F5] active:scale-95"
              style={{
                borderColor: '#E8EAED',
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
              onClick={(e) => {
                e.stopPropagation();
                onReschedule();
              }}
            >
              <RefreshCw className="h-4 w-4" style={{ color: '#2E5077' }} />
              <span className="text-xs" style={{ color: '#2E5077' }}>Reschedule</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2 px-2 gap-1 mario-transition hover:bg-[#F5F5F5] active:scale-95"
              style={{
                borderColor: '#E8EAED',
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
              onClick={(e) => {
                e.stopPropagation();
                onMessageConcierge();
              }}
            >
              <MessageSquare className="h-4 w-4" style={{ color: '#2E5077' }} />
              <span className="text-xs" style={{ color: '#2E5077' }}>Message</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// Empty State Component
function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction 
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div 
        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ backgroundColor: '#4DA1A910' }}
      >
        <Icon className="h-8 w-8" style={{ color: '#4DA1A9' }} />
      </div>
      <h3 
        className="font-medium mb-2"
        style={{ fontSize: '15px', color: '#2E5077' }}
      >
        {title}
      </h3>
      <p className="text-sm text-[#666666] mb-4 max-w-xs mx-auto">
        {description}
      </p>
      {actionText && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          style={{
            borderColor: '#2E5077',
            color: '#2E5077',
            borderRadius: '8px'
          }}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}

// Concierge Request Card
function ConciergeRequestCard({ 
  type, 
  status, 
  requestDate, 
  expectedDate,
  onViewDetails
}: {
  type: string;
  status: 'pending' | 'in-progress' | 'completed';
  requestDate: string;
  expectedDate: string;
  onViewDetails: () => void;
}) {
  return (
    <Card 
      className="p-4 cursor-pointer mario-transition hover:outline hover:outline-[1.5px] hover:outline-[#4DA1A9] hover:outline-offset-0"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(46,80,119,0.08)',
        border: '1px solid #E8EAED'
      }}
      onClick={onViewDetails}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 
            className="font-medium"
            style={{ fontSize: '15px', color: '#2E5077' }}
          >
            {type}
          </h4>
          <StatusChip status={status} />
        </div>
        <div className="flex items-center justify-between text-sm text-[#666666]">
          <span>Requested: {requestDate}</span>
          <span>Expected: {expectedDate}</span>
        </div>
      </div>
    </Card>
  );
}

// Claim Card with Two-Column Layout
function ClaimCard({ 
  service, 
  provider, 
  amount, 
  youOwe, 
  date, 
  status,
  onViewDetails
}: {
  service: string;
  provider: string;
  amount: string;
  youOwe: string;
  date: string;
  status: 'paid' | 'pending' | 'denied';
  onViewDetails: () => void;
}) {
  return (
    <Card 
      className="p-4 cursor-pointer mario-transition hover:outline hover:outline-[1.5px] hover:outline-[#4DA1A9] hover:outline-offset-0"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(46,80,119,0.08)',
        border: '1px solid #E8EAED'
      }}
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 
            className="font-semibold mb-1"
            style={{ fontSize: '15px', color: '#2E5077' }}
          >
            {service} — {amount}
          </h4>
          <p className="text-sm text-[#666666] mb-1">
            {provider}
          </p>
          <p className="text-sm text-[#666666]">
            You owe {youOwe} · {date}
          </p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <StatusChip status={status} />
        </div>
      </div>
    </Card>
  );
}

// Message Card
function MessageCard({ 
  sender, 
  message, 
  time, 
  isNew,
  onViewDetails
}: {
  sender: string;
  message: string;
  time: string;
  isNew?: boolean;
  onViewDetails: () => void;
}) {
  return (
    <Card 
      className="p-4 cursor-pointer mario-transition hover:outline hover:outline-[1.5px] hover:outline-[#4DA1A9] hover:outline-offset-0"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(46,80,119,0.08)',
        border: '1px solid #E8EAED'
      }}
      onClick={onViewDetails}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5"
          style={{ backgroundColor: '#4DA1A9' }}
        >
          M
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-[#2E5077]">{sender}</span>
            <span className="text-xs text-[#666666]">{time}</span>
            {isNew && <div className="w-2 h-2 rounded-full bg-[#4DA1A9]" />}
          </div>
          <p className="text-sm text-[#666666]">{message}</p>
        </div>
      </div>
    </Card>
  );
}

// MarioAI Chat CTA
function MarioAIChatCard({ onClick }: { onClick: () => void }) {
  return (
    <Card 
      className="p-4 text-center cursor-pointer mario-transition hover:outline hover:outline-[1.5px] hover:outline-[#4DA1A9] hover:outline-offset-0"
      style={{ 
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(46,80,119,0.08)',
        border: '1px solid #E8EAED'
      }}
      onClick={onClick}
    >
      <div className="space-y-3">
        <p className="text-sm text-[#666666]">
          Need help with an appointment or claim?
        </p>
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-white font-medium mario-transition active:scale-95"
          style={{ 
            backgroundColor: '#2E5077',
            fontSize: '14px',
            minHeight: '44px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#274666';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2E5077';
          }}
        >
          <MessageSquare className="h-4 w-4" />
          Ask MarioAI
        </button>
      </div>
    </Card>
  );
}

interface MarioHealthHubProps {
  onNavigateToAppointmentDetail?: (appointmentId: string) => void;
  onNavigateToConciergeDetail?: (requestId: string) => void;
  onNavigateToClaimDetail?: (claimId: string) => void;
  onNavigateToInboxDetail?: (conversationId: string) => void;
  onNavigateToCostEstimator?: () => void;
  onViewAllAppointments?: () => void;
  onViewAllConcierge?: () => void;
  onViewAllClaims?: () => void;
  onViewAllMessages?: () => void;
  onSearch?: (query: string) => void;
}

export function MarioHealthHubRefined({
  onNavigateToAppointmentDetail,
  onNavigateToConciergeDetail,
  onNavigateToClaimDetail,
  onNavigateToInboxDetail,
  onNavigateToCostEstimator,
  onViewAllAppointments,
  onViewAllConcierge,
  onViewAllClaims,
  onViewAllMessages,
  onSearch
}: MarioHealthHubProps) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('appointments');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showConciergeChatModal, setShowConciergeChatModal] = useState(false);
  const [selectedConciergeRequest, setSelectedConciergeRequest] = useState<{ id: string; title: string } | null>(null);
  
  // Data state
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [conciergeRequests, setConciergeRequests] = useState<ConciergeRequest[]>([]);
  const [recentClaims, setRecentClaims] = useState<Claim[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [deductibleProgress, setDeductibleProgress] = useState<DeductibleProgress>({ current: 0, total: 0, percentage: 0 });
  
  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  
  // Simple scroll sync functionality using scroll event
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['appointments', 'concierge-requests', 'claims', 'messages'];
      const headerOffset = 180; // Account for sticky header and tab bar
      
      let currentSection = 'appointments'; // Default
      
      // Find which section is currently at the top of the viewport
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is in the top half of the viewport
          if (rect.top <= headerOffset && rect.bottom > headerOffset) {
            currentSection = sectionId;
            break;
          }
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };
    
    // Add scroll listener with throttling
    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };
    
    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll(); // Run once on mount
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [activeSection]);

  // Handlers for appointment actions
  const handleAddToCalendar = (appointment: any) => {
    MarioToast.appointment('Added to Calendar', `${appointment.provider} appointment saved to your calendar`);
  };

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleMessageConcierge = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowMessageModal(true);
  };

  // Fetch data from API with fallback to mock data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) {
        // No user, use mock data
        setUpcomingAppointments(mockUpcomingAppointments);
        setPastAppointments(mockPastAppointments);
        setConciergeRequests(mockConciergeRequests);
        setRecentClaims(mockRecentClaims);
        setMessages(mockMessages);
        setDeductibleProgress(mockDeductibleProgress);
        setLoading(false);
        setOfflineMode(true);
        return;
      }

      setLoading(true);
      setOfflineMode(false);

      try {
        // Try to fetch from unified health hub endpoint first
        try {
          const healthHubData = await fetchHealthHubData(user.uid);
          setUpcomingAppointments(healthHubData.upcomingAppointments || []);
          setPastAppointments(healthHubData.pastAppointments || []);
          setConciergeRequests(healthHubData.conciergeRequests || []);
          setRecentClaims(healthHubData.recentClaims || []);
          setMessages(healthHubData.messages || []);
          setDeductibleProgress(healthHubData.deductibleProgress || { current: 0, total: 0, percentage: 0 });
        } catch (error) {
          // Fallback to individual endpoints
          console.warn('[Health Hub] Unified endpoint failed, trying individual endpoints:', error);
          
          const [appointments, claims, requests] = await Promise.allSettled([
            getAppointments(user.uid),
            getClaims(user.uid),
            getConciergeRequests(user.uid)
          ]);

          if (appointments.status === 'fulfilled') {
            const allAppointments = appointments.value;
            const now = new Date();
            const upcoming = allAppointments.filter(apt => {
              // Simple date comparison - adjust based on your date format
              return apt.status !== 'cancelled' && !apt.isPast;
            });
            const past = allAppointments.filter(apt => apt.isPast || apt.status === 'cancelled');
            setUpcomingAppointments(upcoming);
            setPastAppointments(past);
          }

          if (claims.status === 'fulfilled') {
            setRecentClaims(claims.value);
          }

          if (requests.status === 'fulfilled') {
            setConciergeRequests(requests.value);
          }

          // Messages and deductible progress would need separate endpoints
          // For now, use mock data
          setMessages(mockMessages);
          setDeductibleProgress(mockDeductibleProgress);
        }
      } catch (error) {
        console.error('[Health Hub] Error fetching data, using fallback:', error);
        // Fallback to mock data
        setUpcomingAppointments(mockUpcomingAppointments);
        setPastAppointments(mockPastAppointments);
        setConciergeRequests(mockConciergeRequests);
        setRecentClaims(mockRecentClaims);
        setMessages(mockMessages);
        setDeductibleProgress(mockDeductibleProgress);
        setOfflineMode(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-0 flex items-center justify-center" style={{ backgroundColor: '#FDFCFA' }}>
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#2E5077' }} />
          <p className="text-sm" style={{ color: '#666666' }}>Loading Health Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#FDFCFA' }}>
      
      {/* Offline Mode Banner */}
      {offlineMode && (
        <div 
          className="sticky top-0 z-50 px-4 py-2 flex items-center gap-2"
          style={{ 
            backgroundColor: '#FFF3CD',
            borderBottom: '1px solid #FFE69C'
          }}
        >
          <WifiOff className="h-4 w-4" style={{ color: '#856404' }} />
          <p className="text-sm font-medium" style={{ color: '#856404' }}>
            Offline Mode: Showing cached data
          </p>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40" style={{ backgroundColor: '#FDFCFA' }}>
        <div className="max-w-sm mx-auto px-4 py-4">
          <div className="mb-6">
            <h1 
              className="font-semibold mb-1"
              style={{ 
                fontSize: '18px',
                color: '#2E5077',
                fontWeight: '600'
              }}
            >
              Health Hub
            </h1>
            <p 
              className="text-sm"
              style={{ color: '#666666' }}
            >
              Your care, claims, and concierge in one place.
            </p>
          </div>
        </div>
        
        {/* Tab Navigation - Now separate sticky element */}
        <div className="max-w-sm mx-auto px-4">
          <SectionNav 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4">
        
        {/* Section 1: Appointments */}
        <section id="appointments" className="scroll-mt-40" style={{ marginBottom: '32px' }}>
          <div className="flex items-center justify-between mb-6" style={{ marginTop: '24px' }}>
            <h2 
              id="appointments-header"
              className="font-semibold"
              style={{ 
                fontSize: '16px',
                color: '#2E5077',
                fontWeight: '600'
              }}
            >
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length > 0 && (
              <button 
                className="text-sm mario-transition"
                style={{ color: '#2E5077', outline: 'none' }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #79D7BE';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.color = '#274666';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                  e.currentTarget.style.color = '#2E5077';
                }}
                onClick={onViewAllAppointments}
              >
                View All
              </button>
            )}
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  {...appointment} 
                  onViewDetails={() => onNavigateToAppointmentDetail?.(appointment.id)}
                  onAddToCalendar={() => handleAddToCalendar(appointment)}
                  onReschedule={() => handleReschedule(appointment)}
                  onMessageConcierge={() => handleMessageConcierge(appointment)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No Upcoming Appointments"
              description="You don't have any scheduled appointments. Book a visit with a provider to get started."
              actionText="Find a Doctor"
              onAction={() => onSearch?.('doctors')}
            />
          )}

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <>
              <h3 
                className="font-medium mt-8 mb-4"
                style={{ 
                  fontSize: '15px',
                  color: '#2E5077'
                }}
              >
                Past Appointments
              </h3>
              <div className="space-y-3">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    {...appointment} 
                    onViewDetails={() => onNavigateToAppointmentDetail?.(appointment.id)}
                    onAddToCalendar={() => handleAddToCalendar(appointment)}
                    onReschedule={() => handleReschedule(appointment)}
                    onMessageConcierge={() => handleMessageConcierge(appointment)}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Section Divider */}
        <div className="h-px bg-[#E8EAED]" style={{ margin: '16px 0' }}></div>

        {/* Section 2: Pending Concierge Requests - Enhanced V2 */}
        <section id="concierge-requests" className="scroll-mt-40" style={{ marginBottom: '32px' }}>
          <div id="concierge-requests-header" style={{ marginTop: '24px' }}>
            <MarioConciergeRequests 
            onMessageConcierge={(requestId) => {
              // Find the request to get its title - in a real app this would come from state/props
              setSelectedConciergeRequest({ id: requestId, title: 'MRI Booking Request' });
              setShowConciergeChatModal(true);
            }}
            onAskConcierge={() => {
              setSelectedConciergeRequest({ id: 'new', title: 'New Appointment Request' });
              setShowConciergeChatModal(true);
            }}
          />
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-[#E8EAED]" style={{ margin: '16px 0' }}></div>

        {/* Section 3: Claims & Benefits */}
        <section id="claims" className="scroll-mt-40" style={{ marginBottom: '32px' }}>
          <div className="flex items-center justify-between mb-6" style={{ marginTop: '24px' }}>
            <h2 
              id="claims-header"
              className="font-semibold"
              style={{ 
                fontSize: '16px',
                color: '#2E5077',
                fontWeight: '600'
              }}
            >
              Claims & Benefits
            </h2>
            {recentClaims.length > 0 && (
              <button 
                className="text-sm mario-transition"
                style={{ color: '#2E5077', outline: 'none' }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #79D7BE';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.color = '#274666';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                  e.currentTarget.style.color = '#2E5077';
                }}
                onClick={onViewAllClaims}
              >
                View All
              </button>
            )}
          </div>
          
          {/* Merged Deductible + Estimate Costs */}
          <div 
            className="p-4 mb-4 rounded-xl"
            style={{ 
              backgroundColor: '#4DA1A910'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm mb-1 text-[#2E5077]">
                  ${deductibleProgress.current} of ${deductibleProgress.total.toLocaleString()} met
                </h3>
                <p className="text-xs text-[#666666]">Deductible Progress</p>
              </div>
              <Shield className="h-5 w-5 text-[#9AA4B0]" />
            </div>
            <div className="space-y-3">
              <Progress 
                value={deductibleProgress.percentage} 
                className="h-2"
                style={{ 
                  backgroundColor: '#DCE4EB',
                } as React.CSSProperties}
              />
              <button 
                className="text-xs px-3 py-1.5 rounded border mario-transition"
                style={{ 
                  borderColor: '#2E5077', 
                  color: '#2E5077',
                  backgroundColor: 'transparent',
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
                  e.currentTarget.style.backgroundColor = '#E6EEF4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={onNavigateToCostEstimator}
              >
                Estimate Future Costs →
              </button>
            </div>
          </div>

          {/* Claims List */}
          <div className="space-y-3">
            {recentClaims.map((claim) => (
              <ClaimCard 
                key={claim.id} 
                {...claim} 
                onViewDetails={() => onNavigateToClaimDetail?.(claim.id)}
              />
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-[#E8EAED]" style={{ margin: '16px 0' }}></div>

        {/* Section 4: Messages & Notifications */}
        <section id="messages" className="scroll-mt-40" style={{ marginBottom: '32px' }}>
          <div className="flex items-center justify-between mb-6" style={{ marginTop: '24px' }}>
            <h2 
              id="messages-header"
              className="font-semibold"
              style={{ 
                fontSize: '16px',
                color: '#2E5077',
                fontWeight: '600'
              }}
            >
              Messages & Notifications
            </h2>
            {messages.length > 0 && (
              <button 
                className="text-sm mario-transition"
                style={{ color: '#2E5077', outline: 'none' }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid #79D7BE';
                  e.currentTarget.style.outlineOffset = '2px';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.color = '#274666';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                  e.currentTarget.style.color = '#2E5077';
                }}
                onClick={onViewAllMessages}
              >
                View All Messages
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageCard 
                key={message.id} 
                {...message} 
                onViewDetails={() => onNavigateToInboxDetail?.(message.id)}
              />
            ))}
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-[#E8EAED]" style={{ margin: '16px 0' }}></div>

        {/* Section 5: Tools & Support */}
        <section className="scroll-mt-40" style={{ marginBottom: '32px' }}>
          <h2 
            className="font-semibold mb-6"
            style={{ 
              fontSize: '16px',
              color: '#2E5077',
              fontWeight: '600',
              marginTop: '24px'
            }}
          >
            Tools & Support
          </h2>
          
          <div className="space-y-4">
            {/* Talk to a Doctor Now */}
            <Card 
              className="p-4 text-white cursor-pointer mario-transition hover:outline hover:outline-[1.5px] hover:outline-[#4DA1A9] hover:outline-offset-0"
              style={{ 
                backgroundColor: '#4DA1A9',
                borderRadius: '12px'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Video className="h-4 w-4" />
                    <h3 
                      className="font-semibold"
                      style={{ fontSize: '15px' }}
                    >
                      Talk to a Doctor Now
                    </h3>
                  </div>
                  <p 
                    className="text-white/90"
                    style={{ fontSize: '13px' }}
                  >
                    24/7 telehealth through MarioCare
                  </p>
                </div>
                <button 
                  className="px-3 py-1.5 text-sm rounded border mario-transition"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
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
                    e.currentTarget.style.backgroundColor = '#2E5077';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  Start Visit
                </button>
              </div>
            </Card>
          </div>
        </section>

        {/* Bottom spacing for AI panel */}
        <div className="h-32 md:h-0" />
      </div>

      {/* MarioAI Panel */}
      <MarioAIPanel 
        onBookAppointment={(doctor) => {
          // Handle booking appointment from AI
          console.log('Booking appointment:', doctor);
        }}
        onSearchSuggestion={(query) => {
          onSearch?.(query);
        }}
      />

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <MarioAIAppointmentSupport
          isOpen={showRescheduleModal}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
          }}
          appointment={{
            id: selectedAppointment.id,
            provider: selectedAppointment.provider,
            specialty: selectedAppointment.specialty,
            date: selectedAppointment.date,
            time: selectedAppointment.time,
            estimatedCost: '$180',
            marioPoints: selectedAppointment.marioPoints
          }}
          firstName="Sarah"
          onActionComplete={(action, details) => {
            console.log('Action completed:', action, details);
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
            // Optionally refresh appointments or show updated status
          }}
        />
      )}

      {/* Message Concierge Modal */}
      {showMessageModal && selectedAppointment && (
        <MarioAIAppointmentSupport
          isOpen={showMessageModal}
          onClose={() => {
            setShowMessageModal(false);
            setSelectedAppointment(null);
          }}
          appointment={{
            id: selectedAppointment.id,
            provider: selectedAppointment.provider,
            specialty: selectedAppointment.specialty,
            date: selectedAppointment.date,
            time: selectedAppointment.time,
            estimatedCost: '$180',
            marioPoints: selectedAppointment.marioPoints
          }}
          firstName="Sarah"
          onActionComplete={(action, details) => {
            console.log('Action completed:', action, details);
            setShowMessageModal(false);
            setSelectedAppointment(null);
          }}
        />
      )}

      {/* Concierge Chat Modal */}
      {showConciergeChatModal && selectedConciergeRequest && (
        <MarioAIConciergeChat
          isOpen={showConciergeChatModal}
          onClose={() => {
            setShowConciergeChatModal(false);
            setSelectedConciergeRequest(null);
          }}
          requestId={selectedConciergeRequest.id}
          requestTitle={selectedConciergeRequest.title}
        />
      )}
    </div>
  );
}