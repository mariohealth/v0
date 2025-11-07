#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Phase 0: Checking Prerequisites"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi
echo "✅ npm $(npm -v) found"

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI not found. Installing globally..."
    npm install -g firebase-tools
fi
echo "✅ Firebase CLI $(firebase --version) found"

# Check gcloud CLI
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed. Please install from https://cloud.google.com/sdk/docs/install"
    exit 1
fi
echo "✅ Google Cloud SDK $(gcloud --version | head -n1) found"

# Check Firebase login
if ! firebase projects:list &> /dev/null; then
    echo "⚠️  Not logged in to Firebase. Please run: firebase login"
    echo "   Running firebase login now..."
    firebase login
fi
echo "✅ Logged in to Firebase"

# Check gcloud login
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "⚠️  Not logged in to Google Cloud. Please run: gcloud auth login"
    echo "   Running gcloud auth login now..."
    gcloud auth login
fi
echo "✅ Logged in to Google Cloud"

# Check ADC
if ! gcloud auth application-default print-access-token &> /dev/null; then
    echo "⚠️  Application Default Credentials not set. Please run: gcloud auth application-default login"
    echo "   Running gcloud auth application-default login now..."
    gcloud auth application-default login
fi
echo "✅ Application Default Credentials configured"

# Load environment variables from .env.firebase if it exists
if [ -f .env.firebase ]; then
    echo "📝 Loading environment variables from .env.firebase"
    set -a
    source .env.firebase
    set +a
fi

# Check required environment variables
REQUIRED_VARS=(
    "FIREBASE_PROJECT_ID"
    "FIREBASE_SITE_ID"
    "CLOUD_RUN_SERVICE_ID"
    "CLOUD_RUN_REGION"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var:-}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please create .env.firebase with these variables or export them:"
    echo "  export FIREBASE_PROJECT_ID=your-project-id"
    echo "  export FIREBASE_SITE_ID=your-site-id"
    echo "  export CLOUD_RUN_SERVICE_ID=your-service-id"
    echo "  export CLOUD_RUN_REGION=us-central1"
    exit 1
fi

# Set default directories if not set
export FRONTEND_DIR="${FRONTEND_DIR:-./mario-health-frontend}"
export BACKEND_DIR="${BACKEND_DIR:-./backend/mario-health-api}"

echo ""
echo "✅ All prerequisites met!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Configuration:"
echo "   FIREBASE_PROJECT_ID: $FIREBASE_PROJECT_ID"
echo "   FIREBASE_SITE_ID: $FIREBASE_SITE_ID"
echo "   CLOUD_RUN_SERVICE_ID: $CLOUD_RUN_SERVICE_ID"
echo "   CLOUD_RUN_REGION: $CLOUD_RUN_REGION"
echo "   FRONTEND_DIR: $FRONTEND_DIR"
echo "   BACKEND_DIR: $BACKEND_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

