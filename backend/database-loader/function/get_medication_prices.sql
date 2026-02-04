CREATE OR REPLACE FUNCTION get_medication_prices(
    rxcui_scd_input TEXT,
    quantity_input TEXT DEFAULT NULL
)
RETURNS TABLE (
    rxcui_scd TEXT,
    pharmacy_id TEXT,
    pharmacy_name TEXT,
    pharmacy_type TEXT,
    delivery_only TEXT,
    national TEXT,
    region TEXT,
    source_id TEXT,
    source_name TEXT,
    source_type TEXT,
    price NUMERIC,
    quantity TEXT,
    product_url TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
AS $$
    SELECT
        dp.rxcui_scd,
        dp.pharmacy_id,
        p.pharmacy_name,
        p.pharmacy_type,
        p.delivery_only,
        p.national,
        p.region,
        dp.source_id,
        s.source_name,
        s.source_type,
        TRIM(dp.price)::NUMERIC AS price,
        dp.quantity,
        dp.product_url,
        dp.created_at
    FROM drug_prices dp
    JOIN pharmacies p ON p.pharmacy_id = dp.pharmacy_id
    JOIN drug_price_sources s ON s.source_id = dp.source_id
    WHERE dp.rxcui_scd = rxcui_scd_input
      AND (quantity_input IS NULL OR dp.quantity = quantity_input)
      AND TRIM(dp.price) ~ '^[0-9]+(\.[0-9]+)?$'
    ORDER BY TRIM(dp.price)::NUMERIC ASC;
$$;
