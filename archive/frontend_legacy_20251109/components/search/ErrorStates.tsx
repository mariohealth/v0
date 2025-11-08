import React from 'react';
import { SearchError } from '@/types/api';
import { AlertTriangle, Wifi, Clock, Shield, RefreshCw, XCircle } from 'lucide-react';

interface ErrorDisplayProps {
    error: SearchError;
    onRetry?: () => void;
    onDismiss?: () => void;
    className?: string;
}

export function ErrorDisplay({ error, onRetry, onDismiss, className = '' }: ErrorDisplayProps) {
    const getErrorIcon = () => {
        switch (error.type) {
            case 'NETWORK_ERROR':
                return <Wifi className="w-6 h-6 text-red-500" />;
            case 'TIMEOUT_ERROR':
                return <Clock className="w-6 h-6 text-orange-500" />;
            case 'RATE_LIMIT_ERROR':
                return <Shield className="w-6 h-6 text-yellow-500" />;
            case 'MALFORMED_RESPONSE':
            case 'VALIDATION_ERROR':
                return <AlertTriangle className="w-6 h-6 text-red-500" />;
            case 'EMPTY_RESULTS':
                return <XCircle className="w-6 h-6 text-gray-500" />;
            default:
                return <AlertTriangle className="w-6 h-6 text-red-500" />;
        }
    };

    const getErrorTitle = () => {
        switch (error.type) {
            case 'NETWORK_ERROR':
                return 'Connection Problem';
            case 'TIMEOUT_ERROR':
                return 'Request Timed Out';
            case 'RATE_LIMIT_ERROR':
                return 'Too Many Requests';
            case 'MALFORMED_RESPONSE':
                return 'Invalid Response';
            case 'VALIDATION_ERROR':
                return 'Invalid Search';
            case 'EMPTY_RESULTS':
                return 'No Results Found';
            default:
                return 'Something Went Wrong';
        }
    };

    const getErrorDescription = () => {
        switch (error.type) {
            case 'NETWORK_ERROR':
                return 'Please check your internet connection and try again.';
            case 'TIMEOUT_ERROR':
                return 'The request is taking longer than expected. Please try again.';
            case 'RATE_LIMIT_ERROR':
                return error.retryAfter
                    ? `Please wait ${error.retryAfter} seconds before trying again.`
                    : 'Please wait a moment before trying again.';
            case 'MALFORMED_RESPONSE':
                return 'The server returned an unexpected response. Please try again.';
            case 'VALIDATION_ERROR':
                return 'Please check your search terms and try again.';
            case 'EMPTY_RESULTS':
                return 'No providers match your search criteria. Try adjusting your filters.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    };

    const showRetryButton = error.retryable && onRetry;

    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-start gap-3">
                {getErrorIcon()}
                <div className="flex-1">
                    <h3 className="font-semibold text-red-800 mb-1">
                        {getErrorTitle()}
                    </h3>
                    <p className="text-red-700 text-sm mb-3">
                        {getErrorDescription()}
                    </p>

                    {error.details && process.env.NODE_ENV === 'development' && (
                        <details className="mb-3">
                            <summary className="text-xs text-red-600 cursor-pointer">
                                Technical Details
                            </summary>
                            <pre className="text-xs text-red-600 mt-2 p-2 bg-red-100 rounded overflow-auto">
                                {JSON.stringify(error.details, null, 2)}
                            </pre>
                        </details>
                    )}

                    <div className="flex gap-2">
                        {showRetryButton && (
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                        )}

                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="px-3 py-2 text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
                            >
                                Dismiss
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface EmptyStateProps {
    title?: string;
    description?: string;
    showClearFilters?: boolean;
    onClearFilters?: () => void;
    className?: string;
}

export function EmptyState({
    title = "No Results Found",
    description = "Try adjusting your search terms or filters to find more providers.",
    showClearFilters = false,
    onClearFilters,
    className = ''
}: EmptyStateProps) {
    return (
        <div className={`text-center py-12 ${className}`}>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {description}
            </p>
            {showClearFilters && onClearFilters && (
                <button
                    onClick={onClearFilters}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
}

interface LoadingStateProps {
    message?: string;
    showProgress?: boolean;
    className?: string;
}

export function LoadingState({
    message = "Searching...",
    showProgress = false,
    className = ''
}: LoadingStateProps) {
    return (
        <div className={`text-center py-12 ${className}`}>
            <div className="mx-auto w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 mb-2">{message}</p>
            {showProgress && (
                <div className="w-48 mx-auto bg-gray-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
            )}
        </div>
    );
}

interface NetworkStatusProps {
    isOnline: boolean;
    className?: string;
}

export function NetworkStatus({ isOnline, className = '' }: NetworkStatusProps) {
    if (isOnline) return null;

    return (
        <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 ${className}`}>
            <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 text-sm font-medium">
                    You're offline. Some features may not work properly.
                </span>
            </div>
        </div>
    );
}
