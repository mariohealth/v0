import { SearchError } from './api';

// Test utilities for simulating different error scenarios
export class SearchTestUtils {
    private static instance: SearchTestUtils;
    private testMode: boolean = false;
    private simulatedErrors: Map<string, SearchError> = new Map();

    static getInstance(): SearchTestUtils {
        if (!SearchTestUtils.instance) {
            SearchTestUtils.instance = new SearchTestUtils();
        }
        return SearchTestUtils.instance;
    }

    enableTestMode(): void {
        this.testMode = true;
        console.log('🧪 Search test mode enabled');
    }

    disableTestMode(): void {
        this.testMode = false;
        this.simulatedErrors.clear();
        console.log('🧪 Search test mode disabled');
    }

    // Simulate network timeout
    simulateTimeout(): void {
        this.simulatedErrors.set('timeout', {
            name: 'TimeoutError',
            type: 'TIMEOUT_ERROR',
            message: 'Request timed out after 30 seconds',
            statusCode: 408,
            retryable: true
        } as SearchError);
    }

    // Simulate network error
    simulateNetworkError(): void {
        this.simulatedErrors.set('network', {
            name: 'NetworkError',
            type: 'NETWORK_ERROR',
            message: 'Network connection failed. Please check your internet connection.',
            retryable: true,
            details: { originalError: 'Failed to fetch' }
        } as SearchError);
    }

    // Simulate rate limiting
    simulateRateLimit(): void {
        this.simulatedErrors.set('rateLimit', {
            name: 'RateLimitError',
            type: 'RATE_LIMIT_ERROR',
            message: 'Too many requests. Please try again later.',
            statusCode: 429,
            retryAfter: 60,
            retryable: true
        } as SearchError);
    }

    // Simulate malformed response
    simulateMalformedResponse(): void {
        this.simulatedErrors.set('malformed', {
            name: 'MalformedResponseError',
            type: 'MALFORMED_RESPONSE',
            message: 'Invalid response format from search API',
            retryable: false,
            details: { receivedData: { invalid: 'data' } }
        } as SearchError);
    }

    // Simulate empty results
    simulateEmptyResults(): void {
        this.simulatedErrors.set('empty', {
            name: 'EmptyResultsError',
            type: 'EMPTY_RESULTS',
            message: 'No providers match your search criteria',
            statusCode: 404
        } as SearchError);
    }

    // Simulate validation error
    simulateValidationError(): void {
        this.simulatedErrors.set('validation', {
            name: 'ValidationError',
            type: 'VALIDATION_ERROR',
            message: 'Procedure name is too long (max 200 characters)',
            statusCode: 400
        } as SearchError);
    }

    // Clear all simulated errors
    clearSimulatedErrors(): void {
        this.simulatedErrors.clear();
    }

    // Check if we should simulate an error for a given search term
    shouldSimulateError(searchTerm: string): SearchError | null {
        if (!this.testMode) return null;

        // Simulate errors based on special test keywords
        const lowerTerm = searchTerm.toLowerCase();

        if (lowerTerm.includes('timeout')) {
            return this.simulatedErrors.get('timeout') || null;
        }
        if (lowerTerm.includes('network')) {
            return this.simulatedErrors.get('network') || null;
        }
        if (lowerTerm.includes('rate limit')) {
            return this.simulatedErrors.get('rateLimit') || null;
        }
        if (lowerTerm.includes('malformed')) {
            return this.simulatedErrors.get('malformed') || null;
        }
        if (lowerTerm.includes('empty')) {
            return this.simulatedErrors.get('empty') || null;
        }
        if (lowerTerm.includes('validation')) {
            return this.simulatedErrors.get('validation') || null;
        }

        return null;
    }

    // Simulate slow response for testing loading states
    simulateSlowResponse(delay: number = 5000): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // Test special characters handling
    getSpecialCharacterTests(): Array<{ name: string; input: string; expected: string }> {
        return [
            {
                name: 'Quotes',
                input: 'MRI "scan" with contrast',
                expected: 'MRI scan with contrast'
            },
            {
                name: 'HTML-like characters',
                input: 'CT <scan> & X-ray',
                expected: 'CT scan & X-ray'
            },
            {
                name: 'Unicode characters',
                input: 'Café & Résumé',
                expected: 'Café & Résumé'
            },
            {
                name: 'Very long name',
                input: 'A'.repeat(300),
                expected: 'A'.repeat(200)
            },
            {
                name: 'Mixed special characters',
                input: 'Dr. O\'Connor\'s "Special" <Clinic>',
                expected: 'Dr. OConnor\'s Special Clinic'
            }
        ];
    }

    // Test concurrent search scenarios
    async simulateConcurrentSearches(searchTerms: string[]): Promise<void> {
        const promises = searchTerms.map(async (term, index) => {
            await new Promise(resolve => setTimeout(resolve, index * 100));
            console.log(`🔍 Simulating search ${index + 1}: "${term}"`);
        });

        await Promise.all(promises);
    }
}

// Export singleton instance
export const searchTestUtils = SearchTestUtils.getInstance();

// Development helper to enable test mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).searchTestUtils = searchTestUtils;
    console.log('🧪 Search test utilities available at window.searchTestUtils');
}
