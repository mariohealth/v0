// Re-export API types for convenience
export type {
  SearchParams,
  Provider,
  Review,
  TimeSlot,
  BookingData,
  SearchResponse,
  BookingResponse,
  ApiError,
} from './api';

// Additional types for UI components
export interface FilterState {
  priceRange: [number, number];
  types: string[];
  minRating: number;
}

export interface SortOption {
  value: 'price' | 'rating' | 'distance';
  label: string;
}

export interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string) => string | null;
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface UserPreferences {
  defaultLocation?: string;
  preferredInsuranceProvider?: string;
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
