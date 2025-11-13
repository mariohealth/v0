# Mario Health API - Deployment Guide

## Working Configuration

### Package Versions (Verified Working)
```txt
fastapi==0.120.1
uvicorn[standard]==0.38.0
supabase==2.22.3
python-dotenv==1.0.0
pydantic==2.12.3
pydantic-core==2.41.4
```

### Known Issues

**Issue:** `SupabaseException: Invalid API key` with older package versions

**Solution:** Update to supabase==2.22.3 or later

**Issue:** Package version conflicts

**Solution:** Use exact versions from requirements.txt above

## Deployment Commands

### Quick Deploy
```bash
scripts/deploy.sh
```

### Manual Deploy
```bash
# Build
gcloud builds submit --tag us-central1-docker.pkg.dev/mario-mrf-data/docker-repo/mario-health-api

# Deploy
gcloud run deploy mario-health-api \
  --image us-central1-docker.pkg.dev/mario-mrf-data/docker-repo/mario-health-api \
  --update-env-vars SUPABASE_URL="https://anvremdouphhucqrxgoq.supabase.co",ENVIRONMENT="staging" \
  --update-secrets=SUPABASE_KEY=supabase-default-secret-key:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60
```

## Environment Variables

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: From Secret Manager (service_role key)
- `ENVIRONMENT`: `staging` or `production`
- `ALLOWED_ORIGINS`: CORS origins (optional)

## Testing Deployment
```bash
export API_URL=$(gcloud run services describe mario-health-api --region us-central1 --format='value(status.url)')

# Health check
curl "$API_URL/health"

# Test endpoints
curl "$API_URL/api/v1/categories"
curl "$API_URL/api/v1/search?q=chest"
```

## Troubleshooting

### View Logs
```bash
gcloud run services logs read mario-health-api --region us-central1 --limit 50
```

### Update Secret
```bash
echo -n "new-key" | gcloud secrets versions add supabase-default-secret-key --data-file=-
```

### Rollback
```bash
gcloud run services update-traffic mario-health-api \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-central1
```
