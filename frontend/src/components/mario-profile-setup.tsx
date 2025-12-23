import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Shield, CheckCircle } from 'lucide-react';
import { useUserPreferences } from '@/lib/hooks/useUserPreferences';
import { useInsurance } from '@/lib/hooks/useInsurance';

interface MarioProfileSetupProps {
  onComplete?: () => void;
}

export function MarioProfileSetup({ onComplete }: MarioProfileSetupProps) {
  const { updatePreferences } = useUserPreferences();
  const { providers, loading: providersLoading } = useInsurance();

  const [zipCode, setZipCode] = useState('');
  const [insuranceCarrier, setInsuranceCarrier] = useState('');
  const [searchRadius, setSearchRadius] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [zipError, setZipError] = useState('');

  const validateZipCode = (zip: string): boolean => {
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zip)) {
      setZipError('Please enter a valid 5-digit ZIP code');
      return false;
    }
    setZipError('');
    return true;
  };

  const handleZipChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 5);
    setZipCode(numericValue);
    if (numericValue.length === 5) {
      validateZipCode(numericValue);
    } else if (zipError) {
      setZipError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateZipCode(zipCode)) {
      return;
    }

    if (!insuranceCarrier) {
      setError('Please select an insurance carrier');
      return;
    }

    setLoading(true);
    try {
      await updatePreferences({
        default_zip: zipCode,
        default_radius: searchRadius,
        preferred_insurance_carriers: [insuranceCarrier],
        user_id: '', // Will be set by the hook
      });

      onComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: '#F6F4F0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      <div className="w-full max-w-md px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: '#2E507720' }}
          >
            <CheckCircle
              className="w-8 h-8"
              style={{ color: '#2E5077' }}
            />
          </div>
          <h1
            className="font-bold mb-2"
            style={{
              fontSize: '28px',
              color: '#1A1A1A'
            }}
          >
            Welcome to MarioHealth
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#666666'
            }}
          >
            Let's personalize your experience
          </p>
        </div>

        {/* Form Card */}
        <Card
          className="rounded-2xl shadow-md p-6"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5'
                }}
              >
                <p style={{ fontSize: '14px', color: '#991B1B' }}>
                  {error}
                </p>
              </div>
            )}

            {/* Step 1: ZIP Code */}
            <div>
              <label
                htmlFor="zipCode"
                className="flex items-center gap-2 mb-2"
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1A1A1A'
                }}
              >
                <MapPin className="w-4 h-4" style={{ color: '#2E5077' }} />
                Your ZIP Code
              </label>
              <input
                id="zipCode"
                type="text"
                inputMode="numeric"
                value={zipCode}
                onChange={(e) => handleZipChange(e.target.value)}
                placeholder="Enter 5-digit ZIP code"
                required
                className="w-full px-4 py-3 rounded-lg border transition-colors"
                style={{
                  fontSize: '16px',
                  borderColor: zipError ? '#EF4444' : '#E0E0E0',
                  backgroundColor: '#FFFFFF',
                }}
                onFocus={(e) => {
                  if (!zipError) {
                    e.currentTarget.style.borderColor = '#2E5077';
                  }
                }}
                onBlur={(e) => {
                  if (!zipError) {
                    e.currentTarget.style.borderColor = '#E0E0E0';
                  }
                }}
              />
              {zipError && (
                <p
                  className="mt-1"
                  style={{ fontSize: '12px', color: '#EF4444' }}
                >
                  {zipError}
                </p>
              )}
              <p
                className="mt-1"
                style={{ fontSize: '12px', color: '#999999' }}
              >
                We'll use this to find providers near you
              </p>
            </div>

            {/* Step 2: Insurance Carrier */}
            <div>
              <label
                htmlFor="insuranceCarrier"
                className="flex items-center gap-2 mb-2"
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1A1A1A'
                }}
              >
                <Shield className="w-4 h-4" style={{ color: '#2E5077' }} />
                Insurance Carrier
              </label>
              <select
                id="insuranceCarrier"
                value={insuranceCarrier}
                onChange={(e) => setInsuranceCarrier(e.target.value)}
                required
                disabled={providersLoading}
                className="w-full px-4 py-3 rounded-lg border transition-colors"
                style={{
                  fontSize: '16px',
                  borderColor: '#E0E0E0',
                  backgroundColor: '#FFFFFF',
                  cursor: providersLoading ? 'wait' : 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2E5077';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E0E0E0';
                }}
              >
                <option value="">Select your insurance carrier</option>
                {providers.map((provider) => (
                  <option
                    key={provider.id}
                    value={provider.id}
                    disabled={!provider.available}
                    style={{
                      color: provider.available ? '#1A1A1A' : '#CCCCCC',
                    }}
                  >
                    {provider.name}{!provider.available ? ' (Coming Soon)' : ''}
                  </option>
                ))}
              </select>
              <p
                className="mt-1"
                style={{ fontSize: '12px', color: '#999999' }}
              >
                We'll show you in-network providers
              </p>
            </div>

            {/* Step 3: Search Radius */}
            <div>
              <label
                htmlFor="searchRadius"
                className="flex items-center justify-between mb-2"
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1A1A1A'
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
                  {searchRadius} miles
                </span>
              </label>
              <input
                id="searchRadius"
                type="range"
                min="10"
                max="100"
                step="5"
                value={searchRadius}
                onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4DA1A9 0%, #4DA1A9 ${((searchRadius - 10) / 90) * 100}%, #E0E0E0 ${((searchRadius - 10) / 90) * 100}%, #E0E0E0 100%)`,
                }}
              />
              <div
                className="flex justify-between mt-1"
                style={{ fontSize: '12px', color: '#999999' }}
              >
                <span>10 mi</span>
                <span>100 mi</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || providersLoading}
              className="w-full"
              style={{
                backgroundColor: '#2E5077',
                color: '#FFFFFF',
                minHeight: '48px',
                fontSize: '16px',
                fontWeight: '600',
                opacity: loading || providersLoading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading && !providersLoading) {
                  e.currentTarget.style.backgroundColor = '#274666';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2E5077';
              }}
            >
              {loading ? 'Saving...' : 'Continue to MarioHealth'}
            </Button>
          </form>
        </Card>

        {/* Footer Note */}
        <p
          className="text-center mt-6"
          style={{
            fontSize: '12px',
            color: '#999999'
          }}
        >
          You can update these preferences anytime in your profile
        </p>
      </div>
    </div>
  );
}
