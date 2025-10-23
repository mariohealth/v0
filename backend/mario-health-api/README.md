# 💊 Mario Health API (FastAPI + Google Cloud Run)

## ✨ Features

- ⚡ **FastAPI** for high-performance APIs in Python  
- 🪄 **Supabase** as the Postgres backend  
- 🐳 Containerized with **Docker**  
- ☁️ Serverless hosting via **Google Cloud Run**  

## 🧰 Prerequisites

Before running or deploying, make sure you have:

- ✅ Python 3.10+  
- 🐳 [Docker](https://www.docker.com/)  
- 🪣 [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed & authenticated  
- 🐘 A [Supabase](https://supabase.com/) project with a table (e.g. `products`)

## Deploy to Google Cloud Run

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
  
  NEW:
  gcloud run deploy mario-health-api \
  --image us-central1-docker.pkg.dev/mario-mrf-data/docker-repo/mario-health-api \
  --update-env-vars SUPABASE_URL="https://anvremdouphhucqrxgoq.supabase.co" \
  --update-secrets=SUPABASE_KEY=supabase-default-secret-key:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```


## Test your deployment
From your command line:

Test root endpoint:
```
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" https://mario-health-api-72178908097.us-central1.run.app/
```
Test search endpoint:
```
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" "https://mario-health-api-72178908097.us-central1.run.app/search?q=apple"
```

