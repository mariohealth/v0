-- Database Views
-- Convenient data access patterns

-- can't execute an empty query so:
SELECT 1 FROM zip_codes LIMIT 1;

-- Example: Price comparison view
-- CREATE OR REPLACE VIEW v_price_comparison AS
-- SELECT
--     hp.cpt_code,
--     c.description as procedure_name,
--     hp.carrier_name,
--     hp.price,
--     zc.city,
--     zc.state
-- FROM healthcare_prices hp
-- LEFT JOIN cpt_codes c ON hp.cpt_code = c.cpt_code
-- LEFT JOIN zip_codes zc ON hp.service_zip_code = zc.zip_code;
--
-- COMMENT ON VIEW v_price_comparison IS 'Denormalized view for price comparison queries';