import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchParams, SearchResponse, SearchError, SearchState } from '../types/api';

interface UseSearchOptions {
    debounceMs?: number;
    enableRetry?: boolean;
    maxRetries?: number;
}

interface UseSearchReturn {
    searchState: SearchState;
    search: (params: SearchParams) => Promise<void>;
    retry: () => Promise<void>;
    clearError: () => void;
    cancelSearch: () => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
    const {
        debounceMs = 300,
        enableRetry = true,
        maxRetries = 3
    } = options;

    const [searchState, setSearchState] = useState<SearchState>({
        isLoading: false,
        error: null,
        data: null,
        retryCount: 0,
        lastSearchParams: null
    });

    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearError = useCallback(() => {
        setSearchState(prev => ({ ...prev, error: null }));
    }, []);

    const cancelSearch = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = null;
        }

        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }

        setSearchState(prev => ({ ...prev, isLoading: false }));
    }, []);

    const performSearch = useCallback(async (params: SearchParams, isRetry = false) => {
        // Cancel any existing search
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this search
        abortControllerRef.current = new AbortController();

        setSearchState(prev => ({
            ...prev,
            isLoading: true,
            error: null,
            retryCount: isRetry ? prev.retryCount + 1 : 0
        }));

        try {
            // Import API client dynamically to avoid circular dependencies
            const { apiClient } = await import('./api');

            const response = await apiClient.searchProviders(params);

            // Check if search was cancelled
            if (abortControllerRef.current?.signal.aborted) {
                return;
            }

            setSearchState(prev => ({
                ...prev,
                isLoading: false,
                data: response,
                error: null,
                lastSearchParams: params,
                retryCount: 0
            }));

        } catch (error) {
            // Check if search was cancelled
            if (abortControllerRef.current?.signal.aborted) {
                return;
            }

            // If it's already a SearchError, use it directly
            if (error && typeof error === 'object' && 'type' in error) {
                setSearchState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error as SearchError,
                    lastSearchParams: params
                }));

                // Auto-retry for retryable errors
                if (enableRetry && (error as SearchError).retryable && searchState.retryCount < maxRetries) {
                    const searchError = error as SearchError;
                    const retryDelay = searchError.type === 'RATE_LIMIT_ERROR'
                        ? (searchError.retryAfter || 60) * 1000
                        : Math.pow(2, searchState.retryCount) * 1000; // Exponential backoff

                    retryTimeoutRef.current = setTimeout(() => {
                        performSearch(params, true);
                    }, retryDelay);
                }
                return;
            }

            // Convert other errors to SearchError format
            const searchError: SearchError = {
                name: 'SearchError',
                message: error instanceof Error ? error.message : 'An unknown error occurred',
                type: 'UNKNOWN_ERROR',
                retryable: true,
                statusCode: (error as any)?.statusCode || 500
            };

            // Determine error type and retryability
            if (error instanceof Error) {
                if (error.message.includes('timeout') || error.message.includes('network')) {
                    searchError.type = 'NETWORK_ERROR';
                    searchError.retryable = true;
                } else if (error.message.includes('429') || error.message.includes('rate limit')) {
                    searchError.type = 'RATE_LIMIT_ERROR';
                    searchError.retryable = true;
                    searchError.retryAfter = 60; // Default retry after 60 seconds
                } else if (error.message.includes('400') || error.message.includes('validation')) {
                    searchError.type = 'VALIDATION_ERROR';
                    searchError.retryable = false;
                } else if (error.message.includes('500') || error.message.includes('server')) {
                    searchError.type = 'SERVER_ERROR';
                    searchError.retryable = true;
                }
            }

            setSearchState(prev => ({
                ...prev,
                isLoading: false,
                error: searchError,
                lastSearchParams: params
            }));

            // Auto-retry for retryable errors
            if (enableRetry && searchError.retryable && searchState.retryCount < maxRetries) {
                const retryDelay = searchError.type === 'RATE_LIMIT_ERROR'
                    ? (searchError.retryAfter || 60) * 1000
                    : Math.pow(2, searchState.retryCount) * 1000; // Exponential backoff

                retryTimeoutRef.current = setTimeout(() => {
                    performSearch(params, true);
                }, retryDelay);
            }
        } finally {
            abortControllerRef.current = null;
        }
    }, [enableRetry, maxRetries, searchState.retryCount]);

    const search = useCallback((params: SearchParams) => {
        return new Promise<void>((resolve) => {
            // Clear existing debounce timeout
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            // Set new debounce timeout
            debounceTimeoutRef.current = setTimeout(async () => {
                await performSearch(params);
                resolve();
            }, debounceMs);
        });
    }, [performSearch, debounceMs]);

    const retry = useCallback(async () => {
        if (searchState.lastSearchParams) {
            await performSearch(searchState.lastSearchParams, true);
        }
    }, [performSearch, searchState.lastSearchParams]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancelSearch();
        };
    }, [cancelSearch]);

    return {
        searchState,
        search,
        retry,
        clearError,
        cancelSearch
    };
}
