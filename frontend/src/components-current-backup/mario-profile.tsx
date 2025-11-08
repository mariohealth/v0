'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  CreditCard, 
  DollarSign, 
  Search, 
  Calendar,
  Heart,
  Pill,
  ChevronRight,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Star,
  TrendingUp,
  Sparkles,
  MapPin,
  Lock,
  Gift,
  Building2,
  Stethoscope,
  Upload,
  Trash2,
  Camera
} from 'lucide-react';

// Profile Summary Card
function ProfileSummaryCard() {
  const totalSavings = 1247;
  const yearGoal = 2000;
  const savingsProgress = (totalSavings / yearGoal) * 100;

  return (
    <Card 
      className="p-6 relative overflow-hidden"
      style={{ backgroundColor: '#4DA1A920' }}
    >
      <div className="relative z-10">
        <div className="text-center mb-4">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" />
            <AvatarFallback 
              className="text-white font-semibold"
              style={{ backgroundColor: '#2E5077' }}
            >
              JD
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-semibold mb-1">John Doe</h2>
          <p className="text-sm text-muted-foreground mb-1">john.doe@email.com</p>
          <p className="text-xs text-muted-foreground">Member since 2025</p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">You've saved this year</span>
            <span className="font-semibold">${totalSavings.toLocaleString()} 🎉</span>
          </div>
          <Progress 
            value={savingsProgress} 
            className="h-2"
            style={{ 
              '--progress-background': '#79D7BE',
            } as React.CSSProperties}
          />
          <p className="text-xs text-muted-foreground mt-1">
            ${(yearGoal - totalSavings).toLocaleString()} to reach ${yearGoal.toLocaleString()} goal
          </p>
        </div>

        <Button 
          variant="outline" 
          className="w-full mario-button-scale"
          style={{ borderColor: '#2E5077', color: '#2E5077' }}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    </Card>
  );
}

// Active Insurance Card
function ActiveInsuranceCard() {
  const deductibleMet = 850;
  const deductibleTotal = 2000;
  const deductibleProgress = (deductibleMet / deductibleTotal) * 100;

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Insurance Information</h3>
      
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#2E507710' }}
        >
          <CreditCard 
            className="h-6 w-6"
            style={{ color: '#2E5077' }}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">Blue Cross Blue Shield</h4>
            <div 
              className="w-1 h-4 rounded-full"
              style={{ backgroundColor: '#4DA1A9' }}
            />
          </div>
          <p className="text-sm text-muted-foreground mb-1">PPO Plan • Active</p>
          <p className="text-sm text-muted-foreground mb-1">Member ID: BC123456789</p>
          <p className="text-sm text-muted-foreground">Valid Jan 1 – Dec 31, 2025</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Deductible Progress</span>
          <span className="font-medium">${deductibleMet} of ${deductibleTotal.toLocaleString()}</span>
        </div>
        <Progress 
          value={deductibleProgress} 
          className="h-2"
          style={{ 
            '--progress-background': '#79D7BE',
          } as React.CSSProperties}
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Lock className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Securely stored</span>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="default" 
          size="sm"
          style={{ backgroundColor: '#2E5077' }}
        >
          Update Insurance
        </Button>
        <Button variant="outline" size="sm">
          View Coverage Summary
        </Button>
      </div>
    </Card>
  );
}

// Insurance Information Section (for Profile)
interface InsuranceInfoCardProps {
  hasInsurance?: boolean;
  onAddInsurance: () => void;
  onReplaceImages?: () => void;
  onRemoveInsurance?: () => void;
}

