# Next.js SSR Deployment to Cloud Run

This document describes the deployment process for the Next.js frontend with SSR support.

## Changes Made

1. **Removed static export**: Changed from `output: 'export'` to `output: 'standalone'` in `next.config.mjs`
2. **Updated firebase.json**: Routes all non-API requests to Cloud Run service `mario-health-frontend`
3. **Cleaned up dynamic routes**: Removed `generateStaticParams` from dynamic route pages (not needed for SSR)
4. **Created Dockerfile**: Added Dockerfile for Cloud Run deployment

## Dynamic Routes Supported

The following dynamic routes now work in production:
- `/providers/[id]` - Provider detail pages
- `/providers/[...id]` - Catch-all provider routes
- `/procedures/[slug]` - Procedure detail pages
- `/procedures/[...slug]` - Catch-all procedure routes
- Query parameter routes (e.g., `/home?procedure=...`) continue to work

## Deployment Steps

### 1. Build the Docker Image

```bash
cd frontend
docker build -t gcr.io/YOUR_PROJECT_ID/mario-health-frontend .
```

### 2. Push to Google Container Registry

```bash
docker push gcr.io/YOUR_PROJECT_ID/mario-health-frontend
```

### 3. Deploy to Cloud Run

```bash
gcloud run deploy mario-health-frontend \
  --image gcr.io/YOUR_PROJECT_ID/mario-health-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "NEXT_PUBLIC_API_BASE=https://mario-health-api-gateway-x5pghxd.uc.gateway.dev/api/v1"
```

### 4. Update Firebase Hosting

After deploying to Cloud Run, Firebase Hosting will automatically route requests to the Cloud Run service based on the `firebase.json` configuration.

## Local Development

Local development remains unchanged:
```bash
cd frontend
npm run dev
```

## Important Notes

- The Next.js standalone build creates a `server.js` file that runs the SSR server
- Cloud Run provides the `PORT` environment variable (defaults to 8080)
- All API routes (`/api/**`) continue to route to the `mario-health-api` Cloud Run service
- Static assets are served by Next.js from the `.next/static` directory


