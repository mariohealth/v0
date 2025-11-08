'use client'
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Shield, 
  DollarSign,
  Award,
  Navigation,
  Calendar,
  MessageCircle,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { type Provider } from '@/lib/data/healthcare-data';

interface ProviderDetailProps {
  provider: Provider;
  onBack: () => void;
  service?: string;
}

export function ProviderDetailPage({ provider, onBack, service = "Office Visit" }: ProviderDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const serviceCost = provider.costs[service] || provider.costs['Office Visit'] || {
    total: 150,
    median: 180,
    savings: 30,
    percentSavings: 17
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSaved(!isSaved)}
            className="gap-2"
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
            {provider.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{provider.name}</h1>
            <p className="text-muted-foreground">{provider.specialty}</p>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {provider.rating} ({provider.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={provider.inNetwork ? "default" : "secondary"} className="gap-1">
            <Shield className="h-3 w-3" />
            {provider.inNetwork ? 'In-Network' : 'Out-of-Network'}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <MapPin className="h-3 w-3" />
            {provider.distance} miles
          </Badge>
          {provider.marioPick && (
            <Badge className="bg-accent text-accent-foreground gap-1">
              <Award className="h-3 w-3" />
              Mario's Pick
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-4 mx-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="overview" className="space-y-4 mt-0">
            {/* Contact Information */}
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm">{provider.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {provider.city}, {provider.state} {provider.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{provider.phone}</p>
                </div>
                {provider.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={provider.website} className="text-sm text-primary hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Hours */}
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hours
              </h3>
              <div className="space-y-1">
                {provider.hours && Object.entries(provider.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="font-medium">{day}:</span>
                    <span className="text-muted-foreground">{hours}</span>
                  </div>
                ))}
                {(!provider.hours || Object.keys(provider.hours).length === 0) && (
                  <p className="text-sm text-muted-foreground">Hours not available</p>
                )}
              </div>
            </Card>

            {/* Accepted Insurance */}
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold">Accepted Insurance</h3>
              <div className="space-y-2">
                {provider.acceptedInsurance && provider.acceptedInsurance.slice(0, 3).map((insurance) => (
                  <div key={insurance} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{insurance}</span>
                  </div>
                ))}
                {provider.acceptedInsurance && provider.acceptedInsurance.length > 3 && (
                  <p className="text-sm text-primary cursor-pointer">
                    + {provider.acceptedInsurance.length - 3} more
                  </p>
                )}
                {(!provider.acceptedInsurance || provider.acceptedInsurance.length === 0) && (
                  <p className="text-sm text-muted-foreground">Insurance information not available</p>
                )}
              </div>
            </Card>

            {/* About */}
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {provider.about}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4 mt-0">
            {/* Estimated Cost Card */}
            <Card className="p-4 space-y-4 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Your Estimated Cost</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    ${serviceCost.total}
                  </span>
                  <Badge className="bg-accent text-accent-foreground">
                    +{provider.marioPoints} MarioPoints
                  </Badge>
                </div>

                {serviceCost.facilityFee && serviceCost.professionalFee && (
                  <div className="space-y-1 text-sm">
                    <Separator />
                    <div className="flex justify-between">
                      <span>Facility fee:</span>
                      <span>${serviceCost.facilityFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional fee:</span>
                      <span>${serviceCost.professionalFee}</span>
                    </div>
                    <Separator />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>vs. Median Cost:</span>
                    <span className="line-through text-muted-foreground">
                      ${serviceCost.median}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>You Save:</span>
                    <span className="text-green-600">
                      ${Math.abs(serviceCost.savings)} ({Math.abs(serviceCost.percentSavings)}%)
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cost Comparison Chart */}
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold">Cost Comparison</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded bg-accent/10 border border-accent/20">
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">Mario's Pick</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${serviceCost.total}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded bg-muted/50">
                  <div>
                    <p className="font-medium">Network Average</p>
                    <p className="text-sm text-muted-foreground">Typical cost</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${serviceCost.median}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                * Costs based on your insurance plan and location
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4 mt-0">
            <Card className="p-4">
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Reviews Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Patient reviews and ratings will be available in a future update.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 mt-0">
            {/* Map Placeholder */}
            <Card className="p-4 space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Interactive map coming soon</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{provider.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {provider.city}, {provider.state} {provider.zipCode}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Navigation className="h-4 w-4" />
                    Copy Address
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {provider.distance} miles from your location
                </div>
              </div>

              <Button variant="secondary" className="w-full gap-2">
                <Navigation className="h-4 w-4" />
                Get Directions
              </Button>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-background border-t p-4 space-y-3">
        <Button
          onClick={() => setShowBookingModal(true)}
          className="w-full gap-2"
          size="lg"
        >
          <MessageCircle className="h-4 w-4" />
          Book with Concierge
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2"
          size="lg"
          onClick={() => window.open(`tel:${provider.phone}`)}
        >
          <Phone className="h-4 w-4" />
          Call {provider.phone}
        </Button>
      </div>

      {/* Booking Modal */}
      <ConciergeBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        provider={provider}
        service={service}
        estimatedCost={serviceCost.total}
        marioPoints={provider.marioPoints}
      />
    </div>
  );
}

interface ConciergeBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider;
  service: string;
  estimatedCost: number;
  marioPoints: number;
}

function ConciergeBookingModal({ 
  isOpen, 
  onClose, 
  provider, 
  service, 
  estimatedCost, 
  marioPoints 
}: ConciergeBookingModalProps) {
  const [step, setStep] = useState<'timing' | 'preferences' | 'confirmation'>('timing');
  const [selectedTiming, setSelectedTiming] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleSubmit = () => {
    // Here you would typically submit to your concierge system
    console.log('Booking request submitted:', {
      provider: provider.name,
      service,
      timing: selectedTiming,
      timePreference: selectedTime
    });
    
    // Simulate success
    setStep('confirmation');
  };

  const resetAndClose = () => {
    setStep('timing');
    setSelectedTiming('');
    setSelectedTime('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book with Concierge</DialogTitle>
        </DialogHeader>

        {step === 'timing' && (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                <MessageCircle className="h-4 w-4 inline mr-2" />
                I'll help you book an appointment with <strong>{provider.name}</strong> for {service}.
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-medium">When would you like to schedule?</p>
              <div className="space-y-2">
                {[
                  { value: 'this_week', label: 'This Week' },
                  { value: 'next_week', label: 'Next Week' },
                  { value: 'flexible', label: 'I\'m Flexible' },
                  { value: 'custom', label: 'Specific Date' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedTiming === option.value ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTiming(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep('preferences')}
                disabled={!selectedTiming}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'preferences' && (
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                Great! What time of day works best for you?
              </p>
            </div>

            <div className="space-y-2">
              {[
                { value: 'morning', label: 'Morning (9AM-12PM)' },
                { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
                { value: 'evening', label: 'Evening (5PM-7PM)' },
                { value: 'no_preference', label: 'No Preference' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={selectedTime === option.value ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedTime(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('timing')}>
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={!selectedTime}
              >
                Submit Request
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Request Submitted!</h3>
              <p className="text-sm text-muted-foreground">
                We'll confirm your appointment within 24-48 hours.
              </p>
            </div>

            <Card className="p-3 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="font-medium">{provider.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{service}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preferred:</span>
                  <span className="font-medium">
                    {selectedTiming.replace('_', ' ')} - {selectedTime.replace('_', ' ')}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Est. Cost:</span>
                  <span className="font-medium">${estimatedCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>You'll earn:</span>
                  <span className="font-medium text-accent">+{marioPoints} pts</span>
                </div>
              </div>
            </Card>

            <Button className="w-full" onClick={resetAndClose}>
              View in Health Hub
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}