// API client that can switch between mock and real API
// Usage: Set NEXT_PUBLIC_USE_MOCK=true to use mock data

import { mockApi } from './mock-data';
import type { Category, Procedure, Provider } from './mock-data';
import { getAuthToken } from './auth-token';
import { API_BASE_URL } from './config';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            throw new Error('Mock API called but implementation missing');
        }

        const url = `${this.baseUrl}${endpoint}`;

        // Log the full URL being requested
        const urlProtocol = url.startsWith('http://') ? 'http://' : url.startsWith('https://') ? 'https://' : 'relative';
        console.log(`[API] Request URL: ${url} (protocol: ${urlProtocol})`);
        console.log(`[API] API_BASE_URL: ${this.baseUrl}`);

        // Get auth token for Authorization header
        const token = await getAuthToken();
        
        // Build headers with Authorization if token is available
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Log outgoing headers for debugging
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${options.method || 'GET'} ${url}`, {
                headers: { ...headers, Authorization: token ? `Bearer ${token.substring(0, 20)}...` : 'None' },
            });
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            console.error('Fetch failed:', new Error(`HTTP ${response.status}: ${response.statusText}`));
            console.error(`[API] Failed URL: ${url}`);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    // Categories
    async getCategories(): Promise<Category[]> {
        if (USE_MOCK) {
            return mockApi.getCategories();
        }
        return this.request<Category[]>('/api/v1/categories');
    }

    // Procedures
    async getProcedures(categorySlug?: string): Promise<Procedure[]> {
        if (USE_MOCK) {
            return mockApi.getProcedures(categorySlug);
        }
        const params = categorySlug ? `?category=${categorySlug}` : '';
        return this.request<Procedure[]>(`/procedures${params}`);
    }

    async getProcedure(id: string): Promise<Procedure> {
        if (USE_MOCK) {
            const procedures = await mockApi.getProcedures();
            const procedure = procedures.find(p => p.id === id);
            if (!procedure) throw new Error('Procedure not found');
            return procedure;
        }
        return this.request<Procedure>(`/api/v1/procedures/${id}`);
    }

    async searchProcedures(query: string): Promise<Procedure[]> {
        if (USE_MOCK) {
            return mockApi.searchProcedures(query);
        }
        return this.request<Procedure[]>(`/api/v1/search?q=${encodeURIComponent(query)}`);
    }

    // Providers
    async getProviders(procedureId?: string): Promise<Provider[]> {
        if (USE_MOCK) {
            return mockApi.getProviders();
        }
        const params = procedureId ? `?procedure=${procedureId}` : '';
        return this.request<Provider[]>(`/providers${params}`);
    }

    async getProvider(id: string): Promise<Provider> {
        if (USE_MOCK) {
            const providers = await mockApi.getProviders();
            const provider = providers.find(p => p.id === id);
            if (!provider) throw new Error('Provider not found');
            return provider;
        }
        return this.request<Provider>(`/api/v1/providers/${id}`);
    }
}

export const apiClient = new ApiClient();

