'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MarioStatusButton } from './mario-status-button';
import { 
  ArrowLeft,
  Download,
  FileText,
  MessageSquare,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ClaimDetail {
  id: string;
  provider: string;
  service: string;
  date: string;
  status: 'paid' | 'pending' | 'denied';
  totalAmount: string;
  youOwe: string;
  breakdown: Array<{
    description: string;
    amount: string;
  }>;
  documents: Array<{
    name: string;
    type: 'eob' | 'bill' | 'receipt';
  }>;
  timeline: Array<{
    date: string;
    status: string;
    description: string;
  }>;
}

interface ClaimsDetailProps {
  claim: ClaimDetail;
  onBack: () => void;
  onDisputeClaim: () => void;
  onContactInsurance: () => void;
}

export function MarioClaimsDetail({ 
  claim, 
  onBack, 
  onDisputeClaim, 
  onContactInsurance 
}: ClaimsDetailProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

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
              <h1 className="font-semibold">Claim #{claim.id}</h1>
              <p className="text-sm text-muted-foreground">{claim.service}</p>
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
                Claim Status
              </h2>
              <MarioStatusButton 
                status={claim.status} 
                size="large"
              />
              {claim.status === 'denied' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Service not covered under plan
                </p>
              )}
              {claim.status === 'pending' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Processing with insurance provider
                </p>
              )}
              {claim.status === 'paid' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Claim processed successfully
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Claim Overview */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            Claim Overview
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider:</span>
              <span className="font-medium">{claim.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Date:</span>
              <span className="font-medium">{claim.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-medium">{claim.totalAmount}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-medium">You Owe:</span>
              <span 
                className="font-bold text-lg"
                style={{ color: '#2E5077' }}
              >
                {claim.youOwe}
              </span>
            </div>
          </div>
        </Card>

        {/* Cost Breakdown */}
        <Card className="p-4">
          <Button
            variant="ghost"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full justify-between p-0 h-auto"
          >
            <h3 
              className="font-bold"
              style={{ fontSize: '16px', color: '#1A1A1A' }}
            >
              Cost Breakdown
            </h3>
            {showBreakdown ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {showBreakdown && (
            <div className="mt-4 space-y-2">
              {claim.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.description}</span>
                  <span className="font-medium">{item.amount}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>{claim.totalAmount}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Documents */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            EOB & Documents
          </h3>
          
          <div className="space-y-3">
            {claim.documents.map((doc, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between h-12"
                style={{ borderColor: '#2E5077', color: '#2E5077' }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <span>{doc.name}</span>
                </div>
                <Download className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          {claim.status === 'denied' && (
            <Button 
              onClick={onDisputeClaim}
              className="w-full text-white"
              style={{ backgroundColor: '#2E5077' }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Dispute This Claim
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={onContactInsurance}
            className="w-full"
            style={{ borderColor: '#2E5077', color: '#2E5077' }}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact Insurance
          </Button>
        </div>

        {/* Timeline Tracker */}
        <Card className="p-4">
          <h3 
            className="font-bold mb-4"
            style={{ fontSize: '16px', color: '#1A1A1A' }}
          >
            Timeline Tracker
          </h3>
          
          <div className="space-y-4">
            {claim.timeline.map((event, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {event.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : event.status === 'current' ? (
                    <Clock className="h-5 w-5 text-warning" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-muted" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.description}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}