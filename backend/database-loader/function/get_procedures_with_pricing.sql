DROP FUNCTION IF EXISTS get_procedures_with_pricing(text);
CREATE OR REPLACE FUNCTION get_procedures_with_pricing(family_slug_input TEXT)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    description TEXT,
    min_price NUMERIC,
    max_price NUMERIC,
    avg_price NUMERIC,
    price_count BIGINT,
    family_name TEXT,
    family_slug TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.description,
        MIN(pp.price) as min_price,
        MAX(pp.price) as max_price,
        AVG(pp.price) as avg_price,
        COUNT(pp.id) as price_count,
        pf.name as family_name,
        pf.slug as family_slug
    FROM procedure p
    JOIN procedure_family pf ON p.family_id = pf.id
    LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
    WHERE pf.slug = family_slug_input
    GROUP BY p.id, p.name, p.description, pf.name, pf.slug
    ORDER BY p.name;
END;
$$ LANGUAGE plpgsql;
