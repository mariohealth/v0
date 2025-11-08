'use client'
import React, { useState, useEffect } from 'react';
import { Shield, X, CheckCircle, ChevronRight } from 'lucide-react';

type BannerVariant = 'default' | 'dismissed' | 'completed';

interface InsuranceBannerProps {
  variant?: BannerVariant;
  onAddInsurance: () => void;
  onRemindLater: () => void;
  autoFadeOnComplete?: boolean;
  autoFadeDelay?: number;
}

export function MarioInsuranceBanner({
  variant = 'default',
  onAddInsurance,
  onRemindLater,
  autoFadeOnComplete = true,
  autoFadeDelay = 2000
}: InsuranceBannerProps) {
  const [isVisible, setIsVisible] = useState(variant !== 'dismissed');
  const [currentVariant, setCurrentVariant] = useState(variant);

  useEffect(() => {
    setCurrentVariant(variant);
    
    if (variant === 'completed' && autoFadeOnComplete) {
      setTimeout(() => {
        setIsVisible(false);
      }, autoFadeDelay);
    } else if (variant === 'default') {
      setIsVisible(true);
    }
  }, [variant, autoFadeOnComplete, autoFadeDelay]);

  const handleRemindLater = () => {
    console.log('Remind me later clicked');
    setIsVisible(false);
    onRemindLater();
  };

  if (!isVisible || currentVariant === 'dismissed') {
    return null;
  }

  // Completed variant
  if (currentVariant === 'completed') {
    return (
      <div
        style={{
          backgroundColor: '#E8F5E9',
          border: '1px solid #79D7BE',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideDown 300ms ease-out',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 300ms ease-out'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            backgroundColor: '#79D7BE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <CheckCircle size={24} color="#FFFFFF" strokeWidth={2.5} />
        </div>

        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: '#1B5E20',
              margin: 0
            }}
          >
            Insurance added — prices are now personalized.
          </p>
        </div>

        <style>
          {`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // Default variant
  return (
    <div
      style={{
        backgroundColor: '#E6F7F6',
        border: '1px solid rgba(77, 161, 169, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideDown 300ms ease-out'
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '20px',
          backgroundColor: 'rgba(77, 161, 169, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Shield size={24} color="#4DA1A9" strokeWidth={2} />
      </div>

      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#1A1A1A',
            margin: 0,
            marginBottom: '4px'
          }}
        >
          Add your insurance to see your exact prices.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
          <button
            onClick={onAddInsurance}
            style={{
              background: 'none',
              border: 'none',
              color: '#2E5077',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
            aria-label="Add insurance"
          >
            Add Insurance
            <ChevronRight size={16} />
          </button>

          <button
            onClick={handleRemindLater}
            style={{
              background: 'none',
              border: 'none',
              color: '#666666',
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
            aria-label="Remind me later"
          >
            Remind me later
          </button>
        </div>
      </div>

      <button
        onClick={handleRemindLater}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label="Dismiss insurance reminder"
      >
        <X size={20} color="#666666" />
      </button>

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
