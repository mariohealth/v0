CREATE OR REPLACE FUNCTION get_billing_code_detail(
    code_input TEXT,
    code_type_input TEXT DEFAULT NULL
)
RETURNS TABLE (
    procedure_id TEXT,
    procedure_name TEXT,
    procedure_slug TEXT,
    procedure_description TEXT,
    family_name TEXT,
    family_slug TEXT,
    category_name TEXT,
    category_slug TEXT,
    min_price NUMERIC,
    max_price NUMERIC,
    avg_price NUMERIC,
    provider_count BIGINT,
    code_description TEXT,
    code_type TEXT,
    is_primary BOOLEAN
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.id as procedure_id,
        p.name as procedure_name,
        p.slug as procedure_slug,
        p.description as procedure_description,
        pf.name as family_name,
        pf.slug as family_slug,
        pc.name as category_name,
        pc.slug as category_slug,
        MIN(pp.price) as min_price,
        MAX(pp.price) as max_price,
        AVG(pp.price) as avg_price,
        COUNT(DISTINCT pp.provider_id) as provider_count,
        pbc.description as code_description,
        pbc.code_type,
        COALESCE(pbc.is_primary, false) as is_primary
    FROM procedure_billing_code pbc
    JOIN procedure p ON pbc.procedure_id = p.id
    JOIN procedure_family pf ON p.family_id = pf.id
    JOIN procedure_category pc ON pf.category_id = pc.id
    LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
    WHERE pbc.code = code_input
      AND (code_type_input IS NULL OR pbc.code_type = code_type_input)
    GROUP BY p.id, p.name, p.slug, p.description,
             pf.name, pf.slug, pc.name, pc.slug,
             pbc.description, pbc.code_type, pbc.is_primary
    ORDER BY COALESCE(pbc.is_primary, false) DESC, p.name ASC;
END;
$function$;
