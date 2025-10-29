# GCP Cloud Run Authentication Setup

This document explains how authentication is configured for GCP Cloud Run API calls.

## Architecture

The authentication flow works as follows:

1. **Frontend** → calls `getAuthToken()` from `src/lib/api.ts`
2. **Next.js API Route** → `/api/auth/token` (handled by `frontend/app/api/auth/token/route.ts`)
3. **Google Auth Library** → Generates identity token using service account credentials
4. **Backend API** → Token is included in `Authorization: Bearer {token}` header for all requests

## Environment Variables

Add the following to your `frontend/.env.local` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://mario-health-api-ei5wbr4h5a-uc.a.run.app
NEXT_PUBLIC_API_VERSION=v1

# Google Cloud Platform Configuration
# Option 1: Service Account Key File (recommended for local development)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json

# Option 2: Leave empty to use Application Default Credentials (ADC)
# This works automatically if:
# - Running on GCP (Cloud Run, Compute Engine, etc.)
# - You've run: gcloud auth application-default login
# GOOGLE_APPLICATION_CREDENTIALS=
```

## Setup Instructions

### Local Development

1. **Create a service account** (if you haven't already):
   ```bash
   gcloud iam service-accounts create mario-health-frontend \
     --display-name="Mario Health Frontend Service Account"
   ```

2. **Grant necessary permissions**:
   ```bash
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:mario-health-frontend@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.invoker"
   ```

3. **Create and download service account key**:
   ```bash
   gcloud iam service-accounts keys create ~/mario-health-key.json \
     --iam-account=mario-health-frontend@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

4. **Set environment variable**:
   ```bash
   # In frontend/.env.local
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/mario-health-key.json
   ```

### Alternative: Use Application Default Credentials

If you prefer not to use a service account key file:

```bash
# Authenticate with your user account
gcloud auth application-default login

# Leave GOOGLE_APPLICATION_CREDENTIALS empty or omit it
```

### Production Deployment

For production (e.g., Vercel, Cloud Run):

1. **Add environment variable** in your deployment platform:
   - Variable: `GOOGLE_APPLICATION_CREDENTIALS`
   - Value: Contents of your service account JSON key file (or use secrets management)

2. **Or use Workload Identity** (recommended for GCP deployments):
   - Configure Workload Identity Federation
   - The Google Auth Library will automatically use the service account attached to the Cloud Run service

## Token Caching

The authentication system includes automatic token caching:

- Tokens are cached in memory
- Tokens expire after 1 hour (Google's default)
- Tokens are refreshed 5 minutes before expiration
- On 401 errors, tokens are automatically refreshed and the request is retried once

## Verification

To verify authentication is working:

1. **Check the browser console** for any authentication errors
2. **Test an API call** using the API test page at `/api-test`
3. **Check network tab** to verify `Authorization: Bearer {token}` header is present in requests

## Troubleshooting

### Error: "Could not load the default credentials"

**Solution**: 
- Verify `GOOGLE_APPLICATION_CREDENTIALS` points to a valid service account key file
- Or run `gcloud auth application-default login` for ADC

### Error: "Service account key file not found"

**Solution**: 
- Check that the path in `GOOGLE_APPLICATION_CREDENTIALS` is correct
- Ensure the file exists and is readable

### Error: "Authentication failed: 401"

**Solution**:
- Verify the service account has `roles/run.invoker` permission
- Ensure the target audience (API URL) matches the Cloud Run service URL
- Check that the Cloud Run service allows unauthenticated invocations (if needed) or requires authentication

### Token not refreshing

**Solution**:
- Check browser console for errors from `/api/auth/token`
- Verify the Next.js API route is accessible
- Check that `google-auth-library` is installed in `frontend/package.json`

## API Functions

All API functions automatically use authentication:

- `fetchHealthCheck()`
- `fetchCategories()`
- `getFamiliesByCategory()`
- `getProceduresByFamily()`
- `getProcedureDetail()`
- `searchProcedures()`
- `getBillingCodeDetail()`
- `getProviderDetail()`

The `Authorization: Bearer {token}` header is automatically added to all requests.

