'use client'
import React, { useState } from 'react';
import { MarioLogoLockup } from './mario-logo-lockup';
import { Building2, Mail } from 'lucide-react';

interface GetStartedProps {
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
  onSSOSignUp?: () => void;
  onEmailSignUp?: () => void;
  onSignInClick?: () => void;
  employerLogo?: string;
  employerName?: string;
  isDesktop?: boolean;
}

export function MarioAuthGetStarted({
  onGoogleSignUp,
  onAppleSignUp,
  onSSOSignUp,
  onEmailSignUp,
  onSignInClick,
  employerLogo,
  employerName,
  isDesktop = false
}: GetStartedProps) {
  const [focusedButton, setFocusedButton] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleProviderClick = async (provider: string, callback?: () => void) => {
    setLoading(provider);
    callback?.();
  };

  // Desktop variant with marketing panel
  if (isDesktop) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: '#FDFCFA' }}>
        {/* Left Panel - Marketing */}
        <div 
          className="flex-1 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(46,80,119,0.06) 0%, rgba(77,161,169,0.06) 100%)',
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center px-16">
            <div style={{ maxWidth: '560px' }}>
              <h1 
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '48px',
                  fontWeight: 700,
                  color: '#2E5077',
                  marginBottom: '16px',
                  lineHeight: 1.2
                }}
              >
                Save on care.<br />Earn rewards.
              </h1>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: 400,
                  color: '#666666',
                  lineHeight: 1.6
                }}
              >
                See what you'll really pay. Get transparency, rewards, and peace of mind.
              </p>
            </div>
          </div>
          
          {/* Logo in top-left */}
          <div style={{ position: 'absolute', top: '32px', left: '32px' }}>
            <MarioLogoLockup size="desktop" />
          </div>
        </div>

        {/* Right Panel - Form Card */}
        <div className="flex items-center justify-center" style={{ width: '50%', padding: '32px' }}>
          <AuthCard
            onGoogleSignUp={() => handleProviderClick('google', onGoogleSignUp)}
            onAppleSignUp={() => handleProviderClick('apple', onAppleSignUp)}
            onSSOSignUp={() => handleProviderClick('sso', onSSOSignUp)}
            onEmailSignUp={() => handleProviderClick('email', onEmailSignUp)}
            onSignInClick={onSignInClick}
            employerLogo={employerLogo}
            employerName={employerName}
            focusedButton={focusedButton}
            setFocusedButton={setFocusedButton}
            hoveredButton={hoveredButton}
            setHoveredButton={setHoveredButton}
            loading={loading}
          />
        </div>
      </div>
    );
  }

  // Mobile variant - full screen with centered card
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#FDFCFA', padding: '24px' }}
    >
      <AuthCard
        onGoogleSignUp={() => handleProviderClick('google', onGoogleSignUp)}
        onAppleSignUp={() => handleProviderClick('apple', onAppleSignUp)}
        onSSOSignUp={() => handleProviderClick('sso', onSSOSignUp)}
        onEmailSignUp={() => handleProviderClick('email', onEmailSignUp)}
        onSignInClick={onSignInClick}
        employerLogo={employerLogo}
        employerName={employerName}
        focusedButton={focusedButton}
        setFocusedButton={setFocusedButton}
        hoveredButton={hoveredButton}
        setHoveredButton={setHoveredButton}
        loading={loading}
        showLogo
      />
    </div>
  );
}

interface AuthCardProps {
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
  onSSOSignUp?: () => void;
  onEmailSignUp?: () => void;
  onSignInClick?: () => void;
  employerLogo?: string;
  employerName?: string;
  focusedButton: string | null;
  setFocusedButton: (id: string | null) => void;
  hoveredButton: string | null;
  setHoveredButton: (id: string | null) => void;
  loading: string | null;
  showLogo?: boolean;
}

