import { Check, Clock, X } from 'lucide-react';
import { cn } from './ui/utils';

export type StatusType = 'confirmed' | 'pending' | 'rejected' | 'paid' | 'denied' | 'completed' | 'in-progress';
export type StatusSize = 'small' | 'medium' | 'large';

interface StatusButtonProps {
  status: StatusType;
  size?: StatusSize;
  disabled?: boolean;
  className?: string;
}

const statusConfig = {
  confirmed: {
    label: 'Confirmed',
    icon: Check,
    colors: {
      bg: '#79D7BE',
      text: '#FFFFFF',
      disabledBg: '#79D7BE50',
      disabledText: '#79D7BE80'
    }
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    colors: {
      bg: '#4DA1A9',
      text: '#FFFFFF',
      disabledBg: '#4DA1A950',
      disabledText: '#4DA1A980'
    }
  },
  rejected: {
    label: 'Rejected',
    icon: X,
    colors: {
      bg: '#E53E3E',
      text: '#FFFFFF',
      disabledBg: '#E53E3E50',
      disabledText: '#E53E3E80'
    }
  },
  paid: {
    label: 'Paid',
    icon: Check,
    colors: {
      bg: '#00AA66',
      text: '#FFFFFF',
      disabledBg: '#00AA6650',
      disabledText: '#00AA6680'
    }
  },
  denied: {
    label: 'Denied',
    icon: X,
    colors: {
      bg: '#D32F2F',
      text: '#FFFFFF',
      disabledBg: '#D32F2F50',
      disabledText: '#D32F2F80'
    }
  },
  completed: {
    label: 'Completed',
    icon: Check,
    colors: {
      bg: '#79D7BE',
      text: '#FFFFFF',
      disabledBg: '#79D7BE50',
      disabledText: '#79D7BE80'
    }
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    colors: {
      bg: '#4DA1A9',
      text: '#FFFFFF',
      disabledBg: '#4DA1A950',
      disabledText: '#4DA1A980'
    }
  }
};

const sizeConfig = {
  small: {
    height: '24px',
    padding: '4px 8px',
    fontSize: '12px',
    iconSize: '12px',
    gap: '4px'
  },
  medium: {
    height: '32px',
    padding: '6px 12px',
    fontSize: '14px',
    iconSize: '14px',
    gap: '6px'
  },
  large: {
    height: '40px',
    padding: '8px 16px',
    fontSize: '16px',
    iconSize: '16px',
    gap: '8px'
  }
};

export function MarioStatusButton({ 
  status, 
  size = 'medium', 
  disabled = false,
  className 
}: StatusButtonProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const IconComponent = config.icon;

  const buttonStyle = {
    backgroundColor: disabled ? config.colors.disabledBg : config.colors.bg,
    color: disabled ? config.colors.disabledText : config.colors.text,
    height: sizeStyles.height,
    padding: sizeStyles.padding,
    fontSize: sizeStyles.fontSize,
    gap: sizeStyles.gap,
    border: 'none',
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    fontFamily: 'Inter, sans-serif',
    cursor: disabled ? 'not-allowed' : 'default',
    opacity: disabled ? 0.7 : 1,
    transition: 'all 200ms ease-in-out'
  };

  return (
    <div
      className={cn('inline-flex items-center', className)}
      style={buttonStyle}
    >
      <IconComponent 
        style={{ 
          width: sizeStyles.iconSize, 
          height: sizeStyles.iconSize,
          flexShrink: 0
        }} 
      />
      <span style={{ whiteSpace: 'nowrap' }}>
        {config.label}
      </span>
    </div>
  );
}

// Convenience components for specific statuses
export function ConfirmedStatus({ size = 'medium', disabled = false, className }: Omit<StatusButtonProps, 'status'>) {
  return <MarioStatusButton status="confirmed" size={size} disabled={disabled} className={className} />;
}

export function PendingStatus({ size = 'medium', disabled = false, className }: Omit<StatusButtonProps, 'status'>) {
  return <MarioStatusButton status="pending" size={size} disabled={disabled} className={className} />;
}

export function RejectedStatus({ size = 'medium', disabled = false, className }: Omit<StatusButtonProps, 'status'>) {
  return <MarioStatusButton status="rejected" size={size} disabled={disabled} className={className} />;
}

export function PaidStatus({ size = 'medium', disabled = false, className }: Omit<StatusButtonProps, 'status'>) {
  return <MarioStatusButton status="paid" size={size} disabled={disabled} className={className} />;
}

export function DeniedStatus({ size = 'medium', disabled = false, className }: Omit<StatusButtonProps, 'status'>) {
  return <MarioStatusButton status="denied" size={size} disabled={disabled} className={className} />;
}

export function CompletedStatus({ size = 'medium', disabled = false, className }: Omit<StatusButtonProps, 'status'>) {
  return <MarioStatusButton status="completed" size={size} disabled={disabled} className={className} />;
}

export function InProgressStatus({ size = 'medium', disabled = false, className }: Omit<StatusButtonProps, 'status'>) {
  return <MarioStatusButton status="in-progress" size={size} disabled={disabled} className={className} />;
}