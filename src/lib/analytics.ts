/**
 * Analytics & Performance Monitoring
 * 
 * Lightweight client-side tracking for API performance, page views, and errors.
 * Designed to be easily extended with external analytics services (e.g., Google Analytics, Sentry).
 * 
 * All logs use console.debug to avoid cluttering production console.
 * In development, logs are more verbose for debugging.
 */

interface ApiCallMetrics {
  endpoint: string;
  duration: number;
  status: number;
  error?: string;
  timestamp: number;
}

interface PageViewMetrics {
  path: string;
  timestamp: number;
}

interface ErrorMetrics {
  error: string;
  context: Record<string, any>;
  timestamp: number;
  stack?: string;
}

// In-memory store for recent API calls (last 50)
const apiCallHistory: ApiCallMetrics[] = [];
const MAX_HISTORY_LENGTH = 50;

/**
 * Track an API call with performance metrics
 * @param endpoint - API endpoint that was called
 * @param duration - Response time in milliseconds
 * @param status - HTTP status code
 * @param error - Optional error message
 */
export function trackApiCall(
  endpoint: string,
  duration: number,
  status: number,
  error?: string
): void {
  const timestamp = Date.now();
  const metrics: ApiCallMetrics = {
    endpoint,
    duration,
    status,
    timestamp,
  };

  if (error) {
    metrics.error = error;
  }

  // Add to history
  apiCallHistory.push(metrics);
  if (apiCallHistory.length > MAX_HISTORY_LENGTH) {
    apiCallHistory.shift();
  }

  // Log to console
  if (process.env.NODE_ENV === 'development') {
    const icon = status >= 200 && status < 300 ? '✅' : '❌';
    const color = status >= 200 && status < 300 ? 'color: green' : 'color: red';
    
    console.debug(
      `%c${icon} API Call: ${endpoint}`,
      color,
      {
        status,
        duration: `${duration}ms`,
        timestamp: new Date(timestamp).toLocaleTimeString(),
        ...(error && { error }),
      }
    );

    // Warn about slow requests
    if (duration > 1000) {
      console.warn(`⚠️ Slow API request: ${endpoint} took ${duration}ms`);
    }
  }
}

/**
 * Track a page view
 * @param path - Page path (e.g., '/category/imaging')
 */
export function trackPageView(path: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('📄 Page View:', path, {
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track an error with context
 * @param error - Error object or message
 * @param context - Additional context (e.g., endpoint, user action)
 */
export function trackError(
  error: Error | string,
  context: Record<string, any> = {}
): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : undefined;

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', errorMessage, {
      ...context,
      ...(stack && { stack }),
      timestamp: new Date().toISOString(),
    });
  }

  // TODO: In production, send to error tracking service (e.g., Sentry)
  // Example:
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, {
  //     contexts: context
  //   });
  // }
}

/**
 * Get API performance statistics
 * Useful for debugging in development
 */
export function getApiPerformanceStats(): {
  totalCalls: number;
  averageDuration: number;
  slowCalls: ApiCallMetrics[];
  errorRate: number;
  recentCalls: ApiCallMetrics[];
} {
  if (apiCallHistory.length === 0) {
    return {
      totalCalls: 0,
      averageDuration: 0,
      slowCalls: [],
      errorRate: 0,
      recentCalls: [],
    };
  }

  const totalCalls = apiCallHistory.length;
  const totalDuration = apiCallHistory.reduce((sum, call) => sum + call.duration, 0);
  const averageDuration = Math.round(totalDuration / totalCalls);
  
  const errors = apiCallHistory.filter(call => call.error || call.status >= 400);
  const errorRate = (errors.length / totalCalls) * 100;

  const slowCalls = apiCallHistory.filter(call => call.duration > 1000);

  return {
    totalCalls,
    averageDuration,
    slowCalls,
    errorRate: Math.round(errorRate * 100) / 100,
    recentCalls: apiCallHistory.slice(-10).reverse(), // Most recent 10
  };
}

/**
 * Clear API call history
 * Useful for testing or resetting metrics
 */
export function clearApiHistory(): void {
  apiCallHistory.length = 0;
  if (process.env.NODE_ENV === 'development') {
    console.debug('🗑️ API call history cleared');
  }
}

/**
 * Log API performance summary
 * Useful for debugging in development
 */
export function logPerformanceSummary(): void {
  const stats = getApiPerformanceStats();
  
  console.group('📊 API Performance Summary');
  console.log(`Total Calls: ${stats.totalCalls}`);
  console.log(`Average Duration: ${stats.averageDuration}ms`);
  console.log(`Error Rate: ${stats.errorRate}%`);
  console.log(`Slow Calls (>1000ms): ${stats.slowCalls.length}`);
  
  if (stats.slowCalls.length > 0) {
    console.warn('Slow Requests:', stats.slowCalls);
  }
  
  console.groupEnd();
}

// Export history for use in DevTools component
export function getApiCallHistory(): ApiCallMetrics[] {
  return [...apiCallHistory];
}
