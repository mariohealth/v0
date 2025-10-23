# Deploy to Google Cloud Run

Install & configure Google Cloud SDK:
```
gcloud auth login
gcloud config set project mario-mrf-data
```
Build container image:
```
gcloud builds submit --tag us-central1-docker.pkg.dev/mario-mrf-data/docker-repo/mario-health-api
```
Deploy to Cloud Run:
```
gcloud run deploy mario-health-api \
  --image us-central1-docker.pkg.dev/mario-mrf-data/docker-repo/mario-health-api \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```
When prompted, set the environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

# Test your deployment
From your command line:
```
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" "https://mario-health-api-72178908097.us-central1.run.app/search?q=apple"
curl "https://mario-health-api-72178908097.us-central1.run.app/search?q=apple"
```
