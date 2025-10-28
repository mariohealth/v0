-- Separate function to get all carrier prices for a procedure
DROP FUNCTION IF EXISTS get_procedure_carrier_prices(TEXT);
CREATE OR REPLACE FUNCTION get_procedure_carrier_prices(procedure_id_input TEXT)
RETURNS TABLE (
    carrier_id TEXT,
    carrier_name TEXT,
    price NUMERIC,
    currency TEXT,
    plan_type TEXT,
    network_status TEXT,
    last_updated TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pp.carrier_id,
        pp.carrier_name,
        pp.price,
        pp.currency,
        pp.plan_type,
        pp.network_status,
        pp.last_updated
    FROM procedure_pricing pp
    WHERE pp.procedure_id = procedure_id_input
    ORDER BY pp.price ASC;
END;
$$ LANGUAGE plpgsql;