'use client'
import React, { useState } from 'react';
import { MarioLogoLockup } from './mario-logo-lockup';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface EmailSignUpProps {
  onSignUp?: (fullName: string, email: string, password: string) => void;
  onBackToSignIn?: () => void;
  isDesktop?: boolean;
}

export function MarioAuthEmailSignUp({
  onSignUp,
  onBackToSignIn,
  isDesktop = false
}: EmailSignUpProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string): number => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  // Validation functions
  const validateFullName = (value: string) => {
    if (!value.trim()) return 'Full name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    return '';
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  };

  // Change handlers
  const handleFullNameChange = (value: string) => {
    setFullName(value);
    if (fullNameTouched) setFullNameError(validateFullName(value));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailTouched) setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordTouched) setPasswordError(validatePassword(value));
    if (confirmPasswordTouched && confirmPassword) {
      setConfirmPasswordError(value === confirmPassword ? '' : 'Passwords do not match');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (confirmPasswordTouched) setConfirmPasswordError(validateConfirmPassword(value));
  };

  // Blur handlers
  const handleFullNameBlur = () => {
    setFullNameTouched(true);
    setFullNameError(validateFullName(fullName));
    setFocusedField(null);
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

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
    setConfirmPasswordError(validateConfirmPassword(confirmPassword));
    setFocusedField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFullNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    
    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword);
    
    setFullNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmErr);
    
    if (!nameErr && !emailErr && !passwordErr && !confirmErr) {
      setLoading(true);
      onSignUp?.(fullName, email, password);
    }
  };

  const isValid = fullName && email && password && confirmPassword && 
                  !fullNameError && !emailError && !passwordError && !confirmPasswordError;

  // Desktop variant
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
                Start saving today
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
                Join thousands of members already saving on healthcare and earning rewards.
              </p>
            </div>
          </div>
          
          <div style={{ position: 'absolute', top: '32px', left: '32px' }}>
            <MarioLogoLockup size="desktop" />
          </div>
        </div>

        {/* Right Panel - Form Card */}
        <div className="flex items-center justify-center" style={{ width: '50%', padding: '32px' }}>
          <SignUpCard
            fullName={fullName}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            fullNameError={fullNameError}
            emailError={emailError}
            passwordError={passwordError}
            confirmPasswordError={confirmPasswordError}
            focusedField={focusedField}
            loading={loading}
            isValid={isValid}
            passwordStrength={passwordStrength}
            onFullNameChange={handleFullNameChange}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onConfirmPasswordChange={handleConfirmPasswordChange}
            onFullNameBlur={handleFullNameBlur}
            onEmailBlur={handleEmailBlur}
            onPasswordBlur={handlePasswordBlur}
            onConfirmPasswordBlur={handleConfirmPasswordBlur}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            onSubmit={handleSubmit}
            onBackToSignIn={onBackToSignIn}
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
      <SignUpCard
        fullName={fullName}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        fullNameError={fullNameError}
        emailError={emailError}
        passwordError={passwordError}
        confirmPasswordError={confirmPasswordError}
        focusedField={focusedField}
        loading={loading}
        isValid={isValid}
        passwordStrength={passwordStrength}
        onFullNameChange={handleFullNameChange}
        onEmailChange={handleEmailChange}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={handleConfirmPasswordChange}
        onFullNameBlur={handleFullNameBlur}
        onEmailBlur={handleEmailBlur}
        onPasswordBlur={handlePasswordBlur}
        onConfirmPasswordBlur={handleConfirmPasswordBlur}
        onTogglePassword={() => setShowPassword(!showPassword)}
        onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        onSubmit={handleSubmit}
        onBackToSignIn={onBackToSignIn}
        setFocusedField={setFocusedField}
        showLogo
      />
    </div>
  );
}

interface SignUpCardProps {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  fullNameError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  focusedField: string | null;
  loading: boolean;
  isValid: boolean;
  passwordStrength: number;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onFullNameBlur: () => void;
  onEmailBlur: () => void;
  onPasswordBlur: () => void;
  onConfirmPasswordBlur: () => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToSignIn?: () => void;
  setFocusedField: (field: string | null) => void;
  showLogo?: boolean;
}

