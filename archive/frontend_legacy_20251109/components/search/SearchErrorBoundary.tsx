'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Search } from 'lucide-react';
import { SearchError } from '@/types/api';

interface SearchErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

interface SearchErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
    onRetry?: () => void;
}

export class SearchErrorBoundary extends React.Component<SearchErrorBoundaryProps, SearchErrorBoundaryState> {
    constructor(props: SearchErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): SearchErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('SearchErrorBoundary caught an error:', error, errorInfo);

        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            // TODO: Add Sentry or other error tracking service
            console.error('Production error:', { error: error.message, stack: error.stack, errorInfo });
        }

        this.setState({ errorInfo });
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
            }

            return <SearchErrorFallback error={this.state.error} resetError={this.resetError} onRetry={this.props.onRetry} />;
        }

        return this.props.children;
    }
}

function SearchErrorFallback({
    error,
    resetError,
    onRetry
}: {
    error?: Error;
    resetError: () => void;
    onRetry?: () => void;
}) {
    const handleRetry = () => {
        resetError();
        if (onRetry) {
            onRetry();
        }
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleNewSearch = () => {
        window.location.href = '/search';
    };

    return (
        <div className="min-h-[400px] bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                    Search Error
                </h1>

                <p className="text-gray-600 mb-6">
                    Something went wrong while loading search results. This might be a temporary issue.
                </p>

                {process.env.NODE_ENV === 'development' && error && (
                    <details className="mb-4 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                            Error Details
                        </summary>
                        <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-32">
                            {error.message}
                            {error.stack && (
                                <>
                                    {'\n\nStack Trace:\n'}
                                    {error.stack}
                                </>
                            )}
                        </pre>
                    </details>
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleRetry}
                        className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={handleNewSearch}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            New Search
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hook for functional components to trigger error boundary
export function useSearchErrorHandler() {
    const [error, setError] = React.useState<Error | null>(null);

    const throwError = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return { throwError };
}
