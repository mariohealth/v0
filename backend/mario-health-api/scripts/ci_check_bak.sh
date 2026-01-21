#!/bin/bash
set -e

# Check for .bak files in frontend/src
echo "🔎 Checking for leftover .bak files in frontend/src..."
if find frontend/src -name "*.bak" -o -name "*.bak2" | grep -q .; then
    echo "❌ FAILED: Found .bak files! Please remove them before committing."
    find frontend/src -name "*.bak" -o -name "*.bak2"
    exit 1
else
    echo "✅ No .bak files found."
fi
