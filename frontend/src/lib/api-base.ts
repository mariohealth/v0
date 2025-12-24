/**
 * UNIVERSAL API ACCESS HELPER
 * 
 * FRONTEND API ACCESS RULE:
 * 1. Absolute Cloud Run / gateway URLs are FORBIDDEN in client-side code.
 * 2. Every API call MUST go through this helper (getApiBaseUrl).
 * 3. Relative paths (like /api/v1) are used in production to leverage Firebase Hosting CORS proxy.
 * 4. Local development uses Next.js rewrites to proxy /api to the absolute gateway URL.
 * 
 * If you add a gateway URL directly to client-side code, it may cause CORS errors in production.
 */

/**
 * Returns the universal API base URL based on the current environment.
 * In the browser, this typically returns a relative path like '/api/v1'.
 */
export function getApiBaseUrl(): string {
    // 1. In browser on Firebase Hosting, ALWAYS use relative URL to leverage proxy
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('web.app') || hostname.includes('mariohealth.com') || hostname === 'localhost' || hostname === '127.0.0.1') {
            // For both production and local dev, relative paths are handled by proxies 
            // (Firebase rewrites in prod, Next.js rewrites in local dev)
            return '/api/v1';
        }
    }

    // 2. Fallback for SSR or other environments (should use relative whenever possible)
    const base = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';

    // Safety check: strip protocol if it accidentally leaked into NEXT_PUBLIC_API_BASE in a browser environment
    if (typeof window !== 'undefined' && base.startsWith('http')) {
        console.warn('[API Base] Absolute URL detected in browser environment. Falling back to relative path to avoid CORS issues.');
        return '/api/v1';
    }

    return base.endsWith('/') ? base.slice(0, -1) : base;
}
