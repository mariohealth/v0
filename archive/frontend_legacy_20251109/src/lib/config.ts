/**
 * Centralized API Configuration
 * 
 * This file centralizes all API configuration to ensure consistency
 * across the application. All API calls should import API_BASE_URL from here.
 * 
 * CRITICAL: For Firebase Hosting deployment, this must point to the API Gateway:
 * https://mario-health-api-gateway-x5pghxd.uc.gateway.dev
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://mario-health-api-gateway-x5pghxd.uc.gateway.dev";

// Validate API URL is configured
if (typeof window !== 'undefined') {
  if (!API_BASE_URL || API_BASE_URL === 'your_api_url') {
    console.warn('⚠️  NEXT_PUBLIC_API_URL is not configured. Using default API Gateway URL.');
  }
  console.log('✅ API Base URL configured:', API_BASE_URL);
}

