'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { fetchHealthCheck, fetchCategories } from '../../lib/api';
import type { Category } from '../../lib/transforms';

interface TestResult {
  name: string;
  endpoint: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  responseTime?: number;
  error?: string;
  data?: any;
}

export default function ApiTestPage() {
  const [healthCheck, setHealthCheck] = useState<TestResult>({
    name: 'Health Check',
    endpoint: '/api/v1/health',
    status: 'idle',
  });
  
  const [categories, setCategories] = useState<TestResult>({
    name: 'Categories',
    endpoint: '/api/v1/categories',
    status: 'idle',
  });

  const [isTesting, setIsTesting] = useState(false);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_API_URL || '';
    setApiUrl(url);
    runTests();
  }, []);

  const runTests = async () => {
    setIsTesting(true);

    // Test Health Check
    const healthStart = performance.now();
    try {
      setHealthCheck(prev => ({ ...prev, status: 'loading' }));
      const healthData = await fetchHealthCheck();
      const healthDuration = Math.round(performance.now() - healthStart);
      setHealthCheck({
        name: 'Health Check',
        endpoint: '/api/v1/health',
        status: 'success',
        responseTime: healthDuration,
        data: healthData,
      });
    } catch (error) {
      const healthDuration = Math.round(performance.now() - healthStart);
      setHealthCheck({
        name: 'Health Check',
        endpoint: '/api/v1/health',
        status: 'error',
        responseTime: healthDuration,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Test Categories
    const categoriesStart = performance.now();
    try {
      setCategories(prev => ({ ...prev, status: 'loading' }));
      const categoriesData = await fetchCategories();
      const categoriesDuration = Math.round(performance.now() - categoriesStart);
      setCategories({
        name: 'Categories',
        endpoint: '/api/v1/categories',
        status: 'success',
        responseTime: categoriesDuration,
        data: categoriesData,
      });
    } catch (error) {
      const categoriesDuration = Math.round(performance.now() - categoriesStart);
      setCategories({
        name: 'Categories',
        endpoint: '/api/v1/categories',
        status: 'error',
        responseTime: categoriesDuration,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    setIsTesting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'loading':
        return <Clock className="w-6 h-6 text-yellow-500 animate-spin" />;
      default:
        return <div className="w-6 h-6" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            SUCCESS
          </span>
        );
      case 'error':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            ERROR
          </span>
        );
      case 'loading':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            TESTING...
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            READY
          </span>
        );
    }
  };

  const renderTestResult = (result: TestResult) => {
    return (
      <div
        className={`rounded-lg border-2 p-6 transition-all ${
          result.status === 'success'
            ? 'bg-green-50 border-green-200'
            : result.status === 'error'
            ? 'bg-red-50 border-red-200'
            : result.status === 'loading'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(result.status)}
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{result.name}</h3>
              <code className="text-sm text-gray-600">{result.endpoint}</code>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {result.responseTime !== undefined && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{result.responseTime}ms</span>
              </div>
            )}
            {getStatusBadge(result.status)}
          </div>
        </div>

        {/* Error Message */}
        {result.error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">Error:</p>
            <p className="text-sm text-red-700">{result.error}</p>
          </div>
        )}

        {/* Response Data */}
        {result.data && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Response:</p>
              <p className="text-xs text-gray-500">
                {Array.isArray(result.data) ? `${result.data.length} items` : '1 object'}
              </p>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                API Connection Test
              </h1>
              <p className="text-lg text-gray-600">
                Test your backend API connection and view response data
              </p>
            </div>
            <button
              onClick={runTests}
              disabled={isTesting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${isTesting ? 'animate-spin' : ''}`} />
              {isTesting ? 'Testing...' : 'Run Tests'}
            </button>
          </div>

          {/* API URL Display */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">API Base URL:</span>
              <code className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
                {apiUrl || 'Not configured'}
              </code>
              {!apiUrl && (
                <span className="text-sm text-red-600 ml-2">
                  (Set NEXT_PUBLIC_API_URL in .env.local)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-6">
          {renderTestResult(healthCheck)}
          {renderTestResult(categories)}
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-900">
            <strong>Note:</strong> This page tests the API connection and displays raw JSON responses.
            Response times are measured from client-side request to response.
          </p>
        </div>
      </div>
    </div>
  );
}

