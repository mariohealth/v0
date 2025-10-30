# Workload Identity Federation Setup Guide

Complete guide to set up secure authentication between GitHub Actions and Google Cloud.

## Prerequisites

- GCP project with billing enabled
- GitHub repository
- `gcloud` CLI installed and authenticated
- Owner or Security Admin role on GCP project

## Step-by-Step Setup

### 1. Set Environment Variables
```bash
export PROJECT_ID="your-gcp-project-id"
export GITHUB_ORG="your-github-username-or-org"
export GITHUB_REPO="bigquery-to-postgres"
export SERVICE_ACCOUNT_NAME="github-bigquery-sync"
export WORKLOAD_IDENTITY_POOL="github-actions-pool"
export WORKLOAD_IDENTITY_PROVIDER="github-actions-provider"

# Get project number (needed later)
export PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
```

### 2. Create Service Account
```bash
gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
    --project=${PROJECT_ID} \
    --description="Service account for GitHub Actions BigQuery sync" \
    --display-name="GitHub BigQuery Sync"

export SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
```

### 3. Grant Permissions
```bash
# BigQuery Data Viewer (read data)
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/bigquery.dataViewer"

# BigQuery Job User (run queries)
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/bigquery.jobUser"
```

### 4. Create Workload Identity Pool
```bash
gcloud iam workload-identity-pools create ${WORKLOAD_IDENTITY_POOL} \
    --project=${PROJECT_ID} \
    --location="global" \
    --display-name="GitHub Actions Pool"
```

### 5. Create Workload Identity Provider
```bash
gcloud iam workload-identity-pools providers create-oidc ${WORKLOAD_IDENTITY_PROVIDER} \
    --project=${PROJECT_ID} \
    --location="global" \
    --workload-identity-pool=${WORKLOAD_IDENTITY_POOL} \
    --display-name="GitHub Actions Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
    --attribute-condition="assertion.repository_owner == '${GITHUB_ORG}'" \
    --issuer-uri="https://token.actions.githubusercontent.com"
```

### 6. Bind Service Account to Workload Identity
```bash
gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT_EMAIL} \
    --project=${PROJECT_ID} \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WORKLOAD_IDENTITY_POOL}/attribute.repository/${GITHUB_ORG}/${GITHUB_REPO}"
```

### 7. Get Provider Resource Name
```bash
gcloud iam workload-identity-pools providers describe ${WORKLOAD_IDENTITY_PROVIDER} \
    --project=${PROJECT_ID} \
    --location="global" \
    --workload-identity-pool=${WORKLOAD_IDENTITY_POOL} \
    --format="value(name)"
```

Copy the output - you'll need it for GitHub secrets.

### 8. Configure GitHub Secrets

Go to: `https://github.com/${GITHUB_ORG}/${GITHUB_REPO}/settings/secrets/actions`

Add these secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `WIF_PROVIDER` | Provider name from step 7 | `projects/123.../providers/github-actions-provider` |
| `WIF_SERVICE_ACCOUNT` | Service account email | `github-bigquery-sync@project.iam.gserviceaccount.com` |
| `GCP_PROJECT_ID` | Your project ID | `my-gcp-project` |
| `BIGQUERY_DATASET` | Dataset name | `healthcare_data` |
| `POSTGRES_DB_URL` | Connection string | `postgresql://user:pass@host:5432/db` |

### 9. Test the Setup

Go to GitHub Actions → Run workflow manually to test authentication.

## Troubleshooting

**Error: "Permission denied"**
- Check service account has correct roles
- Verify workload identity binding includes your repo

**Error: "Invalid workload identity"**
- Confirm `attribute.repository_owner` matches your GitHub org/username
- Check provider configuration

**Error: "Token request failed"**
- Ensure `permissions: id-token: write` is in workflow file
- Verify provider issuer URI is `https://token.actions.githubusercontent.com`

## Cleanup (if needed)
```bash
# Delete provider
gcloud iam workload-identity-pools providers delete ${WORKLOAD_IDENTITY_PROVIDER} \
    --location="global" \
    --workload-identity-pool=${WORKLOAD_IDENTITY_POOL}

# Delete pool
gcloud iam workload-identity-pools delete ${WORKLOAD_IDENTITY_POOL} \
    --location="global"

# Delete service account
gcloud iam service-accounts delete ${SERVICE_ACCOUNT_EMAIL}
```

## References

- [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [GitHub Actions with Google Cloud](https://github.com/google-github-actions/auth)
