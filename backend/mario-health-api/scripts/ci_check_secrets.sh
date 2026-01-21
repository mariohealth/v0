#!/bin/bash
set -e

# Search for prohibited secret binding
if grep -r "supabase-default-secret-key" backend/mario-health-api/scripts/deploy.sh; then
    echo "❌ FATAL: Found usage of 'supabase-default-secret-key' in deploy.sh. You MUST use 'supabase-service-role-key' for the backend to bypass RLS."
    exit 1
fi

echo "✅ No prohibited secret bindings found."
