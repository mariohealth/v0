# Mario Health Provider Data Diagnostics — 2025-11-11_20-41-07

## Provider Summary

- Total providers: 1000
- Missing name: 1000
- Missing location (city/state): 0
- Missing coordinates (lat/lng): 0

## State Coverage (Top 10)

| State | Providers |
|-------|-----------|
| CA | 1000 |

## Providers Linked to Pricing

- Providers with pricing: 0
- Total providers: 1000
- Coverage: 0.0%

## Top Providers by Pricing Volume

| Name | City | State | Procedures | Price Range |
|------|------|-------|------------|-------------|
| Unknown | N/A | N/A | 17 | $10.00-$170.00 |
| Unknown | N/A | N/A | 17 | $10.00-$170.00 |
| Unknown | N/A | N/A | 17 | $10.00-$170.00 |
| Unknown | N/A | N/A | 17 | $10.00-$170.00 |
| Unknown | N/A | N/A | 17 | $10.00-$170.00 |
| Unknown | N/A | N/A | 17 | $10.00-$170.00 |
| Unknown | N/A | N/A | 17 | $10.00-$170.00 |
| Unknown | N/A | N/A | 17 | $10.00-$170.00 |
| Unknown | N/A | N/A | 17 | $10.00-$170.00 |
| Unknown | N/A | N/A | 16 | $5.00-$250.00 |
| Unknown | N/A | N/A | 16 | $10.00-$290.00 |
| Unknown | N/A | N/A | 7 | $5.00-$10.00 |
| Unknown | N/A | N/A | 7 | $5.00-$10.00 |
| Unknown | N/A | N/A | 7 | $5.00-$10.00 |
| Unknown | N/A | N/A | 7 | $5.00-$10.00 |

## ⚠️ Data Quality Issues

- **Orphan pricing records**: 1000 pricing rows reference providers that don't exist in provider_location
- **Recommendation**: Clean up orphan records or add missing provider records

## Recommendations

1. **Verify provider_location completeness**: Ensure all providers have name, city, state, and coordinates
2. **Link pricing to providers**: Increase coverage of providers with pricing data
3. **Clean orphan records**: Remove or fix pricing records that reference non-existent providers
4. **Geographic coverage**: Consider adding providers in states with low coverage
