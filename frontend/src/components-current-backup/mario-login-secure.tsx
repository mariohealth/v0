'use client'
import React, { useState, useEffect } from 'react';
import { MarioLogoLockup } from './mario-logo-lockup';
import { Fingerprint, Mail, Shield, Scan } from 'lucide-react';

interface MarioLoginSecureProps {
  onBiometricLogin?: () => void;
  onEmailPhoneLogin?: () => void;
  onAppleLogin?: () => void;
  onGoogleLogin?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  isDesktop?: boolean;
}

// Detect platform for biometric type
const detectBiometricType = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // iOS devices
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return {
      type: 'faceid',
      label: 'Sign in with Face ID',
      icon: 'face'
    };
  }
  
  // Android and other devices
  return {
    type: 'fingerprint',
    label: 'Sign in with Face or Fingerprint',
    icon: 'fingerprint'
  };
};

export function MarioLoginSecure({
  onBiometricLogin,
  onEmailPhoneLogin,
  onAppleLogin,
  onGoogleLogin,
  onBack,
  showBackButton = false,
  isDesktop = false
}: MarioLoginSecureProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [focusedButton, setFocusedButton] = useState<string | null>(null);
  const [biometricConfig, setBiometricConfig] = useState(detectBiometricType());

  // Auto-trigger biometric for returning users
  useEffect(() => {
    // Simulate auto-trigger for returning users
    const isReturningUser = localStorage.getItem('mario_returning_user') === 'true';
    if (isReturningUser && onBiometricLogin) {
      // Auto-trigger biometric after a brief delay
      const timer = setTimeout(() => {
        // In a real app, this would trigger the actual biometric prompt
        console.log('Auto-triggering biometric authentication...');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [onBiometricLogin]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#FDFCFA', padding: isDesktop ? '32px' : '16px' }}
    >
      {/* Back Button */}
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          aria-label="Go back"
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E5077" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      )}

      {/* Main Card Container */}
      <div
        style={{
          width: '100%',
          maxWidth: isDesktop ? '440px' : '400px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: isDesktop ? '48px 40px' : '40px 16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Logo Lockup */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <MarioLogoLockup size={isDesktop ? 'desktop' : 'mobile'} />
        </div>

        {/* Welcome Heading */}
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isDesktop ? '32px' : '28px',
            fontWeight: 600,
            color: '#4DA1A9',
            marginBottom: '8px',
            textAlign: 'center',
            lineHeight: 1.2
          }}
        >
          Welcome to Mario
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#666666',
            marginBottom: '32px',
            textAlign: 'center'
          }}
        >
          Your health, simplified.
        </p>

        {/* Biometric Login Button */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={onBiometricLogin}
            onMouseEnter={() => setHoveredButton('biometric')}
            onMouseLeave={() => setHoveredButton(null)}
            onFocus={() => setFocusedButton('biometric')}
            onBlur={() => setFocusedButton(null)}
            aria-label="Use device biometrics to sign in"
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '16px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'transform 0.2s ease',
              transform: hoveredButton === 'biometric' ? 'scale(1.02)' : 'scale(1)',
              outline: focusedButton === 'biometric' ? '2px solid #79D7BE' : 'none',
              outlineOffset: '4px',
              borderRadius: '8px'
            }}
          >
            {/* Biometric Icon Circle */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '2px solid #2E5077',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                backgroundColor: hoveredButton === 'biometric' ? 'rgba(46, 80, 119, 0.05)' : 'transparent'
              }}
            >
              {biometricConfig.icon === 'face' ? (
                <Scan size={40} color="#2E5077" strokeWidth={1.5} />
              ) : (
                <Fingerprint size={40} color="#2E5077" strokeWidth={1.5} />
              )}
            </div>

            {/* Biometric Text */}
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#1A1A1A',
                  marginBottom: '4px'
                }}
              >
                {biometricConfig.label}
              </p>
              
              {/* HIPAA Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Shield size={14} color="#666666" />
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#666666'
                  }}
                >
                  Secure login • HIPAA Compliant
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Divider with "or" */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#666666',
              padding: '0 16px'
            }}
          >
            or
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
        </div>

        {/* Email or Phone Button */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={onEmailPhoneLogin}
            onMouseEnter={() => setHoveredButton('email')}
            onMouseLeave={() => setHoveredButton(null)}
            onFocus={() => setFocusedButton('email')}
            onBlur={() => setFocusedButton(null)}
            style={{
              width: '100%',
              minHeight: '48px',
              borderRadius: '12px',
              backgroundColor: hoveredButton === 'email' ? '#2A4A6B' : '#2E5077',
              color: '#FFFFFF',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              transition: 'all 0.2s ease',
              boxShadow: focusedButton === 'email' ? '0 0 0 3px #79D7BE' : 'none',
              outline: 'none'
            }}
          >
            <Mail size={20} />
            <span>Sign in with Email or Phone</span>
          </button>
        </div>

        {/* Divider with "or continue with" */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#666666',
              padding: '0 16px'
            }}
          >
            or continue with
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E0E0E0' }} />
        </div>

        {/* Social Login Icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          {/* Apple Icon */}
          <button
            onClick={onAppleLogin}
            onMouseEnter={() => setHoveredButton('apple')}
            onMouseLeave={() => setHoveredButton(null)}
            onFocus={() => setFocusedButton('apple')}
            onBlur={() => setFocusedButton(null)}
            aria-label="Sign in with Apple"
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              borderRadius: '50%',
              backgroundColor: hoveredButton === 'apple' ? '#1A1A1A' : '#000000',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              transform: hoveredButton === 'apple' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: focusedButton === 'apple' ? '0 0 0 3px #79D7BE' : '0 2px 8px rgba(0, 0, 0, 0.15)',
              outline: 'none'
            }}
          >
            <AppleIcon />
          </button>

          {/* Google Icon */}
          <button
            onClick={onGoogleLogin}
            onMouseEnter={() => setHoveredButton('google')}
            onMouseLeave={() => setHoveredButton(null)}
            onFocus={() => setFocusedButton('google')}
            onBlur={() => setFocusedButton(null)}
            aria-label="Sign in with Google"
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E0E0E0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              transform: hoveredButton === 'google' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: focusedButton === 'google' ? '0 0 0 3px #79D7BE' : hoveredButton === 'google' ? '0 2px 12px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
              outline: 'none'
            }}
          >
            <GoogleIcon />
          </button>
        </div>

        {/* Footer - Sign Up Link */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#666666' }}>
            Don't have an account?{' '}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#2E5077',
                fontWeight: 600,
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
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Apple Icon Component
function AppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" color="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.569 12.503c-.027-2.706 2.201-4.007 2.301-4.071-1.254-1.842-3.207-2.094-3.902-2.122-1.66-.169-3.243.982-4.086.982-.842 0-2.145-.957-3.525-.932-1.814.027-3.486 1.059-4.421 2.688-1.884 3.28-.482 8.142 1.354 10.804.898 1.304 1.968 2.769 3.373 2.716 1.357-.054 1.871-.88 3.512-.88 1.641 0 2.102.88 3.525.853 1.454-.027 2.394-1.331 3.291-2.636 1.037-1.512 1.465-2.974 1.491-3.051-.033-.013-2.859-1.098-2.887-4.351h-.026zM15.034 5.398c.748-.909 1.252-2.172 1.114-3.43-1.076.044-2.379.721-3.151 1.63-.692.807-1.298 2.095-1.135 3.33 1.2.094 2.425-.612 3.172-1.53z"/>
    </svg>
  );
}

// Google Icon Component
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