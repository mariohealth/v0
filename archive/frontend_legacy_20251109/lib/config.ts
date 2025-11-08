/**
 * Centralized API Configuration
 * 
 * This file centralizes all API configuration to ensure consistency
 * across the application. All API calls should import API_BASE_URL from here.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mario-health-api-ei5wbr4h5a-uc.a.run.app";

// Validate API URL is configured
if (!API_BASE_URL || API_BASE_URL === 'your_api_url') {
  console.warn('⚠️  NEXT_PUBLIC_API_URL is not configured. Using default Cloud Run URL.');
}

