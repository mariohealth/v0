-- Optimized Search Function v3
-- Uses UNION for index-friendly filtering and reduced pricing scans.

CREATE OR REPLACE FUNCTION search_procedures_v3(
    search_query TEXT,
    zip_code_input TEXT DEFAULT NULL,
    radius_miles INT DEFAULT 25
)
RETURNS TABLE (
    procedure_id TEXT,
    procedure_name TEXT,
    procedure_slug TEXT,
    family_name TEXT,
    family_slug TEXT,
    category_name TEXT,
    category_slug TEXT,
    best_price NUMERIC,
    avg_price NUMERIC,
    max_price NUMERIC,
    provider_count BIGINT,
    nearest_provider TEXT,
    nearest_distance_miles NUMERIC,
    match_score NUMERIC
)
LANGUAGE plpgsql
AS $function$
DECLARE
    search_location GEOGRAPHY;
    radius_meters NUMERIC;
    search_tsquery tsquery;
BEGIN
    radius_meters := radius_miles * 1609.34;
    BEGIN
        search_tsquery := plainto_tsquery('english', search_query);
    EXCEPTION WHEN OTHERS THEN
        search_tsquery := plainto_tsquery('english', '');
    END;

    IF zip_code_input IS NOT NULL THEN
        SELECT location INTO search_location
        FROM zip_codes WHERE zip_code = zip_code_input LIMIT 1;
        IF search_location IS NULL THEN RETURN; END IF;
    END IF;

    RETURN QUERY
    WITH candidates_union AS (
        -- 1. Exact Name Match
        SELECT id, CAST(1.0 AS NUMERIC) as score_base FROM procedure WHERE LOWER(name) = LOWER(search_query)
        UNION ALL
        -- 2. Full Text Search
        SELECT id, CAST(0.5 + (ts_rank(search_vector, search_tsquery) * 0.4) AS NUMERIC) as score_base 
        FROM procedure WHERE search_vector @@ search_tsquery
        UNION ALL
        -- 3. Fuzzy Name Match
        SELECT id, CAST(similarity(name, search_query) * 0.4 AS NUMERIC) as score_base 
        FROM procedure WHERE similarity(name, search_query) > 0.3
        UNION ALL
        -- 4. Fuzzy Common Name Match
        SELECT id, CAST(similarity(COALESCE(common_name, ''), search_query) * 0.4 AS NUMERIC) as score_base 
        FROM procedure WHERE similarity(COALESCE(common_name, ''), search_query) > 0.3
    ),
    candidates_dedup AS (
        -- Dedup by ID, keeping the highest score for that ID
        SELECT DISTINCT ON (id) id, score_base
        FROM candidates_union
        ORDER BY id, score_base DESC
    ),
    top_candidates AS (
        -- Now sort by score to get true top N matches
        -- Use id as tie-breaker for deterministic ordering
        SELECT id, score_base
        FROM candidates_dedup
        ORDER BY score_base DESC, id ASC
        LIMIT 200
    ),
    final_candidates AS (
        SELECT c.id, p.name, p.slug, p.common_name, p.family_id, c.score_base as match_score
        FROM top_candidates c
        JOIN procedure p ON c.id = p.id
    ),
    procedure_pricing_agg AS (
        SELECT 
            pp.procedure_id,
            MIN(pp.price) as min_price,
            AVG(pp.price) as avg_price,
            MAX(pp.price) as max_price,
            COUNT(DISTINCT pl.provider_name) as prov_count,
            (ARRAY_AGG(pl.provider_name ORDER BY 
                CASE WHEN search_location IS NOT NULL THEN ST_Distance(search_location, pl.location) ELSE 0 END ASC
            ))[1] as nearest_prov,
            (ARRAY_AGG(
                CASE WHEN search_location IS NOT NULL THEN ST_Distance(search_location, pl.location) * 0.000621371 ELSE 0 END
                ORDER BY 
                CASE WHEN search_location IS NOT NULL THEN ST_Distance(search_location, pl.location) ELSE 0 END ASC
            ))[1] as nearest_dist
        FROM procedure_pricing pp
        JOIN final_candidates fc ON pp.procedure_id = fc.id
        JOIN provider_location pl ON pp.provider_location_id = pl.id
        WHERE 
             (search_location IS NULL 
             OR ST_DWithin(search_location, pl.location, radius_meters))
             AND trim(coalesce(pl.provider_name, '')) <> ''
        GROUP BY pp.procedure_id
    )
    SELECT
        fc.id, fc.name, fc.slug, pf.name, pf.slug, pc.name, pc.slug,
        ppa.min_price, ppa.avg_price, ppa.max_price, ppa.prov_count,
        ppa.nearest_prov, CAST(ppa.nearest_dist AS NUMERIC),
        CAST(fc.match_score AS NUMERIC)
    FROM final_candidates fc
    JOIN procedure_pricing_agg ppa ON fc.id = ppa.procedure_id
    JOIN procedure_family pf ON fc.family_id = pf.id
    JOIN procedure_category pc ON pf.category_id = pc.id
    ORDER BY fc.match_score DESC, ppa.min_price ASC
    LIMIT 50;
END;
$function$;

-- Required Indexes
CREATE INDEX IF NOT EXISTS idx_procedure_name_trgm ON procedure USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_procedure_common_name_trgm ON procedure USING gin (common_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_procedure_search_vector ON procedure USING gin (search_vector);
CREATE INDEX IF NOT EXISTS idx_procedure_pricing_procedure_id ON procedure_pricing (procedure_id);

-- Verification queries (Supabase SQL Editor)
-- 1) Count blank provider names in v3 results for "brain mri"
-- SELECT COUNT(*) FROM search_procedures_v3('brain mri', NULL, 25)
-- WHERE trim(coalesce(nearest_provider, '')) = '';
-- 2) Ensure nearest_provider is never blank (should return 0 rows)
-- SELECT * FROM search_procedures_v3('brain mri', NULL, 25)
-- WHERE trim(coalesce(nearest_provider, '')) = '';
