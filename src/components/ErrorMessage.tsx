'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

/**
 * ErrorMessage component displays an error with an icon and optional retry button.
 * Includes red error styling and user-friendly formatting.
 */
export function ErrorMessage({
    message,
    onRetry,
    className = ''
}: ErrorMessageProps) {
    return (
        <div
            className={`
        bg-red-50 border border-red-200 rounded-lg p-4
        ${className}
      `}
        >
            <div className="flex items-start gap-3">
                {/* Error Icon */}
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />

                {/* Error Message */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-red-800 mb-1">
                        Error
                    </h3>
                    <p className="text-sm text-red-700">
                        {message}
                    </p>
                </div>
            </div>

            {/* Retry Button */}
            {onRetry && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onRetry}
                        className="
              inline-flex items-center gap-2
              px-4 py-2
              text-sm font-medium
              text-white bg-red-600
              rounded-md
              hover:bg-red-700
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              transition-colors duration-200
            "
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}

