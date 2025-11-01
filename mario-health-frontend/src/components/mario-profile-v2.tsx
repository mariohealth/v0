'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  User, 
  CreditCard, 
  Bell,
  Moon,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  ChevronRight,
  MapPin,
  Lock,
  Users,
  Pill
} from 'lucide-react';

interface MarioProfileV2Props {
  onNavigateToHome?: () => void;
  onNavigateToHealthHub?: () => void;
  onNavigateToRewards?: () => void;
  onSignOut?: () => void;
  onUpdateInsurance?: () => void;
  onViewSavedProviders?: () => void;
  onViewSavedMedications?: () => void;
  onViewSavedPharmacies?: () => void;
}

export function MarioProfileV2({
  onNavigateToHome,
  onNavigateToHealthHub,
  onNavigateToRewards,
  onSignOut,
  onUpdateInsurance,
  onViewSavedProviders,
  onViewSavedMedications,
  onViewSavedPharmacies
}: MarioProfileV2Props) {
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    initials: 'SJ',
    memberSince: 'March 2024',
    tier: 'Silver Tier',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
  };

  // Insurance data
  const insurance = {
    provider: 'Blue Cross Blue Shield',
    memberId: 'ABC123456',
    copay: '$15',
    deductibleCurrent: 850,
    deductibleTotal: 2000,
    deductiblePercentage: 42.5
  };

  // Saved lists data
  const savedLists = [
    { id: 'providers', icon: Users, label: 'Saved Providers', count: 3 },
    { id: 'medications', icon: Pill, label: 'Saved Medications', count: 2 },
    { id: 'pharmacies', icon: MapPin, label: 'Saved Pharmacies', count: 1 }
  ];

  return (
    <div 
      className="min-h-screen pb-20"
      style={{ 
        backgroundColor: '#F6F4F0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-40"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="px-4 py-4">
          <h1 
            className="font-semibold"
            style={{ 
              fontSize: '22px',
              color: '#2E5077'
            }}
          >
            Profile
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        
        {/* Section 1: Profile Overview */}
        <Card 
          className="rounded-2xl shadow-md p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <Avatar 
                className="w-20 h-20"
                style={{ 
                  border: '3px solid #79D7BE40',
                  boxShadow: '0 2px 8px rgba(46, 80, 119, 0.08)'
                }}
              >
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback 
                  className="font-semibold"
                  style={{ 
                    backgroundColor: '#2E5077',
                    color: '#FFFFFF',
                    fontSize: '24px'
                  }}
                >
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* User Info */}
            <h2 
              className="font-semibold mb-2"
              style={{ 
                fontSize: '20px',
                color: '#1A1A1A'
              }}
            >
              {user.name}
            </h2>
            <p 
              className="mb-1"
              style={{ 
                fontSize: '14px',
                color: '#666666'
              }}
            >
              {user.email}
            </p>
            <p 
              className="mb-4"
              style={{ 
                fontSize: '12px',
                color: '#999999'
              }}
            >
              Member since {user.memberSince}
            </p>

            {/* Tier Badge */}
            <div 
              className="px-4 py-2 rounded-full mb-6"
              style={{ 
                backgroundColor: '#4DA1A920',
                color: '#4DA1A9',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {user.tier}
            </div>

            {/* Edit Profile Button */}
            <Button
              variant="outline"
              className="w-full"
              style={{
                borderColor: '#2E5077',
                color: '#2E5077',
                minHeight: '44px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Section 2: Insurance Information */}
        <Card 
          className="rounded-2xl shadow-md p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 
            className="font-semibold mb-4"
            style={{ 
              fontSize: '20px',
              color: '#1A1A1A'
            }}
          >
            Insurance Information
          </h2>

          {/* Insurance Details */}
          <div className="space-y-4 mb-4">
            {/* Plan Name */}
            <div className="flex items-center justify-between">
              <div>
                <p 
                  style={{ 
                    fontSize: '14px',
                    color: '#666666',
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}
                >
                  Plan Name
                </p>
                <p 
                  style={{ 
                    fontSize: '16px',
                    color: '#1A1A1A'
                  }}
                >
                  {insurance.provider}
                </p>
              </div>
              <Shield className="h-6 w-6" style={{ color: '#4DA1A9' }} />
            </div>

            {/* Divider */}
            <div 
              className="h-px"
              style={{ backgroundColor: '#4DA1A920' }}
            />

            {/* Member ID */}
            <div>
              <p 
                style={{ 
                  fontSize: '14px',
                  color: '#666666',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}
              >
                Member ID
              </p>
              <p 
                style={{ 
                  fontSize: '16px',
                  color: '#1A1A1A'
                }}
              >
                {insurance.memberId}
              </p>
            </div>

            {/* Copay */}
            <div>
              <p 
                style={{ 
                  fontSize: '14px',
                  color: '#666666',
                  fontWeight: '500',
                  marginBottom: '4px'
                }}
              >
                Copay
              </p>
              <p 
                style={{ 
                  fontSize: '16px',
                  color: '#1A1A1A'
                }}
              >
                {insurance.copay}
              </p>
            </div>

            {/* Deductible Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p 
                  style={{ 
                    fontSize: '14px',
                    color: '#666666',
                    fontWeight: '500'
                  }}
                >
                  Deductible Progress
                </p>
                <p 
                  style={{ 
                    fontSize: '14px',
                    color: '#4DA1A9',
                    fontWeight: '500'
                  }}
                >
                  {insurance.deductiblePercentage}%
                </p>
              </div>
              <Progress 
                value={insurance.deductiblePercentage} 
                className="h-2 mb-2"
                style={{ 
                  '--progress-background': 'linear-gradient(90deg, #4DA1A9 0%, #79D7BE 100%)',
                } as React.CSSProperties}
              />
              <p 
                style={{ 
                  fontSize: '14px',
                  color: '#1A1A1A'
                }}
              >
                ${insurance.deductibleCurrent.toLocaleString()} of ${insurance.deductibleTotal.toLocaleString()} met
              </p>
            </div>
          </div>

          {/* Update Insurance Button */}
          <Button
            className="w-full"
            onClick={onUpdateInsurance}
            style={{
              backgroundColor: '#2E5077',
              color: '#FFFFFF',
              minHeight: '44px',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#274666';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2E5077';
            }}
          >
            Update Insurance
          </Button>
        </Card>

        {/* Section 3: My Saved Lists */}
        <Card 
          className="rounded-2xl shadow-md p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 
            className="font-semibold mb-4"
            style={{ 
              fontSize: '20px',
              color: '#1A1A1A'
            }}
          >
            My Saved Lists
          </h2>

          {/* Saved List Items */}
          <div className="space-y-0 mb-4">
            {savedLists.map((item, index) => (
              <div key={item.id}>
                <button
                  className="w-full flex items-center justify-between py-3 px-0 transition-colors"
                  onClick={() => {
                    if (item.id === 'providers') onViewSavedProviders?.();
                    if (item.id === 'medications') onViewSavedMedications?.();
                    if (item.id === 'pharmacies') onViewSavedPharmacies?.();
                  }}
                  style={{ 
                    minHeight: '48px',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F9F9F9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon 
                      className="h-5 w-5" 
                      style={{ color: '#2E5077' }} 
                    />
                    <span 
                      style={{ 
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1A1A1A'
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      style={{ 
                        fontSize: '14px',
                        color: '#666666'
                      }}
                    >
                      {item.count}
                    </span>
                    <ChevronRight 
                      className="h-4 w-4" 
                      style={{ color: '#999999' }} 
                    />
                  </div>
                </button>
                {index < savedLists.length - 1 && (
                  <div 
                    className="h-px"
                    style={{ backgroundColor: '#E0E0E0' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* View All Link */}
          <button
            className="text-center w-full"
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#2E5077'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            View All Saved
          </button>
        </Card>

        {/* Section 4: Reminders & Alerts */}
        <Card 
          className="rounded-2xl shadow-md p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 
            className="font-semibold mb-4"
            style={{ 
              fontSize: '20px',
              color: '#1A1A1A'
            }}
          >
            Reminders & Alerts
          </h2>

          {/* Toggle Items */}
          <div className="space-y-0 mb-4">
            {/* Medication Refill Reminder */}
            <div 
              className="flex items-center justify-between py-3"
              style={{ minHeight: '48px' }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A1A1A'
                }}
              >
                Medication Refill Reminder
              </span>
              <Switch
                checked={medicationReminders}
                onCheckedChange={setMedicationReminders}
                style={{
                  '--switch-thumb-color': medicationReminders ? '#FFFFFF' : '#999999',
                  '--switch-bg-checked': '#4DA1A9',
                  '--switch-bg-unchecked': '#E0E0E0'
                } as React.CSSProperties}
              />
            </div>

            {/* Divider */}
            <div 
              className="h-px"
              style={{ backgroundColor: '#E0E0E0' }}
            />

            {/* Appointment Alerts */}
            <div 
              className="flex items-center justify-between py-3"
              style={{ minHeight: '48px' }}
            >
              <span 
                style={{ 
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1A1A1A'
                }}
              >
                Appointment Alerts
              </span>
              <Switch
                checked={appointmentAlerts}
                onCheckedChange={setAppointmentAlerts}
                style={{
                  '--switch-thumb-color': appointmentAlerts ? '#FFFFFF' : '#999999',
                  '--switch-bg-checked': '#4DA1A9',
                  '--switch-bg-unchecked': '#E0E0E0'
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Manage Notifications Link */}
          <button
            className="text-center w-full"
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#2E5077'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Manage Notifications
          </button>
        </Card>

        {/* Section 5: Settings */}
        <Card 
          className="rounded-2xl shadow-md p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <h2 
            className="font-semibold mb-4"
            style={{ 
              fontSize: '20px',
              color: '#1A1A1A'
            }}
          >
            Settings
          </h2>

          {/* Settings Items */}
          <div className="space-y-0 mb-6">
            {/* Notifications Toggle */}
            <div 
              className="flex items-center justify-between py-3"
              style={{ minHeight: '48px' }}
            >
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5" style={{ color: '#2E5077' }} />
                <span 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1A1A1A'
                  }}
                >
                  Notifications
                </span>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                style={{
                  '--switch-thumb-color': notificationsEnabled ? '#FFFFFF' : '#999999',
                  '--switch-bg-checked': '#4DA1A9',
                  '--switch-bg-unchecked': '#E0E0E0'
                } as React.CSSProperties}
              />
            </div>

            {/* Divider */}
            <div 
              className="h-px"
              style={{ backgroundColor: '#E0E0E0' }}
            />

            {/* Dark Mode Toggle */}
            <div 
              className="flex items-center justify-between py-3"
              style={{ minHeight: '48px' }}
            >
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5" style={{ color: '#2E5077' }} />
                <span 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1A1A1A'
                  }}
                >
                  Dark Mode
                </span>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                style={{
                  '--switch-thumb-color': darkMode ? '#FFFFFF' : '#999999',
                  '--switch-bg-checked': '#4DA1A9',
                  '--switch-bg-unchecked': '#E0E0E0'
                } as React.CSSProperties}
              />
            </div>

            {/* Divider */}
            <div 
              className="h-px"
              style={{ backgroundColor: '#E0E0E0' }}
            />

            {/* Privacy Policy */}
            <button
              className="w-full flex items-center justify-between py-3 px-0 transition-colors"
              style={{ 
                minHeight: '48px',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9F9F9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5" style={{ color: '#2E5077' }} />
                <span 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1A1A1A'
                  }}
                >
                  Privacy Policy
                </span>
              </div>
              <ChevronRight className="h-4 w-4" style={{ color: '#999999' }} />
            </button>

            {/* Divider */}
            <div 
              className="h-px"
              style={{ backgroundColor: '#E0E0E0' }}
            />

            {/* Help & Support */}
            <button
              className="w-full flex items-center justify-between py-3 px-0 transition-colors"
              style={{ 
                minHeight: '48px',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9F9F9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5" style={{ color: '#2E5077' }} />
                <span 
                  style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1A1A1A'
                  }}
                >
                  Help & Support
                </span>
              </div>
              <ChevronRight className="h-4 w-4" style={{ color: '#999999' }} />
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            className="w-full py-3 text-center transition-opacity"
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#2E5077'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onClick={onSignOut}
          >
            Sign Out
          </button>
        </Card>

      </div>

      {/* Bottom Navigation */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E8EAED',
          height: '64px'
        }}
      >
        <div className="flex items-center justify-around h-full max-w-md mx-auto px-2">
          <button
            className="flex flex-col items-center justify-center flex-1 py-2 transition-opacity"
            style={{ color: '#6B6B6B' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onClick={onNavigateToHome}
          >
            <MapPin className="h-5 w-5 mb-1" />
            <span style={{ fontSize: '11px', fontWeight: '500' }}>Search</span>
          </button>

          <button
            className="flex flex-col items-center justify-center flex-1 py-2 transition-opacity"
            style={{ color: '#6B6B6B' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onClick={onNavigateToHealthHub}
          >
            <CreditCard className="h-5 w-5 mb-1" />
            <span style={{ fontSize: '11px', fontWeight: '500' }}>Health Hub</span>
          </button>

          <button
            className="flex flex-col items-center justify-center flex-1 py-2 transition-opacity"
            style={{ color: '#6B6B6B' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onClick={onNavigateToRewards}
          >
            <Bell className="h-5 w-5 mb-1" />
            <span style={{ fontSize: '11px', fontWeight: '500' }}>Rewards</span>
          </button>

          <button
            className="flex flex-col items-center justify-center flex-1 py-2"
            style={{ color: '#2E5077' }}
          >
            <User className="h-5 w-5 mb-1" />
            <span style={{ fontSize: '11px', fontWeight: '600' }}>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
