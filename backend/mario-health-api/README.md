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
- ✅ Python 3.10+  
- 🐳 [Docker](https://www.docker.com/)  
- 🪣 [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed & authenticated  
- 🐘 A [Supabase](https://supabase.com/) project with a table (e.g. `products`)

## 🛡️ Security & Guardrails

### 1. Service Role Key Requirement
The backend explicitly requires the **Service Role API Key** (`supabase-service-role-key`) to function correctly.
-   **Why?**: The application performs direct table reads and RPC calls that may be protected by Row Level Security (RLS). The Service Role key bypasses these policies to ensure the backend can always fetch required data.
-   **Safety**: This key is verifying during startup and deployment. Using the `anon` key will cause startup failures in production.

### 2. Schema Facts
-   **NPI Lookup**: The `provider` table uses `provider_id` as the primary key, which **IS** the 10-digit NPI.
-   **No `npi` column**: There is no separate `npi` column. Code should strictly use `provider_id`. CI checks prevent usage of `npi` column references.

### 3. Resilience & Fallback
If the `get_provider_detail` RPC returns empty results (e.g., due to missing joined data like location), the service attempts a **Fallback**:
-   It queries the `provider` table directly.
-   If found, it returns a **Basic Profile** (name/specialty only) and sets `data_completeness="basic"` in the response.
-   This ensures providers are visible even if their profile data is incomplete.
-   **Note**: Critical errors (Auth, Connection, 503) are **NOT** masked and will return a 503 error.

## 🔐 Authenticate Local Environment

For local development, you need to authenticate with Google Cloud using Application Default Credentials (ADC):

```bash
# Authenticate local environment for Firebase Admin SDK
gcloud auth application-default login
```

This allows Firebase Admin SDK to use your local credentials. On Cloud Run, the runtime automatically uses the attached IAM service account, so no additional setup is needed.

## Deploy on your local machine
```bash
# Create virtual environment (if not already done)
python3 -m venv .venv

# Activate it
# On Mac/Linux:
source .venv/bin/activate

# Install requirements in virtual env (if not already done)
pip3 install --no-cache-dir -r requirements.txt

# Authenticate with Google Cloud for Firebase Admin SDK (required for local development)
gcloud auth application-default login

# Set the following variables in .env to their correct value
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-key

# From your backend/ directory
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Then test (from a different terminal)
curl http://localhost:8000/api/v1/categories/imaging/families

# Deactivate venv if needed
deactivate
```

## Deploy to Google Cloud Run
### 1. Verify you're in the right directory
```bash
pwd # Should be in mario-health/backend/mario-health-api/
```
### 2. Start Docker Desktop on your local machine and test locally first
```bash
docker build -t mario-health-api-test .
docker run -p 8080:8080 \
  -e SUPABASE_URL="https://anvremdouphhucqrxgoq.supabase.co" \
  -e SUPABASE_KEY="your-key" \
  mario-health-api-test
```

### 3. Test in another terminal
```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/categories
```

### 4. If works, proceed with deployment

Install & configure Google Cloud SDK:
```bash
gcloud auth login
gcloud config set project mario-mrf-data
```
Use the deployment script
```bash
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

