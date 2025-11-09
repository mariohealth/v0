# MarioAI v1 - Conversation Scripts Archive

**Archive Date:** November 10, 2024

**Context:** This archive contains mock conversation scripts that were previously used in MarioAI chat components before migrating to live API calls.

## Files Archived

- `conversation-scripts.ts` - Mock conversation scripts including:
  - Chest tightness conversation flow
  - Knee pain conversation flow
  - Headache conversation flow
  - Diabetes medication conversation flow
  - Allergies conversation flow
  - Sleep issues conversation flow
  - Topic detection function

## Migration Notes

- Conversation scripts were replaced with live API calls
- Chat context is now persisted in localStorage for session continuity
- Quick actions now navigate to specific routes:
  - "Book a Visit" → `/home?mode=book`
  - "Rx Renewal" → `/medications`
  - "I Have a Health Concern" → `/ai?context=concern`

## Usage

This data is preserved for reference and dev mode fallback only. Do not import or use in production code unless as a fallback when APIs are unavailable.

