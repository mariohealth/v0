from decimal import Decimal
from typing import Optional, List, Dict
from pydantic import BaseModel

# Frequency weight mapping - use this throughout
FREQUENCY_WEIGHTS = {
    "always": 1.0,
    "usually": 0.75,
    "sometimes": 0.40,
    "rarely": 0.10
}

class CodeSummary(BaseModel):
    id: str
    code: str
    code_type: str
    name: str
    frequency: str | None
    frequency_weight: float | None  # Computed from frequency
    is_default: bool
    display_order: int
    why_billed: str | None

class BundleGroupSummary(BaseModel):
    id: str
    name: str
    selection_type: str
    is_required: bool
    phase: str | None
    display_order: int
    codes: List[CodeSummary]  # Sorted by display_order

class BundleDetail(BaseModel):
    id: str
    slug: str
    name: str
    description: str | None
    category: str | None
    primary_cpt_code: str | None
    typical_setting: str | None
    global_period_days: int | None
    groups: List[BundleGroupSummary]

class BundleList(BaseModel):
    id: str
    slug: str
    name: str
    description: str | None
    category: str | None
    primary_cpt_code: str | None
    typical_setting: str | None
    estimated_duration_hours: float | None

class BundleListResponse(BaseModel):
    bundles: List[BundleList]

class RateRange(BaseModel):
    """Min/Expected/Max rate structure"""
    min: Decimal | None
    expected: Decimal | None  # Frequency-weighted average
    max: Decimal | None

class CodeEstimate(BaseModel):
    code_id: str
    code: str
    code_type: str
    name: str
    frequency: str
    frequency_weight: float
    display_order: int
    professional_rate: Dict[str, Optional[Decimal]]  # {min, avg, max}
    institutional_rate: Dict[str, Optional[Decimal]]  # {min, avg, max}
    why_billed: str | None

class GroupEstimate(BaseModel):
    group_id: str
    group_name: str
    phase: str | None
    selection_type: str
    display_order: int
    codes: List[CodeEstimate]  # Sorted by display_order
    subtotal: RateRange

class HospitalInfo(BaseModel):
    id: str
    name: str
    city: str | None
    state: str | None

class InsuranceInfo(BaseModel):
    carrier_id: str
    carrier_name: str | None
    plan_id: str
    plan_name: str | None

class CodeWithoutPricing(BaseModel):
    code_id: str
    code: str
    code_type: str
    name: str
    frequency: str
    reason: str

class SurpriseCharge(BaseModel):
    code_id: str
    code: str
    name: str
    frequency: str
    frequency_weight: float
    estimated_contribution: Decimal  # rate.avg * frequency_weight
    rate: Dict[str, Optional[Decimal]]  # {min, avg, max}
    why_billed: str

class EstimateMetadata(BaseModel):
    codes_with_pricing: int
    codes_without_pricing: int
    pricing_coverage_percent: float

class EstimateBreakdown(BaseModel):
    total: RateRange
    professional_total: RateRange
    institutional_total: RateRange
    breakdown_by_phase: Dict[str, RateRange]
    breakdown_by_group: List[GroupEstimate]
    surprise_charges: List[SurpriseCharge]
    codes_without_pricing: List[CodeWithoutPricing]

class BundleEstimateResponse(BaseModel):
    bundle: Dict[str, str] # Minimal bundle info
    hospital: HospitalInfo
    insurance: InsuranceInfo
    estimate: EstimateBreakdown
    metadata: EstimateMetadata
    warnings: List[str] = []

class HospitalBundleStats(BaseModel):
    id: str
    name: str
    address: str | None
    city: str | None
    state: str | None
    zip_code: str | None
    distance_miles: float | None
    coverage_percent: float
    estimated_total_range: Dict[str, Optional[Decimal]] # min, avg, max

class BundleHospitalsResponse(BaseModel):
    hospitals: List[HospitalBundleStats]
