'use client'
import React from 'react';
import { MarioLogo } from './mario-logo';

interface GetStartedProps {
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
  onSSOSignUp?: () => void;
  onEmailSignUp?: () => void;
  onSignInClick?: () => void;
  employerLogo?: string;
  employerName?: string;
}

export function MarioGetStarted({
  onGoogleSignUp,
  onAppleSignUp,
  onSSOSignUp,
  onEmailSignUp,
  onSignInClick,
  employerLogo,
  employerName = "Your Employer"
}: GetStartedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6" style={{ backgroundColor: '#FDFCFA' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div style={{ width: '80px', height: '80px' }}>
            <MarioLogo />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="mb-2" style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
            Get Started with Mario
          </h1>
          <p style={{ fontSize: '14px', fontWeight: 400, color: '#666666' }}>
            Choose how you'd like to sign up
          </p>
        </div>

        {/* Sign-up Buttons */}
        <div className="flex flex-col gap-2 mb-6">
          {/* Continue with Google */}
          <button
            onClick={onGoogleSignUp}
            className="w-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E5E5',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              fontSize: '16px',
              fontWeight: 500,
              color: '#1A1A1A',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Continue with Apple */}
          <button
            onClick={onAppleSignUp}
            className="w-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#000000',
              border: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              fontSize: '16px',
              fontWeight: 500,
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <AppleIcon />
            <span>Continue with Apple</span>
          </button>

          {/* Continue with SSO (Employer) */}
          <button
            onClick={onSSOSignUp}
            className="w-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#2E5077',
              border: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              fontSize: '16px',
              fontWeight: 500,
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {employerLogo ? (
              <img 
                src={employerLogo} 
                alt={employerName}
                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
              />
            ) : (
              <SSOIcon />
            )}
            <span>Continue with SSO (Employer)</span>
          </button>

          {/* Sign up with Email */}
          <button
            onClick={onEmailSignUp}
            className="w-full flex items-center justify-center gap-2 transition-all hover:bg-blue-50 active:scale-[0.98]"
            style={{
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #2E5077',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
              fontSize: '16px',
              fontWeight: 500,
              color: '#2E5077',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <EmailIcon />
            <span>Sign up with Email</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <p style={{ fontSize: '14px', color: '#666666' }}>
            Already have an account?{' '}
            <button
              onClick={onSignInClick}
              className="hover:underline transition-colors"
              style={{ 
                color: '#2E5077', 
                fontWeight: 500,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Google Icon (24px)
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

// Apple Icon (24px)
function AppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.569 12.503c-.027-2.706 2.201-4.007 2.301-4.071-1.254-1.842-3.207-2.094-3.902-2.122-1.66-.169-3.243.982-4.086.982-.842 0-2.145-.957-3.525-.932-1.814.027-3.486 1.059-4.421 2.688-1.884 3.28-.482 8.142 1.354 10.804.898 1.304 1.968 2.769 3.373 2.716 1.357-.054 1.871-.88 3.512-.88 1.641 0 2.102.88 3.525.853 1.454-.027 2.394-1.331 3.291-2.636 1.037-1.512 1.465-2.974 1.491-3.051-.033-.013-2.859-1.098-2.887-4.351h-.026zM15.034 5.398c.748-.909 1.252-2.172 1.114-3.43-1.076.044-2.379.721-3.151 1.63-.692.807-1.298 2.095-1.135 3.33 1.2.094 2.425-.612 3.172-1.53z"/>
    </svg>
  );
}

// SSO Icon (24px) - Building/Office icon
function SSOIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  );
}

// Email Icon (24px)
function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m2 7 10 7 10-7"/>
    </svg>
  );
}
