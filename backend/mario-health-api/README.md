bla bla
# Deploy to Google Cloud Run

Install & configure Google Cloud SDK:
```
gcloud auth login
gcloud config set project mario-mrf-data
```
Build container image:
```
gcloud builds submit --tag gcr.io/mario-mrf-data/mario-health-api
```
Deploy to Cloud Run:
```
gcloud run deploy mario-health-api \
  --image gcr.io/mario-mrf-data/mario-health-api \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated
```
When prompted, set the environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`