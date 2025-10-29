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
### 1. Verify you're in the right directory
```
pwd # Should be in mario-health/backend/mario-health-api/
```
### 2. Start Docker Desktop on your local machine and test locally first
```
docker build -t mario-health-api-test .
docker run -p 8080:8080 \
  -e SUPABASE_URL="https://anvremdouphhucqrxgoq.supabase.co" \
  -e SUPABASE_KEY="your-key" \
  mario-health-api-test
```

### 3. Test in another terminal
```
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/categories
```

### 4. If works, proceed with deployment

Install & configure Google Cloud SDK:
```
gcloud auth login
gcloud config set project mario-mrf-data
```
Use the deployment script
```
chmod +x deploy.sh # make it executable (if not already done)

./deploy.sh
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

