export type MedicationPriceApiRow = {
  rxcui_scd: string;
  pharmacy_id: string;
  pharmacy_name: string | null;
  pharmacy_type: string | null;
  delivery_only: string | boolean | null;
  national: string | boolean | null;
  region: string | null;
  source_id: string | null;
  source_name: string | null;
  source_type: string | null;
  price: number;
  quantity: string | null;
  product_url: string | null;
  created_at: string | null;
};

type PricingType = 'coupon' | 'cash' | 'unknown';

export type MedicationCashPrice = {
  pharmacy: string;
  price: number;
  distance?: number;
  delivery?: boolean;
  deliveryTime?: string;
};

export type MedicationMarioPick = {
  pharmacy: string;
  price: number;
  savings: number;
};

export type MedicationSearchPricing = {
  cashPrices: MedicationCashPrice[];
  marioPick: MedicationMarioPick | null;
  insurancePrice: null;
};

export type MedicationDetailOffer = {
  name: string;
  distance: string;
  price: string;
  priceValue: number;
  savings?: string;
  source?: string | null;
  delivery?: boolean;
};

export type MedicationDetailMarioPick = {
  name: string;
  distance: string;
  price: string;
  priceValue: number;
  copayComparison: string;
  savings: string;
  yearSavings: string;
  source: string | null;
  delivery: boolean;
};

export type MedicationDetailPricing = {
  marioPick: MedicationDetailMarioPick | null;
  withInsurance: MedicationDetailOffer[];
  withoutInsurance: MedicationDetailOffer[];
};

export type MedicationComparePrice = {
  name: string;
  distance: string;
  distanceValue: number;
  price: string;
  priceValue: number;
  delivery?: boolean;
  marioPick?: boolean;
  savings?: string;
};

export type MedicationPricingTransform = MedicationSearchPricing & {
  detailPricing: MedicationDetailPricing;
  comparePrices: MedicationComparePrice[];
};

const parseBoolean = (value: string | boolean | null): boolean => {
  if (value === true) return true;
  if (value === false || value === null) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === 't' || normalized === '1' || normalized === 'yes';
};

const formatPrice = (value: number): string => `$${value.toFixed(2)}`;

const getPricingType = (row: MedicationPriceApiRow): PricingType => {
  if (row.source_id === 'goodrx') return 'coupon';
  if (row.source_id === 'costplus') return 'cash';
  return 'unknown';
};

type EnrichedMedicationRow = MedicationPriceApiRow & {
  pricingType: PricingType;
  couponAvailable: boolean;
  sourceLabel: string | null;
  delivery: boolean;
};

const enrichRow = (row: MedicationPriceApiRow): EnrichedMedicationRow => {
  const pricingType = getPricingType(row);
  const couponAvailable = Boolean(row.product_url);
  const sourceLabel = getSourceLabel(row);
  const delivery = getDeliveryFlag(row);

  return {
    ...row,
    pricingType,
    couponAvailable,
    sourceLabel,
    delivery,
  };
};

const getSourceLabel = (row: MedicationPriceApiRow): string | null => {
  return row.source_name ? `via ${row.source_name}` : null;
};

const getDeliveryFlag = (row: MedicationPriceApiRow): boolean => {
  return (
    parseBoolean(row.delivery_only) ||
    row.pharmacy_type === 'mail_order' ||
    parseBoolean(row.national)
  );
};

const selectMarioPick = (rows: EnrichedMedicationRow[]): EnrichedMedicationRow | null => {
  if (rows.length === 0) return null;

  const scored = [...rows].sort((left, right) => {
    if (left.price !== right.price) {
      return left.price - right.price;
    }

    const leftPricing = left.pricingType;
    const rightPricing = right.pricingType;
    const pricingRank = (type: PricingType) => {
      if (type === 'cash') return 0;
      if (type === 'coupon') return 1;
      return 2;
    };

    const pricingDiff = pricingRank(leftPricing) - pricingRank(rightPricing);
    if (pricingDiff !== 0) return pricingDiff;

    const leftDelivery = left.delivery ? 0 : 1;
    const rightDelivery = right.delivery ? 0 : 1;
    if (leftDelivery !== rightDelivery) return leftDelivery - rightDelivery;

    return (left.pharmacy_name || '').localeCompare(right.pharmacy_name || '');
  });

  return scored[0];
};

