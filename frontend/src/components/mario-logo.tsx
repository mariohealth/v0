import { cn } from './ui/utils';
import marioLogo from 'figma:asset/14dd42739444e8035ce3f11f46006e30fca6c4a7.png';

interface MarioLogoProps {
  variant?: 'full' | 'icon' | 'reversed' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  employerLogo?: string;
  employerName?: string;
}

export function MarioLogo({ 
  variant = 'full', 
  size = 'md', 
  className = '',
  employerLogo,
  employerName 
}: MarioLogoProps) {
  const sizeStyles = {
    sm: { fontSize: '1.25rem', minWidth: '60px', iconSize: '3.6rem' }, // 20px text, 57.6px icon (60% + 50% bigger)
    md: { fontSize: '1.5rem', minWidth: '80px', iconSize: '4.8rem' },   // 24px text, 76.8px icon (60% + 50% bigger)
    lg: { fontSize: '2rem', minWidth: '120px', iconSize: '6rem' }       // 32px text, 96px icon (60% + 50% bigger)
  };

  const colorStyles = {
    full: 'text-[#2E5077]',
    icon: 'text-[#2E5077]',
    reversed: 'text-white',
    monochrome: 'text-current'
  };

  const style = sizeStyles[size];
  
  // Debug: Let's see what props we're getting
  const shouldShowWordmark = variant !== 'icon';
  console.log('🔍 MARIO LOGO DEBUG - variant:', variant, 'size:', size, 'should show wordmark:', shouldShowWordmark);
  
  // Also alert to make sure we see it
  if (variant === 'full') {
    console.log('🎯 DESKTOP LOGO RENDERING - should show wordmark!');
  }
  
  return (
    <div className={cn('flex items-center', className)} style={{ gap: '0px' }}>
      {/* Mario M Logo */}
      <div 
        className="flex-shrink-0"
        style={{
          width: style.iconSize,
          height: style.iconSize,
          marginLeft: '-10px',
        }}
      >
        <img 
          src={marioLogo} 
          alt="Mario Health"
          className="w-full h-full object-contain"
          style={{
            width: style.iconSize,
            height: style.iconSize,
          }}
        />
      </div>
      
      {/* Mario Wordmark - Show for all variants except icon */}
      {shouldShowWordmark && (
        <div 
          className="font-semibold tracking-tight select-none -ml-1"
          style={{
            fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            fontSize: style.fontSize,
            minWidth: style.minWidth,
            fontWeight: 600,
            color: variant === 'reversed' ? '#ffffff' : '#2E5077',
            display: 'flex',
            alignItems: 'center',

          }}
        >
          mario
        </div>
      )}
      
      {/* Employer Co-Branding */}
      {(employerLogo || employerName) && (
        <>
          <div className="w-px h-6 bg-border mx-2" />
          <div className="flex items-center gap-2">
            {employerLogo && (
              <img 
                src={employerLogo} 
                alt={employerName || 'Employer'} 
                className="h-6 w-auto"
              />
            )}
            {employerName && !employerLogo && (
              <span className="text-sm font-medium text-muted-foreground">
                {employerName}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}