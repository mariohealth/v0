# API Gateway Setup for Mario Health API

This guide sets up a Google Cloud API Gateway that fronts the Cloud Run service, enabling public access while respecting organization policies that prevent making Cloud Run services public.

## Prerequisites

- Google Cloud SDK installed and authenticated
- Project ID: `mario-mrf-data`
- Region: `us-central1`
- Cloud Run service: `mario-health-api` (must exist and be accessible)

## Quick Deploy

Run the automated deployment script:

```bash
cd backend/mario-health-api
./deploy-gateway.sh
```

## Manual Deployment

If you prefer to run commands manually:

### 1. Enable Required APIs

```bash
gcloud services enable \
  apigateway.googleapis.com \
  servicemanagement.googleapis.com \
  servicecontrol.googleapis.com \
  --project=mario-mrf-data
```

### 2. Set Up Service Account

```bash
# Use default App Engine service account or create a new one
SERVICE_ACCOUNT_EMAIL="mario-mrf-data@appspot.gserviceaccount.com"

# Grant Cloud Run Invoker role to the service account
gcloud run services add-iam-policy-binding mario-health-api \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/run.invoker" \
  --region=us-central1 \
  --project=mario-mrf-data
```

### 3. Create API

```bash
gcloud api-gateway apis create mario-health-api \
  --project=mario-mrf-data \
  --display-name="Mario Health API"
```

### 4. Create API Config

```bash
gcloud api-gateway api-configs create mario-health-api-config \
  --api=mario-health-api \
  --openapi-spec=api-gateway-config.yaml \
  --project=mario-mrf-data \
  --backend-auth-service-account=mario-mrf-data@appspot.gserviceaccount.com
```

### 5. Create Gateway

```bash
gcloud api-gateway gateways create mario-health-api-gateway \
  --api=mario-health-api \
  --api-config=mario-health-api-config \
  --location=us-central1 \
  --project=mario-mrf-data
```

### 6. Get Gateway URL

```bash
gcloud api-gateway gateways describe mario-health-api-gateway \
  --location=us-central1 \
  --project=mario-mrf-data \
  --format='value(defaultHostname)'
```

## CORS Configuration

The API Gateway is configured to allow CORS requests from:

- `http://localhost:3000` (local development)
- `https://mario-health-frontend.vercel.app`
- `https://mario-health-clean.vercel.app`

All HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS) are allowed, along with all headers and credentials.

## Testing

After deployment, test the gateway:

```bash
# Get gateway URL
GATEWAY_URL=$(gcloud api-gateway gateways describe mario-health-api-gateway \
  --location=us-central1 \
  --project=mario-mrf-data \
  --format='value(defaultHostname)')

# Test health endpoint
curl "https://${GATEWAY_URL}/api/v1/health"

# Test categories endpoint
curl "https://${GATEWAY_URL}/api/v1/categories"

# Test CORS (from browser console)
fetch("https://${GATEWAY_URL}/api/v1/categories", {
  method: 'GET',
  headers: { 'Origin': 'http://localhost:3000' }
})
```

## Update Frontend Configuration

After deployment, update your frontend `.env.local`:

```bash
NEXT_PUBLIC_API_URL=https://<gateway-url>
```

Replace `<gateway-url>` with the actual gateway hostname from step 6.

## Troubleshooting

### Gateway Not Accessible

1. Check gateway status:
   ```bash
   gcloud api-gateway gateways describe mario-health-api-gateway \
     --location=us-central1 \
     --project=mario-mrf-data
   ```

2. Check API config:
   ```bash
   gcloud api-gateway api-configs describe mario-health-api-config \
     --api=mario-health-api \
     --project=mario-mrf-data
   ```

### CORS Errors

1. Verify CORS configuration in `api-gateway-config.yaml`
2. Check that your origin is in the `allowedOrigins` list
3. Ensure `allowCredentials: true` is set if using authentication

### 403 Forbidden

1. Verify service account has `roles/run.invoker` permission:
   ```bash
   gcloud run services get-iam-policy mario-health-api \
     --region=us-central1 \
     --project=mario-mrf-data
   ```

2. Check that the service account email matches in both the IAM policy and API config

## Cleanup

To remove the API Gateway:

```bash
# Delete gateway
gcloud api-gateway gateways delete mario-health-api-gateway \
  --location=us-central1 \
  --project=mario-mrf-data

# Delete API config
gcloud api-gateway api-configs delete mario-health-api-config \
  --api=mario-health-api \
  --project=mario-mrf-data

# Delete API
gcloud api-gateway apis delete mario-health-api \
  --project=mario-mrf-data
```

