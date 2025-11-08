'use client'
import React, { useState, useEffect } from 'react';
import { MarioLogoLockup } from './mario-logo-lockup';
import { Eye, EyeOff, Building2, CheckCircle, AlertCircle, X } from 'lucide-react';

// Mock Auth Flow States
type AuthState = 'default' | 'loading' | 'error' | 'success';

interface SignupProps {
  onSignUp?: (email: string, password: string) => void;
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
  onSSOSignUp?: () => void;
  onLoginClick?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  backButtonLabel?: string;
  isDesktop?: boolean;
  employerLogo?: string;
  employerName?: string;
  // Mock flow control
  mockAuthDelay?: number;
  mockAuthSuccess?: boolean;
  onAuthSuccess?: () => void;
}

export function MarioAuthSignup({
  onSignUp,
  onGoogleSignUp,
  onAppleSignUp,
  onSSOSignUp,
  onLoginClick,
  onBack,
  showBackButton = false,
  backButtonLabel,
  isDesktop = false,
  employerLogo,
  employerName = 'Your Employer',
  mockAuthDelay = 1000,
  mockAuthSuccess = true,
  onAuthSuccess
}: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Mock auth flow state
  const [authState, setAuthState] = useState<AuthState>('default');
  const [authError, setAuthError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailTouched) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordTouched) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
    setFocusedField(null);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
    setFocusedField(null);
  };

  // Mock auth flow handler
  const simulateAuth = (authMethod: string) => {
    console.log(`${authMethod} clicked`);
    setAuthState('loading');
    setAuthError('');

    setTimeout(() => {
      if (mockAuthSuccess) {
        setAuthState('success');
        setShowConfetti(true);
        
        // Redirect after success message
        setTimeout(() => {
          onAuthSuccess?.();
        }, 1500);
      } else {
        setAuthState('error');
        setAuthError('Sign-up failed. Please try again.');
      }
    }, mockAuthDelay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    
    if (!emailErr && !passwordErr) {
      simulateAuth('Email signup');
      onSignUp?.(email, password);
    }
  };

  const isValid = email && password && !emailError && !passwordError;

  // Desktop variant with marketing panel
  if (isDesktop) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: '#FDFCFA' }}>
        {/* Confetti Effect */}
        {showConfetti && <ConfettiEffect />}

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
          <SignupCard
            email={email}
            password={password}
            showPassword={showPassword}
            emailError={emailError}
            passwordError={passwordError}
            focusedField={focusedField}
            authState={authState}
            authError={authError}
            isValid={isValid}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onEmailBlur={handleEmailBlur}
            onPasswordBlur={handlePasswordBlur}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleSubmit}
            onGoogleSignUp={() => simulateAuth('Google sign-up')}
            onAppleSignUp={() => simulateAuth('Apple sign-up')}
            onSSOSignUp={() => simulateAuth('Employer SSO')}
            onLoginClick={onLoginClick}
            onDismissError={() => setAuthState('default')}
            setFocusedField={setFocusedField}
            employerLogo={employerLogo}
            employerName={employerName}
          />
        </div>
      </div>
    );
  }

  // Mobile variant
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#FDFCFA', padding: '24px' }}
    >
      {/* Confetti Effect */}
      {showConfetti && <ConfettiEffect />}

      {showBackButton && onBack && (
        <button
          onClick={onBack}
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
      
      <SignupCard
        email={email}
        password={password}
        showPassword={showPassword}
        emailError={emailError}
        passwordError={passwordError}
        focusedField={focusedField}
        authState={authState}
        authError={authError}
        isValid={isValid}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onEmailBlur={handleEmailBlur}
        onPasswordBlur={handlePasswordBlur}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onSubmit={handleSubmit}
        onGoogleSignUp={() => simulateAuth('Google sign-up')}
        onAppleSignUp={() => simulateAuth('Apple sign-up')}
        onSSOSignUp={() => simulateAuth('Employer SSO')}
        onLoginClick={onLoginClick}
        onDismissError={() => setAuthState('default')}
        setFocusedField={setFocusedField}
        employerLogo={employerLogo}
        employerName={employerName}
        showLogo
      />
    </div>
  );
}

interface SignupCardProps {
  email: string;
  password: string;
  showPassword: boolean;
  emailError: string;
  passwordError: string;
  focusedField: string | null;
  authState: AuthState;
  authError: string;
  isValid: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEmailBlur: () => void;
  onPasswordBlur: () => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
  onSSOSignUp?: () => void;
  onLoginClick?: () => void;
  onDismissError: () => void;
  setFocusedField: (field: string | null) => void;
  employerLogo?: string;
  employerName?: string;
  showLogo?: boolean;
}

