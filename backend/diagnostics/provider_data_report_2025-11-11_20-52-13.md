# Mario Health Provider Data Diagnostics — 2025-11-11_20-52-13

## Summary

- Total providers: 1000

## Missing Field Breakdown

- Missing name: 0
- Missing coordinates: 0

## State Coverage (Top 10)

| State | Providers |
|-------|-----------|
| CA | 1000 |

## Providers Linked to Pricing

### Using Composite 'id' Field (pp.provider_id = pl.id)
- Providers with pricing: 0
- Total providers: 1000
- Coverage: 0.0%

### Using Numeric 'provider_id' Field (pp.provider_id = pl.provider_id) [CORRECT]
- Providers with pricing: 3
- Total providers: 1000
- Coverage: 0.3%

## ⚠️ Data Quality Issues

- **Orphan pricing records**: 985 pricing rows reference providers that don't exist in provider_location
- **Recommendation**: Clean up orphan records or add missing provider records

## Recommendations

1. **Use correct join field**: Join should use `pp.provider_id = pl.provider_id` (numeric), not `pp.provider_id = pl.id` (composite)
2. **Fix orphan records**: Address {orphan_count_numeric} pricing records that reference non-existent providers
3. **Increase pricing coverage**: Only {coverage_percent_numeric}% of providers have pricing data
4. **Verify data seeding**: Ensure new pricing data uses valid provider_id values
