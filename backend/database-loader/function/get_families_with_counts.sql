CREATE OR REPLACE FUNCTION get_families_with_counts(category_slug_input TEXT)
RETURNS TABLE (
    id TEXT,
    name TEXT,
    slug TEXT,
    description TEXT,
    procedure_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pf.id,
        pf.name,
        pf.slug,
        pf.description,
        COUNT(p.id) as procedure_count
    FROM procedure_family pf
    JOIN procedure_category pc ON pf.category_id = pc.id
    LEFT JOIN procedure p ON p.family_id = pf.id
    WHERE pc.slug = category_slug_input
    GROUP BY pf.id, pf.name, pf.slug, pf.description
    ORDER BY pf.name;
END;
$$ LANGUAGE plpgsql;