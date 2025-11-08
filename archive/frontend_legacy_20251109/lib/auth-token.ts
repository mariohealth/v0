/**
 * Auth token utility for fetching and caching Google Cloud identity tokens
 * Used to authenticate requests to the FastAPI backend (local or Cloud Run)
 */

interface TokenCache {
    token: string;
    expiresAt: number;
}

// Token cache to avoid fetching on every request
// Tokens expire after 3600 seconds (1 hour), but we'll refresh 5 minutes early
let tokenCache: TokenCache | null = null;
const TOKEN_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch an identity token from the Next.js auth endpoint
 * Uses Application Default Credentials (gcloud auth application-default login)
 */
async function fetchAuthToken(): Promise<string> {
    try {
        const response = await fetch('/api/auth/token', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error || `Failed to fetch auth token: ${response.statusText}`);
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error fetching auth token:', error);
        throw error;
    }
}

/**
 * Get a valid auth token, using cache if available and not expired
 * @returns Promise resolving to a Bearer token string (without "Bearer " prefix)
 */
export async function getAuthToken(): Promise<string | null> {
    // Check if we have a valid cached token
    if (tokenCache && Date.now() < tokenCache.expiresAt) {
        return tokenCache.token;
    }

    try {
        const token = await fetchAuthToken();
        
        // Cache the token with expiration (3600 seconds, minus 5 min buffer)
        const expiresIn = 3600 * 1000 - TOKEN_BUFFER_MS;
        tokenCache = {
            token,
            expiresAt: Date.now() + expiresIn,
        };

        return token;
    } catch (error) {
        console.error('Failed to get auth token:', error);
        // For local development, return null if token fetch fails
        // This allows testing without Google Cloud credentials
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            console.warn('⚠️  Auth token not available. Continuing without Authorization header.');
            return null;
        }
        throw error;
    }
}

/**
 * Clear the token cache (useful for testing or forced refresh)
 */
export function clearTokenCache(): void {
    tokenCache = null;
}

