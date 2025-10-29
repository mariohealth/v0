'use client';

/**
 * Example usage of the API Adapter
 * 
 * This file demonstrates how to use the API adapter in your components
 * and how easy it is to switch between mock and real APIs.
 */

import React, { useState } from 'react';
import { apiAdapter, searchProviders, getProviderDetails, SearchParams } from './adapter';
import { Provider } from '../mockData';

// Example 1: Using the adapter instance directly
export async function searchProvidersExample() {
    try {
        const results = await apiAdapter.searchProviders({
            procedure: 'MRI Scan',
            location: 'New York',
            priceRange: [500, 1000],
            minRating: 4.0,
            types: ['imaging_center', 'hospital']
        });

        console.log(`Found ${results.totalCount} providers`);
        console.log('Providers:', results.providers);

        return results;
    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    }
}

// Example 2: Using individual functions (backward compatible)
export async function getProviderExample(providerId: string) {
    try {
        const provider = await getProviderDetails(providerId);

        console.log(`Provider: ${provider.name}`);
        console.log(`Rating: ${provider.rating}/5 (${provider.reviewCount} reviews)`);
        console.log(`Price: $${provider.price}`);

        return provider;
    } catch (error) {
        console.error('Failed to get provider details:', error);
        throw error;
    }
}

// Example 3: Checking API mode
export function checkApiMode() {
    if (apiAdapter.isMockMode()) {
        console.log('🔧 Using mock data for development');
    } else {
        console.log('🌐 Using real API:', apiAdapter.getApiUrl());
    }
}

// Example 4: React component usage
export function ProviderSearchComponent() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (searchParams: SearchParams) => {
        setLoading(true);
        setError(null);

        try {
            // This will automatically use mock or real API based on environment
            const results = await searchProviders(searchParams);
            setProviders(results.providers);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Example component - replace with your actual JSX implementation
    return null; // Placeholder - implement your search UI here
}

// Example 5: Environment switching demonstration
export function demonstrateSwitching() {
    console.log('=== API Adapter Demo ===');

    // Check current mode
    checkApiMode();

    // The same code works regardless of mock/real mode
    console.log('Searching for providers...');
    searchProvidersExample().then(results => {
        console.log('Search completed successfully!');
    }).catch(error => {
        console.error('Search failed:', error);
    });
}

// To switch between mock and real APIs:
// 1. Open .env.local
// 2. Change NEXT_PUBLIC_USE_MOCK_API=true (mock) or false (real)
// 3. Restart your development server
// 4. The same code will now use the other API mode!
