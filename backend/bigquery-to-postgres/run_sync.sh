#!/bin/bash
# Local execution script for testing

set -e

# Parse arguments
FULL_REFRESH=""
TABLES=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --full-refresh)
            FULL_REFRESH="--full-refresh"
            shift
            ;;
        --table)
            TABLES="--tables $2"
            shift 2
            ;;
        --tables)
            shift
            TABLES="--tables"
            while [[ $# -gt 0 && ! $1 =~ ^-- ]]; do
                TABLES="$TABLES $1"
                shift
            done
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--full-refresh] [--table TABLE_NAME] [--tables TABLE1 TABLE2 ...]"
            exit 1
            ;;
    esac
done

echo "🚀 Starting BigQuery → Postgres sync..."

# Load environment variables
source .env

# Create logs directory
mkdir -p logs

# Run sync
if [ -n "$TABLES" ]; then
    echo "Syncing specific tables: $TABLES"
    python scripts/sync_all.py $TABLES $FULL_REFRESH
else
    echo "Syncing all tables"
    python scripts/sync_all.py $FULL_REFRESH
fi

# Validate results
python scripts/validate_data.py

echo "✅ Sync complete!"
