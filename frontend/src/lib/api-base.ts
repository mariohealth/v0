/**
 * UNIVERSAL API ACCESS HELPER
 * 
 * FRONTEND API ACCESS RULE:
 * 1. Every API call MUST go through this helper (getApiBaseUrl).
 * 2. In production, Firebase Hosting rewrites handle API routing (no CORS issues).
 * 3. In local dev, you can point to:
 *    - Local backend: http://localhost:8000/api/v1 (default)
 *    - Deployed backend: Set NEXT_PUBLIC_API_BASE_URL in .env.local
 * 
 * See DEV_GUIDE.md for details on switching between local and deployed backend.
 */

/**
 * Returns the API base URL based on the current environment.
 * 
 * Behavior:
 * - SSR (server-side): Always returns absolute URL
 * - Browser: Uses NEXT_PUBLIC_API_BASE_URL if set, otherwise defaults to localhost:8000
 * 
 * To use deployed backend in local dev:
 * Set in .env.local:
 *   NEXT_PUBLIC_API_BASE_URL=https://mario-health-api-ei5wbr4h5a-uc.a.run.app/api/v1
 */
export function getApiBaseUrl(): string {
    const isBrowser = typeof window !== 'undefined';
    const isProduction = process.env.NODE_ENV === 'production';

    const normalize = (val: string) => (val.endsWith('/') ? val.slice(0, -1) : val);

    /**
     * Defensive normalization: Ensure /api/v1 suffix is present
     * Prevents 404s if env var is misconfigured without /api/v1
     */
    const ensureApiV1Suffix = (url: string): string => {
        const normalized = normalize(url);
        if (!normalized.endsWith('/api/v1')) {
            return `${normalized}/api/v1`;
        }
        return normalized;
    };

    // SERVER (SSR) — must return ABSOLUTE URL to avoid "Failed to parse URL"
    if (!isBrowser) {
        const envBase =
            process.env.API_BASE_URL ||
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            'http://localhost:8000/api/v1';
        return ensureApiV1Suffix(envBase);
    }

    // BROWSER — prefer NEXT_PUBLIC_API_BASE_URL if set
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        const url = ensureApiV1Suffix(process.env.NEXT_PUBLIC_API_BASE_URL);
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            const logKey = '__api_base_logged';
            if (!(window as any)[logKey]) {
                console.log(`[API Config] Using configured backend: ${url}`);
                (window as any)[logKey] = true;
            }
        }
        return url;
    }

    // Browser non-localhost default: use relative path so hosting rewrites apply
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const isLocalhost =
            hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname === '[::1]';
        if (!isLocalhost) {
            return '/api/v1';
        }
    }

    // PRODUCTION BROWSER: Use relative path so Firebase Hosting rewrites can proxy to Cloud Run
    if (isProduction) {
        const url = '/api/v1';
        return url;
    }

    // Local dev fallback: hit local backend
    const url = normalize('http://localhost:8000/api/v1');
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        const logKey = '__api_base_logged';
        if (!(window as any)[logKey]) {
            console.log(`[API Config] Using local backend (default): ${url}`);
            (window as any)[logKey] = true;
        }
    }
    return url;
}
