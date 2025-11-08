'use client'
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Shield, 
  Gift, 
  CheckCircle2,
  Sparkles,
  X
} from 'lucide-react';

interface AppointmentSlot {
  id: string;
  day: string;
  time: string;
  available: boolean;
}

interface BookingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  doctor: {
    name: string;
    specialty: string;
    price: string;
    network?: string;
    points?: number;
  };
}

export function MarioBookingFlow({ 
  isOpen, 
  onClose, 
  onConfirm, 
  doctor 
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedSlot(null);
      setShowConfetti(false);
    }
  }, [isOpen]);

  // Available appointment slots
  const appointmentSlots: AppointmentSlot[] = [
    { id: '1', day: 'Tomorrow', time: '2:30 PM', available: true },
    { id: '2', day: 'Wednesday', time: '10:15 AM', available: true },
    { id: '3', day: 'Thursday', time: '9:00 AM', available: true },
    { id: '4', day: 'Friday', time: '3:45 PM', available: true }
  ];

  const handleSlotSelect = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedSlot) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setShowConfetti(true);
    }
  };

  const handleConfirmBooking = () => {
    onConfirm();
    onClose();
  };

  // Progress dots
  const renderProgressDots = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            step === currentStep 
              ? "bg-[#2E5077] w-6" 
              : step < currentStep
              ? "bg-[#2E5077]"
              : "bg-[#E0E0E0]"
          )}
        />
      ))}
    </div>
  );

  // Confetti animation
  const renderConfetti = () => {
    if (!showConfetti) return null;

    const confettiColors = ['#2E5077', '#4DA1A9', '#79D7BE', '#FFA726', '#00AA66'];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: confettiColors[i % confettiColors.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1
    }));

    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 mario-confetti"
            style={{
              left: `${piece.left}%`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`
            }}
          />
        ))}
      </div>
    );
  };

  // Step 1: Select Appointment
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Doctor Info */}
      <div className="text-center">
        <div 
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: '#4DA1A9' }}
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
        <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
      </div>

      {/* Available Slots */}
      <div>
        <h4 className="font-medium mb-3">Select Appointment Time</h4>
        <div className="space-y-2">
          {appointmentSlots.map((slot) => (
            <Card
              key={slot.id}
              className={cn(
                "p-4 cursor-pointer mario-transition",
                selectedSlot?.id === slot.id 
                  ? "ring-2 ring-[#2E5077] bg-[#2E5077]/5" 
                  : "mario-hover-primary"
              )}
              onClick={() => handleSlotSelect(slot)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#2E5077' }}
                  >
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {slot.day} – {slot.time}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Initial Consultation
                    </div>
                  </div>
                </div>
                {slot.available && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span 
                      className="text-xs font-medium"
                      style={{ color: '#00AA66' }}
                    >
                      Available
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <Button
        className="w-full h-11"
        style={{ backgroundColor: '#2E5077' }}
        onClick={handleNext}
        disabled={!selectedSlot}
      >
        Continue to Confirmation
      </Button>
    </div>
  );

  // Step 2: Confirm Details
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Confirm Appointment</h3>
        <p className="text-sm text-muted-foreground">
          Please review your appointment details
        </p>
      </div>

      {/* Summary Card */}
      <Card 
        className="p-5 space-y-4"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '2px solid #E0E0E0'
        }}
      >
        {/* Doctor */}
        <div className="flex items-start gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#4DA1A9' }}
          >
            <svg 
              width="24" 
              height="24" 
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
          <div className="flex-1">
            <div className="font-medium">{doctor.name}</div>
            <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
          </div>
        </div>

        <div 
          className="h-px"
          style={{ backgroundColor: '#E0E0E0' }}
        />

        {/* Date & Time */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#2E5077' }}
          >
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-0.5">Date & Time</div>
            <div className="font-medium text-sm">
              {selectedSlot?.day} at {selectedSlot?.time}
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#4DA1A9' }}
          >
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-0.5">Estimated Price</div>
            <div className="font-semibold" style={{ color: '#2E5077' }}>
              {doctor.price}
            </div>
          </div>
        </div>

        {/* Network */}
        {doctor.network && (
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(121, 215, 190, 0.2)' }}
            >
              <Shield className="h-5 w-5" style={{ color: '#79D7BE' }} />
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-0.5">Insurance Status</div>
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5"
                style={{ 
                  backgroundColor: '#79D7BE20',
                  color: '#2E5077',
                  border: '1px solid #79D7BE'
                }}
              >
                <Shield className="h-3 w-3 mr-1" />
                {doctor.network}
              </Badge>
            </div>
          </div>
        )}

        {/* MarioPoints */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'rgba(77, 161, 169, 0.2)' }}
          >
            <Gift className="h-5 w-5" style={{ color: '#4DA1A9' }} />
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-0.5">Rewards</div>
            <div 
              className="font-medium text-sm"
              style={{ color: '#4DA1A9' }}
            >
              +{doctor.points || 150} MarioPoints
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-11"
          onClick={() => setCurrentStep(1)}
          style={{ 
            borderColor: '#4DA1A9',
            color: '#4DA1A9'
          }}
        >
          Back
        </Button>
        <Button
          className="flex-1 h-11"
          style={{ backgroundColor: '#2E5077' }}
          onClick={handleNext}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );

  // Step 3: Booking Confirmation
  const renderStep3 = () => (
    <div className="space-y-6 py-4">
      {/* Success Icon */}
      <div className="text-center">
        <div 
          className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(121, 215, 190, 0.2)' }}
        >
          <CheckCircle2 
            className="h-12 w-12"
            style={{ color: '#00AA66' }}
          />
        </div>
        <h3 className="font-semibold text-xl mb-2">
          Appointment Confirmed! 🎉
        </h3>
        <p className="text-muted-foreground mb-4">
          Your appointment with {doctor.name} has been confirmed
        </p>
        
        {/* Appointment Details */}
        <Card 
          className="p-4 mb-6"
          style={{ 
            backgroundColor: '#F6F4F0',
            border: '1px solid #E0E0E0'
          }}
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {selectedSlot?.day} at {selectedSlot?.time}
            </span>
          </div>
        </Card>

        {/* Points Earned */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ backgroundColor: 'rgba(77, 161, 169, 0.15)' }}
        >
          <Sparkles 
            className="h-5 w-5"
            style={{ color: '#4DA1A9' }}
          />
          <span 
            className="font-medium"
            style={{ color: '#2E5077' }}
          >
            +{doctor.points || 150} MarioPoints added!
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          className="w-full h-11"
          style={{ backgroundColor: '#2E5077' }}
          onClick={handleConfirmBooking}
        >
          View in Health Hub
        </Button>
        <Button
          variant="outline"
          className="w-full h-11"
          onClick={handleConfirmBooking}
          style={{ 
            borderColor: '#4DA1A9',
            color: '#4DA1A9'
          }}
        >
          Done
        </Button>
      </div>

      {/* Confirmation Message */}
      <p className="text-xs text-center text-muted-foreground">
        You'll receive a confirmation email and reminder 24 hours before your appointment
      </p>
    </div>
  );

  return (
    <>
      {renderConfetti()}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="sm:max-w-md p-0 overflow-hidden"
          style={{ 
            backgroundColor: '#F6F4F0',
            borderRadius: '16px',
            border: 'none'
          }}
          aria-describedby={undefined}
        >
          <VisuallyHidden>
            <DialogTitle>Book Appointment</DialogTitle>
          </VisuallyHidden>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {renderProgressDots()}
            
            <div className="mt-2">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