function SignUpCard(props: SignUpCardProps) {
  const strengthColors = ['#D32F2F', '#FF9800', '#4DA1A9', '#2E5077'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '32px 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      {props.showLogo && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <MarioLogoLockup size="mobile" />
        </div>
      )}

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
        Use your email to get started.
      </p>

      <form onSubmit={props.onSubmit}>
        {/* Full Name */}
        <FormField
          id="fullName"
          label="Full Name"
          type="text"
          value={props.fullName}
          onChange={props.onFullNameChange}
          onFocus={() => props.setFocusedField('fullName')}
          onBlur={props.onFullNameBlur}
          error={props.fullNameError}
          isFocused={props.focusedField === 'fullName'}
          placeholder="John Doe"
        />

        {/* Email */}
        <FormField
          id="email"
          label="Email"
          type="email"
          value={props.email}
          onChange={props.onEmailChange}
          onFocus={() => props.setFocusedField('email')}
          onBlur={props.onEmailBlur}
          error={props.emailError}
          isFocused={props.focusedField === 'email'}
          placeholder="you@example.com"
        />

        {/* Password */}
        <div style={{ marginBottom: '12px' }}>
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
              type={props.showPassword ? 'text' : 'password'}
              value={props.password}
              onChange={(e) => props.onPasswordChange(e.target.value)}
              onFocus={() => props.setFocusedField('password')}
              onBlur={props.onPasswordBlur}
              aria-invalid={!!props.passwordError}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '8px',
                border: props.passwordError ? '2px solid #D32F2F' : props.focusedField === 'password' ? '2px solid #2E5077' : '1px solid #E0E0E0',
                padding: '0 48px 0 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.2s ease'
              }}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={props.onTogglePassword}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {props.showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </button>
          </div>
          
          {/* Password Strength Meter */}
          {props.password && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: index < props.passwordStrength ? strengthColors[props.passwordStrength - 1] : '#E0E0E0',
                      transition: 'background-color 0.2s ease'
                    }}
                  />
                ))}
              </div>
              {props.passwordStrength > 0 && (
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: strengthColors[props.passwordStrength - 1],
                  marginTop: '4px'
                }}>
                  {strengthLabels[props.passwordStrength - 1]}
                </p>
              )}
            </div>
          )}
          
          {props.passwordError && (
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#D32F2F',
              marginTop: '4px'
            }}>
              {props.passwordError}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '24px' }}>
          <label
            htmlFor="confirmPassword"
            style={{
              display: 'block',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1A1A1A',
              marginBottom: '8px'
            }}
          >
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="confirmPassword"
              type={props.showConfirmPassword ? 'text' : 'password'}
              value={props.confirmPassword}
              onChange={(e) => props.onConfirmPasswordChange(e.target.value)}
              onFocus={() => props.setFocusedField('confirmPassword')}
              onBlur={props.onConfirmPasswordBlur}
              aria-invalid={!!props.confirmPasswordError}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '8px',
                border: props.confirmPasswordError ? '2px solid #D32F2F' : props.focusedField === 'confirmPassword' ? '2px solid #2E5077' : '1px solid #E0E0E0',
                padding: '0 48px 0 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.2s ease'
              }}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={props.onToggleConfirmPassword}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {props.showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </button>
          </div>
          {props.confirmPasswordError && (
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#D32F2F',
              marginTop: '4px'
            }}>
              {props.confirmPasswordError}
            </p>
          )}
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={!props.isValid || props.loading}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: props.isValid && !props.loading ? '#2E5077' : '#E0E0E0',
            color: props.isValid && !props.loading ? '#FFFFFF' : '#999999',
            border: 'none',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            cursor: props.isValid && !props.loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            marginBottom: '16px'
          }}
        >
          {props.loading ? 'Creating account…' : 'Continue'}
        </button>
      </form>

      {/* Back to Sign In */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={props.onBackToSignIn}
          style={{
            background: 'none',
            border: 'none',
            color: '#2E5077',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
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
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  error: string;
  isFocused: boolean;
  placeholder: string;
}

function FormField({ id, label, type, value, onChange, onFocus, onBlur, error, isFocused, placeholder }: FormFieldProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          color: '#1A1A1A',
          marginBottom: '8px'
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-invalid={!!error}
        style={{
          width: '100%',
          height: '48px',
          borderRadius: '8px',
          border: error ? '2px solid #D32F2F' : isFocused ? '2px solid #2E5077' : '1px solid #E0E0E0',
          padding: '0 16px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '16px',
          outline: 'none',
          transition: 'border 0.2s ease'
        }}
        placeholder={placeholder}
      />
      {error && (
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#D32F2F',
            marginTop: '4px'
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}