function SignupCard({
  email,
  password,
  showPassword,
  emailError,
  passwordError,
  focusedField,
  authState,
  authError,
  isValid,
  onEmailChange,
  onPasswordChange,
  onEmailBlur,
  onPasswordBlur,
  onTogglePassword,
  onSubmit,
  onGoogleSignUp,
  onAppleSignUp,
  onSSOSignUp,
  onLoginClick,
  onDismissError,
  setFocusedField,
  employerLogo,
  employerName,
  showLogo = false
}: SignupCardProps) {
  const isLoading = authState === 'loading';
  const isDisabled = isLoading || authState === 'success';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '32px 24px 24px', // 24px bottom padding
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 300ms ease-out'
      }}
    >
      {/* Logo lockup - only on mobile */}
      {showLogo && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
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
        Create your account
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
        Join thousands saving on healthcare
      </p>

      {/* Success Message */}
      {authState === 'success' && (
        <SuccessBanner message="Success! Redirecting to your Health Hub…" />
      )}

      {/* Error Banner */}
      {authState === 'error' && authError && (
        <ErrorBanner message={authError} onDismiss={onDismissError} />
      )}

      {/* PRIMARY: SSO Button (full-width, 48px height, #2E5077 background) */}
      <button
        onClick={onSSOSignUp}
        disabled={isDisabled}
        style={{
          width: '100%',
          height: '48px',
          borderRadius: '8px',
          backgroundColor: '#2E5077',
          color: '#FFFFFF',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          fontWeight: 600,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '16px',
          opacity: isDisabled ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.backgroundColor = '#2A4A6B';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.backgroundColor = '#2E5077';
          }
        }}
      >
        {employerLogo ? (
          <img src={employerLogo} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
        ) : (
          <Building2 size={20} color="#FFFFFF" />
        )}
        <span>{isLoading && authState === 'loading' ? 'Connecting…' : `Continue with ${employerName}`}</span>
      </button>

      {/* SECONDARY: Apple + Google circular buttons (48x48px, 8px spacing, center-aligned) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
        <button
          onClick={onAppleSignUp}
          disabled={isDisabled}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '24px',
            backgroundColor: '#000000',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: isDisabled ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = '#1A1A1A';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = '#000000';
            }
          }}
          aria-label="Sign up with Apple"
        >
          <AppleIcon />
        </button>
        <button
          onClick={onGoogleSignUp}
          disabled={isDisabled}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '24px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: isDisabled ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = '#F7F7F7';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }
          }}
          aria-label="Sign up with Google"
        >
          <GoogleIcon />
        </button>
      </div>

      {/* Divider: "or" centered with thin line (#E0E0E0, 1px) - 24px margin top/bottom */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', marginTop: '24px' }}>
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

      {/* TERTIARY: Email/Password Form (manual entry section) */}
      <form onSubmit={onSubmit}>
        {/* Email Input - outlined, border #2E5077, 8px corner radius with focus ring */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1A1A1A',
              marginBottom: '8px'
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={onEmailBlur}
            aria-invalid={!!emailError}
            disabled={isDisabled}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              border: emailError ? '2px solid #B00020' : '1px solid #E0E0E0',
              padding: '0 16px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              outline: focusedField === 'email' && !emailError ? '2px solid #2E5077' : 'none',
              outlineOffset: '0px',
              boxShadow: focusedField === 'email' && !emailError ? '0 0 0 3px rgba(46, 80, 119, 0.125)' : 'none',
              transition: 'border 0.2s ease, outline 0.2s ease, box-shadow 0.2s ease',
              cursor: isDisabled ? 'not-allowed' : 'text'
            }}
            placeholder="you@example.com"
          />
          {emailError && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#B00020',
                marginTop: '4px'
              }}
            >
              {emailError}
            </p>
          )}
        </div>

        {/* Password Input - outlined, border #2E5077, 8px corner radius with focus ring and error state */}
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1A1A1A',
              marginBottom: '8px'
            }}
          >
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={onPasswordBlur}
              aria-invalid={!!passwordError}
              disabled={isDisabled}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '8px',
                border: passwordError ? '2px solid #B00020' : '1px solid #E0E0E0',
                padding: '0 48px 0 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                outline: focusedField === 'password' && !passwordError ? '2px solid #2E5077' : 'none',
                outlineOffset: '0px',
                boxShadow: focusedField === 'password' && !passwordError ? '0 0 0 3px rgba(46, 80, 119, 0.125)' : 'none',
                transition: 'border 0.2s ease, outline 0.2s ease, box-shadow 0.2s ease',
                cursor: isDisabled ? 'not-allowed' : 'text'
              }}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              disabled={isDisabled}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showPassword ? <EyeOff size={20} color="#666666" /> : <Eye size={20} color="#666666" />}
            </button>
          </div>
          {passwordError && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#B00020',
                marginTop: '4px'
              }}
            >
              {passwordError}
            </p>
          )}
        </div>

        {/* Sign Up Button - secondary outline style (white bg, #2E5077 border/text, hover #EDF2F6) */}
        <button
          type="submit"
          disabled={!isValid || isDisabled}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            color: isValid && !isDisabled ? '#2E5077' : '#999999',
            border: isValid && !isDisabled ? '1px solid #2E5077' : '1px solid #E0E0E0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isValid && !isDisabled ? 'pointer' : 'not-allowed',
            transition: 'all 200ms ease',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (isValid && !isDisabled) {
              e.currentTarget.style.backgroundColor = '#EDF2F6';
            }
          }}
          onMouseLeave={(e) => {
            if (isValid && !isDisabled) {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }
          }}
          onMouseDown={(e) => {
            if (isValid && !isDisabled) {
              e.currentTarget.style.transform = 'scale(0.98)';
            }
          }}
          onMouseUp={(e) => {
            if (isValid && !isDisabled) {
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {isLoading ? (
            <>
              <span>Creating account…</span>
              <Spinner color="#2E5077" />
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      {/* 
        NOTE FOR DEVELOPERS:
        Replace console.log with real Supabase/Auth.js provider logic during integration.
        Example: supabase.auth.signInWithOAuth({ provider: 'google' })
      */}

      {/* Footer Link - small text, subdued gray #666666, underline on hover */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#666666' }}>
          Already have an account?{' '}
          <button
            onClick={onLoginClick}
            disabled={isDisabled}
            style={{
              background: 'none',
              border: 'none',
              color: isDisabled ? '#999999' : '#666666',
              fontWeight: 500,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              padding: 0,
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.textDecoration = 'underline';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

// Success Banner Component
function SuccessBanner({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#E8F5E9',
        border: '1px solid #79D7BE',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 300ms ease-out'
      }}
    >
      <CheckCircle size={20} color="#79D7BE" />
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          color: '#1B5E20',
          flex: 1
        }}
      >
        {message}
      </span>
    </div>
  );
}

// Error Banner Component
function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#FDEDED',
        border: '1px solid #F5C6CB',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 300ms ease-out'
      }}
    >
      <AlertCircle size={20} color="#B00020" />
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          color: '#B00020',
          flex: 1
        }}
      >
        ⚠️ {message}
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={16} color="#B00020" />
      </button>
    </div>
  );
}

