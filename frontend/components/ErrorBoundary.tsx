'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
            }

            return <ErrorFallback error={this.state.error} resetError={this.resetError} />;
        }

        return this.props.children;
    }
}

function ErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                    Something went wrong
                </h1>

                <p className="text-gray-600 mb-6">
                    We're sorry, but something unexpected happened. Please try refreshing the page.
                </p>

                {process.env.NODE_ENV === 'development' && error && (
                    <details className="mb-4 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                            Error Details
                        </summary>
                        <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={resetError}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>

                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}
