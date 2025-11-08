'use client'
import React, { useEffect, useState } from 'react';
import { Gift, Check, X, TrendingUp, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'points';
  title: string;
  description?: string;
  points?: number;
  savings?: number;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  showPointsToast: (points: number, action: string, savings?: number) => void;
  showSuccessToast: (title: string, description?: string) => void;
  showErrorToast: (title: string, description?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    const duration = toast.duration || (toast.type === 'points' ? 6000 : 4000);
    setTimeout(() => removeToast(id), duration);
  };

  const showPointsToast = (points: number, action: string, savings?: number) => {
    showToast({
      type: 'points',
      title: `+${points} MarioPoints earned!`,
      description: action + (savings ? ` • You saved $${savings}` : ''),
      points,
      savings,
      duration: 6000,
      action: {
        label: 'View Rewards',
        onClick: () => {
          // Navigate to rewards page
          console.log('Navigate to rewards');
        }
      }
    });
  };

  const showSuccessToast = (title: string, description?: string) => {
    showToast({
      type: 'success',
      title,
      description
    });
  };

  const showErrorToast = (title: string, description?: string) => {
    showToast({
      type: 'error',
      title,
      description
    });
  };

  return (
    <ToastContext.Provider value={{ 
      showToast, 
      showPointsToast, 
      showSuccessToast, 
      showErrorToast 
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastContainerProps {
  toasts: ToastNotification[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full md:bottom-4 md:right-4">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ToastNotification;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'error':
        return <X className="h-5 w-5 text-red-600" />;
      case 'points':
        return <Gift className="h-5 w-5 text-accent" />;
      default:
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'points':
        return 'bg-accent/10 border-accent/20';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card 
      className={`
        p-4 shadow-lg transition-all duration-300 cursor-pointer
        ${getBackgroundColor()}
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'scale-95' : 'scale-100'}
      `}
      onClick={toast.action ? toast.action.onClick : handleRemove}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-xs text-muted-foreground mt-1">
              {toast.description}
            </p>
          )}
          
          {toast.type === 'points' && toast.savings && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">${toast.savings} saved</span>
              </div>
              <div className="flex items-center gap-1 text-accent">
                <Award className="h-3 w-3" />
                <span className="text-xs font-medium">+{toast.points} pts</span>
              </div>
            </div>
          )}
          
          {toast.action && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 h-6 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                toast.action!.onClick();
                handleRemove();
              }}
            >
              {toast.action.label}
            </Button>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}

// Confetti effect for major milestones
export function ConfettiEffect({ trigger, duration = 3000 }: { trigger: boolean; duration?: number }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      setTimeout(() => setIsActive(false), duration);
    }
  }, [trigger, duration]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 animate-confetti"
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
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

// Add confetti animation to globals.css:
/*
@keyframes confetti {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.animate-confetti {
  animation: confetti linear forwards;
}
*/