-- Database Functions and Procedures
-- Reusable logic for triggers and application code

-- Function to automatically update location from lat/lon coordinates
DROP FUNCTION IF EXISTS update_location_from_coords() CASCADE;
CREATE OR REPLACE FUNCTION update_location_from_coords()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    ELSE
        NEW.location = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_location_from_coords() IS
'Automatically creates a PostGIS geography point from latitude and longitude columns';


-- Updated search_procedures function with full-text search + fuzzy matching
-- Run this THIRD in Supabase SQL Editor (replaces old function)

CREATE OR REPLACE FUNCTION search_procedures_v2(
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
    match_score NUMERIC  -- NEW: relevance score for ranking
)
LANGUAGE plpgsql
AS $function$
DECLARE
    search_location GEOGRAPHY;
    radius_meters NUMERIC;
    search_tsquery tsquery;
BEGIN
    radius_meters := radius_miles * 1609.34;

    -- Convert search query to tsquery for full-text search
    search_tsquery := plainto_tsquery('english', search_query);

    -- Get location if ZIP code provided
    IF zip_code_input IS NOT NULL THEN
        SELECT location
        INTO search_location
        FROM zip_codes
        WHERE zip_code = zip_code_input
        LIMIT 1;

        IF search_location IS NULL THEN
            RETURN;
        END IF;
    END IF;

    RETURN QUERY
    WITH filtered_pricing AS (
        SELECT
            pp.procedure_id,
            pp.carrier_name,
            pp.price,
            pl.provider_name,
            pl.location,
            CASE
                WHEN search_location IS NOT NULL THEN
                    ST_Distance(search_location, pl.location) * 0.000621371
                ELSE 0
            END as distance_miles
        FROM procedure_pricing pp
        JOIN provider_location pl ON pp.provider_location_id = pl.id
        WHERE
            search_location IS NULL OR
            ST_DWithin(search_location, pl.location, radius_meters)
    ),
    procedure_stats AS (
        SELECT
            p.id,
            p.name,
            p.slug,
            p.common_name,
            pf.name as fam_name,
            pf.slug as fam_slug,
            pc.name as cat_name,
            pc.slug as cat_slug,
            MIN(fp.price) as min_price,
            AVG(fp.price) as avg_price,
            MAX(fp.price) as max_price,
            COUNT(DISTINCT fp.provider_name) as prov_count,
            (
                SELECT fp2.provider_name
                FROM filtered_pricing fp2
                WHERE fp2.procedure_id = p.id
                ORDER BY fp2.distance_miles ASC
                LIMIT 1
            ) as nearest_prov,
            (
                SELECT CAST(fp2.distance_miles AS NUMERIC)
                FROM filtered_pricing fp2
                WHERE fp2.procedure_id = p.id
                ORDER BY fp2.distance_miles ASC
                LIMIT 1
            ) as nearest_dist,
            -- Calculate relevance score
            CASE
                -- Exact match on name (highest priority)
                WHEN LOWER(p.name) = LOWER(search_query) THEN 1.0
                -- Exact match on common_name
                WHEN LOWER(COALESCE(p.common_name, '')) = LOWER(search_query) THEN 0.95
                -- Full-text search match
                WHEN p.search_vector @@ search_tsquery THEN
                    0.5 + (ts_rank(p.search_vector, search_tsquery) * 0.4)
                -- Fuzzy match on name
                WHEN similarity(p.name, search_query) > 0.3 THEN
                    similarity(p.name, search_query) * 0.4
                -- Fuzzy match on common_name
                WHEN similarity(COALESCE(p.common_name, ''), search_query) > 0.3 THEN
                    similarity(COALESCE(p.common_name, ''), search_query) * 0.35
                ELSE 0
            END as relevance_score
        FROM procedure p
        JOIN procedure_family pf ON p.family_id = pf.id
        JOIN procedure_category pc ON pf.category_id = pc.id
        INNER JOIN filtered_pricing fp ON fp.procedure_id = p.id
        WHERE
            -- Multi-condition search with full-text search + fuzzy matching
            (
                -- Full-text search (handles multi-word, stemming, ranking)
                p.search_vector @@ search_tsquery
                OR
                -- Fuzzy matching on name (handles typos)
                similarity(p.name, search_query) > 0.3
                OR
                -- Fuzzy matching on common_name
                similarity(COALESCE(p.common_name, ''), search_query) > 0.3
                OR
                -- Fallback: word-by-word ILIKE for partial matches
                (
                    SELECT bool_and(
                        p.name ILIKE '%' || word || '%' OR
                        COALESCE(p.common_name, '') ILIKE '%' || word || '%' OR
                        COALESCE(p.description, '') ILIKE '%' || word || '%'
                    )
                    FROM unnest(string_to_array(search_query, ' ')) AS word
                    WHERE word != ''
                )
            )
        GROUP BY p.id, p.name, p.slug, p.common_name, p.search_vector,
                 pf.name, pf.slug, pc.name, pc.slug
        HAVING COUNT(fp.price) > 0
    )
    SELECT
        ps.id as procedure_id,
        ps.name as procedure_name,
        ps.slug as procedure_slug,
        ps.fam_name as family_name,
        ps.fam_slug as family_slug,
        ps.cat_name as category_name,
        ps.cat_slug as category_slug,
        ps.min_price as best_price,
        ps.avg_price as avg_price,
        ps.max_price as max_price,
        ps.prov_count as provider_count,
        ps.nearest_prov as nearest_provider,
        ps.nearest_dist as nearest_distance_miles,
        CAST(ps.relevance_score AS NUMERIC) as match_score
    FROM procedure_stats ps
    WHERE ps.relevance_score > 0
    ORDER BY
        -- Primary sort: relevance score (best matches first)
        ps.relevance_score DESC,
        -- Secondary sort: price (cheapest first)
        ps.min_price ASC,
        -- Tertiary sort: distance (nearest first)
        COALESCE(ps.nearest_dist, 999999) ASC
    LIMIT 50;
END;
$function$;


CREATE OR REPLACE FUNCTION get_specialty_details(specialty_id TEXT)
RETURNS TABLE (
id TEXT,
name TEXT,
slug TEXT,
is_used BOOL,
description TEXT,
taxonomy_id TEXT,
taxonomy_name TEXT,
taxonomy_description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sp.id,
        sp.name,
        sp.slug,
        sp.is_used,
        sp.description,
        sm.taxonomy_id,
        ns.display_name AS taxonomy_name,
        ns.definition AS taxonomy_description
    FROM specialty AS sp
    JOIN specialty_map AS sm ON sp.id = sm.specialty_id
    LEFT JOIN nucc_specialty_individual AS ns ON sm.taxonomy_id = ns.id
    WHERE sp.id = specialty_id;
END;
$$ LANGUAGE plpgsql;
