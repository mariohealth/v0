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

    const normalize = (val: string) => (val.endsWith('/') ? val.slice(0, -1) : val);

    // SERVER (SSR) — must return ABSOLUTE URL to avoid "Failed to parse URL"
    if (!isBrowser) {
        const envBase =
            process.env.API_BASE_URL ||
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            'http://localhost:8000/api/v1';
        return normalize(envBase);
    }

    // BROWSER — prefer NEXT_PUBLIC_API_BASE_URL if set (allows pointing to deployed backend)
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
        return normalize(process.env.NEXT_PUBLIC_API_BASE_URL);
    }

    // Local dev fallback: hit local backend
    return normalize('http://localhost:8000/api/v1');
}
