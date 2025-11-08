'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MarioStatusButton } from './mario-status-button';
import { 
  ArrowLeft,
  Clock,
  MapPin,
  DollarSign,
  MessageSquare,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ConciergeRequest {
  id: string;
  type: string;
  status: 'pending' | 'in-progress' | 'completed';
  requestDate: string;
  expectedDate: string;
  service: string;
  preferredLocation?: string;
  priceRange?: string;
  updates: Array<{
    date: string;
    message: string;
    source: 'system' | 'concierge' | 'user';
  }>;
}

interface ConciergeDetailProps {
  request: ConciergeRequest;
  onBack: () => void;
  onMessageConcierge: () => void;
  onCancelRequest: () => void;
}

export function MarioConciergeDetail({ 
  request, 
  onBack, 
  onMessageConcierge, 
  onCancelRequest 
}: ConciergeDetailProps) {
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
              <h1 className="font-semibold">{request.type}</h1>
              <p className="text-sm text-muted-foreground">Concierge Request</p>
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
                Requested {request.requestDate} • Expected {request.expectedDate}
              </h2>
              <MarioStatusButton 
                status={request.status} 
                size="large"
              />
            </div>
          </div>
        </Card>

        {/* Request Summary */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            Request Summary
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Service:</span>
              <span className="text-sm text-muted-foreground">{request.service}</span>
            </div>
            
            {request.preferredLocation && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Preferred Location:</span>
                <span className="text-sm text-muted-foreground">{request.preferredLocation}</span>
              </div>
            )}
            
            {request.priceRange && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Price Range:</span>
                <span className="text-sm text-muted-foreground">{request.priceRange}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Updates Timeline */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            Updates & Timeline
          </h3>
          
          <div className="space-y-4">
            {request.updates.map((update, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {update.source === 'system' ? (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  ) : update.source === 'concierge' ? (
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: '#4DA1A9' }}
                    >
                      C
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                      U
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{update.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{update.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3">
          <Button 
            onClick={onMessageConcierge}
            className="w-full text-white"
            style={{ backgroundColor: '#2E5077' }}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Concierge
          </Button>
          
          {request.status !== 'completed' && (
            <Button 
              variant="outline" 
              onClick={onCancelRequest}
              className="w-full"
              style={{ borderColor: '#D32F2F', color: '#D32F2F' }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel Request
            </Button>
          )}
        </div>

        {/* Request Details */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            Request Details
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Request ID:</span>
              <span className="font-medium">#{request.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submitted:</span>
              <span className="font-medium">{request.requestDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected completion:</span>
              <span className="font-medium">{request.expectedDate}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}