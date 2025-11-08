/**
 * Mario Health Rewards System
 * Handles reward points for user actions
 */

export type RewardEventType =
    | 'concierge'
    | 'marioPick'
    | 'prescription'
    | 'profileComplete'
    | 'firstSearch'
    | 'firstBooking';

export interface RewardEvent {
    type: RewardEventType;
    points: number;
    timestamp: number;
    description: string;
}

const REWARD_POINTS: Record<RewardEventType, number> = {
    concierge: 50,
    marioPick: 25,
    prescription: 30,
    profileComplete: 100,
    firstSearch: 10,
    firstBooking: 75,
};

const REWARD_DESCRIPTIONS: Record<RewardEventType, string> = {
    concierge: 'Booked with Concierge',
    marioPick: 'Used MarioAI Pick',
    prescription: 'Found Prescription',
    profileComplete: 'Completed Profile',
    firstSearch: 'First Search',
    firstBooking: 'First Booking',
};

/**
 * Handle a reward event
 * Returns the points earned
 */
export function handleReward(eventType: RewardEventType): number {
    const points = REWARD_POINTS[eventType];
    const description = REWARD_DESCRIPTIONS[eventType];

    // Log to console (placeholder until backend connection)
    console.log(`[Rewards] ${description}: +${points} MarioPoints`);

    // Store in localStorage for now
    const rewards = getRewardHistory();
    const newReward: RewardEvent = {
        type: eventType,
        points,
        timestamp: Date.now(),
        description,
    };

    rewards.push(newReward);
    localStorage.setItem('marioRewards', JSON.stringify(rewards));

    // Update total points
    const totalPoints = getTotalPoints() + points;
    localStorage.setItem('marioTotalPoints', totalPoints.toString());

    return points;
}

/**
 * Get reward history from localStorage
 */
export function getRewardHistory(): RewardEvent[] {
    try {
        const stored = localStorage.getItem('marioRewards');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Get total points
 */
export function getTotalPoints(): number {
    try {
        const stored = localStorage.getItem('marioTotalPoints');
        return stored ? parseInt(stored, 10) : 0;
    } catch {
        return 0;
    }
}

/**
 * Clear reward history
 */
export function clearRewardHistory(): void {
    localStorage.removeItem('marioRewards');
    localStorage.removeItem('marioTotalPoints');
}

