'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { type Provider } from '../data/healthcare-data';

interface ProviderDetailProps {
  provider: Provider;
  onBack?: () => void;
  service?: string;
}

export function ProviderDetailPage({ provider, onBack, service = "Office Visit" }: ProviderDetailProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

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
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
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

      {/* Rest of the component - keeping original implementation */}
      <div className="container mx-auto px-4 py-6">
        {/* Provider Header Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {provider.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{provider.name}</h1>
              <p className="text-muted-foreground mb-2">{provider.specialty}</p>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{provider.rating}</span>
                <span className="text-sm text-muted-foreground">({provider.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {provider.distance} miles
                </div>
                <Badge variant={provider.inNetwork ? 'default' : 'outline'}>
                  {provider.inNetwork ? 'In-Network' : 'Out-of-Network'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground">{provider.about || 'No description available.'}</p>
            </Card>

            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <p className="text-muted-foreground mb-2">
                {provider.address}<br />
                {provider.city}, {provider.state} {provider.zipCode}
              </p>
              {provider.phone && (
                <p className="text-muted-foreground">
                  <Phone className="h-4 w-4 inline mr-2" />
                  {provider.phone}
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Service Cost: {service}</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Cost</span>
                  <span className="text-2xl font-bold">${serviceCost.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Median Cost</span>
                  <span className="text-lg">${serviceCost.median}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Savings</span>
                  <span className="text-lg font-semibold text-green-600">
                    ${serviceCost.savings} ({serviceCost.percentSavings}%)
                  </span>
                </div>
              </div>
              <Button className="w-full mt-6" onClick={() => setShowBookingModal(true)}>
                Book Appointment
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Available Services</h2>
              <div className="space-y-2">
                {provider.services.length > 0 ? (
                  provider.services.map((service, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      {service}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No services listed.</p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              <p className="text-muted-foreground">
                {provider.reviewCount} reviews available. Review functionality coming soon.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Booking functionality coming soon.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Wrapper component for server-side rendering
export function ProviderDetailWrapper({ provider }: { provider: Provider }) {
  return <ProviderDetailPage provider={provider} />
}
