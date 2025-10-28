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
            p.id as procedure_id,
            p.name as procedure_name,
            p.slug as procedure_slug,
            pf.name as family_name,
            pf.slug as family_slug,
            pc.name as category_name,
            pc.slug as category_slug,
            MIN(fp.price) as best_price,
            AVG(fp.price) as avg_price,
            MAX(fp.price) as max_price,
            COUNT(DISTINCT fp.provider_name) as provider_count,
            (
                SELECT fp2.provider_name
                FROM filtered_pricing fp2
                WHERE fp2.procedure_id = p.id
                ORDER BY fp2.distance_miles ASC
                LIMIT 1
            ) as nearest_provider,
            (
                SELECT fp2.distance_miles
                FROM filtered_pricing fp2
                WHERE fp2.procedure_id = p.id
                ORDER BY fp2.distance_miles ASC
                LIMIT 1
            ) as nearest_distance_miles
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
    SELECT *
    FROM procedure_stats
    ORDER BY
        CASE
            WHEN LOWER(procedure_name) = LOWER(search_query) THEN 0
            WHEN LOWER(procedure_name) LIKE LOWER(search_query) || '%' THEN 1
            ELSE 2
        END,
        best_price ASC,
        COALESCE(nearest_distance_miles, 999999) ASC
    LIMIT 50;
END;
$function$;
