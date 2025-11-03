{% macro round_price(price_column) %}
    CASE
        WHEN {{ price_column }} < 1 THEN 1
        WHEN {{ price_column }} < 1000 THEN ROUND({{ price_column }} / 10) * 10
        WHEN {{ price_column }} < 100000 THEN ROUND({{ price_column }} / 100) * 100
        WHEN {{ price_column }} < 10000000 THEN ROUND({{ price_column }} / 1000) * 1000
        ELSE {{ price_column }}
    END
{% endmacro %}
