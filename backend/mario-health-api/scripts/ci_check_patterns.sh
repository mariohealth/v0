#!/bin/bash
set -e

# Search for prohibited patterns
# 1. "npi" usage in provider_service.py (Schema Protection)
if grep -rn "npi" backend/mario-health-api/app/services/provider_service.py; then
    echo "❌ FATAL: Found prohibited 'npi' column reference in provider_service.py. The provider table does not have an 'npi' column (use 'provider_id')."
    exit 1
fi

echo "✅ No prohibited 'npi' patterns found."
