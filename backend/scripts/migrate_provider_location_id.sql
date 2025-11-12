-- 🧭 Mario Health — Migration: provider_id → provider_location_id
-- Requires: provider_location.id is the new PK; provider_id may still exist (legacy)

BEGIN;

-- 1️⃣  Back-up legacy table for safety
CREATE TABLE IF NOT EXISTS procedure_pricing_legacy_backup AS
SELECT * FROM procedure_pricing;

-- 2️⃣  Add new column if missing
ALTER TABLE procedure_pricing
ADD COLUMN IF NOT EXISTS provider_location_id INTEGER;

-- 3️⃣  Map existing pricing rows to provider_location.id via provider_id
--      (assumes provider_id still exists in provider_location)
UPDATE procedure_pricing pp
SET provider_location_id = pl.id
FROM provider_location pl
WHERE pp.provider_id IS NOT NULL
  AND pl.provider_id = pp.provider_id
  AND pp.provider_location_id IS NULL;

-- 4️⃣  Verify mapping success
SELECT
  COUNT(*) AS total_pricing_rows,
  COUNT(*) FILTER (WHERE provider_location_id IS NOT NULL) AS mapped_rows,
  COUNT(*) FILTER (WHERE provider_location_id IS NULL) AS unmapped_rows
FROM procedure_pricing;

-- 5️⃣  Seed demo MRI pricing (if missing) using valid provider_location_ids
INSERT INTO procedure_pricing (procedure_id, provider_location_id, price, updated_at)
SELECT 'brain-mri', id, (400 + (random()*100)::INT), NOW()
FROM provider_location
WHERE id NOT IN (SELECT provider_location_id FROM procedure_pricing WHERE procedure_id = 'brain-mri' AND provider_location_id IS NOT NULL)
LIMIT 5;

INSERT INTO procedure_pricing (procedure_id, provider_location_id, price, updated_at)
SELECT 'leg-joint-mri', id, (420 + (random()*80)::INT), NOW()
FROM provider_location
WHERE id NOT IN (SELECT provider_location_id FROM procedure_pricing WHERE procedure_id = 'leg-joint-mri' AND provider_location_id IS NOT NULL)
LIMIT 5;

INSERT INTO procedure_pricing (procedure_id, provider_location_id, price, updated_at)
SELECT 'upper-spinal-canal-mri', id, (450 + (random()*60)::INT), NOW()
FROM provider_location
WHERE id NOT IN (SELECT provider_location_id FROM procedure_pricing WHERE procedure_id = 'upper-spinal-canal-mri' AND provider_location_id IS NOT NULL)
LIMIT 5;

-- 6️⃣  Remove orphans: pricing rows pointing to non-existent provider_location.id
DELETE FROM procedure_pricing pp
WHERE provider_location_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM provider_location pl WHERE pl.id = pp.provider_location_id
  );

-- 7️⃣  Clean up legacy provider_id column (optional, keep temporarily)
-- ALTER TABLE procedure_pricing DROP COLUMN provider_id;

COMMIT;

