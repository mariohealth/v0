'use client';

/**
 * Development Tools Component
 * 
 * A floating panel that only appears in development mode for debugging API calls.
 * Shows:
 * - Current API URL
 * - Mock mode status
 * - Recent API calls with timing
 * - Quick test buttons
 */

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Server, Clock, Activity } from 'lucide-react';
import { getApiCallHistory, getApiPerformanceStats } from '../lib/analytics';

export default function DevTools() {
    const [isOpen, setIsOpen] = useState(false);
    const [apiHistory, setApiHistory] = useState(getApiCallHistory());

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'Not configured';
    const USE_MOCK = false; // TODO: Read from actual env

    useEffect(() => {
        // Refresh history every 2 seconds
        const interval = setInterval(() => {
            setApiHistory(getApiCallHistory());
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const stats = getApiPerformanceStats();

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                title="Toggle Dev Tools"
            >
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                <span className="font-semibold">DevTools</span>
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="mt-2 bg-white border-2 border-purple-300 rounded-lg shadow-xl w-96 max-h-[80vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-purple-600 text-white p-4 flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        <h3 className="font-bold">Development Tools</h3>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-1">
                        {/* API Configuration */}
                        <div className="p-4 border-b border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Server className="w-4 h-4" />
                                API Configuration
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-600">API URL:</span>
                                    <div className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                                        {API_BASE_URL}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Mock Mode:</span>
                                    <span className={`px-2 py-1 rounded ${USE_MOCK ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {USE_MOCK ? 'ON' : 'OFF'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Performance Stats */}
                        {stats.totalCalls > 0 && (
                            <div className="p-4 border-b border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Performance
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Total Calls:</span>
                                        <div className="font-bold text-lg">{stats.totalCalls}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Avg Time:</span>
                                        <div className="font-bold text-lg">{stats.averageDuration}ms</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Errors:</span>
                                        <div className="font-bold text-lg text-red-600">{stats.errorRate}%</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Slow (1s+):</span>
                                        <div className="font-bold text-lg text-yellow-600">{stats.slowCalls.length}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent API Calls */}
                        <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Recent API Calls
                            </h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {apiHistory.length === 0 ? (
                                    <p className="text-sm text-gray-500">No API calls yet</p>
                                ) : (
                                    apiHistory.slice(-10).reverse().map((call, index) => (
                                        <div
                                            key={index}
                                            className="text-xs bg-gray-50 p-2 rounded border border-gray-200"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono truncate flex-1">{call.endpoint}</span>
                                                <span className={`ml-2 px-2 py-0.5 rounded ${call.status >= 200 && call.status < 300
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {call.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <span>{call.duration}ms</span>
                                                <span>•</span>
                                                <span>{new Date(call.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            {call.error && (
                                                <div className="mt-1 text-xs text-red-600 truncate">
                                                    {call.error}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="p-4 border-t border-gray-200 space-y-2">
                            <a
                                href="/api-status"
                                className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                → View API Status Dashboard
                            </a>
                            <a
                                href={`${API_BASE_URL}/docs`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                → Open Swagger Docs
                            </a>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-purple-50 border-t border-purple-200 text-xs text-purple-900">
                        <strong>DEV MODE ONLY</strong> - This component is hidden in production
                    </div>
                </div>
            )}
        </div>
    );
}
