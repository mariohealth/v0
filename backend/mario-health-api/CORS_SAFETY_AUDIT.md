# CORS Configuration Safety Audit

## How Origins Are Combined

The backend combines origins in the following order:

1. **REQUIRED_ORIGINS** (lines 79-87 in `app/main.py`):
   - Hardcoded list of essential origins
   - **Always included** regardless of environment
   - Current list:
     - `http://localhost:3000`
     - `http://localhost:3001`
     - `http://127.0.0.1:3000`
     - `http://127.0.0.1:3001`
     - `https://mario-mrf-data.web.app`
     - `https://mario-health-frontend.vercel.app`
     - `https://mario-health-clean.vercel.app`

2. **ALLOWED_ORIGINS** (from env var, lines 96-104):
   - Read from `ALLOWED_ORIGINS` environment variable
   - Default if not set: production domains only
   - Can be overridden in deployment config

3. **Merge Logic** (lines 106-110):
   ```python
   for origin in REQUIRED_ORIGINS:
       if origin not in ALLOWED_ORIGINS:
           ALLOWED_ORIGINS.append(origin)
   ```
   - `REQUIRED_ORIGINS` are **appended** to `ALLOWED_ORIGINS`
   - Duplicates are skipped (via `if origin not in ALLOWED_ORIGINS`)

4. **Final List**:
   - Passed to `CORSMiddleware(allow_origins=ALLOWED_ORIGINS)`
   - **No wildcards** are used (FastAPI doesn't support them)
   - **Exact origin matching** required

## Production Safety Analysis

### ✅ No Wildcards
- No `*` or pattern matching in origin lists
- FastAPI's `allow_credentials=True` requires exact origin matches

### ⚠️ Localhost Origins in Production
**Current Behavior:**
- Localhost origins (`http://localhost:3000`, etc.) are in `REQUIRED_ORIGINS`
- These **ARE included in deployed environments** (staging, production)

**Security Assessment:**
- **Low risk**: Browsers enforce same-origin policy; production users cannot spoof localhost
- **Best practice**: Would be better to conditionally include localhost only in dev

**Recommendation for Production:**
Make localhost origins conditional based on environment:
```python
# Example improvement (not implemented yet):
if os.getenv("ENVIRONMENT") == "production":
    REQUIRED_ORIGINS = [
        "https://mario-mrf-data.web.app",
        "https://mario-health-frontend.vercel.app",
        "https://mario-health-clean.vercel.app",
    ]
else:
    REQUIRED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://mario-mrf-data.web.app",
        "https://mario-health-frontend.vercel.app",
        "https://mario-health-clean.vercel.app",
    ]
```

### Current Production Origins
When deployed with default config:
1. All `REQUIRED_ORIGINS` (including localhost)
2. Default `ALLOWED_ORIGINS`: `mario.health`, `www.mario.health`, Vercel deployments
3. Any additional origins set via `ALLOWED_ORIGINS` env var

## Verification

To see actual origins in a running backend:
```bash
# Check logs on startup
gcloud run services logs read mario-health-api --region us-central1 --limit 20 | grep "CORS configured"
```

Expected output:
```
🔒 CORS configured with allowed origins: ['http://localhost:3000', 'http://localhost:3001', ...]
```

## Summary

- ✅ No wildcards (secure)
- ✅ Exact origin matching enforced
- ⚠️ Localhost origins present in production (low risk but not best practice)
- ℹ️ To restrict localhost to dev only, use environment-based filtering