function AuthCard({
  onGoogleSignUp,
  onAppleSignUp,
  onSSOSignUp,
  onEmailSignUp,
  onSignInClick,
  employerLogo,
  employerName,
  focusedButton,
  setFocusedButton,
  hoveredButton,
  setHoveredButton,
  loading,
  showLogo = false
}: AuthCardProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '32px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Logo lockup - only on mobile */}
      {showLogo && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <MarioLogoLockup size="mobile" />
        </div>
      )}

      {/* Header */}
      <h1
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#1A1A1A',
          marginBottom: '8px',
          textAlign: 'center'
        }}
      >
        Get Started with Mario
      </h1>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: '#666666',
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        Choose how you'd like to sign up
      </p>

      {/* Button stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Google Button */}
        <ProviderButton
          id="google"
          label="Continue with Google"
          icon={<GoogleIcon />}
          onClick={onGoogleSignUp}
          style={{
            backgroundColor: hoveredButton === 'google' ? '#F7F7F7' : '#FFFFFF',
            color: '#1A1A1A',
            border: '1px solid #E0E0E0'
          }}
          focusRingColor="#2E5077"
          isFocused={focusedButton === 'google'}
          onFocus={() => setFocusedButton('google')}
          onBlur={() => setFocusedButton(null)}
          onMouseEnter={() => setHoveredButton('google')}
          onMouseLeave={() => setHoveredButton(null)}
          loading={loading === 'google'}
        />

        {/* Apple Button */}
        <ProviderButton
          id="apple"
          label="Continue with Apple"
          icon={<AppleIcon />}
          onClick={onAppleSignUp}
          style={{
            backgroundColor: hoveredButton === 'apple' ? '#111111' : '#000000',
            color: '#FFFFFF',
            border: 'none'
          }}
          focusRingColor="#4DA1A9"
          isFocused={focusedButton === 'apple'}
          onFocus={() => setFocusedButton('apple')}
          onBlur={() => setFocusedButton(null)}
          onMouseEnter={() => setHoveredButton('apple')}
          onMouseLeave={() => setHoveredButton(null)}
          loading={loading === 'apple'}
        />

        {/* SSO Button */}
        <ProviderButton
          id="sso"
          label="Continue with SSO (Employer)"
          icon={employerLogo ? <img src={employerLogo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} /> : <Building2 size={24} color="#FFFFFF" />}
          onClick={onSSOSignUp}
          style={{
            backgroundColor: hoveredButton === 'sso' ? '#2A4A6B' : '#2E5077',
            color: '#FFFFFF',
            border: 'none'
          }}
          focusRingColor="#79D7BE"
          isFocused={focusedButton === 'sso'}
          onFocus={() => setFocusedButton('sso')}
          onBlur={() => setFocusedButton(null)}
          onMouseEnter={() => setHoveredButton('sso')}
          onMouseLeave={() => setHoveredButton(null)}
          loading={loading === 'sso'}
        />

        {/* Email Button */}
        <ProviderButton
          id="email"
          label="Sign up with Email"
          icon={<Mail size={24} color="#2E5077" />}
          onClick={onEmailSignUp}
          style={{
            backgroundColor: hoveredButton === 'email' ? '#F7FAFF' : '#FFFFFF',
            color: '#2E5077',
            border: '1px solid #2E5077'
          }}
          focusRingColor="#4DA1A9"
          isFocused={focusedButton === 'email'}
          onFocus={() => setFocusedButton('email')}
          onBlur={() => setFocusedButton(null)}
          onMouseEnter={() => setHoveredButton('email')}
          onMouseLeave={() => setHoveredButton(null)}
          loading={loading === 'email'}
        />
      </div>

      {/* Footer */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#666666' }}>
          Already have an account?{' '}
          <button
            onClick={onSignInClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#2E5077',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

interface ProviderButtonProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  style: React.CSSProperties;
  focusRingColor: string;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  loading?: boolean;
}

function ProviderButton({
  id,
  label,
  icon,
  onClick,
  style,
  focusRingColor,
  isFocused,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  loading = false
}: ProviderButtonProps) {
  return (
    <button
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={loading}
      style={{
        width: '100%',
        height: '48px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        opacity: loading ? 0.6 : 1,
        ...style,
        outline: 'none',
        boxShadow: isFocused ? `0 0 0 2px ${focusRingColor}` : 'none'
      }}
    >
      <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {loading ? <Spinner color={style.color as string} /> : icon}
      </div>
      <span>{loading ? 'Connecting…' : label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.569 12.503c-.027-2.706 2.201-4.007 2.301-4.071-1.254-1.842-3.207-2.094-3.902-2.122-1.66-.169-3.243.982-4.086.982-.842 0-2.145-.957-3.525-.932-1.814.027-3.486 1.059-4.421 2.688-1.884 3.28-.482 8.142 1.354 10.804.898 1.304 1.968 2.769 3.373 2.716 1.357-.054 1.871-.88 3.512-.88 1.641 0 2.102.88 3.525.853 1.454-.027 2.394-1.331 3.291-2.636 1.037-1.512 1.465-2.974 1.491-3.051-.033-.013-2.859-1.098-2.887-4.351h-.026zM15.034 5.398c.748-.909 1.252-2.172 1.114-3.43-1.076.044-2.379.721-3.151 1.63-.692.807-1.298 2.095-1.135 3.33 1.2.094 2.425-.612 3.172-1.53z"/>
    </svg>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="2" strokeOpacity="0.2" />
      <path d="M10 2a8 8 0 0 1 8 8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