const getSavings = (rows: EnrichedMedicationRow[], picked: EnrichedMedicationRow | null): number => {
  if (!picked || rows.length < 2) return 0;
  const sorted = [...rows].sort((a, b) => a.price - b.price);
  const runnerUp = sorted.find((row) => row !== picked);
  if (!runnerUp) return 0;
  return Math.max(0, Number((runnerUp.price - picked.price).toFixed(2)));
};

export const transformMedicationSearchPricing = (
  rows: MedicationPriceApiRow[],
): MedicationSearchPricing => {
  const enrichedRows = rows.map(enrichRow);
  const cashPrices: MedicationCashPrice[] = enrichedRows.map((row) => ({
    pharmacy: row.pharmacy_name || row.pharmacy_id,
    price: row.price,
    delivery: row.delivery,
  }));

  const picked = selectMarioPick(enrichedRows);
  const savings = getSavings(enrichedRows, picked);

  return {
    cashPrices,
    marioPick: picked
      ? {
          pharmacy: picked.pharmacy_name || picked.pharmacy_id,
          price: picked.price,
          savings,
        }
      : null,
    insurancePrice: null,
  };
};

export const transformMedicationDetailPricing = (
  rows: MedicationPriceApiRow[],
): MedicationDetailPricing => {
  const enrichedRows = rows.map(enrichRow);
  const picked = selectMarioPick(enrichedRows);
  const savings = getSavings(enrichedRows, picked);
  const yearSavings = savings > 0 ? `$${(savings * 12).toFixed(0)} per year` : '—';

  const withoutInsurance: MedicationDetailOffer[] = enrichedRows.map((row) => ({
    name: row.pharmacy_name || row.pharmacy_id,
    distance: row.delivery ? 'Delivery' : '—',
    price: formatPrice(row.price),
    priceValue: row.price,
    source: row.sourceLabel,
    delivery: row.delivery,
  }));

  const marioPick = picked
    ? {
        name: picked.pharmacy_name || picked.pharmacy_id,
        distance: picked.delivery ? 'Delivery' : '—',
        price: formatPrice(picked.price),
        priceValue: picked.price,
        copayComparison: '—',
        savings: savings > 0 ? `Save $${savings.toFixed(2)} this month` : '—',
        yearSavings,
        source: picked.sourceLabel,
        delivery: picked.delivery,
      }
    : null;

  return {
    marioPick,
    withInsurance: [],
    withoutInsurance,
  };
};

export const transformMedicationComparePrices = (
  rows: MedicationPriceApiRow[],
): MedicationComparePrice[] => {
  const enrichedRows = rows.map(enrichRow);
  const picked = selectMarioPick(enrichedRows);
  const savings = getSavings(enrichedRows, picked);

  return enrichedRows.map((row) => {
    const delivery = row.delivery;
    const isMarioPick = picked ? row === picked : false;
    return {
      name: row.pharmacy_name || row.pharmacy_id,
      distance: delivery ? 'Delivery' : '—',
      distanceValue: delivery ? 0 : 999,
      price: formatPrice(row.price),
      priceValue: row.price,
      delivery,
      marioPick: isMarioPick || undefined,
      savings: isMarioPick && savings > 0 ? `Save $${savings.toFixed(2)}` : undefined,
    };
  });
};

export const transformMedicationPrices = (
  rows: MedicationPriceApiRow[],
): MedicationPricingTransform => {
  return {
    ...transformMedicationSearchPricing(rows),
    detailPricing: transformMedicationDetailPricing(rows),
    comparePrices: transformMedicationComparePrices(rows),
  };
};
