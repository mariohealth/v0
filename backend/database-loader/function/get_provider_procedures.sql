-- Function to get all procedures offered by a provider
CREATE OR REPLACE FUNCTION get_provider_procedures(provider_id_input TEXT)
RETURNS TABLE (
    procedure_id TEXT,
    procedure_name TEXT,
    procedure_slug TEXT,
    family_name TEXT,
    family_slug TEXT,
    category_name TEXT,
    category_slug TEXT,
    price NUMERIC,
    carrier_id TEXT,
    carrier_name TEXT,
    last_updated TIMESTAMP
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.id as procedure_id,
        p.name as procedure_name,
        p.slug as procedure_slug,
        pf.name as family_name,
        pf.slug as family_slug,
        pc.name as category_name,
        pc.slug as category_slug,
        pp.price,
        pp.carrier_id,
        pp.carrier_name,
        pp.updated_at as last_updated
    FROM procedure_pricing pp
    JOIN procedure p ON pp.procedure_id = p.id
    JOIN procedure_family pf ON p.family_id = pf.id
    JOIN procedure_category pc ON pf.category_id = pc.id
    WHERE pp.provider_id = provider_id_input
    ORDER BY pc.name, pf.name, p.name;
END;
$function$;
