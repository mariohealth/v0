'use client'
import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  ChevronLeft,
  Heart,
  DollarSign,
  TrendingDown,
  Gift,
  MessageCircle,
  Navigation,
  Copy,
  Check,
  Target
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from './ui/utils';
import { MarioAIConcierge } from './mario-ai-concierge';
import { type Provider } from '../data/healthcare-data';

interface ProviderDetailCompleteProps {
  provider: Provider;
  onBack?: () => void;
  onBookingComplete?: (appointmentId: string) => void;
}

export function ProviderDetailComplete({ 
  provider, 
  onBack,
  onBookingComplete 
}: ProviderDetailCompleteProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [showConcierge, setShowConcierge] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);

  // Get the primary service cost (MRI in this case)
  const primaryService = 'MRI';
  const serviceCost = provider.costs?.[primaryService];

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Save to user's saved providers
  };

  const handleCall = () => {
    window.location.href = `tel:${provider.phone}`;
  };

  const handleDirections = () => {
    const address = `${provider.address}, ${provider.city}, ${provider.state} ${provider.zipCode}`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  const copyAddress = async () => {
    const address = `${provider.address}, ${provider.city}, ${provider.state} ${provider.zipCode}`;
    try {
      await navigator.clipboard.writeText(address);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleConciergeComplete = (appointmentId: string) => {
    setShowConcierge(false);
    onBookingComplete?.(appointmentId);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Results
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={cn(
                "transition-colors",
                isSaved && "text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Hero Section */}
        <Card className="p-6 mb-6">
          {provider.marioPick && (
            <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium mb-4 inline-flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mario's Pick - Save {serviceCost?.percentSavings}%
            </div>
          )}
          
          <div className="flex items-start gap-6">
            <div 
              className="rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ 
                width: '72px',
                height: '72px',
                backgroundColor: '#4DA1A9'
              }}
            >
              <svg 
                width="36" 
                height="36" 
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
              <h1 className="text-2xl font-bold mb-2">{provider.name}</h1>
              <p className="text-muted-foreground mb-3">{provider.specialty}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{provider.rating.toFixed(2)}</span>
                  <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                </div>
                <Badge 
                  variant={provider.inNetwork ? "default" : "outline"}
                  className={cn(
                    provider.inNetwork 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                      : "border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300"
                  )}
                >
                  {provider.inNetwork ? "In-Network" : "Out-of-Network"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p>{provider.address}</p>
                    <p>{provider.city}, {provider.state} {provider.zipCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{provider.phone}</span>
                </div>
                {provider.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <a 
                      href={provider.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Hours</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {provider.hours && Object.entries(provider.hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium">{day}:</span>
                    <span className="text-muted-foreground">{hours}</span>
                  </div>
                ))}
                {!provider.hours && (
                  <p className="text-muted-foreground text-sm col-span-2">Hours not available</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Accepted Insurance</h3>
              <div className="flex flex-wrap gap-2">
                {provider.acceptedInsurance && provider.acceptedInsurance.slice(0, 3).map((insurance) => (
                  <Badge key={insurance} variant="outline">
                    {insurance}
                  </Badge>
                ))}
                {provider.acceptedInsurance && provider.acceptedInsurance.length > 3 && (
                  <Badge variant="outline">
                    +{provider.acceptedInsurance.length - 3} more
                  </Badge>
                )}
                {(!provider.acceptedInsurance || provider.acceptedInsurance.length === 0) && (
                  <p className="text-muted-foreground text-sm">Insurance information not available</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-muted-foreground leading-relaxed">{provider.about}</p>
            </Card>
          </TabsContent>

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-6">
            {serviceCost && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Your Estimated Cost</h3>
                </div>
                
                <div className="bg-primary/5 rounded-lg p-4 mb-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${serviceCost.total}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {serviceCost.facilityFee && (
                      <div className="flex justify-between">
                        <span>Facility fee:</span>
                        <span>${serviceCost.facilityFee}</span>
                      </div>
                    )}
                    {serviceCost.professionalFee && (
                      <div className="flex justify-between">
                        <span>Professional fee:</span>
                        <span>${serviceCost.professionalFee}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>vs. Median Cost:</span>
                    <span className="font-medium">${serviceCost.median}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      You Save:
                    </span>
                    <span className="font-bold text-green-600">
                      ${serviceCost.savings} ({serviceCost.percentSavings}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-accent" />
                      MarioPoints:
                    </span>
                    <span className="font-medium text-accent">+{provider.marioPoints}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  Costs based on your insurance plan. Final amount may vary.
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Cost Comparison</h3>
              <div className="space-y-4">
                {/* Simple bar chart representation */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{provider.name}</span>
                    <span className="text-sm">${serviceCost?.total || 'N/A'}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full" 
                      style={{ width: serviceCost ? `${(serviceCost.total / serviceCost.median) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>$0</span>
                  <span>Average: ${serviceCost?.median || 'N/A'}</span>
                  <span>${serviceCost ? Math.round(serviceCost.median * 1.5) : 'N/A'}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location" className="space-y-6">
            <Card className="p-6">
              {/* Map Placeholder */}
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-4">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Interactive map would be displayed here</p>
                  <p className="text-sm">Showing provider location</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-muted-foreground">
                      {provider.address}<br />
                      {provider.city}, {provider.state} {provider.zipCode}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyAddress}>
                    {addressCopied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {addressCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Distance</h3>
                  <p className="text-muted-foreground">
                    {provider.distance} miles from your location
                  </p>
                </div>

                <Button onClick={handleDirections} className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-10 md:relative md:border-0 md:bg-transparent md:p-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleCall}
              className="flex-1 md:flex-none"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call {provider.phone}
            </Button>
            <Button 
              onClick={() => setShowConcierge(true)}
              className="flex-1"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Book with Concierge
            </Button>
          </div>
        </div>
      </div>

      {/* Concierge Modal */}
      <Dialog open={showConcierge} onOpenChange={setShowConcierge}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book with Concierge</DialogTitle>
          </DialogHeader>
          <MarioAIConcierge
            provider={provider}
            service={primaryService}
            estimatedCost={serviceCost?.total}
            pointsEarned={provider.marioPoints}
            onComplete={handleConciergeComplete}
            onCancel={() => setShowConcierge(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}