/**
 * Analytics & Performance Monitoring
 * 
 * Lightweight client-side tracking for API performance, page views, and errors.
 */

interface ApiCallMetrics {
    endpoint: string;
    duration: number;
    status: number;
    error?: string;
    timestamp: number;
}

const apiCallHistory: ApiCallMetrics[] = [];
const MAX_HISTORY_LENGTH = 50;

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

    apiCallHistory.push(metrics);
    if (apiCallHistory.length > MAX_HISTORY_LENGTH) {
        apiCallHistory.shift();
    }

    if (process.env.NODE_ENV === 'development') {
        const icon = status >= 200 && status < 300 ? '✅' : '❌';
        console.debug(
            `${icon} API Call: ${endpoint}`,
            { status, duration: `${duration}ms`, ...(error && { error }) }
        );

        if (duration > 1000) {
            console.warn(`⚠️ Slow API request: ${endpoint} took ${duration}ms`);
        }
    }
}

export function trackError(
    error: Error | string,
    context: Record<string, any> = {}
): void {
    const errorMessage = error instanceof Error ? error.message : error;

    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', errorMessage, { ...context });
    }
}

export function getApiPerformanceStats() {
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
        recentCalls: apiCallHistory.slice(-10).reverse(),
    };
}

export function getApiCallHistory(): ApiCallMetrics[] {
    return [...apiCallHistory];
}
