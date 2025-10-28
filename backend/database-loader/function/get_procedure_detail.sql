DROP FUNCTION IF EXISTS get_procedure_detail(TEXT);
CREATE OR REPLACE FUNCTION get_procedure_detail(procedure_slug_input TEXT)
RETURNS TABLE (
    -- Procedure info
    id TEXT,
    name TEXT,
    slug TEXT,
    description TEXT,
    -- Family info
    family_id TEXT,
    family_name TEXT,
    family_slug TEXT,
    -- Category info
    category_id TEXT,
    category_name TEXT,
    category_slug TEXT,
    -- Pricing stats
    min_price NUMERIC,
    max_price NUMERIC,
    avg_price NUMERIC,
    median_price NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        pf.id as family_id,
        pf.name as family_name,
        pf.slug as family_slug,
        pc.id as category_id,
        pc.name as category_name,
        pc.slug as category_slug,
        MIN(pp.price) as min_price,
        MAX(pp.price) as max_price,
        AVG(pp.price) as avg_price,
        CAST(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY pp.price) AS NUMERIC) as median_price
    FROM procedure p
    JOIN procedure_family pf ON p.family_id = pf.id
    JOIN procedure_category pc ON pf.category_id = pc.id
    LEFT JOIN procedure_pricing pp ON pp.procedure_id = p.id
    WHERE p.slug = procedure_slug_input
    GROUP BY p.id, p.name, p.slug, p.description,
             pf.id, pf.name, pf.slug,
             pc.id, pc.name, pc.slug;
END;
$$ LANGUAGE plpgsql;
