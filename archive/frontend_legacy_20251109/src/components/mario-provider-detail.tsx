'use client'
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Shield, 
  DollarSign, 
  Gift, 
  Navigation,
  Copy,
  CheckCircle,
  Heart,
  Share2,
  Calendar
} from 'lucide-react';

interface ProviderDetailProps {
  provider: {
    id: string;
    name: string;
    specialty: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    distance: string;
    inNetwork: boolean;
    address: string;
    phone: string;
    hours: string;
    estimatedCost: string;
    medianCost: string;
    savings: string;
    marioPoints: number;
    nextAvailable: string;
    acceptsInsurance: string[];
    languages: string[];
    education: string[];
    certifications: string[];
  };
  onBack: () => void;
  onBook: () => void;
  onCall: () => void;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: any;
  onConfirm: () => void;
}

function BookingModal({ isOpen, onClose, provider, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const availableDates = [
    { date: '2025-01-15', label: 'Tomorrow', slots: ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'] },
    { date: '2025-01-16', label: 'Friday', slots: ['8:00 AM', '11:00 AM', '1:00 PM', '4:00 PM'] },
    { date: '2025-01-17', label: 'Monday', slots: ['9:30 AM', '12:00 PM', '2:30 PM', '5:00 PM'] }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {provider.avatar ? (
                  <img src={provider.avatar} alt={provider.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="text-sm font-semibold text-primary">
                    {provider.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium">{provider.name}</h4>
                <p className="text-sm text-muted-foreground">{provider.specialty}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Select Date</h4>
            <div className="grid grid-cols-3 gap-2">
              {availableDates.map((dateOption) => (
                <Button
                  key={dateOption.date}
                  variant={selectedDate === dateOption.date ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedDate(dateOption.date);
                    setSelectedTime('');
                  }}
                  className="h-auto p-2 flex flex-col"
                >
                  <span className="text-xs">{dateOption.label}</span>
                  <span className="text-xs opacity-70">
                    {new Date(dateOption.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div>
              <h4 className="font-medium mb-3">Select Time</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableDates
                  .find(d => d.date === selectedDate)
                  ?.slots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-sm font-medium">Appointment Details</p>
                  <p className="text-xs text-muted-foreground">
                    {availableDates.find(d => d.date === selectedDate)?.label} at {selectedTime}
                  </p>
                  <p className="text-xs text-accent font-medium">
                    Estimated cost: {provider.estimatedCost} • Earn {provider.marioPoints} points
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={onConfirm} 
              disabled={!selectedDate || !selectedTime}
              className="flex-1 mario-button-scale"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MarioProviderDetail({ provider, onBack, onBook, onCall }: ProviderDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  
  const savingsAmount = parseInt(provider.medianCost.replace('$', '')) - parseInt(provider.estimatedCost.replace('$', ''));
  const savingsPercentage = Math.round((savingsAmount / parseInt(provider.medianCost.replace('$', ''))) * 100);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(provider.address);
      setAddressCopied(true);
      setTimeout(() => setAddressCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address');
    }
  };

  const handleBookingConfirm = () => {
    setBookingModalOpen(false);
    onBook();
    // Show success toast or navigate to confirmation
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Hero Section */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
              {provider.avatar ? (
                <img src={provider.avatar} alt={provider.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="text-xl font-bold text-muted-foreground">
                  {provider.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-card-foreground">{provider.name}</h1>
              <p className="text-muted-foreground mb-2">{provider.specialty}</p>
              
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(provider.rating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {provider.rating} ({provider.reviewCount} reviews)
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {provider.distance}
                </div>
              </div>
              
              <Badge variant={provider.inNetwork ? "default" : "secondary"} className="mb-2">
                <Shield className="h-3 w-3 mr-1" />
                {provider.inNetwork ? "In-Network" : "Out-of-Network"}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorited(!isFavorited)}
                className="mario-button-scale"
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" className="mario-button-scale">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="space-y-4">
              {/* Contact Information */}
              <Card className="p-4">
                <h3 className="font-medium mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm">{provider.address}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="mario-button-scale"
                    >
                      {addressCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{provider.phone}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{provider.hours}</p>
                  </div>
                </div>
              </Card>

              {/* Cost Overview */}
              <Card className="p-4">
                <h3 className="font-medium mb-3">Cost Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Your estimated cost:</span>
                    <span className="font-bold text-primary text-lg">{provider.estimatedCost}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Typical cost:</span>
                    <span className="text-sm text-muted-foreground line-through">{provider.medianCost}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium text-accent">You'll save:</span>
                    <span className="font-bold text-accent">${savingsAmount} ({savingsPercentage}%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <Gift className="h-4 w-4" />
                    <span>+{provider.marioPoints} MarioPoints</span>
                  </div>
                </div>
              </Card>

              {/* Insurance & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Insurance Accepted</h3>
                  <div className="space-y-2">
                    {provider.acceptsInsurance.map((insurance, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{insurance}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="costs" className="space-y-4">
              {/* Detailed Cost Breakdown */}
              <Card className="p-4">
                <h3 className="font-medium mb-4">Cost Comparison</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div>
                      <p className="font-medium text-primary">Your Cost with {provider.name}</p>
                      <p className="text-xs text-muted-foreground">With your insurance plan</p>
                    </div>
                    <span className="text-xl font-bold text-primary">{provider.estimatedCost}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Typical Market Cost</p>
                      <p className="text-xs text-muted-foreground">Average in your area</p>
                    </div>
                    <span className="text-lg font-semibold text-muted-foreground">{provider.medianCost}</span>
                  </div>
                  
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-accent">Your Savings</span>
                      <span className="text-xl font-bold text-accent">${savingsAmount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <Gift className="h-4 w-4" />
                      <span>Plus earn {provider.marioPoints} MarioPoints</span>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              {/* Map Placeholder */}
              <Card className="p-4">
                <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-4">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Interactive map would be displayed here</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground">{provider.address}</p>
                    <p className="text-sm text-muted-foreground mt-1">{provider.distance} away</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(provider.address)}`, '_blank')}
                    className="mario-button-scale"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 md:relative md:border-0 md:bg-transparent md:mt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onCall}
              className="flex-1 mario-button-scale"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call {provider.phone}
            </Button>
            <Button
              onClick={() => setBookingModalOpen(true)}
              className="flex-1 mario-button-scale"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Next available: {provider.nextAvailable}
          </p>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        provider={provider}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
}