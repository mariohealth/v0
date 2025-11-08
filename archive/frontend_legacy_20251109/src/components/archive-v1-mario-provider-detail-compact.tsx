'use client'
/**
 * ⚠️ ⚠️ ⚠️ ARCHIVED - Provider Page V1 (Appointment Slots Prototype) ⚠️ ⚠️ ⚠️
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚫 DO NOT USE THIS COMPONENT FOR ANY NEW PROVIDER PAGES 🚫
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This component represents the OLD provider detail page design that includes
 * appointment time-slot selection grids. This design pattern has been DEPRECATED
 * in favor of the V2 AI Concierge booking flow.
 * 
 * 📦 STATUS: HISTORICAL REFERENCE ONLY - DO NOT REUSE
 * 
 * 📅 Date Archived: October 30, 2025
 * 🔄 Replaced By: mario-provider-hospital-detail.tsx (V2 - AI Concierge Design)
 * 📚 Archive Docs: /guidelines/ARCHIVE-HISTORICAL-SCREENS.md
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🔴 Key Differences from V2:
 * - ❌ Shows "Available Appointments" grid with time slots
 * - ❌ Uses direct appointment slot selection
 * - ❌ Opens MarioBookingFlow modal for booking
 * 
 * ✅ V2 Improvements:
 * - ✅ Uses MarioAI Chat for intelligent booking
 * - ✅ No time slot grids - AI handles scheduling
 * - ✅ Better hospital context integration
 * - ✅ Follows Mario Health Design System V2
 * - ✅ Reference Provider: Dr. Rebecca Hart (Cardiology)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📋 Example Provider (V1 - Archived): 
 *    Dr. Sarah Johnson (Orthopedics) — UCSF Medical Center
 * 
 * 🌟 V2 Reference Provider (Use This Instead):
 *    Dr. Rebecca Hart (Cardiology) — UCSF / Stanford
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✨ For ALL new provider pages, use: mario-provider-hospital-detail.tsx
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MarioBookingFlow } from './mario-booking-flow';
import { 
  Star,
  Phone,
  MapPin,
  Gift,
  Check,
  Shield,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { MarioProvider } from '@/lib/data/mario-provider-data';

interface MarioProviderDetailProps {
  provider: MarioProvider;
  onBack: () => void;
  onBookAppointment: () => void;
}

// Compact Hero Card Component
function CompactHeroCard({ provider }: { provider: MarioProvider }) {
  return (
    <Card 
      className="p-4"
      style={{ 
        minHeight: '150px',
        maxHeight: '160px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
      }}
    >
      <div className="flex items-start gap-4">
        {/* Doctor Avatar - Gender-neutral medical icon */}
        <div 
          className="rounded-full flex-shrink-0 flex items-center justify-center"
          style={{ 
            width: '64px',
            height: '64px',
            backgroundColor: '#4DA1A9'
          }}
        >
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
            <circle cx="20" cy="10" r="2" />
          </svg>
        </div>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h1 className="font-semibold text-base mb-1">{provider.name}</h1>
              <p className="text-sm text-muted-foreground mb-2">{provider.specialty}</p>
              
              {/* Rating and Network - Two decimal places */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="text-sm font-medium">{parseFloat(provider.rating).toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">({provider.reviews} reviews)</span>
                </div>
                
                <Badge 
                  variant="outline"
                  className="text-xs px-2 py-0.5"
                  style={{ 
                    borderColor: '#79D7BE',
                    color: '#79D7BE',
                    backgroundColor: '#79D7BE10'
                  }}
                >
                  {provider.network}
                </Badge>
              </div>
            </div>

            {/* Contact Icons */}
            <div className="flex gap-2 ml-2">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Mario's Pick Badge */}
          {provider.marioPick && (
            <Badge 
              className="text-xs px-2 py-1 text-white"
              style={{ backgroundColor: '#4DA1A9' }}
            >
              ⭐ Mario's Pick
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

// About Section
function AboutSection({ provider }: { provider: MarioProvider }) {
  return (
    <Card className="p-4">
      <h2 
        className="font-bold mb-3"
        style={{ fontSize: '16px', color: '#2E5077' }}
      >
        About
      </h2>
      <div className="border-t border-muted-foreground/20 pt-3">
        <p 
          className="text-muted-foreground leading-relaxed"
          style={{ fontSize: '14px', lineHeight: '1.4' }}
        >
          {provider.bio}
        </p>
      </div>
    </Card>
  );
}

// Appointment Costs Section
function AppointmentCostsSection({ provider }: { provider: MarioProvider }) {
  return (
    <Card className="p-4">
      <h2 
        className="font-bold mb-3"
        style={{ fontSize: '16px', color: '#2E5077' }}
      >
        Appointment Costs
      </h2>
      <div className="space-y-0">
        {provider.appointmentCosts.map((cost, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between py-3 ${
              index < provider.appointmentCosts.length - 1 ? 'border-b' : ''
            }`}
            style={{ 
              borderColor: '#E0E0E0',
              minHeight: '44px'
            }}
          >
            <span 
              className="text-muted-foreground"
              style={{ fontSize: '14px' }}
            >
              {cost.label}
            </span>
            <span 
              className="font-semibold"
              style={{ 
                fontSize: '15px',
                color: '#2E5077'
              }}
            >
              {cost.price}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Available Appointments Section - V1 TIME SLOT GRID (DEPRECATED)
function AvailableAppointmentsSection({ 
  provider, 
  onSlotSelect 
}: { 
  provider: MarioProvider;
  onSlotSelect: (appointment: any) => void;
}) {
  return (
    <Card className="p-4">
      <h2 
        className="font-bold mb-3"
        style={{ fontSize: '16px', color: '#2E5077' }}
      >
        Available Appointments
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {provider.appointments.map((appointment, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-3 text-left justify-between hover:border-accent mario-transition mario-button-scale"
            style={{ 
              borderRadius: '12px',
              borderColor: '#EAEAEA'
            }}
            onClick={() => onSlotSelect(appointment)}
          >
            <div>
              <div className="text-sm font-medium">
                {appointment.day} — {appointment.time}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3" style={{ color: '#79D7BE' }} />
              <span className="text-xs" style={{ color: '#79D7BE' }}>
                Available
              </span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}

// Insurance Accepted Section
function InsuranceAcceptedSection({ provider }: { provider: MarioProvider }) {
  return (
    <Card className="p-4">
      <h2 
        className="font-bold mb-3"
        style={{ fontSize: '16px', color: '#2E5077' }}
      >
        Insurance Accepted
      </h2>
      <div className="space-y-2">
        {provider.insuranceAccepted.map((insurance, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#79D7BE' }}
            />
            <span 
              className="text-sm"
              style={{ color: '#2E2E2E' }}
            >
              {insurance}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Earn MarioPoints Section
function EarnMarioPointsSection({ provider }: { provider: MarioProvider }) {
  return (
    <Card 
      className="p-4"
      style={{ 
        background: 'linear-gradient(180deg, #E9F6F5 0%, #FFFFFF 100%)',
        border: 'none'
      }}
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#4DA1A9' }}
        >
          <Gift className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1">
          <div 
            className="text-xl font-bold mb-1"
            style={{ color: '#4DA1A9' }}
          >
            {provider.rewards.points}
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            Book this appointment to earn rewards.
          </p>
          <p className="text-xs text-muted-foreground">
            {provider.rewards.savings}
          </p>
        </div>
      </div>
    </Card>
  );
}

// Sticky CTA Bar
function StickyBookingCTA({ onBook }: { onBook: () => void }) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card"
      style={{ boxShadow: '0 -4px 6px rgba(0,0,0,0.1)' }}
    >
      <div className="max-w-2xl mx-auto">
        <Button 
          onClick={onBook}
          className="w-full text-white font-bold mario-button-scale"
          style={{ 
            backgroundColor: '#2E5077',
            height: '44px'
          }}
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
}

export function MarioProviderDetailCompactV1Archived({ 
  provider, 
  onBack, 
  onBookAppointment 
}: MarioProviderDetailProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Scroll to CTA when appointment slot is selected
  const handleSlotSelect = (appointment: any) => {
    setSelectedAppointment(appointment);
    if (ctaRef.current) {
      ctaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card mario-shadow-card">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">Provider Details</h1>
              <p className="text-sm text-muted-foreground">Review and book appointment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        
        {/* 1. Compact Hero Card */}
        <CompactHeroCard provider={provider} />

        {/* 2. About Section */}
        <AboutSection provider={provider} />

        {/* 3. Appointment Costs */}
        <AppointmentCostsSection provider={provider} />

        {/* 4. Available Appointments */}
        <AvailableAppointmentsSection 
          provider={provider} 
          onSlotSelect={handleSlotSelect}
        />

        {/* 5. Insurance Accepted */}
        <InsuranceAcceptedSection provider={provider} />

        {/* 6. Earn MarioPoints */}
        <EarnMarioPointsSection provider={provider} />

        {/* Reference div for scroll target */}
        <div ref={ctaRef} />
      </div>

      {/* 7. Sticky CTA */}
      <StickyBookingCTA onBook={() => setShowBookingFlow(true)} />

      {/* Booking Flow Modal */}
      <MarioBookingFlow
        isOpen={showBookingFlow}
        onClose={() => setShowBookingFlow(false)}
        onConfirm={() => {
          setShowBookingFlow(false);
          onBookAppointment();
        }}
        doctor={{
          name: provider.name,
          specialty: provider.specialty,
          price: `${provider.appointmentCosts[0].cost}`,
          network: provider.network,
          points: parseInt(provider.rewards.points.replace(/[^0-9]/g, '')) || 150
        }}
        appointment={selectedAppointment}
      />
    </div>
  );
}
