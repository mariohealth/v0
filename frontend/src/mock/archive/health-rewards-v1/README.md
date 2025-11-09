# Health Hub & Rewards v1 - Mock Data Archive

**Archive Date:** November 10, 2024

**Context:** This archive contains mock data that was previously used in the Health Hub and Rewards components before migrating to live API calls.

## Files Archived

- `health-hub-mock-data.ts` - Mock data for Health Hub including:
  - Upcoming appointments
  - Past appointments
  - Concierge requests
  - Recent claims
  - Messages
  - Deductible progress

- `rewards-mock-data.ts` - Mock data for Rewards including:
  - All available rewards (gift cards, donations, etc.)
  - Reward categories and details

## Migration Notes

- Mock data was replaced with live API calls:
  - Health Hub → `/api/v1/appointments`, `/api/v1/claims`, `/api/v1/requests`
  - Rewards → Firestore or Supabase users table for points
- The components now use helper functions in `lib/api.ts`:
  - `fetchHealthHubData(userId)`
  - `fetchRewardsData(userId)`
  - `updateMarioPoints(userId, delta)`
- If API fails, components fall back to archived mock data with "Offline Mode" banner

## Usage

This data is preserved for reference and fallback only. Do not import or use in production code unless as a fallback when APIs are unavailable.

