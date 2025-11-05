'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MarioLogoLockup } from './mario-logo-lockup';
import { Eye, EyeOff, CheckCircle, AlertCircle, X } from 'lucide-react';

// Mock Auth Flow States
type AuthState = 'default' | 'loading' | 'error' | 'success';

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
  onCreateAccount?: () => void;
  onForgotPassword?: () => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  backButtonLabel?: string;
  isDesktop?: boolean;
  // Mock flow control
  mockAuthDelay?: number;
  mockAuthSuccess?: boolean;
  onAuthSuccess?: () => void;
}

export function MarioAuthLogin({
  onLogin,
  onCreateAccount,
  onForgotPassword,
  onGoogleLogin,
  onAppleLogin,
  onBack,
  showBackButton = false,
  backButtonLabel = 'Back',
  isDesktop = false,
  mockAuthDelay = 1000,
  mockAuthSuccess = true,
  onAuthSuccess
}: LoginProps) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Auth flow state
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

  // Supabase auth handler
  const handleLogin = async (email: string, password: string) => {
    setAuthState('loading');
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthState('error');
        setAuthError(error.message || 'Sign-in failed. Please try again.');
        onLogin?.(email, password); // Call callback for backward compatibility
      } else {
        setAuthState('success');
        setShowConfetti(true);
        console.log('Mock login success, redirecting...');
        
        // Redirect immediately after success
        setTimeout(() => {
          onAuthSuccess?.();
          router.push('/home'); // Redirect to home page after login
        }, 500); // Reduced delay for faster redirect
      }
    } catch (err) {
      setAuthState('error');
      setAuthError('An unexpected error occurred. Please try again.');
      onLogin?.(email, password); // Call callback for backward compatibility
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    
    if (!emailErr && !passwordErr) {
      await handleLogin(email, password);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setAuthState('loading');
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'google' ? 'google' : 'apple',
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });

      if (error) {
        setAuthState('error');
        setAuthError(error.message || `${provider} sign-in failed. Please try again.`);
      } else {
        // Mock OAuth - redirect immediately
        console.log(`Mock ${provider} login success, redirecting...`);
        setTimeout(() => {
          router.push('/home');
          if (provider === 'google') {
            onGoogleLogin?.();
          } else {
            onAppleLogin?.();
          }
        }, 500);
      }
    } catch (err) {
      setAuthState('error');
      setAuthError(`An unexpected error occurred during ${provider} sign-in. Please try again.`);
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
                Welcome back to Mario
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
                Continue your journey to better healthcare savings and rewards.
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
          <LoginCard
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
            onCreateAccount={onCreateAccount}
            onForgotPassword={onForgotPassword}
            onGoogleLogin={() => handleSocialLogin('google')}
            onAppleLogin={() => handleSocialLogin('apple')}
            onDismissError={() => setAuthState('default')}
            setFocusedField={setFocusedField}
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
      
      <LoginCard
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
        onCreateAccount={onCreateAccount}
        onForgotPassword={onForgotPassword}
        onGoogleLogin={() => handleSocialLogin('google')}
        onAppleLogin={() => handleSocialLogin('apple')}
        onDismissError={() => setAuthState('default')}
        setFocusedField={setFocusedField}
        showLogo
      />
    </div>
  );
}

interface LoginCardProps {
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
  onCreateAccount?: () => void;
  onForgotPassword?: () => void;
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  onDismissError: () => void;
  setFocusedField: (field: string | null) => void;
  showLogo?: boolean;
}

function LoginCard({
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
  onCreateAccount,
  onForgotPassword,
  onGoogleLogin,
  onAppleLogin,
  onDismissError,
  setFocusedField,
  showLogo = false
}: LoginCardProps) {
  const isLoading = authState === 'loading';
  const isDisabled = isLoading || authState === 'success';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '32px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 300ms ease-out'
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
        Sign in to Mario
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
        Welcome back. Please enter your credentials.
      </p>

      {/* Success Message */}
      {authState === 'success' && (
        <SuccessBanner message="Success! Redirecting to your Health Hub…" />
      )}

      {/* Error Banner */}
      {authState === 'error' && authError && (
        <ErrorBanner message={authError} onDismiss={onDismissError} />
      )}

      {/* Form */}
      <form onSubmit={onSubmit}>
        {/* Email Input */}
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
              border: emailError ? '2px solid #D32F2F' : focusedField === 'email' ? '2px solid #2E5077' : '1px solid #E0E0E0',
              padding: '0 16px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              outline: 'none',
              transition: 'border 0.2s ease',
              cursor: isDisabled ? 'not-allowed' : 'text'
            }}
            placeholder="you@example.com"
          />
          {emailError && (
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: '#D32F2F',
                marginTop: '4px'
              }}
            >
              {emailError}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '8px' }}>
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
                border: passwordError ? '2px solid #D32F2F' : focusedField === 'password' ? '2px solid #2E5077' : '1px solid #E0E0E0',
                padding: '0 48px 0 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.2s ease',
                cursor: isDisabled ? 'not-allowed' : 'text'
              }}
              placeholder="Enter your password"
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
                color: '#D32F2F',
                marginTop: '4px'
              }}
            >
              {passwordError}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={onForgotPassword}
            disabled={isDisabled}
            style={{
              background: 'none',
              border: 'none',
              color: isDisabled ? '#999999' : '#2E5077',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
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
            Forgot password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={!isValid || isDisabled}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: isValid && !isDisabled ? '#2E5077' : '#E0E0E0',
            color: isValid && !isDisabled ? '#FFFFFF' : '#999999',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isValid && !isDisabled ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isLoading ? (
            <>
              <span>Signing in…</span>
              <Spinner />
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Divider */}
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

      {/* Social Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <button
          onClick={onGoogleLogin}
          disabled={isDisabled}
          style={{
            flex: 1,
            height: '48px',
            borderRadius: '8px',
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
        >
          <GoogleIcon />
        </button>
        <button
          onClick={onAppleLogin}
          disabled={isDisabled}
          style={{
            flex: 1,
            height: '48px',
            borderRadius: '8px',
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
        >
          <AppleIcon />
        </button>
      </div>

      {/* 
        NOTE FOR DEVELOPERS:
        Replace console.log with real Supabase/Auth.js provider logic during integration.
        Example: supabase.auth.signInWithOAuth({ provider: 'google' })
      */}

      {/* Footer */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#666666' }}>
          New here?{' '}
          <button
            onClick={onCreateAccount}
            disabled={isDisabled}
            style={{
              background: 'none',
              border: 'none',
              color: isDisabled ? '#999999' : '#2E5077',
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
            Create an account
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
function Spinner() {
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
      <circle cx="10" cy="10" r="8" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M10 2a8 8 0 0 1 8 8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
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
