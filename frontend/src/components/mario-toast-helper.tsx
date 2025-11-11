'use client'
/**
 * Mario Health Toast Notification Helper
 * 
 * Pre-configured toast variants that automatically position above bottom nav
 * with proper safe area spacing for mobile devices.
 * 
 * Usage:
 * import { MarioToast } from './components/mario-toast-helper';
 * 
 * MarioToast.success('Appointment added to calendar');
 * MarioToast.error('Failed to load data');
 * MarioToast.info('Your appointment is tomorrow');
 * MarioToast.reward(150, 'Appointment completed');
 */

import { toast } from 'sonner';
import { CheckCircle, XCircle, Info, Gift, AlertCircle, Calendar, Clock, Heart } from 'lucide-react';

export const MarioToast = {
  /**
   * Success toast with green accent
   * @param title - Main message
   * @param description - Optional secondary text
   */
  success: (title: string, description?: string) => {
    return toast.success(title, {
      description,
      icon: <CheckCircle className="w-5 h-5" />,
      duration: 4000,
      className: 'mario-toast',
    });
  },

  /**
   * Error toast with red accent
   * @param title - Error message
   * @param description - Optional error details
   */
  error: (title: string, description?: string) => {
    return toast.error(title, {
      description,
      icon: <XCircle className="w-5 h-5" />,
      duration: 4000,
      className: 'mario-toast',
    });
  },

  /**
   * Info toast with blue accent
   * @param title - Information message
   * @param description - Optional details
   */
  info: (title: string, description?: string) => {
    return toast.info(title, {
      description,
      icon: <Info className="w-5 h-5" />,
      duration: 4000,
      className: 'mario-toast',
    });
  },

  /**
   * Warning toast with amber accent
   * @param title - Warning message
   * @param description - Optional warning details
   */
  warning: (title: string, description?: string) => {
    return toast(title, {
      description,
      icon: <AlertCircle className="w-5 h-5" style={{ color: '#FFA726' }} />,
      duration: 4000,
      className: 'mario-toast',
      style: {
        borderLeft: '4px solid #FFA726',
      },
    });
  },

  /**
   * Reward/MarioPoints toast with teal accent and gift icon
   * @param points - Number of points earned
   * @param action - Action that earned points
   * @param savings - Optional savings amount
   */
  reward: (points: number, action: string, savings?: number) => {
    const description = savings 
      ? `${action} • You saved $${savings}`
      : action;

    return toast(`+${points} MarioPoints earned!`, {
      description,
      icon: <Gift className="w-5 h-5" style={{ color: '#4DA1A9' }} />,
      duration: 6000,
      className: 'mario-toast',
      style: {
        borderLeft: '4px solid #4DA1A9',
      },
    });
  },

  /**
   * Appointment-related toast
   * @param title - Appointment message
   * @param description - Optional appointment details
   */
  appointment: (title: string, description?: string) => {
    return toast(title, {
      description,
      icon: <Calendar className="w-5 h-5" style={{ color: '#4DA1A9' }} />,
      duration: 4000,
      className: 'mario-toast',
      style: {
        borderLeft: '4px solid #4DA1A9',
      },
    });
  },

  /**
   * Time-sensitive toast (running late, reminder, etc.)
   * @param title - Time-related message
   * @param description - Optional time details
   */
  time: (title: string, description?: string) => {
    return toast(title, {
      description,
      icon: <Clock className="w-5 h-5" style={{ color: '#4DA1A9' }} />,
      duration: 4000,
      className: 'mario-toast',
      style: {
        borderLeft: '4px solid #4DA1A9',
      },
    });
  },

  /**
   * Health/wellness toast
   * @param title - Health message
   * @param description - Optional health details
   */
  health: (title: string, description?: string) => {
    return toast(title, {
      description,
      icon: <Heart className="w-5 h-5" style={{ color: '#79D7BE' }} />,
      duration: 4000,
      className: 'mario-toast',
      style: {
        borderLeft: '4px solid #79D7BE',
      },
    });
  },

  /**
   * Custom toast with manual configuration
   * @param title - Message
   * @param options - Toast options
   */
  custom: (title: string, options?: {
    description?: string;
    icon?: React.ReactNode;
    duration?: number;
    accentColor?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  }) => {
    return toast(title, {
      description: options?.description,
      icon: options?.icon,
      duration: options?.duration || 4000,
      className: 'mario-toast',
      style: options?.accentColor ? {
        borderLeft: `4px solid ${options.accentColor}`,
      } : undefined,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  /**
   * Promise toast for async operations
   * @param promise - Promise to track
   * @param messages - Messages for each state
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      className: 'mario-toast',
    });
  },

  /**
   * Dismiss a specific toast
   * @param toastId - ID returned from toast function
   */
  dismiss: (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },
};

/**
 * Pre-configured toast messages for common actions
 */
export const MarioToastMessages = {
  // Authentication
  LOGIN_SUCCESS: () => MarioToast.success('Welcome back!', 'Successfully signed in'),
  LOGOUT_SUCCESS: () => MarioToast.success('Signed out', 'See you next time!'),
  BIOMETRIC_SUCCESS: () => MarioToast.success('Biometric authentication successful'),
  
  // Appointments
  APPOINTMENT_ADDED_TO_CALENDAR: () => MarioToast.appointment('Added to Calendar', 'Appointment saved to your calendar'),
  APPOINTMENT_RESCHEDULED: () => MarioToast.appointment('Reschedule request sent', "We'll confirm within 24-48 hours"),
  APPOINTMENT_CANCELLED: () => MarioToast.success('Appointment canceled', 'No fees charged'),
  CLINIC_NOTIFIED_LATE: (minutes: string) => MarioToast.time('Clinic notified', `They know you'll be ${minutes} minutes late`),
  
  // MarioPoints
  POINTS_EARNED: (points: number, action: string) => MarioToast.reward(points, action),
  POINTS_EARNED_WITH_SAVINGS: (points: number, action: string, savings: number) => 
    MarioToast.reward(points, action, savings),
  
  // Insurance
  INSURANCE_UPLOADED: () => MarioToast.success('Insurance card uploaded', 'Processing verification'),
  INSURANCE_VERIFIED: () => MarioToast.success('Insurance verified', 'Your coverage is active'),
  
  // Requests
  REQUEST_SENT: () => MarioToast.success('Request sent', 'Our team will follow up soon'),
  BENEFITS_TEAM_NOTIFIED: () => MarioToast.info('Request sent to benefits team', "You'll get a reply within 1-2 business days"),
  
  // Errors
  NETWORK_ERROR: () => MarioToast.error('Connection error', 'Please check your internet connection'),
  GENERIC_ERROR: () => MarioToast.error('Something went wrong', 'Please try again'),
  
  // Loading states
  LOADING_APPOINTMENT: () => MarioToast.info('Loading appointment details...'),
  LOADING_PROVIDER: () => MarioToast.info('Loading provider information...'),
};

export default MarioToast;
