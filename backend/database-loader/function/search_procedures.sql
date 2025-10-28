CREATE OR REPLACE FUNCTION search_procedures(
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
    nearest_distance_miles NUMERIC
)
LANGUAGE plpgsql
AS $function$
DECLARE
    search_location GEOGRAPHY;
    radius_meters NUMERIC;
BEGIN
    radius_meters := radius_miles * 1609.34;

    IF zip_code_input IS NOT NULL THEN
        SELECT location
        INTO search_location
        FROM zip_codes
        WHERE zip = zip_code_input
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
        JOIN provider_location pl ON pp.provider_id = pl.provider_id
        WHERE
            search_location IS NULL OR
            ST_DWithin(search_location, pl.location, radius_meters)
    ),
    procedure_stats AS (
        SELECT
            p.id,
            p.name,
            p.slug,
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
            ) as nearest_dist
        FROM procedure p
        JOIN procedure_family pf ON p.family_id = pf.id
        JOIN procedure_category pc ON pf.category_id = pc.id
        INNER JOIN filtered_pricing fp ON fp.procedure_id = p.id
        WHERE
            p.name ILIKE '%' || search_query || '%' OR
            COALESCE(p.description, '') ILIKE '%' || search_query || '%'
        GROUP BY p.id, p.name, p.slug,
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
        ps.nearest_dist as nearest_distance_miles
    FROM procedure_stats ps
    ORDER BY
        CASE
            WHEN LOWER(ps.name) = LOWER(search_query) THEN 0
            WHEN LOWER(ps.name) LIKE LOWER(search_query) || '%' THEN 1
            ELSE 2
        END,
        ps.min_price ASC,
        COALESCE(ps.nearest_dist, 999999) ASC
    LIMIT 50;
END;
$function$;
