CREATE OR REPLACE FUNCTION get_provider_detail(provider_id_input TEXT)
RETURNS TABLE (
    -- Provider info
    provider_id TEXT,
    provider_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    phone TEXT,
    -- Pricing stats
    total_procedures BIGINT,
    avg_price NUMERIC,
    min_price NUMERIC,
    max_price NUMERIC
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        pl.provider_id,
        pl.provider_name,
        pl.address,
        pl.city,
        pl.state,
        pl.zip_code,
        pl.latitude,
        pl.longitude,
        pl.phone,
        COUNT(DISTINCT pp.procedure_id) as total_procedures,
        AVG(pp.price) as avg_price,
        MIN(pp.price) as min_price,
        MAX(pp.price) as max_price
    FROM provider_location pl
    LEFT JOIN procedure_pricing pp ON pp.provider_id = pl.provider_id
    WHERE pl.provider_id = provider_id_input
    GROUP BY pl.provider_id, pl.provider_name, pl.address, pl.city,
             pl.state, pl.zip_code, pl.latitude, pl.longitude, pl.phone
    LIMIT 1;
END;
$function$;
