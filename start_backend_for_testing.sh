#!/bin/bash
# Start backend with correct configuration for testing

cd "$(dirname "$0")/backend/mario-health-api"

# Set required environment variables
export GOOGLE_ALLOWED_AUDIENCES="764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com"
export ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,https://mario-health-frontend.vercel.app"
export ENVIRONMENT="development"

echo "Starting backend with configuration:"
echo "  GOOGLE_ALLOWED_AUDIENCES: $GOOGLE_ALLOWED_AUDIENCES"
echo "  ALLOWED_ORIGINS: $ALLOWED_ORIGINS"
echo ""
echo "Backend will be available at: http://127.0.0.1:8000"
echo "Press Ctrl+C to stop"
echo ""

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