function InsuranceInfoCard({ 
  hasInsurance = false, 
  onAddInsurance,
  onReplaceImages,
  onRemoveInsurance 
}: InsuranceInfoCardProps) {
  
  // Empty state - no insurance added yet
  if (!hasInsurance) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Insurance Information</h3>
        
        <div 
          className="text-center py-8 px-4 rounded-lg"
          style={{ backgroundColor: 'rgba(46, 80, 119, 0.05)' }}
        >
          {/* Illustration placeholder */}
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(46, 80, 119, 0.1)' }}
          >
            <Shield size={32} color="#2E5077" strokeWidth={2} />
          </div>
          
          <h4 className="font-medium mb-2" style={{ color: '#1A1A1A' }}>
            You haven't added your insurance yet.
          </h4>
          
          <p className="text-sm text-muted-foreground mb-4">
            Add your insurance card to see personalized prices and maximize savings.
          </p>
          
          <Button
            onClick={onAddInsurance}
            style={{ backgroundColor: '#2E5077' }}
            className="mario-button-scale"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Insurance
          </Button>
        </div>
        
        {/* Reassurance footer */}
        <div 
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: 'rgba(121, 215, 190, 0.1)', border: '1px solid rgba(121, 215, 190, 0.3)' }}
        >
          <p className="text-xs text-center" style={{ color: '#1B5E20' }}>
            🔒 HIPAA-compliant | Data encrypted in transit and at rest
          </p>
        </div>
      </Card>
    );
  }
  
  // Populated state - insurance added
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Insurance Information</h3>
        <Badge 
          style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}
          className="text-xs"
        >
          Active
        </Badge>
      </div>
      
      {/* Insurance card thumbnails */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Front card thumbnail */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Front of card
          </label>
          <div 
            className="relative rounded-lg overflow-hidden border-2 border-border"
            style={{ aspectRatio: '16/10' }}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: '#F7F7F7' }}
            >
              <Camera size={24} color="#999999" />
            </div>
            {/* Placeholder for uploaded image */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-90"
              style={{ display: 'none' }}
            />
          </div>
        </div>
        
        {/* Back card thumbnail */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Back of card
          </label>
          <div 
            className="relative rounded-lg overflow-hidden border-2 border-border"
            style={{ aspectRatio: '16/10' }}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: '#F7F7F7' }}
            >
              <Camera size={24} color="#999999" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Insurance details */}
      <div 
        className="p-4 rounded-lg mb-4"
        style={{ backgroundColor: 'rgba(46, 80, 119, 0.05)' }}
      >
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Plan Name</label>
            <p className="text-sm font-medium">Blue Cross Blue Shield PPO</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Member ID</label>
            <p className="text-sm font-medium">
              BC1234****89 
              <span className="text-xs text-muted-foreground ml-2">(last 4 digits masked)</span>
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Coverage Period</label>
            <p className="text-sm font-medium">Jan 1 – Dec 31, 2025</p>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={onReplaceImages}
          variant="default"
          size="sm"
          style={{ backgroundColor: '#2E5077' }}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          Replace Images
        </Button>
        <Button
          onClick={onRemoveInsurance}
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </div>
      
      {/* Security footer */}
      <div className="flex items-center gap-2 mt-4">
        <Lock className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Securely stored and HIPAA-compliant</span>
      </div>
    </Card>
  );
}

// Quick Stats Grid
function QuickStatsGrid() {
  const stats = [
    { 
      icon: DollarSign, 
      label: 'Total Saved', 
      value: '$1,247', 
      subtitle: 'Lifetime',
      bgColor: '#79D7BE' 
    },
    { 
      icon: Star, 
      label: 'Points Earned', 
      value: '2,450', 
      subtitle: 'Lifetime',
      bgColor: '#4DA1A9' 
    },
    { 
      icon: Search, 
      label: 'Searches', 
      value: '127', 
      subtitle: 'Lifetime',
      bgColor: '#2E5077' 
    },
    { 
      icon: Calendar, 
      label: 'Bookings', 
      value: '8', 
      subtitle: 'Lifetime',
      bgColor: '#F6F4F0',
      iconColor: '#9333EA'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="p-4 text-center">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: stat.bgColor }}
            >
              <IconComponent 
                className="h-6 w-6"
                style={{ color: stat.iconColor || 'white' }}
              />
            </div>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </Card>
        );
      })}
    </div>
  );
}

