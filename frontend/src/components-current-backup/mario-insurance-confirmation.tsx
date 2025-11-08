'use client'
import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader } from 'lucide-react';

interface InsuranceConfirmationProps {
  onViewPrices: () => void;
  autoRedirect?: boolean;
  autoRedirectDelay?: number;
}

export function MarioInsuranceConfirmation({
  onViewPrices,
  autoRedirect = true,
  autoRedirectDelay = 1500
}: InsuranceConfirmationProps) {
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animate checkmark in
    setTimeout(() => setShowCheckmark(true), 300);
    
    // Show button after checkmark
    setTimeout(() => setShowButton(true), 800);

    // Auto-redirect if enabled
    if (autoRedirect) {
      setTimeout(() => {
        onViewPrices();
      }, autoRedirectDelay);
    }
  }, [autoRedirect, autoRedirectDelay, onViewPrices]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FDFCFA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          textAlign: 'center'
        }}
      >
        {/* Animated Checkmark */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            backgroundColor: '#E8F5E9',
            border: '4px solid #79D7BE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            transform: showCheckmark ? 'scale(1)' : 'scale(0)',
            opacity: showCheckmark ? 1 : 0,
            transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <CheckCircle size={64} color="#79D7BE" strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '28px',
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: '16px',
            lineHeight: 1.2,
            opacity: showCheckmark ? 1 : 0,
            transform: showCheckmark ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 400ms ease-out 200ms'
          }}
        >
          Insurance uploaded — we're checking your coverage.
        </h1>

        {/* Processing indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '40px',
            opacity: showCheckmark ? 1 : 0,
            transition: 'opacity 400ms ease-out 300ms'
          }}
        >
          <Loader
            size={16}
            color="#4DA1A9"
            style={{
              animation: 'spin 1s linear infinite'
            }}
          />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#666666'
            }}
          >
            Processing your information...
          </span>
        </div>

        {/* Button (with delayed appearance) */}
        {showButton && (
          <button
            onClick={onViewPrices}
            style={{
              width: '100%',
              maxWidth: '320px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#2E5077',
              color: '#FFFFFF',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: showButton ? 1 : 0,
              transform: showButton ? 'translateY(0)' : 'translateY(20px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2A4A6B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2E5077';
            }}
            aria-label="View prices with insurance"
          >
            View prices with insurance
          </button>
        )}

        {/* Auto-redirect hint */}
        {autoRedirect && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              color: '#999999',
              marginTop: '16px',
              opacity: showButton ? 1 : 0,
              transition: 'opacity 400ms ease-out 600ms'
            }}
          >
            Redirecting automatically...
          </p>
        )}

        {/* Inline spinner animation */}
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}
