'use client';

import { useState } from 'react';

/**
 * Error Test Component
 * 
 * This component provides a button that triggers an error when clicked,
 * allowing you to test that the ErrorBoundary is working correctly.
 * 
 * Usage:
 * 1. Temporarily add <ErrorTest /> to your layout
 * 2. Click the button to trigger an error
 * 3. Verify the error boundary catches it and shows the error UI
 * 4. Remove the component after testing
 */
export function ErrorTest() {
    const [shouldError, setShouldError] = useState(false);

    if (shouldError) {
        throw new Error('Test error - Error Boundary is working!');
    }

    return (
        <button
            onClick={() => setShouldError(true)}
            className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-colors font-medium text-sm"
            title="Click to test error boundary (development only)"
        >
            🧪 Test Error Boundary
        </button>
    );
}

