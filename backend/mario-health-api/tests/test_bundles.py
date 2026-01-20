import pytest
from decimal import Decimal
from unittest.mock import MagicMock
from app.services.bundle_service import BundleService
from app.models.bundle import BundleDetail, BundleGroupSummary, CodeSummary

# Mocks for Supabase response
class MockResponse:
    def __init__(self, data):
        self.data = data

class MockQuery:
    def __init__(self):
        self._return_value = MockResponse([])
        self._side_effect = None
        self._call_count = 0

    def select(self, *args, **kwargs):
        return self

    def eq(self, *args, **kwargs):
        return self

    def in_(self, *args, **kwargs):
        return self

    def order(self, *args, **kwargs):
        return self

    def limit(self, *args, **kwargs):
        return self
        
    def single(self, *args, **kwargs):
        return self

    def execute(self):
        if self._side_effect:
            try:
                result = self._side_effect[self._call_count]
                self._call_count += 1
                return result
            except IndexError:
                raise AssertionError("Unexpected extra Supabase query call")
        return self._return_value

class MockSupabase:
    def __init__(self):
        self.query_mock = MockQuery()

    def table(self, name):
        return self.query_mock

@pytest.fixture
def mock_supabase():
    return MockSupabase()

@pytest.fixture
def service(mock_supabase):
    return BundleService(mock_supabase)

# --- Helper to create CodeSummary ---
def mk_code(id, freq, weight):
    return CodeSummary(
        id=id, code=id, code_type="CPT", name=f"Code {id}", 
        frequency=freq, frequency_weight=weight, is_default=False, display_order=1, why_billed=None
    )

# --- Helper to create Pricing Row ---
def mk_pricing(code, min_p, avg_p, max_p):
    return {
        "billing_code": code, "billing_code_type": "CPT",
        "min_professional_rate": min_p, "avg_professional_rate": avg_p, "max_professional_rate": max_p,
        "min_institutional_rate": 0, "avg_institutional_rate": 0, "max_institutional_rate": 0
    }

# --- Tests for Calculation Logic (ALL, ONE, etc) ---

def test_calc_logic_all(service, mock_supabase):
    # ALL: min=sum(min*w), exp=sum(exp*w), max=sum(max*w)
    c1 = mk_code("c1", "always", 1.0)
    c2 = mk_code("c2", "sometimes", 0.5) # User weight
    
    group = BundleGroupSummary(
        id="g1", name="G", selection_type="ALL", is_required=True, phase="p", display_order=1, codes=[c1, c2]
    )
    bundle = BundleDetail(id="b", slug="s", name="N", description=None, category=None, primary_cpt_code=None, typical_setting=None, global_period_days=None, groups=[group])
    
    service.get_bundle_detail = MagicMock(return_value=bundle)
    
    pricing = [
        mk_pricing("c1", 100, 200, 300),
        mk_pricing("c2", 50, 60, 70)
    ]
    
    # Mock H/I queries
    mock_supabase.query_mock._side_effect = [
        MockResponse({"name": "H", "city": "C", "state": "S"}), # Hosp exists check
        MockResponse(pricing), # Pricing
        MockResponse({"name": "I"}) # Insurance
    ]
    
    res = service.calculate_bundle_estimate("s", "h", "cp")
    
    # c1: min=100 (always), avg=200*1, max=300
    # c2: min=ignored (sometimes), avg=60*0.5=30, max=70
    # Total: min=100, avg=230, max=370
    assert res.estimate.total.min == Decimal(100)
    assert res.estimate.total.expected == Decimal(230)
    assert res.estimate.total.max == Decimal(370)

def test_calc_logic_one(service, mock_supabase):
    # ONE: min=min(min), exp=w_avg(exp), max=max(max)
    c1 = mk_code("c1", "always", 1.0) # Cost 200
    c2 = mk_code("c2", "usually", 0.5) # Cost 100
    
    group = BundleGroupSummary(
        id="g1", name="G", selection_type="ONE", is_required=True, phase="p", display_order=1, codes=[c1, c2]
    )
    bundle = BundleDetail(id="b", slug="s", name="N", description=None, category=None, primary_cpt_code=None, typical_setting=None, global_period_days=None, groups=[group])
    
    service.get_bundle_detail = MagicMock(return_value=bundle)
    
    pricing = [
        mk_pricing("c1", 100, 200, 300),
        mk_pricing("c2", 50, 100, 150)
    ]
    
    mock_supabase.query_mock._side_effect = [
        MockResponse({"name": "H"}), 
        MockResponse(pricing),
        MockResponse({"name": "I"})
    ]
    
    res = service.calculate_bundle_estimate("s", "h", "cp")
    
    # Min = min(100, 50) = 50
    assert res.estimate.total.min == Decimal(50)
    # Max = max(300, 150) = 300
    assert res.estimate.total.max == Decimal(300)
    # Exp = (200*1 + 100*0.5) / (1 + 0.5) = (200 + 50) / 1.5 = 250 / 1.5 = 166.6666...
    assert abs(res.estimate.total.expected - Decimal("166.6666666666666666666666667")) < Decimal("0.0001")