// Saved Items Tabbed Component
function SavedItemsCard() {
  const savedProviders = [
    {
      name: "Dr. Sarah Johnson",
      subtitle: "Orthopedic Surgery",
      location: "1.2 miles away",
      type: "provider"
    },
    {
      name: "City Imaging Center", 
      subtitle: "Radiology Services",
      location: "0.8 miles away",
      type: "provider"
    }
  ];

  const savedMedications = [
    {
      name: "Metformin 500mg",
      subtitle: "30-day supply",
      price: "$9.90 at Cost Plus Drugs",
      type: "medication"
    },
    {
      name: "Atorvastatin 20mg",
      subtitle: "90-day supply", 
      price: "$8.00 at Walmart",
      type: "medication"
    }
  ];

  const savedPharmacies = [
    {
      name: "CVS Pharmacy",
      subtitle: "24-hour location",
      location: "0.3 miles away",
      type: "pharmacy"
    }
  ];

  const renderSavedItems = (items: any[], type: string) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-6">
          <div 
            className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: '#2E507720' }}
          >
            {type === 'provider' && <Stethoscope className="h-6 w-6" style={{ color: '#2E5077' }} />}
            {type === 'medication' && <Pill className="h-6 w-6" style={{ color: '#2E5077' }} />}
            {type === 'pharmacy' && <Building2 className="h-6 w-6" style={{ color: '#2E5077' }} />}
          </div>
          <p className="text-sm text-muted-foreground mb-2">No saved {type}s yet</p>
          <Button variant="outline" size="sm">
            Browse {type === 'provider' ? 'Doctors' : type === 'medication' ? 'Meds' : 'Pharmacies'}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted mario-transition">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#4DA1A920' }}
            >
              {type === 'provider' && <Stethoscope className="h-5 w-5" style={{ color: '#4DA1A9' }} />}
              {type === 'medication' && <Pill className="h-5 w-5" style={{ color: '#4DA1A9' }} />}
              {type === 'pharmacy' && <Building2 className="h-5 w-5" style={{ color: '#4DA1A9' }} />}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              {item.location && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </p>
              )}
              {item.price && (
                <p className="text-xs font-medium" style={{ color: '#4DA1A9' }}>{item.price}</p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-accent hover:text-accent/80"
            >
              View
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Saved Items</h3>
      
      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers" className="text-sm">Providers</TabsTrigger>
          <TabsTrigger value="medications" className="text-sm">Medications</TabsTrigger>
          <TabsTrigger value="pharmacies" className="text-sm">Pharmacies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="providers" className="mt-4">
          {renderSavedItems(savedProviders, 'provider')}
        </TabsContent>
        
        <TabsContent value="medications" className="mt-4">
          {renderSavedItems(savedMedications, 'medication')}
        </TabsContent>
        
        <TabsContent value="pharmacies" className="mt-4">
          {renderSavedItems(savedPharmacies, 'pharmacy')}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Rewards Snapshot
function RewardsSnapshotCard() {
  const currentPoints = 2450;
  const nextRewardThreshold = 3000;
  const progress = (currentPoints / nextRewardThreshold) * 100;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#4DA1A9' }}
        >
          <Gift className="h-6 w-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium mb-1">Your Rewards</h3>
          <div 
            className="text-2xl font-bold mb-1"
            style={{ color: '#2E5077' }}
          >
            {currentPoints.toLocaleString()} points
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Next reward at {nextRewardThreshold.toLocaleString()} points
          </p>
          <Progress 
            value={progress} 
            className="h-2"
            style={{ 
              '--progress-background': '#79D7BE',
            } as React.CSSProperties}
          />
        </div>
        
        <Button 
          style={{ backgroundColor: '#2E5077' }}
          className="mario-button-scale"
        >
          Redeem Now
        </Button>
      </div>
    </Card>
  );
}

// Settings & Preferences Card
function SettingsCard() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingItems = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Push and email notifications",
      type: "toggle",
      value: notifications,
      onToggle: setNotifications
    },
    {
      icon: Moon,
      label: "Dark Mode",
      description: "Switch to dark theme",
      type: "toggle", 
      value: darkMode,
      onToggle: setDarkMode
    },
    {
      icon: Shield,
      label: "Privacy Policy",
      type: "link",
      onClick: () => console.log('Privacy policy')
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      type: "link",
      onClick: () => console.log('Help & support')
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Settings & Preferences</h3>
      
      <div className="space-y-1">
        {settingItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                item.type === 'link' ? 'hover:bg-muted mario-transition cursor-pointer' : ''
              }`}
              style={{ minHeight: '56px' }}
              onClick={item.type === 'link' ? item.onClick : undefined}
            >
              <IconComponent className="h-5 w-5 text-muted-foreground" />
              
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.label}</h4>
                {item.description && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
              
              {item.type === 'toggle' ? (
                <Switch 
                  checked={item.value} 
                  onCheckedChange={item.onToggle}
                />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          );
        })}
        
        {/* Sign Out */}
        <div className="border-t pt-4 mt-4">
          <div 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 mario-transition cursor-pointer"
            onClick={() => console.log('Sign out')}
          >
            <LogOut className="h-5 w-5 text-red-500" />
            <span className="font-medium text-sm text-red-500">Sign Out</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function MarioProfile() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card mario-shadow-card">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#2E5077' }}>
              👤 Profile
            </h1>
            <p className="text-muted-foreground">Manage your account, insurance, and preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* 1. Profile Summary Card */}
        <ProfileSummaryCard />

        {/* 2. Active Insurance Card */}
        <ActiveInsuranceCard />

        {/* 3. Quick Stats Grid */}
        <QuickStatsGrid />

        {/* 4. Saved Items (Tabbed) */}
        <SavedItemsCard />

        {/* 5. Rewards Snapshot */}
        <RewardsSnapshotCard />

        {/* 6. Settings & Preferences */}
        <SettingsCard />

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Mario Health • HIPAA Compliant • All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}