#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRONTEND_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$FRONTEND_DIR"

echo "🔎 Ensuring no navigation to /search exists..."

# Ripgrep for any router navigation to /search
if rg "router\\.(push|replace)\\(.*['\"]/search" src; then
  echo "❌ Found disallowed navigation to /search"
  exit 1
fi

echo "✅ No /search navigations found."