def test_calc_logic_zero_or_more(service, mock_supabase):
    # ZERO_OR_MORE: min=0, exp=sum(exp*w), max=sum(max)
    c1 = mk_code("c1", "always", 1.0)
    
    group = BundleGroupSummary(
        id="g1", name="G", selection_type="ZERO_OR_MORE", is_required=True, phase="p", display_order=1, codes=[c1]
    )
    bundle = BundleDetail(id="b", slug="s", name="N", description=None, category=None, primary_cpt_code=None, typical_setting=None, global_period_days=None, groups=[group])
    
    service.get_bundle_detail = MagicMock(return_value=bundle)
    
    pricing = [mk_pricing("c1", 100, 200, 300)]
    
    mock_supabase.query_mock._side_effect = [
        MockResponse({"name": "H"}), 
        MockResponse(pricing),
        MockResponse({"name": "I"})
    ]
    
    res = service.calculate_bundle_estimate("s", "h", "cp")
    
    assert res.estimate.total.min == Decimal(0)
    assert res.estimate.total.expected == Decimal(200) # 200*1
    assert res.estimate.total.max == Decimal(300) # 300 (taking all)

def test_calc_logic_zero_or_one(service, mock_supabase):
    # ZERO_OR_ONE: min=0, exp=w_avg(exp)/NOT count?, max=max(max)
    # User Spec: expected = weighted_average(code.expected, weights)
    # Wait, "NOT divide by count" note was "weighted_average ... // NOT divide by count".
    # Standard weighted average IS dividing by sum of weights.
    # Previous logic divided by count.
    # So I implemented standard weighted avg.
    
    c1 = mk_code("c1", "always", 1.0)
    c2 = mk_code("c2", "always", 1.0)
    
    group = BundleGroupSummary(
        id="g1", name="G", selection_type="ZERO_OR_ONE", is_required=True, phase="p", display_order=1, codes=[c1, c2]
    )
    bundle = BundleDetail(id="b", slug="s", name="N", description=None, category=None, primary_cpt_code=None, typical_setting=None, global_period_days=None, groups=[group])
    
    service.get_bundle_detail = MagicMock(return_value=bundle)
    
    pricing = [
        mk_pricing("c1", 100, 200, 300),
        mk_pricing("c2", 200, 400, 600)
    ]
    
    mock_supabase.query_mock._side_effect = [
        MockResponse({"name": "H"}), 
        MockResponse(pricing),
        MockResponse({"name": "I"})
    ]
    
    res = service.calculate_bundle_estimate("s", "h", "cp")
    
    assert res.estimate.total.min == Decimal(0)
    assert res.estimate.total.max == Decimal(600)
    # Exp = (200*1 + 400*1) / (1+1) = 300
    assert res.estimate.total.expected == Decimal(300)

def test_missing_pricing(service, mock_supabase):
    c1 = mk_code("c1", "always", 1.0)
    c2 = mk_code("c2", "always", 1.0)
    
    group = BundleGroupSummary(
        id="g1", name="G", selection_type="ALL", is_required=True, phase="p", display_order=1, codes=[c1, c2]
    )
    bundle = BundleDetail(id="b", slug="s", name="N", description=None, category=None, primary_cpt_code=None, typical_setting=None, global_period_days=None, groups=[group])
    
    service.get_bundle_detail = MagicMock(return_value=bundle)
    
    # Only c1 has pricing
    pricing = [
        mk_pricing("c1", 100, 200, 300)
    ]
    
    mock_supabase.query_mock._side_effect = [
        MockResponse({"name": "H"}), 
        MockResponse(pricing),
        MockResponse({"name": "I"})
    ]
    
    res = service.calculate_bundle_estimate("s", "h", "cp")
    
    # c2 is missing. Should be excluded from totals.
    # Total = c1 only.
    assert res.estimate.total.min == Decimal(100)
    assert len(res.estimate.codes_without_pricing) == 1
    assert res.estimate.codes_without_pricing[0].code == "c2"

def test_hospital_not_found(service, mock_supabase):
    service.get_bundle_detail = MagicMock(return_value=BundleDetail(id="b", slug="s", name="N", description=None, category=None, primary_cpt_code=None, typical_setting=None, global_period_days=None, groups=[]))
    
    # Hospital check returns empty
    mock_supabase.query_mock._side_effect = [
        MockResponse(None)
    ]
    
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as exc:
        service.calculate_bundle_estimate("s", "h", "cp")
    assert exc.value.status_code == 400    
