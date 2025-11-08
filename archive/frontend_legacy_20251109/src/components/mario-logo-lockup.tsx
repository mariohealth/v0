import React from 'react';

interface MarioLogoLockupProps {
  size?: 'mobile' | 'desktop';
  variant?: 'default' | 'white';
  className?: string;
}

export function MarioLogoLockup({ 
  size = 'mobile', 
  variant = 'default',
  className = '' 
}: MarioLogoLockupProps) {
  const iconSize = size === 'mobile' ? 48 : 64;
  const wordmarkSize = size === 'mobile' ? 22 : 26;
  const gap = 8;
  
  const primaryBlue = '#2E5077';
  const color = variant === 'white' ? '#FFFFFF' : primaryBlue;
  
  return (
    <div 
      className={`inline-flex items-center ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {/* Circle "m" icon */}
      <div
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <span
          style={{
            fontFamily: 'Montserrat, Inter, system-ui, sans-serif',
            fontSize: `${iconSize * 0.5}px`,
            fontWeight: 700,
            color: variant === 'white' ? primaryBlue : '#FFFFFF',
            lineHeight: 1,
            marginTop: '-2px'
          }}
        >
          m
        </span>
      </div>
      
      {/* Wordmark "mario" */}
      <span
        style={{
          fontFamily: 'Montserrat, Inter, system-ui, sans-serif',
          fontSize: `${wordmarkSize}px`,
          fontWeight: 600,
          color: color,
          lineHeight: 1,
          letterSpacing: '-0.02em'
        }}
      >
        mario
      </span>
    </div>
  );
}
