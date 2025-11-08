# 🔥 Firebase Deployment Guide

Complete guide for deploying Mario Health to Firebase Hosting with Firebase Auth and Cloud Run backend.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Step-by-Step Setup](#step-by-step-setup)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Rollback Instructions](#rollback-instructions)

## 🧰 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 18+** and npm
- ✅ **Firebase CLI** (`npm install -g firebase-tools`)
- ✅ **Google Cloud SDK** (`gcloud`) installed and authenticated
- ✅ **Firebase project** created in [Firebase Console](https://console.firebase.google.com/)
- ✅ **Cloud Run service** deployed (your FastAPI backend)

### Authentication Setup

You need to be logged in to both Firebase and Google Cloud:

```bash
# Login to Firebase
firebase login

# Login to Google Cloud
gcloud auth login

# Set up Application Default Credentials (ADC) for local development
gcloud auth application-default login
```

## 🚀 Quick Start

1. **Create `.env.firebase` file** in the repository root:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SITE_ID=your-site-id

# Cloud Run Configuration
CLOUD_RUN_SERVICE_ID=your-service-id
CLOUD_RUN_REGION=us-central1

# Directory Configuration
FRONTEND_DIR=./frontend
BACKEND_DIR=./backend/mario-health-api
```

2. **Run the full deployment**:

```bash
make all
```

This will run all phases in order:
- Check prerequisites
- Initialize Firebase project
- Link Cloud Run service
- Set up environment files
- Migrate frontend to Firebase Auth
- Set up backend Firebase Admin SDK
- Configure Firebase Hosting rewrites
- Validate locally
- Deploy to Firebase Hosting

## 📝 Step-by-Step Setup

For more control, run each phase individually:

```bash
# Phase 0: Check prerequisites
make prereqs

# Phase 1: Initialize Firebase project
make init

# Phase 2: Link Cloud Run service
make link

# Phase 3: Set up environment files
make env

# Phase 4: Migrate frontend to Firebase Auth
make frontend

# Phase 5: Set up backend Firebase Admin SDK
make backend

# Phase 6: Configure Firebase Hosting rewrites
make rewrites

# Phase 7: Validate locally
make validate

# Phase 8: Deploy to Firebase Hosting
make deploy
```

## 🔐 Environment Variables

### Root `.env.firebase`

Create this file in the repository root:

```bash
FIREBASE_PROJECT_ID=mario-health
FIREBASE_SITE_ID=mario-health
CLOUD_RUN_SERVICE_ID=mario-health-api
CLOUD_RUN_REGION=us-central1
FRONTEND_DIR=./frontend
BACKEND_DIR=./backend/mario-health-api
```

### Frontend `.env.local`

Create this file in `frontend/.env.local`:

```bash
# Get these from Firebase Console → Project Settings → Your apps → Web app
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**How to get Firebase Web app credentials:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. Click on your Web app (or create one if it doesn't exist)
6. Copy the configuration values

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Firebase Hosting (Frontend)                │
│  https://your-site.web.app                              │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js App (Static + SSR)                     │   │
│  │  - Firebase Auth (Client-side)                  │   │
│  │  - AuthProvider (Session persistence)            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ /api/** requests
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Cloud Run (Backend)                        │
│  https://your-service.run.app                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  FastAPI Application                             │   │
│  │  - Firebase Admin SDK (ADC)                      │   │
│  │  - Token verification                            │   │
│  │  - CORS configured for Firebase Hosting          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Configuration Files

### `firebase.json`

Firebase Hosting configuration with rewrites to Cloud Run:

```json
{
  "hosting": {
    "site": "your-site-id",
    "public": ".next",
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "your-service-id",
          "region": "us-central1"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### `.firebaserc`

Firebase project configuration:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

## 🐛 Troubleshooting

### 403 Forbidden on Hosting

**Symptoms:** Getting 403 errors when accessing Firebase Hosting.

**Solutions:**

1. **Verify Firebase project initialization:**
   ```bash
   firebase projects:list
   firebase use your-project-id
   ```

2. **Check Firebase Hosting site exists:**
   ```bash
   firebase hosting:sites:list
   ```

3. **Verify `firebase.json` rewrites:**
   - Check that `serviceId` matches your Cloud Run service
   - Check that `region` matches your Cloud Run region
   - Ensure Cloud Run service is accessible

4. **Check Cloud Run service accessibility:**
   ```bash
   gcloud run services describe your-service-id \
     --region us-central1 \
     --project your-project-id
   ```

5. **Verify CORS configuration:**
   - Check backend `main.py` includes Firebase Hosting origins
   - Ensure `allow_credentials=True` in CORS middleware

### 401 from `/secure/verify`

**Symptoms:** Getting 401 Unauthorized when calling secure endpoints.

**Solutions:**

1. **Confirm Firebase Auth enabled providers:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Google (or other providers you're using)

2. **Confirm token retrieval:**
   ```javascript
   // In browser console
   import { auth } from '@/lib/firebase';
   const token = await auth.currentUser?.getIdToken();
   console.log('Token:', token);
   ```

3. **Check Authorization header format:**
   ```javascript
   // Should be: "Bearer <token>"
   fetch('/api/secure/verify', {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   });
   ```

4. **Verify ADC for local development:**
   ```bash
   gcloud auth application-default login
   ```

5. **Check Cloud Run service account permissions:**
   - Service account needs **Firebase Admin** or **Identity Toolkit Admin** role
   ```bash
   gcloud projects add-iam-policy-binding your-project-id \
     --member="serviceAccount:your-service@your-project.iam.gserviceaccount.com" \
     --role="roles/firebase.admin"
   ```

### CORS Errors

**Symptoms:** CORS errors when frontend tries to call backend API.

**Solutions:**

1. **Verify CORS origins in backend:**
   - Check `main.py` includes Firebase Hosting origins:
     ```python
     FIREBASE_HOSTING_ORIGINS = [
         "https://*.web.app",
         "https://*.firebaseapp.com",
     ]
     ```

2. **Check CORS middleware configuration:**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=ALLOWED_ORIGINS,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Verify request origin:**
   - Check browser console for actual origin
   - Ensure it matches one of the allowed origins

### Supabase Postgres Still Used

**Note:** Supabase Postgres is still used for database operations. Only authentication has been migrated to Firebase.

**Mapping Firebase UID to Supabase:**

If you need to map Firebase `uid` to your Supabase `profiles.user_id`:

```sql
-- Example: Update profile with Firebase UID
UPDATE profiles
SET firebase_uid = 'firebase-uid-here'
WHERE user_id = 'supabase-user-id';
```

Keep existing Supabase database environment variables on Cloud Run (not on Hosting):
- `SUPABASE_URL`
- `SUPABASE_KEY`

### Build Errors

**Symptoms:** Frontend build fails.

**Solutions:**

1. **Check Firebase environment variables:**
   ```bash
   cd frontend
   cat .env.local
   # Ensure all NEXT_PUBLIC_FIREBASE_* variables are set
   ```

2. **Verify Firebase package installed:**
   ```bash
   cd frontend
   npm list firebase
   ```

3. **Clear Next.js cache:**
   ```bash
   cd frontend
   rm -rf .next
   npm run build
   ```

### Deployment Errors

**Symptoms:** `firebase deploy` fails.

**Solutions:**

1. **Check Firebase login:**
   ```bash
   firebase login:list
   ```

2. **Verify project access:**
   ```bash
   firebase projects:list
   ```

3. **Check Firebase Hosting site:**
   ```bash
   firebase hosting:sites:list
   ```

4. **Verify build output:**
   ```bash
   cd frontend
   ls -la .next
   # Ensure .next directory exists after build
   ```

## 🔄 Rollback Instructions

If you need to rollback to the previous setup:

### 1. Rollback Frontend

```bash
# Restore Supabase Auth in frontend
cd frontend
git checkout HEAD -- src/lib/supabase/
git checkout HEAD -- src/components/mario-auth-*.tsx
git checkout HEAD -- src/components/mario-navigation.tsx
```

### 2. Rollback Backend

```bash
# Remove Firebase Admin SDK
cd backend/mario-health-api
# Remove firebase-admin from requirements.txt
# Remove app/auth/firebase_auth.py
# Restore original main.py
git checkout HEAD -- app/main.py
```

### 3. Rollback Firebase Hosting

```bash
# Remove Firebase configuration
rm firebase.json
rm .firebaserc
```

### 4. Redeploy to Previous Platform

If you were using Vercel before:

```bash
cd frontend
vercel deploy
```

## 📚 Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials)

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. Check the [Firebase Status Page](https://status.firebase.google.com/)
2. Review Firebase Console logs
3. Check Cloud Run logs:
   ```bash
   gcloud logging read "resource.type=cloud_run_revision" --limit 50
   ```
4. Review browser console for frontend errors
5. Check Network tab for API request/response details

## ✅ Success Checklist

After deployment, verify:

- [ ] Firebase Hosting site is accessible: `https://your-site.web.app`
- [ ] Frontend loads correctly
- [ ] Firebase Auth login works (Google sign-in)
- [ ] User session persists across page reloads
- [ ] API endpoints are accessible: `https://your-site.web.app/api/...`
- [ ] Secure endpoints require authentication: `/api/secure/verify`
- [ ] CORS is configured correctly
- [ ] Cloud Run service is accessible
- [ ] Backend logs show successful token verification

---

**Last Updated:** $(date)
**Version:** 1.0.0

