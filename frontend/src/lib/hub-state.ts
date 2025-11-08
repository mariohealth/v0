/**
 * Health Hub state persistence utility
 * Stores active tab/subtab in localStorage
 */

const HUB_STATE_KEY = 'marioHubState';

export interface HubState {
    activeTab?: 'appointments' | 'claims' | 'messages' | 'overview';
    lastVisited?: string;
}

/**
 * Get saved hub state
 */
export function getHubState(): HubState {
    if (typeof window === 'undefined') {
        return {};
    }

    try {
        const stored = localStorage.getItem(HUB_STATE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error parsing hub state:', e);
    }

    return {};
}

/**
 * Save hub state
 */
export function saveHubState(state: HubState): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(HUB_STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('Error saving hub state:', e);
    }
}

/**
 * Clear hub state
 */
export function clearHubState(): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.removeItem(HUB_STATE_KEY);
    } catch (e) {
        console.error('Error clearing hub state:', e);
    }
}

