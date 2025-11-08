'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MarioStatusButton } from './mario-status-button';
import { 
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  MessageSquare,
  Phone
} from 'lucide-react';

interface AppointmentDetailProps {
  appointment: {
    id: string;
    provider: string;
    specialty: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending';
    location: string;
    estimate: string;
    notes?: string;
  };
  onBack: () => void;
  onReschedule: () => void;
  onMessageConcierge: () => void;
}

export function MarioAppointmentDetail({ 
  appointment, 
  onBack, 
  onReschedule, 
  onMessageConcierge 
}: AppointmentDetailProps) {
  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      
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
              <h1 className="font-semibold">{appointment.provider}</h1>
              <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        
        {/* Status Banner */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg mb-2">
                {appointment.date} at {appointment.time}
              </h2>
              <MarioStatusButton 
                status={appointment.status} 
                size="large"
              />
            </div>
          </div>
        </Card>

        {/* Appointment Info */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            Appointment Details
          </h3>
          
          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{appointment.location}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.date} at {appointment.time}
                </p>
              </div>
            </div>

            {/* Estimate */}
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Estimated Cost</p>
                <p className="text-sm text-muted-foreground">{appointment.estimate}</p>
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="pt-3 border-t border-muted-foreground/20">
                <p className="font-medium mb-2">Notes</p>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            Actions
          </h3>
          
          <div className="space-y-3">
            {/* Add to Calendar */}
            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              style={{ borderColor: '#2E5077', color: '#2E5077' }}
            >
              <Calendar className="h-4 w-4 mr-3" />
              Add to Calendar
            </Button>

            {/* Reschedule */}
            <Button 
              variant="outline" 
              onClick={onReschedule}
              className="w-full justify-start h-12"
              style={{ borderColor: '#2E5077', color: '#2E5077' }}
            >
              <Clock className="h-4 w-4 mr-3" />
              Reschedule Appointment
            </Button>

            {/* Message Concierge */}
            <Button 
              onClick={onMessageConcierge}
              className="w-full justify-start h-12 text-white"
              style={{ backgroundColor: '#2E5077' }}
            >
              <MessageSquare className="h-4 w-4 mr-3" />
              Message Concierge
            </Button>

            {/* Call Provider */}
            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 text-muted-foreground"
            >
              <Phone className="h-4 w-4 mr-3" />
              Call Provider
            </Button>
          </div>
        </Card>

        {/* Provider Info */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            Provider Information
          </h3>
          
          <div className="space-y-2">
            <p className="font-medium">{appointment.provider}</p>
            <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
            <p className="text-sm text-muted-foreground">{appointment.location}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}