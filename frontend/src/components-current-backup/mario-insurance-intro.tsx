'use client'
import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';

interface InsuranceIntroProps {
  onAddInsurance: () => void;
  onSkip: () => void;
  isDesktop?: boolean;
}

export function MarioInsuranceIntro({
  onAddInsurance,
  onSkip,
  isDesktop = false
}: InsuranceIntroProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FDFCFA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isDesktop ? '48px' : '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isDesktop ? '560px' : '400px',
          textAlign: 'center'
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '40px',
            backgroundColor: 'rgba(46, 80, 119, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px'
          }}
        >
          <Shield size={40} color="#2E5077" strokeWidth={2} />
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isDesktop ? '32px' : '28px',
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: '16px',
            lineHeight: 1.2
          }}
        >
          Let's personalize your savings.
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: isDesktop ? '18px' : '16px',
            fontWeight: 400,
            color: '#666666',
            marginBottom: '40px',
            lineHeight: 1.6
          }}
        >
          Add your insurance to see your exact prices.
        </p>

        {/* Primary CTA */}
        <button
          onClick={onAddInsurance}
          style={{
            width: '100%',
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
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2A4A6B';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2E5077';
          }}
          aria-label="Add insurance to see personalized prices"
        >
          Add Insurance
          <ChevronRight size={20} />
        </button>

        {/* Secondary text link */}
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            color: '#666666',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '8px',
            marginBottom: '40px',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
            e.currentTarget.style.color = '#2E5077';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
            e.currentTarget.style.color = '#666666';
          }}
          aria-label="Skip insurance setup for now"
        >
          Skip for now
        </button>

        {/* Reassurance text */}
        <div
          style={{
            padding: '16px',
            backgroundColor: 'rgba(121, 215, 190, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(121, 215, 190, 0.3)'
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#1B5E20',
              margin: 0,
              lineHeight: 1.5
            }}
          >
            🔒 Secure & HIPAA-compliant. You can add this anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
