import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

/**
 * Next.js API route to generate Google Cloud identity tokens
 * for authenticating with Cloud Run services.
 * 
 * This route uses the Google Auth Library to generate an identity token
 * with the Cloud Run service URL as the target audience.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the target audience (Cloud Run service URL) from environment or use default
    const targetAudience = 
      process.env.NEXT_PUBLIC_API_URL || 
      'https://mario-health-api-ei5wbr4h5a-uc.a.run.app';

    // Initialize Google Auth
    // This will automatically use credentials from:
    // 1. GOOGLE_APPLICATION_CREDENTIALS environment variable (service account key file)
    // 2. GCP metadata server (if running on GCP)
    // 3. gcloud auth application-default login credentials
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    // Get the client (this will use default credentials)
    const client = await auth.getIdTokenClient(targetAudience);
    
    // Get the identity token
    const idToken = await client.idTokenProvider.fetchIdToken(targetAudience);

    if (!idToken) {
      return NextResponse.json(
        { error: 'Failed to generate identity token' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      token: idToken,
      expiresIn: 3600, // Google identity tokens typically expire in 1 hour
    });
  } catch (error) {
    console.error('Error generating identity token:', error);
    
    // Provide helpful error messages
    let errorMessage = 'Failed to generate identity token';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Could not load the default credentials')) {
        errorMessage = 'Google Cloud credentials not configured. Please set GOOGLE_APPLICATION_CREDENTIALS or use gcloud auth application-default login';
        statusCode = 401;
      } else if (error.message.includes('ENOENT')) {
        errorMessage = 'Service account key file not found. Check GOOGLE_APPLICATION_CREDENTIALS path';
        statusCode = 401;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: statusCode }
    );
  }
}
