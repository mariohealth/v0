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
    const isBrowser = typeof window !== 'undefined';

    const normalize = (val: string) => (val.endsWith('/') ? val.slice(0, -1) : val);

    // SERVER (SSR) — must return ABSOLUTE URL to avoid "Failed to parse URL"
    if (!isBrowser) {
        const envBase =
            process.env.API_BASE_URL ||
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            'http://localhost:8000/api/v1';
        return normalize(envBase);
    }

    // BROWSER — prefer absolute env (needed for static export on Firebase)
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return normalize(process.env.NEXT_PUBLIC_API_BASE_URL);
    }

    // Local dev fallback: hit local API directly
    return normalize('http://localhost:8000/api/v1');
}
