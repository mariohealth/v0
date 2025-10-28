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

## Deploy on your local machine
```
# Create virtual environment (if not already done)
python -m venv venv

# Activate it
# On Mac/Linux:
source .venv/bin/activate

# Install requirements in virtual env (if not already done)
pip install --no-cache-dir -r requirements.txt

# Set the following variables in .env to their correct value
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-key

# From your backend/ directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Then test (from a different terminal)
curl http://localhost:8000/api/v1/categories/imaging/families

# Deactivate venv if needed
deactivate
```

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
  --update-env-vars SUPABASE_URL="https://anvremdouphhucqrxgoq.supabase.co" \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
  
  maybe not needed every time:
  --update-secrets=SUPABASE_KEY=supabase-default-secret-key:latest \
```

## Test your cloud deployment
From your command line:

Test root endpoint:
```
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" https://mario-health-api-72178908097.us-central1.run.app/
```
Test search endpoint:
```
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" "https://mario-health-api-72178908097.us-central1.run.app/search?q=apple"
```

