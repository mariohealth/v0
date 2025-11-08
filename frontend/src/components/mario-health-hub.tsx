import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { MarioStatusButton } from './mario-status-button';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CreditCard, 
  Shield, 
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Plus,
  Phone,
  RotateCcw,
  Check,
  X,
  DollarSign,
  TrendingUp,
  VideoIcon,
  Users,
  Gift,
  Settings,
  Heart,
  Pill,
  Calculator
} from 'lucide-react';

// Section Navigation Component
function SectionNav({ 
  activeSection, 
  onSectionChange,
  onScrollToSection
}: { 
  activeSection: string;
  onSectionChange: (section: string) => void;
  onScrollToSection: (sectionId: string) => void;
}) {
  const sections = [
    { id: 'appointments', label: 'Appointments' },
    { id: 'concierge', label: 'Concierge' },
    { id: 'claims', label: 'Claims' },
    { id: 'messages', label: 'Messages' }
  ];

  const scrollToSection = (sectionId: string) => {
    onSectionChange(sectionId);
    onScrollToSection(sectionId);
  };

  return (
    <div className="flex gap-6 mb-6">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
            activeSection === section.id
              ? 'border-b-2'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
          style={{
            color: activeSection === section.id ? '#2E5077' : undefined,
            borderBottomColor: activeSection === section.id ? '#2E5077' : undefined,
            fontWeight: 500
          }}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
}

// Compressed Appointment Card
function AppointmentCard({ 
  provider, 
  specialty, 
  date, 
  time, 
  status,
  onViewDetails
}: {
  provider: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
  onViewDetails: () => void;
}) {
  return (
    <Card 
      className="p-4 mario-transition cursor-pointer hover:outline hover:outline-[1.5px] hover:outline-[#4DA1A9] hover:outline-offset-0"
      style={{ 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        minHeight: '96px'
      }}
      onClick={onViewDetails}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">{provider} • {specialty}</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{date}, {time}</span>
              <MarioStatusButton 
                status={status} 
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Streamlined Concierge Request
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
      className="p-4 mario-transition cursor-pointer hover:outline hover:outline-[1.5px] hover:outline-[#4DA1A9] hover:outline-offset-0"
      style={{ 
        border: '1px solid #E8EAED',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
      onClick={onViewDetails}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{type}</h4>
          <MarioStatusButton 
            status={status} 
            size="small"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Requested: {requestDate}</span>
          <span>Expected: {expectedDate}</span>
        </div>
      </div>
    </Card>
  );
}

// Compact Claims List Item
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
    <div 
      className="p-4 rounded-lg border mario-transition cursor-pointer hover:outline hover:outline-[1.5px] hover:outline-[#4DA1A9] hover:outline-offset-0"
      style={{ 
        borderColor: '#E8EAED',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold mb-1" style={{ fontSize: '15px' }}>
            {service} — {amount}
          </h4>
          <p className="text-sm text-muted-foreground mb-1" style={{ fontSize: '13px' }}>
            {provider}
          </p>
          <p className="text-sm text-muted-foreground" style={{ fontSize: '13px' }}>
            You owe {youOwe} · {date}
          </p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <MarioStatusButton 
            status={status} 
            size="small"
          />
        </div>
      </div>
    </div>
  );
}

// Simplified Message Card
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
      className="p-3 mario-transition mario-hover-primary cursor-pointer"
      style={{ 
        backgroundColor: 'var(--mario-neutral-bg)',
        border: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
            <span className="font-medium text-sm">{sender}</span>
            <span className="text-xs text-muted-foreground">{time}</span>
            {isNew && <div className="w-2 h-2 rounded-full bg-accent" />}
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </Card>
  );
}

// MarioAI Chat CTA
function MarioAIChatCard() {
  return (
    <Card 
      className="p-4 cursor-pointer mario-transition mario-hover-primary"
      style={{ boxShadow: '0 1px 3px rgba(46,80,119,0.08)' }}
    >
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Need help with an appointment or claim?
        </p>
        <Button 
          className="text-white"
          style={{ backgroundColor: '#2E5077' }}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Ask MarioAI
        </Button>
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
}

export function MarioHealthHub({
  onNavigateToAppointmentDetail,
  onNavigateToConciergeDetail,
  onNavigateToClaimDetail,
  onNavigateToInboxDetail,
  onNavigateToCostEstimator,
  onViewAllAppointments,
  onViewAllConcierge,
  onViewAllClaims,
  onViewAllMessages
}: MarioHealthHubProps = {}) {
  const [activeSection, setActiveSection] = useState('appointments');
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Smooth scroll to section with proper offset and highlight
  const scrollToSection = (sectionId: string) => {
    const headerElement = document.getElementById(`${sectionId}-section`);
    
    if (headerElement) {
      // Get the sticky header height dynamically
      const stickyHeader = document.querySelector('.sticky.top-0') as HTMLElement;
      const stickyHeaderHeight = stickyHeader ? stickyHeader.offsetHeight : 90;
      
      // Calculate position to show the section header just below sticky header
      const headerPosition = headerElement.getBoundingClientRect().top;
      const offsetPosition = headerPosition + window.pageYOffset - stickyHeaderHeight - 8; // 8px extra spacing

      // Smooth scroll animation
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Add highlight effect to the header
      setHighlightedSection(sectionId);
      setTimeout(() => {
        setHighlightedSection(null);
      }, 800);
    }
  };

  // Mock data
  const upcomingAppointments = [
    {
      provider: "Dr. Sarah Johnson",
      specialty: "Orthopedic Surgery",
      date: "Tomorrow",
      time: "2:30 PM",
      status: 'confirmed' as const
    },
    {
      provider: "Dr. Angela Patel",
      specialty: "Internal Medicine",
      date: "Oct 15",
      time: "10:15 AM",
      status: 'pending' as const
    }
  ];

  const conciergeRequests = [
    {
      type: "MRI Knee Scheduling",
      status: 'in-progress' as const,
      requestDate: "Oct 3",
      expectedDate: "Oct 10"
    }
  ];

  const recentClaims = [
    {
      service: "Annual Physical Exam",
      provider: "Dr. Sarah Johnson",
      amount: "$220",
      youOwe: "$25",
      date: "Sep 28",
      status: 'paid' as const
    },
    {
      service: "Blood Work Panel",
      provider: "City Lab Services", 
      amount: "$185",
      youOwe: "$15",
      date: "Sep 25",
      status: 'pending' as const
    },
    {
      service: "X-Ray Chest",
      provider: "Metro Imaging",
      amount: "$95",
      youOwe: "$20",
      date: "Sep 20",
      status: 'denied' as const
    }
  ];

  const messages = [
    {
      sender: "Mario Concierge",
      message: "Your MRI appointment has been scheduled for Oct 18th. Confirmation details sent to your email.",
      time: "2 hrs ago",
      isNew: true
    }
  ];

  const deductibleProgress = {
    current: 850,
    total: 2000,
    percentage: (850 / 2000) * 100
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      
      {/* Clean Header */}
      <div className="sticky top-0 z-40 bg-card">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <div>
            <h1 
              className="font-semibold mb-1"
              style={{ 
                fontSize: '22px',
                color: '#2E5077'
              }}
            >
              Health Hub
            </h1>
            <p 
              className="text-sm"
              style={{ color: '#6B6B6B' }}
            >
              Your care, claims, and concierge in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        
        {/* Section Navigation */}
        <div className="mb-6">
          <SectionNav 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onScrollToSection={scrollToSection}
          />
        </div>

        {/* Section 1: Upcoming Appointments */}
        <section id="appointments" className="scroll-mt-32">
          <div id="appointments-section" style={{ marginTop: '16px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <h2 
                className="font-semibold transition-all duration-300"
                style={{ 
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#2E5077',
                  fontWeight: '600',
                  opacity: highlightedSection === 'appointments' ? 1 : 1,
                  transform: highlightedSection === 'appointments' ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                Upcoming Appointments
              </h2>
            <button 
              className="text-sm mario-transition"
              style={{ color: '#2E5077' }}
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
            </div>
            
            <div className="grid gap-3 mb-4">
              {upcomingAppointments.map((appointment, index) => (
                <AppointmentCard 
                  key={index} 
                  {...appointment} 
                  onViewDetails={() => onNavigateToAppointmentDetail?.(appointment.provider)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-[#E8EAED]" style={{ margin: '16px 0' }}></div>

        {/* Section 2: Concierge Requests */}
        <section id="concierge" className="scroll-mt-32">
          <div id="concierge-section" style={{ marginTop: '16px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <h2 
                className="font-semibold transition-all duration-300"
                style={{ 
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#2E5077',
                  fontWeight: '600',
                  opacity: highlightedSection === 'concierge' ? 1 : 1,
                  transform: highlightedSection === 'concierge' ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                Concierge Requests
              </h2>
            <button 
              className="text-sm mario-transition"
              style={{ color: '#2E5077' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
                e.currentTarget.style.color = '#274666';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
                e.currentTarget.style.color = '#2E5077';
              }}
              onClick={onViewAllConcierge}
            >
              View All
            </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {conciergeRequests.map((request, index) => (
                <ConciergeRequestCard 
                  key={index} 
                  {...request} 
                  onViewDetails={() => onNavigateToConciergeDetail?.(request.type)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-[#E8EAED]" style={{ margin: '16px 0' }}></div>

        {/* Section 3: Claims & Benefits */}
        <section id="claims" className="scroll-mt-32">
          <div id="claims-section" style={{ marginTop: '16px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <h2 
                className="font-semibold transition-all duration-300"
                style={{ 
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#2E5077',
                  fontWeight: '600',
                  opacity: highlightedSection === 'claims' ? 1 : 1,
                  transform: highlightedSection === 'claims' ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                Claims & Benefits
              </h2>
            <button 
              className="text-sm mario-transition"
              style={{ color: '#2E5077' }}
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
          </div>
          
          {/* Deductible Tracker */}
          <div 
            className="p-4 mb-4 rounded-lg"
            style={{ 
              backgroundColor: '#4DA1A910',
              border: 'none'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  ${deductibleProgress.current} of ${deductibleProgress.total.toLocaleString()} met
                </h3>
                <p className="text-xs text-muted-foreground">Deductible Progress</p>
              </div>
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Progress 
                value={deductibleProgress.percentage} 
                className="h-2"
                style={{ 
                  '--progress-background': 'linear-gradient(90deg, #4DA1A9 0%, #79D7BE 100%)',
                } as React.CSSProperties}
              />
              <button 
                className="text-xs h-7 px-3 rounded border mario-transition"
                style={{ 
                  borderColor: '#4DA1A9', 
                  color: '#4DA1A9',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E6EEF4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={onNavigateToCostEstimator}
              >
                Estimate Costs
              </button>
            </div>
          </div>

            {/* Claims List */}
            <div className="space-y-3 mb-4">
              {recentClaims.map((claim, index) => (
                <ClaimCard 
                  key={index} 
                  {...claim} 
                  onViewDetails={() => onNavigateToClaimDetail?.(claim.service)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-[#E8EAED]" style={{ margin: '16px 0' }}></div>

        {/* Section 4: Messages & Notifications */}
        <section id="messages" className="scroll-mt-32">
          <div id="messages-section" style={{ marginTop: '16px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <h2 
                className="font-semibold transition-all duration-300"
                style={{ 
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#2E5077',
                  fontWeight: '600',
                opacity: highlightedSection === 'messages' ? 1 : 1,
                transform: highlightedSection === 'messages' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              Messages & Notifications
            </h2>
            <button 
              className="text-sm mario-transition"
              style={{ color: '#2E5077' }}
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
            </div>
            
            <div className="space-y-3 mb-4">
              {messages.map((message, index) => (
                <MessageCard 
                  key={index} 
                  {...message} 
                  onViewDetails={() => onNavigateToInboxDetail?.(message.sender)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-[#E8EAED]" style={{ margin: '16px 0' }}></div>

        {/* Section 5: Cost Estimator CTA */}
        <Card 
          className="p-4 cursor-pointer mario-transition hover:outline hover:outline-[1.5px] hover:outline-[#4DA1A9] hover:outline-offset-0"
          style={{ boxShadow: '0 1px 3px rgba(46,80,119,0.08)' }}
          onClick={onNavigateToCostEstimator}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#4DA1A910' }}
            >
              <Calculator className="h-6 w-6" style={{ color: '#4DA1A9' }} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">Estimate Healthcare Costs</h3>
              <p className="text-sm text-muted-foreground">
                Plan your medical expenses and budget ahead
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Section 6: MarioAI Chat CTA */}
        <MarioAIChatCard />

        {/* Section 7: Telehealth CTA */}
        <Card 
          className="p-4 text-white"
          style={{ 
            backgroundColor: '#4DA1A9',
            border: 'none'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 
                className="font-semibold mb-1"
                style={{ fontSize: '15px' }}
              >
                Talk to a Doctor Now
              </h3>
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
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
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
    </div>
  );
}