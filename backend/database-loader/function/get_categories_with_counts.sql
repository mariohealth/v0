DROP FUNCTION IF EXISTS get_categories_with_counts();
CREATE OR REPLACE FUNCTION get_categories_with_counts()
RETURNS TABLE (
    id TEXT,
    name TEXT,
    slug TEXT,
    emoji TEXT,
    description TEXT,
    family_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pc.id,
        pc.name,
        pc.slug,
        pc.emoji,
        pc.description,
        COUNT(pf.id) as family_count
    FROM procedure_category pc
    LEFT JOIN procedure_family pf ON pf.category_id = pc.id
    GROUP BY pc.id, pc.name, pc.slug, pc.description
    ORDER BY pc.name;
END;
$$ LANGUAGE plpgsql;
