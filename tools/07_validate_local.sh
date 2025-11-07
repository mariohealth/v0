#!/bin/bash
set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔎 Phase 7: Local Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

export FRONTEND_DIR="${FRONTEND_DIR:-./mario-health-frontend}"
export BACKEND_DIR="${BACKEND_DIR:-./backend/mario-health-api}"

# Check frontend
if [ -d "$FRONTEND_DIR" ]; then
    echo "📦 Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    if [ ! -d "node_modules" ]; then
        npm install
    else
        echo "✅ Frontend dependencies already installed"
    fi
    
    echo ""
    echo "✅ Frontend setup complete"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 Manual Testing Instructions:"
    echo ""
    echo "1. Start the frontend dev server:"
    echo "   cd $FRONTEND_DIR"
    echo "   npm run dev"
    echo ""
    echo "2. Open http://localhost:3000 in your browser"
    echo ""
    echo "3. Test Firebase Auth:"
    echo "   - Sign in with Google (ensure provider is enabled in Firebase Console)"
    echo "   - Check browser console for auth state"
    echo ""
    echo "4. Test token retrieval (in browser console):"
    echo "   import { auth } from '@/lib/firebase';"
    echo "   const token = await auth.currentUser?.getIdToken();"
    echo "   console.log('Token:', token);"
    echo ""
    echo "5. Test secure endpoint:"
    echo "   const r = await fetch('/api/secure/verify', {"
    echo "     headers: { Authorization: \`Bearer \${token}\` }"
    echo "   });"
    echo "   console.log(await r.json());"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    cd - > /dev/null
else
    echo "⚠️  Frontend directory not found: $FRONTEND_DIR"
fi

# Check backend
if [ -d "$BACKEND_DIR" ]; then
    echo ""
    echo "📦 Backend setup check..."
    cd "$BACKEND_DIR"
    
    if [ -f "requirements.txt" ]; then
        echo "✅ requirements.txt found"
        if grep -q "firebase-admin" requirements.txt; then
            echo "✅ firebase-admin in requirements.txt"
        else
            echo "⚠️  firebase-admin not in requirements.txt"
        fi
    fi
    
    if [ -f "app/auth/firebase_auth.py" ]; then
        echo "✅ Firebase auth module found"
    else
        echo "⚠️  Firebase auth module not found"
    fi
    
    echo ""
    echo "✅ Backend setup check complete"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧪 Backend Testing:"
    echo ""
    echo "1. Install dependencies:"
    echo "   cd $BACKEND_DIR"
    echo "   pip install -r requirements.txt"
    echo ""
    echo "2. Ensure ADC is configured:"
    echo "   gcloud auth application-default login"
    echo ""
    echo "3. Start backend:"
    echo "   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    echo ""
    echo "4. Test secure endpoint:"
    echo "   curl -H 'Authorization: Bearer <token>' http://localhost:8000/secure/verify"
    echo ""
    
    cd - > /dev/null
else
    echo "⚠️  Backend directory not found: $BACKEND_DIR"
fi

echo ""
echo "✅ Validation complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

