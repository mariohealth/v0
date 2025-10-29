'use client';

import { useState } from 'react';

export function ErrorTestButton() {
    const [shouldError, setShouldError] = useState(false);

    if (shouldError) {
        throw new Error('🧪 Test Error - Error Boundary is working correctly!');
    }

    return (
        <button
            onClick={() => setShouldError(true)}
            className="fixed bottom-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
            title="Click to test error boundary"
        >
            🧪 Test Error
        </button>
    );
}

