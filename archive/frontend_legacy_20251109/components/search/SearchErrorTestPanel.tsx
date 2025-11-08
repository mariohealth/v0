import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorDisplay, EmptyState, LoadingState } from '@/components/search/ErrorStates';
import { SkeletonSearchResults } from '@/components/ui/SkeletonComponents';
import { searchTestUtils } from '@/lib/searchTestUtils';
import { SearchError } from '@/lib/api';
import { Play, RotateCcw, Wifi, Clock, Shield, AlertTriangle, XCircle } from 'lucide-react';

interface TestScenario {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
}

export function SearchErrorTestPanel() {
    const [currentError, setCurrentError] = useState<SearchError | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmptyState, setShowEmptyState] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(false);

    const testScenarios: TestScenario[] = [
        {
            id: 'timeout',
            name: 'Network Timeout',
            description: 'Simulate slow 3G connection timeout',
            icon: <Clock className="w-5 h-5 text-orange-500" />,
            action: () => {
                searchTestUtils.simulateTimeout();
                setCurrentError(searchTestUtils.shouldSimulateError('timeout test')!);
            }
        },
        {
            id: 'network',
            name: 'Network Error',
            description: 'Simulate connection failure',
            icon: <Wifi className="w-5 h-5 text-red-500" />,
            action: () => {
                searchTestUtils.simulateNetworkError();
                setCurrentError(searchTestUtils.shouldSimulateError('network test')!);
            }
        },
        {
            id: 'rateLimit',
            name: 'Rate Limiting',
            description: 'Simulate API rate limit exceeded',
            icon: <Shield className="w-5 h-5 text-yellow-500" />,
            action: () => {
                searchTestUtils.simulateRateLimit();
                setCurrentError(searchTestUtils.shouldSimulateError('rate limit test')!);
            }
        },
        {
            id: 'malformed',
            name: 'Malformed Response',
            description: 'Simulate invalid API response',
            icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
            action: () => {
                searchTestUtils.simulateMalformedResponse();
                setCurrentError(searchTestUtils.shouldSimulateError('malformed test')!);
            }
        },
        {
            id: 'empty',
            name: 'Empty Results',
            description: 'Simulate no search results',
            icon: <XCircle className="w-5 h-5 text-gray-500" />,
            action: () => {
                setShowEmptyState(true);
                setCurrentError(null);
            }
        },
        {
            id: 'loading',
            name: 'Loading State',
            description: 'Show loading skeletons',
            icon: <Play className="w-5 h-5 text-blue-500" />,
            action: () => {
                setIsLoading(true);
                setCurrentError(null);
                setShowEmptyState(false);
                setTimeout(() => setIsLoading(false), 3000);
            }
        },
        {
            id: 'skeleton',
            name: 'Skeleton Loading',
            description: 'Show skeleton components',
            icon: <Play className="w-5 h-5 text-purple-500" />,
            action: () => {
                setShowSkeleton(true);
                setCurrentError(null);
                setShowEmptyState(false);
                setTimeout(() => setShowSkeleton(false), 3000);
            }
        }
    ];

    const handleRetry = () => {
        console.log('🔄 Retry clicked');
        setCurrentError(null);
    };

    const handleDismiss = () => {
        setCurrentError(null);
    };

    const handleClearAll = () => {
        setCurrentError(null);
        setIsLoading(false);
        setShowEmptyState(false);
        setShowSkeleton(false);
        searchTestUtils.clearSimulatedErrors();
    };

    const testSpecialCharacters = () => {
        const tests = searchTestUtils.getSpecialCharacterTests();
        tests.forEach(test => {
            console.log(`🧪 Testing ${test.name}:`, {
                input: test.input,
                expected: test.expected
            });
        });
    };

    const testConcurrentSearches = async () => {
        const searchTerms = ['MRI', 'CT scan', 'X-ray', 'Ultrasound', 'Blood test'];
        await searchTestUtils.simulateConcurrentSearches(searchTerms);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Search Error Testing</h3>
                    <p className="text-sm text-gray-600">Test different error scenarios and loading states</p>
                </div>
                <Button
                    onClick={handleClearAll}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Clear All
                </Button>
            </div>

            {/* Test Scenarios Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {testScenarios.map((scenario) => (
                    <button
                        key={scenario.id}
                        onClick={scenario.action}
                        className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {scenario.icon}
                        <span className="text-sm font-medium text-gray-900">{scenario.name}</span>
                        <span className="text-xs text-gray-600 text-center">{scenario.description}</span>
                    </button>
                ))}
            </div>

            {/* Additional Test Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
                <Button
                    onClick={testSpecialCharacters}
                    variant="outline"
                    size="sm"
                >
                    Test Special Characters
                </Button>
                <Button
                    onClick={testConcurrentSearches}
                    variant="outline"
                    size="sm"
                >
                    Test Concurrent Searches
                </Button>
                <Button
                    onClick={() => searchTestUtils.enableTestMode()}
                    variant="outline"
                    size="sm"
                >
                    Enable Test Mode
                </Button>
                <Button
                    onClick={() => searchTestUtils.disableTestMode()}
                    variant="outline"
                    size="sm"
                >
                    Disable Test Mode
                </Button>
            </div>

            {/* Error Display */}
            {currentError && (
                <div className="mb-6">
                    <ErrorDisplay
                        error={currentError}
                        onRetry={handleRetry}
                        onDismiss={handleDismiss}
                    />
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="mb-6">
                    <LoadingState
                        message="Testing loading state..."
                        showProgress={true}
                    />
                </div>
            )}

            {/* Empty State */}
            {showEmptyState && (
                <div className="mb-6">
                    <EmptyState
                        title="No providers found"
                        description="This is a test of the empty state component."
                        showClearFilters={true}
                        onClearFilters={() => setShowEmptyState(false)}
                    />
                </div>
            )}

            {/* Skeleton Loading */}
            {showSkeleton && (
                <div className="mb-6">
                    <SkeletonSearchResults count={4} />
                </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Testing Instructions</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Click any test scenario button to simulate that error state</li>
                    <li>• Use "Test Special Characters" to validate input sanitization</li>
                    <li>• Use "Test Concurrent Searches" to test debouncing and cancellation</li>
                    <li>• Enable test mode to simulate errors based on search keywords</li>
                    <li>• Check browser console for detailed test logs</li>
                </ul>
            </div>
        </div>
    );
}
