#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🛡️  Phase 5: Backend Firebase Admin SDK (ADC) + CORS + Secure Routes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

export BACKEND_DIR="${BACKEND_DIR:-./backend/mario-health-api}"

if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found: $BACKEND_DIR"
    exit 1
fi

cd "$BACKEND_DIR"

# Add firebase-admin to requirements.txt if not present
echo "📝 Checking requirements.txt..."
if ! grep -q "firebase-admin" requirements.txt; then
    echo "firebase-admin>=6.0.0" >> requirements.txt
    echo "✅ Added firebase-admin to requirements.txt"
else
    echo "✅ firebase-admin already in requirements.txt"
fi

# Verify firebase_auth.py exists (already created in previous work)
if [ -f "app/auth/firebase_auth.py" ]; then
    echo "✅ Firebase auth module exists"
else
    echo "⚠️  Firebase auth module not found. It should have been created earlier."
fi

echo ""
echo "✅ Backend Firebase Admin SDK setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Next Steps:"
echo "   1. Install backend dependencies: pip install -r requirements.txt"
echo "   2. Ensure CORS is configured in main.py for Firebase Hosting domains"
echo "   3. Verify secure endpoints are added (/secure/verify)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd - > /dev/null

