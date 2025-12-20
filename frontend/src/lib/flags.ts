export const FLAGS = {
    ENABLE_REWARDS: false,
    ENABLE_BOOKING: false,
    ENABLE_AI_CONCIERGE: false,
    ENABLE_INSURANCE_OCR: false,
    // Add more flags here as needed
} as const;

export type FeatureFlag = keyof typeof FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
    return FLAGS[flag];
}
