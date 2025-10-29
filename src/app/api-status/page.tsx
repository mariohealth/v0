'use client';

/**
 * API Status Dashboard
 * 
 * Developer tool to verify API integration status and health.
 * Only accessible in development mode.
 */

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, Activity, ExternalLink } from 'lucide-react';
import * as api from '../../lib/api';
import { getApiPerformanceStats } from '../../lib/analytics';

interface EndpointStatus {
    name: string;
    endpoint: string;
    status: 'checking' | 'success' | 'error';
    duration?: number;
    error?: string;
    sampleData?: any;
}

export default function ApiStatusPage() {
    const [endpoints, setEndpoints] = useState<EndpointStatus[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mario-health-api-72178908097.us-central1.run.app';

    const checkEndpoint = async (
        name: string,
        endpoint: string,
        testFn: () => Promise<any>
    ) => {
        const startTime = performance.now();

        setEndpoints(prev => prev.map(e =>
            e.endpoint === endpoint ? { ...e, status: 'checking' } : e
        ));

        try {
            const result = await testFn();
            const duration = Math.round(performance.now() - startTime);

            setEndpoints(prev => prev.map(e =>
                e.endpoint === endpoint ? {
                    ...e,
                    status: 'success',
                    duration,
                    sampleData: JSON.stringify(result, null, 2).substring(0, 200),
                } : e
            ));
        } catch (error) {
            const duration = Math.round(performance.now() - startTime);

            setEndpoints(prev => prev.map(e =>
                e.endpoint === endpoint ? {
                    ...e,
                    status: 'error',
                    duration,
                    error: error instanceof Error ? error.message : String(error),
                } : e
            ));
        }
    };

    const checkAllEndpoints = async () => {
        setIsChecking(true);

        const checks: EndpointStatus[] = [
            { name: 'Get Categories', endpoint: '/api/v1/categories', status: 'checking' },
            { name: 'Get Families (Imaging)', endpoint: '/api/v1/categories/imaging/families', status: 'checking' },
            { name: 'Get Procedures (X-Ray)', endpoint: '/api/v1/families/x-ray/procedures', status: 'checking' },
            { name: 'Search Procedures', endpoint: '/api/v1/search?q=chest', status: 'checking' },
            { name: 'Provider Detail', endpoint: '/api/v1/providers/prov_1', status: 'checking' },
        ];

        setEndpoints(checks);

        await Promise.all([
            checkEndpoint(checks[0].name, checks[0].endpoint, () => api.getCategories()),
            checkEndpoint(checks[1].name, checks[1].endpoint, () => api.getFamiliesByCategory('imaging')),
            checkEndpoint(checks[2].name, checks[2].endpoint, () => api.getProceduresByFamily('x-ray')),
            checkEndpoint(checks[3].name, checks[3].endpoint, () => api.searchProcedures('chest')),
            checkEndpoint(checks[4].name, checks[4].endpoint, () => api.getProviderDetail('prov_1')),
        ]);

        setIsChecking(false);
    };

    useEffect(() => {
        checkAllEndpoints();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'checking':
                return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'checking':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const stats = getApiPerformanceStats();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">API Status Dashboard</h1>
                            <p className="text-gray-600 mt-2">Real-time backend integration health check</p>
                        </div>
                        <button
                            onClick={checkAllEndpoints}
                            disabled={isChecking}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Activity className="w-4 h-4" />
                            {isChecking ? 'Checking...' : 'Refresh'}
                        </button>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-900">
                            <ExternalLink className="w-4 h-4" />
                            <span className="font-medium">API Base URL:</span>
                            <code className="text-sm">{BASE_URL}</code>
                            <a
                                href={`${BASE_URL}/docs`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto text-blue-600 hover:text-blue-800 underline"
                            >
                                View Swagger Docs →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                {stats.totalCalls > 0 && (
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600">Total API Calls</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalCalls}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600">Avg Duration</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.averageDuration}ms</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600">Error Rate</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.errorRate}%</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600">Slow Calls</div>
                            <div className="text-2xl font-bold text-red-600">{stats.slowCalls.length}</div>
                        </div>
                    </div>
                )}

                {/* Endpoint Status */}
                <div className="space-y-4">
                    {endpoints.map((endpoint, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-lg border ${getStatusColor(endpoint.status)} transition-all`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(endpoint.status)}
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{endpoint.name}</h3>
                                        <code className="text-sm text-gray-600">{endpoint.endpoint}</code>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {endpoint.duration && (
                                        <div className="text-sm text-gray-600">
                                            {endpoint.duration}ms
                                        </div>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${endpoint.status === 'success' ? 'bg-green-100 text-green-800' :
                                            endpoint.status === 'error' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {endpoint.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {endpoint.error && (
                                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
                                    <p className="text-sm text-red-800">{endpoint.error}</p>
                                </div>
                            )}

                            {endpoint.sampleData && (
                                <details className="mt-4">
                                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                                        View sample data
                                    </summary>
                                    <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-x-auto">
                                        {endpoint.sampleData}...
                                    </pre>
                                </details>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900">
                        <strong>Note:</strong> This page is for development only. It helps verify backend integration status and troubleshoot API issues.
                    </p>
                </div>
            </div>
        </div>
    );
}
