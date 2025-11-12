#!/usr/bin/env bash

set -euo pipefail

echo "============================================================"
echo "🏥 Mario Health — Adaptive Diagnostics ($(date))"
echo "============================================================"

# Determine database connection string
if [ -n "${POSTGRES_URL:-}" ]; then
  DB="$POSTGRES_URL"
elif [ -n "${SUPABASE_DB_PASS:-}" ]; then
  DB="postgresql://postgres.anvremdouphhucqrxgoq:${SUPABASE_DB_PASS}@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
else
  echo "ERROR: Either POSTGRES_URL or SUPABASE_DB_PASS must be set"
  exit 1
fi

# 🔎 Detect columns
HAS_PLID=$(psql "$DB" -Atc "SELECT 1 FROM information_schema.columns WHERE table_name='procedure_pricing' AND column_name='provider_location_id' LIMIT 1" 2>/dev/null || echo "")
HAS_METRICS_PP=$(psql "$DB" -Atc "SELECT 1 FROM information_schema.tables WHERE table_name='procedure_pricing_metrics' LIMIT 1" 2>/dev/null || echo "")
HAS_METRICS_PL=$(psql "$DB" -Atc "SELECT 1 FROM information_schema.tables WHERE table_name='provider_location_metrics' LIMIT 1" 2>/dev/null || echo "")

if [[ "$HAS_PLID" == "1" ]]; then
  echo "🔧 Detected new schema: joining on procedure_pricing.provider_location_id → provider_location.id"
  JOIN_SQL="
    FROM procedure_pricing pp
    JOIN provider_location pl ON pp.provider_location_id = pl.id
  "
  ORPHAN_WHERE="pl.id IS NULL"
  JOIN_NOTE="pp.provider_location_id = pl.id"
else
  echo "⚠️ New schema not detected; falling back to old join on provider_id"
  JOIN_SQL="
    FROM procedure_pricing pp
    JOIN provider_location pl ON pp.provider_id = pl.provider_id
  "
  ORPHAN_WHERE="pl.provider_id IS NULL"
  JOIN_NOTE="pp.provider_id = pl.provider_id"
fi

echo "🔗 Using join: ${JOIN_NOTE}"

# 1) Coverage by procedure (minimum useful snapshot)
echo ""
echo "🧩 Procedure coverage snapshot:"
psql "$DB" -c "
WITH coverage AS (
  SELECT
    pp.procedure_id,
    COUNT(*) AS pricing_rows,
    COUNT(*) FILTER (WHERE pl.id IS NOT NULL OR pl.provider_id IS NOT NULL) AS linked_rows,
    MIN(pp.price) AS min_price
  $JOIN_SQL
  GROUP BY pp.procedure_id
)
SELECT procedure_id, linked_rows AS providers_with_prices, min_price
FROM coverage
ORDER BY procedure_id
LIMIT 50;
"

# 2) Orphan counts and linkage health
echo ""
echo "📊 Linkage health:"
if [[ "$HAS_PLID" == "1" ]]; then
  psql "$DB" -c "
  SELECT
    (SELECT COUNT(*) FROM provider_location) AS total_providers,
    (SELECT COUNT(*) FROM procedure_pricing) AS total_pricing_rows,
    (SELECT COUNT(*) $JOIN_SQL) AS linked_pricing_rows,
    (SELECT COUNT(*) FROM procedure_pricing pp
      LEFT JOIN provider_location pl ON pp.provider_location_id = pl.id
      WHERE pl.id IS NULL) AS orphan_pricing_rows;
  "
else
  psql "$DB" -c "
  SELECT
    (SELECT COUNT(*) FROM provider_location) AS total_providers,
    (SELECT COUNT(*) FROM procedure_pricing) AS total_pricing_rows,
    (SELECT COUNT(*) $JOIN_SQL) AS linked_pricing_rows,
    (SELECT COUNT(*) FROM procedure_pricing pp
      LEFT JOIN provider_location pl ON pp.provider_id = pl.provider_id
      WHERE pl.provider_id IS NULL) AS orphan_pricing_rows;
  "
fi

# 3) Focus checks for MRI family (adjust slugs as needed)
echo ""
echo "🧠 MRI focus — per-procedure detail:"
for slug in 'brain-mri' 'leg-joint-mri' 'upper-spinal-canal-mri' 'arm-joint-mri' 'lower-spinal-canal-mri'; do
  echo ""
  echo "→ $slug"
  psql "$DB" -c "
  SELECT
    pp.procedure_id,
    COALESCE(pl.provider_name, pl.name, '—') AS provider_name,
    COALESCE(pl.city,'') AS city,
    COALESCE(pl.state,'') AS state,
    pp.price,
    pp.updated_at
  $JOIN_SQL
  WHERE pp.procedure_id = '$slug'
  ORDER BY pp.price ASC
  LIMIT 10;
  "
done

# 4) Metrics tables (if present)
if [[ "$HAS_METRICS_PP" == "1" ]]; then
  echo ""
  echo "📈 procedure_pricing_metrics (top 10):"
  psql "$DB" -c "SELECT * FROM procedure_pricing_metrics ORDER BY updated_at DESC NULLS LAST LIMIT 10;"
else
  echo ""
  echo "ℹ️ procedure_pricing_metrics table not found; skipping."
fi

if [[ "$HAS_METRICS_PL" == "1" ]]; then
  echo ""
  echo "📈 provider_location_metrics (top 10):"
  psql "$DB" -c "SELECT * FROM provider_location_metrics ORDER BY updated_at DESC NULLS LAST LIMIT 10;"
else
  echo ""
  echo "ℹ️ provider_location_metrics table not found; skipping."
fi

# 5) API smoke tests (local)
echo ""
echo "🌐 API smoke tests (if backend running locally on :8080):"
set +e
curl -s http://localhost:8080/api/v1/search?q=mri 2>/dev/null | jq '.[0:5]' 2>/dev/null || echo "search route not reachable"
curl -s http://localhost:8080/api/v1/procedures/brain-mri/providers 2>/dev/null | jq 2>/dev/null || echo "providers route not reachable"
set -e

# 6) Write a compact Markdown summary
mkdir -p backend/diagnostics
OUT="backend/diagnostics/ADAPTIVE_DIAGNOSTICS_$(date +%Y%m%d_%H%M).md"
{
  echo "# Mario Adaptive Diagnostics"
  echo "**Run:** $(date)"
  echo ""
  echo "## Join Strategy"
  echo "- Using: \`${JOIN_NOTE}\`"
  echo ""
  echo "## Hints"
  echo "- If 'brain-mri' shows 0 rows above but search lists many providers, seed pricing rows using the *new* key (provider_location_id)."
  echo "- Orphan rows = pricing rows pointing at non-existent provider locations — clean or reseed."
} > "$OUT"

echo ""
echo "✅ Wrote $OUT"
echo "============================================================"

