'use client'
import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { FeatureGate } from './ui/FeatureGate';

interface InsuranceUploadProps {
  open: boolean;
  onClose: () => void;
  onContinue: (frontImage: File | null, backImage: File | null) => void;
  onSkip: () => void;
}

type CardStatus = 'empty' | 'uploading' | 'valid' | 'invalid';

interface CardState {
  front: {
    file: File | null;
    preview: string | null;
    status: CardStatus;
  };
  back: {
    file: File | null;
    preview: string | null;
    status: CardStatus;
  };
}

export function MarioInsuranceUpload({
  open,
  onClose,
  onContinue,
  onSkip
}: InsuranceUploadProps) {
  const [cardState, setCardState] = useState<CardState>({
    front: { file: null, preview: null, status: 'empty' },
    back: { file: null, preview: null, status: 'empty' }
  });

  const handleFileSelect = (side: 'front' | 'back', file: File) => {
    console.log(`Insurance ${side} image uploaded:`, file.name);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCardState(prev => ({
        ...prev,
        [side]: {
          file,
          preview: reader.result as string,
          status: 'uploading' as CardStatus
        }
      }));

      // Simulate processing
      setTimeout(() => {
        setCardState(prev => ({
          ...prev,
          [side]: {
            ...prev[side],
            status: 'valid' as CardStatus
          }
        }));
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (side: 'front' | 'back') => {
    console.log(`Remove ${side} insurance image`);
    setCardState(prev => ({
      ...prev,
      [side]: { file: null, preview: null, status: 'empty' }
    }));
  };

  const handleContinue = () => {
    console.log('Insurance submission started');
    onContinue(cardState.front.file, cardState.back.file);
  };

  const handleSkip = () => {
    console.log('Skip insurance upload');
    onSkip();
  };

  const isValid = cardState.front.status === 'valid' && cardState.back.status === 'valid';
  const hasAnyCard = cardState.front.file || cardState.back.file;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{
          maxWidth: '480px',
          padding: '32px 24px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px'
        }}
      >
        <FeatureGate feature="ENABLE_INSURANCE_OCR" showOverlay>
          {/* Header with close button */}
          <DialogHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <DialogTitle
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  margin: 0
                }}
              >
                Upload insurance card
              </DialogTitle>
              <button
                onClick={handleSkip}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666666',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
                aria-label="Skip insurance upload"
              >
                Skip
              </button>
            </div>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#666666',
                margin: 0
              }}
            >
              Front and back help us verify coverage.
            </p>
          </DialogHeader>

          {/* Card Upload Areas */}
          <div style={{ marginTop: '24px', marginBottom: '24px' }}>
            <CardUploadArea
              label="Front of card"
              cardData={cardState.front}
              onFileSelect={(file) => handleFileSelect('front', file)}
              onRemove={() => handleRemove('front')}
            />

            <div style={{ height: '16px' }} />

            <CardUploadArea
              label="Back of card"
              cardData={cardState.back}
              onFileSelect={(file) => handleFileSelect('back', file)}
              onRemove={() => handleRemove('back')}
            />
          </div>

          {/* Reassurance text */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(121, 215, 190, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(121, 215, 190, 0.3)',
              marginBottom: '24px'
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                fontWeight: 400,
                color: '#1B5E20',
                margin: 0,
                lineHeight: 1.5
              }}
            >
              🔒 We never share your data. Encrypted & HIPAA-compliant.
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!hasAnyCard}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: isValid ? '#2E5077' : hasAnyCard ? '#4DA1A9' : '#E0E0E0',
              color: hasAnyCard ? '#FFFFFF' : '#999999',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              cursor: hasAnyCard ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (hasAnyCard) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              if (hasAnyCard) {
                e.currentTarget.style.opacity = '1';
              }
            }}
            aria-label="Continue with insurance upload"
          >
            Continue
          </button>
        </FeatureGate>
      </DialogContent>
    </Dialog>
  );
}

interface CardUploadAreaProps {
  label: string;
  cardData: CardState['front'];
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

function CardUploadArea({ label, cardData, onFileSelect, onRemove }: CardUploadAreaProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const getStatusChip = () => {
    switch (cardData.status) {
      case 'uploading':
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: '#FFF3E0',
              color: '#E65100',
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            <AlertCircle size={14} />
            Processing
          </div>
        );
      case 'valid':
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: '#E8F5E9',
              color: '#2E7D32',
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            <Check size={14} />
            Valid
          </div>
        );
      case 'invalid':
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: '#FDEDED',
              color: '#B00020',
              fontSize: '12px',
              fontWeight: 500
            }}
          >
            <AlertCircle size={14} />
            Invalid
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1A1A1A'
          }}
        >
          {label}
        </label>
        {getStatusChip()}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-label={`Upload ${label}`}
      />

      {cardData.preview ? (
        // Preview with replace/remove
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '140px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid #E0E0E0',
            backgroundColor: '#F7F7F7'
          }}
        >
          <img
            src={cardData.preview}
            alt={label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Overlay controls */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: 0,
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          >
            <button
              onClick={handleClick}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                color: '#2E5077',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              aria-label={`Replace ${label}`}
            >
              Replace
            </button>
            <button
              onClick={onRemove}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                border: '1px solid #FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              aria-label={`Remove ${label}`}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        // Empty upload area
        <button
          onClick={handleClick}
          style={{
            width: '100%',
            height: '140px',
            borderRadius: '8px',
            border: '2px dashed #E0E0E0',
            backgroundColor: '#FAFAFA',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2E5077';
            e.currentTarget.style.backgroundColor = 'rgba(46, 80, 119, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E0E0E0';
            e.currentTarget.style.backgroundColor = '#FAFAFA';
          }}
          aria-label={`Upload ${label}`}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '24px',
              backgroundColor: 'rgba(46, 80, 119, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Upload size={24} color="#2E5077" />
          </div>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#2E5077'
            }}
          >
            Upload / Take Photo
          </span>
        </button>
      )}
    </div>
  );
}