// Spinner Component
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

// Confetti Effect Component
function ConfettiEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: [
              '#2E5077', // Primary blue
              '#4DA1A9', // Accent teal
              '#79D7BE', // Support green
              '#00AA66', // Success green
              '#FFA726'  // Warning amber
            ][Math.floor(Math.random() * 5)],
            animation: `confetti-fall ${2 + Math.random() * 2}s linear ${Math.random() * 2}s forwards`
          }}
        />
      ))}
    </div>
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" color="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.569 12.503c-.027-2.706 2.201-4.007 2.301-4.071-1.254-1.842-3.207-2.094-3.902-2.122-1.66-.169-3.243.982-4.086.982-.842 0-2.145-.957-3.525-.932-1.814.027-3.486 1.059-4.421 2.688-1.884 3.28-.482 8.142 1.354 10.804.898 1.304 1.968 2.769 3.373 2.716 1.357-.054 1.871-.88 3.512-.88 1.641 0 2.102.88 3.525.853 1.454-.027 2.394-1.331 3.291-2.636 1.037-1.512 1.465-2.974 1.491-3.051-.033-.013-2.859-1.098-2.887-4.351h-.026zM15.034 5.398c.748-.909 1.252-2.172 1.114-3.43-1.076.044-2.379.721-3.151 1.63-.692.807-1.298 2.095-1.135 3.33 1.2.094 2.425-.612 3.172-1.53z"/>
    </svg>
  );
}