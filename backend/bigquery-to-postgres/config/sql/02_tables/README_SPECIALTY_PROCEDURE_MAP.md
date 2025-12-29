# Specialty Procedure Map Table

## Purpose
The `specialty_procedure_map` table links medical specialties to their representative procedures, enabling accurate "typical visit cost" calculations for each specialty type.

## Schema

```sql
CREATE TABLE specialty_procedure_map (
  id TEXT PRIMARY KEY,
  specialty_id TEXT REFERENCES specialty(id) NOT NULL,
  procedure_id TEXT REFERENCES procedure(id) NOT NULL,
  visit_type TEXT NOT NULL, -- 'standard', 'extended', 'complex'
  is_representative BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(specialty_id, procedure_id, visit_type)
);
```

## Usage

### Finding Representative Procedures for a Specialty
```sql
SELECT p.name, p.slug, spm.visit_type
FROM specialty_procedure_map spm
JOIN procedure p ON spm.procedure_id = p.id
WHERE spm.specialty_id = '4' -- Cardiologist
  AND spm.is_representative = true;
```

### Getting Average Cost for a Specialty
```sql
SELECT 
  s.name as specialty_name,
  AVG(pp.price) as avg_visit_cost,
  COUNT(DISTINCT pp.provider_id) as provider_count
FROM specialty_procedure_map spm
JOIN specialty s ON spm.specialty_id = s.id
JOIN procedure_pricing pp ON spm.procedure_id = pp.procedure_id
WHERE spm.is_representative = true
  AND s.slug = 'cardiologist'
GROUP BY s.id, s.name;
```

## Data Population

Seed data is provided in `seeds/specialty_procedure_map.csv`. By default, all specialties are mapped to `proc_office_visit` as the representative procedure.

To add specialty-specific procedures (e.g., EKGs for cardiologists):

```sql
INSERT INTO specialty_procedure_map (specialty_id, procedure_id, visit_type, is_representative)
VALUES ('4', 'proc_ecg', 'standard', false);
```

## Indexes
- `idx_specialty_procedure_map_specialty` - Fast lookup by specialty
- `idx_specialty_procedure_map_procedure` - Fast lookup by procedure
- `idx_specialty_procedure_map_representative` - Fast filtering by representative flag

