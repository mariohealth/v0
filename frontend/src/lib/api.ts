const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface SearchParams {
  procedure: string;
  location?: string;
  insuranceProvider?: string;
  maxDistance?: number;
  priceRange?: [number, number];
  minRating?: number;
  types?: string[];
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  address: string | {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  distance: string;
  priceRange: { min: number; max: number };
  acceptedInsurance: string[];
  phone?: string;
  website?: string;
  images?: string[];
  reviews?: Review[];
  availability?: string;
  badges?: string[];
  type?: string;
  neighborhood?: string;
  acceptsInsurance?: boolean;
  price: number;
  originalPrice?: number;
  negotiatedRate?: number;
  standardRate?: number;
  savingsPercent?: number;
  savings?: number;
  availableTimeSlots?: TimeSlot[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export interface BookingData {
  providerId: string;
  patientName: string;
  email: string;
  phone: string;
  preferredDate: string;
  insuranceProvider?: string;
  notes?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  memberId: string;
  reasonForVisit?: string;
}

export interface SearchResponse {
  providers: Provider[];
  totalCount: number;
  filters: {
    priceRange: [number, number];
    locations: string[];
    insuranceProviders: string[];
    specialties: string[];
  };
}

export interface BookingResponse {
  bookingId: string;
  confirmationNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  appointmentDate: string;
  appointmentTime: string;
  provider: Provider;
  patient: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async searchProviders(params: SearchParams): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();
    
    searchParams.append('procedure', params.procedure);
    if (params.location) searchParams.append('location', params.location);
    if (params.insuranceProvider) searchParams.append('insuranceProvider', params.insuranceProvider);
    if (params.maxDistance) searchParams.append('maxDistance', params.maxDistance.toString());
    if (params.priceRange) {
      searchParams.append('minPrice', params.priceRange[0].toString());
      searchParams.append('maxPrice', params.priceRange[1].toString());
    }
    if (params.minRating) searchParams.append('minRating', params.minRating.toString());
    if (params.types && params.types.length > 0) {
      searchParams.append('types', params.types.join(','));
    }

    return this.request<SearchResponse>(`/search?${searchParams.toString()}`);
  }

  async getProviderDetails(id: string): Promise<Provider> {
    return this.request<Provider>(`/providers/${id}`);
  }

  async createBooking(data: BookingData): Promise<BookingResponse> {
    return this.request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBookingDetails(bookingId: string): Promise<BookingResponse> {
    return this.request<BookingResponse>(`/bookings/${bookingId}`);
  }

  async cancelBooking(bookingId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/bookings/${bookingId}/cancel`, {
      method: 'DELETE',
    });
  }

  async getAvailableTimeSlots(providerId: string, date?: string): Promise<TimeSlot[]> {
    const params = date ? `?date=${date}` : '';
    return this.request<TimeSlot[]>(`/providers/${providerId}/time-slots${params}`);
  }

  async verifyInsurance(memberId: string, providerId: string): Promise<{
    verified: boolean;
    coverage: {
      copay?: number;
      deductible?: number;
      coinsurance?: number;
    };
  }> {
    return this.request(`/insurance/verify`, {
      method: 'POST',
      body: JSON.stringify({ memberId, providerId }),
    });
  }

  async getProcedures(query?: string): Promise<{
    procedures: Array<{
      id: string;
      name: string;
      category: string;
      description: string;
      averagePrice: number;
    }>;
  }> {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return this.request(`/procedures${params}`);
  }

  async getInsuranceProviders(): Promise<{
    providers: Array<{
      id: string;
      name: string;
      logo?: string;
    }>;
  }> {
    return this.request('/insurance/providers');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual functions for convenience
export const searchProviders = (params: SearchParams) => apiClient.searchProviders(params);
export const getProviderDetails = (id: string) => apiClient.getProviderDetails(id);
export const createBooking = (data: BookingData) => apiClient.createBooking(data);
export const getBookingDetails = (bookingId: string) => apiClient.getBookingDetails(bookingId);
export const cancelBooking = (bookingId: string) => apiClient.cancelBooking(bookingId);
export const getAvailableTimeSlots = (providerId: string, date?: string) => 
  apiClient.getAvailableTimeSlots(providerId, date);
export const verifyInsurance = (memberId: string, providerId: string) => 
  apiClient.verifyInsurance(memberId, providerId);
export const getProcedures = (query?: string) => apiClient.getProcedures(query);
export const getInsuranceProviders = () => apiClient.getInsuranceProviders();
