import { useState, useEffect } from 'react';
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
  Pill,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useUserPreferences } from '@/lib/hooks/useUserPreferences';
import { useInsurance } from '@/lib/hooks/useInsurance';

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
  const { user: authUser } = useAuth();
  const { preferences, loading: prefsLoading, updatePreferences } = useUserPreferences();
  const { providers, loading: providersLoading } = useInsurance();

  const [medicationReminders, setMedicationReminders] = useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Edit states for Week 1 MVP fields
  const [editingLocation, setEditingLocation] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState(false);
  const [tempZipCode, setTempZipCode] = useState('');
  const [tempSearchRadius, setTempSearchRadius] = useState(60);
  const [tempInsuranceCarrier, setTempInsuranceCarrier] = useState('');
  const [zipError, setZipError] = useState('');
  const [saving, setSaving] = useState(false);

  // Load preferences into temp state when editing starts
  useEffect(() => {
    if (preferences) {
      setTempZipCode(preferences.default_zip || '');
      setTempSearchRadius(preferences.default_radius || 60);
      setTempInsuranceCarrier(preferences.preferred_insurance_carriers?.[0] || '');
    }
  }, [preferences]);

  // Mock user data (will be replaced with real auth data later)
  const user = {
    name: authUser?.displayName || authUser?.email?.split('@')[0] || 'User',
    email: authUser?.email || 'user@example.com',
    initials: authUser?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
    memberSince: 'March 2024',
    tier: 'Silver Tier',
    avatar: authUser?.photoURL || undefined
  };

  // Insurance data (mock for now - Week 2 feature)
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

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zip)) {
      setZipError('Please enter a valid 5-digit ZIP code');
      return false;
    }
    setZipError('');
    return true;
  };

  const handleSaveLocation = async () => {
    if (!validateZipCode(tempZipCode)) {
      return;
    }

    setSaving(true);
    try {
      await updatePreferences({
        default_zip: tempZipCode,
        default_radius: tempSearchRadius,
      });
      setEditingLocation(false);
    } catch (err) {
      console.error('Failed to save location preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelLocation = () => {
    setTempZipCode(preferences?.default_zip || '');
    setTempSearchRadius(preferences?.default_radius || 60);
    setZipError('');
    setEditingLocation(false);
  };

  const handleSaveInsurance = async () => {
    if (!tempInsuranceCarrier) {
      return;
    }

    setSaving(true);
    try {
      await updatePreferences({
        preferred_insurance_carriers: [tempInsuranceCarrier],
      });
      setEditingInsurance(false);
    } catch (err) {
      console.error('Failed to save insurance preference:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelInsurance = () => {
    setTempInsuranceCarrier(preferences?.preferred_insurance_carriers?.[0] || '');
    setEditingInsurance(false);
  };

  const getInsuranceProviderName = (id: string) => {
    const provider = providers.find(p => p.id === id);
    return provider?.name || id;
  };

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

        {/* Section 2: Location Preferences (Week 1 MVP) */}
        <Card
          className="rounded-2xl shadow-md p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: '20px',
                color: '#1A1A1A'
              }}
            >
              Location Preferences
            </h2>
            {!editingLocation && (
              <button
                onClick={() => setEditingLocation(true)}
                className="transition-opacity"
                style={{ color: '#2E5077' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
          </div>

          {editingLocation ? (
            <div className="space-y-4">
              {/* Edit ZIP Code */}
              <div>
                <label
                  htmlFor="editZipCode"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#666666',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  ZIP Code
                </label>
                <input
                  id="editZipCode"
                  type="text"
                  inputMode="numeric"
                  value={tempZipCode}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setTempZipCode(numericValue);
                    if (numericValue.length === 5) {
                      validateZipCode(numericValue);
                    } else if (zipError) {
                      setZipError('');
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{
                    fontSize: '16px',
                    borderColor: zipError ? '#EF4444' : '#E0E0E0'
                  }}
                />
                {zipError && (
                  <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>
                    {zipError}
                  </p>
                )}
              </div>

              {/* Edit Search Radius */}
              <div>
                <label
                  htmlFor="editSearchRadius"
                  className="flex items-center justify-between"
                  style={{ marginBottom: '8px' }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#666666'
                    }}
                  >
                    Search Radius
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#4DA1A9'
                    }}
                  >
                    {tempSearchRadius} miles
                  </span>
                </label>
                <input
                  id="editSearchRadius"
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={tempSearchRadius}
                  onChange={(e) => setTempSearchRadius(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #4DA1A9 0%, #4DA1A9 ${((tempSearchRadius - 10) / 90) * 100}%, #E0E0E0 ${((tempSearchRadius - 10) / 90) * 100}%, #E0E0E0 100%)`,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSaveLocation}
                  disabled={saving || !!zipError}
                  className="flex-1"
                  style={{
                    backgroundColor: '#2E5077',
                    color: '#FFFFFF',
                    minHeight: '44px',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: saving || zipError ? 0.6 : 1
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancelLocation}
                  disabled={saving}
                  variant="outline"
                  className="flex-1"
                  style={{
                    borderColor: '#E0E0E0',
                    color: '#666666',
                    minHeight: '44px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Display ZIP Code */}
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
                    ZIP Code
                  </p>
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#1A1A1A'
                    }}
                  >
                    {preferences?.default_zip || 'Not set'}
                  </p>
                </div>
                <MapPin className="h-6 w-6" style={{ color: '#4DA1A9' }} />
              </div>

              {/* Divider */}
              <div
                className="h-px"
                style={{ backgroundColor: '#4DA1A920' }}
              />

              {/* Display Search Radius */}
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#666666',
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}
                >
                  Search Radius
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#1A1A1A'
                  }}
                >
                  {preferences?.default_radius || 60} miles
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Section 3: Insurance Carrier (Week 1 MVP) */}
        <Card
          className="rounded-2xl shadow-md p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: '20px',
                color: '#1A1A1A'
              }}
            >
              Insurance Carrier
            </h2>
            {!editingInsurance && (
              <button
                onClick={() => setEditingInsurance(true)}
                className="transition-opacity"
                style={{ color: '#2E5077' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <Edit className="h-5 w-5" />
              </button>
            )}
          </div>

          {editingInsurance ? (
            <div className="space-y-4">
              {/* Edit Insurance Carrier */}
              <div>
                <label
                  htmlFor="editInsuranceCarrier"
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#666666',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Carrier
                </label>
                <select
                  id="editInsuranceCarrier"
                  value={tempInsuranceCarrier}
                  onChange={(e) => setTempInsuranceCarrier(e.target.value)}
                  disabled={providersLoading}
                  className="w-full px-4 py-2 rounded-lg border"
                  style={{
                    fontSize: '16px',
                    borderColor: '#E0E0E0',
                    cursor: providersLoading ? 'wait' : 'pointer'
                  }}
                >
                  <option value="">Select your insurance carrier</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSaveInsurance}
                  disabled={saving || !tempInsuranceCarrier}
                  className="flex-1"
                  style={{
                    backgroundColor: '#2E5077',
                    color: '#FFFFFF',
                    minHeight: '44px',
                    fontSize: '14px',
                    fontWeight: '500',
                    opacity: saving || !tempInsuranceCarrier ? 0.6 : 1
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancelInsurance}
                  disabled={saving}
                  variant="outline"
                  className="flex-1"
                  style={{
                    borderColor: '#E0E0E0',
                    color: '#666666',
                    minHeight: '44px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
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
                  Current Carrier
                </p>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#1A1A1A'
                  }}
                >
                  {preferences?.preferred_insurance_carriers?.[0]
                    ? getInsuranceProviderName(preferences.preferred_insurance_carriers[0])
                    : 'Not set'}
                </p>
              </div>
              <Shield className="h-6 w-6" style={{ color: '#4DA1A9' }} />
            </div>
          )}
        </Card>

        {/* Section 4: Additional Insurance Details (Week 2 - Mock for now) */}
        <Card
          className="rounded-2xl shadow-md p-4"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-semibold"
              style={{
                fontSize: '20px',
                color: '#1A1A1A'
              }}
            >
              Insurance Details
            </h2>
            <Badge
              variant="secondary"
              style={{
                backgroundColor: '#F0F0F0',
                color: '#666666',
                fontSize: '10px',
                fontWeight: '500',
                padding: '4px 8px'
              }}
            >
              Week 2
            </Badge>
          </div>

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

        {/* Section 5: My Saved Lists */}
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

        {/* Section 6: Reminders & Alerts */}
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

        {/* Section 7: Settings */}
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
