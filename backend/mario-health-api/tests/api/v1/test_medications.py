import logging
from unittest.mock import patch
from app.core.dependencies import get_supabase
from app.main import app


class FakeRPCResult:
    def __init__(self, data):
        self.data = data


class FakeRPCRequest:
    def __init__(self, data):
        self._data = data

    def execute(self):
        return FakeRPCResult(self._data)


class FakeTableQuery:
    def __init__(self, data):
        self.data = data
        
    def select(self, fields):
        return self
        
    def eq(self, field, value):
        return self
        
    def execute(self):
        return FakeRPCResult(self.data)


class FakeSupabaseClient:
    def __init__(self, data, drug_data=None):
        self.data = data
        self.drug_data = drug_data or []
        self.last_call = None

    def rpc(self, name, params):
        self.last_call = {"name": name, "params": params}
        return FakeRPCRequest(self.data)
        
    def table(self, table_name):
        if table_name == "drugs":
            return FakeTableQuery(self.drug_data)
        return FakeTableQuery([])


def test_medication_prices_sorted_and_complete(test_client):
    fake_rows = [
        {
            "rxcui_scd": "12345",
            "pharmacy_id": "pharm_2",
            "pharmacy_name": "Beta Pharmacy",
            "pharmacy_type": "retail",
            "delivery_only": "false",
            "national": "false",
            "region": "west",
            "source_id": "src_2",
            "source_name": "SingleCare",
            "source_type": "coupon",
            "price": "12.50",
            "quantity": "30",
            "product_url": "https://example.com/2",
            "created_at": "2025-02-01T00:00:00Z",
        },
        {
            "rxcui_scd": "12345",
            "pharmacy_id": "pharm_1",
            "pharmacy_name": "Alpha Pharmacy",
            "pharmacy_type": "mail",
            "delivery_only": "true",
            "national": "true",
            "region": "national",
            "source_id": "src_1",
            "source_name": "GoodRx",
            "source_type": "coupon",
            "price": "8.25",
            "quantity": "30",
            "product_url": "https://example.com/1",
            "created_at": "2025-02-02T00:00:00Z",
        },
    ]

    fake_supabase = FakeSupabaseClient(fake_rows)
    app.dependency_overrides[get_supabase] = lambda: fake_supabase

    response = test_client.get(
        "/api/v1/medications/prices",
        params={"rxcui_scd": "12345", "quantity": 30},
    )

    app.dependency_overrides = {}

    assert response.status_code == 200
    data = response.json()
    prices = [row["price"] for row in data]
    assert prices == sorted(prices)

    assert fake_supabase.last_call["name"] == "get_medication_prices"
    assert fake_supabase.last_call["params"]["rxcui_scd_input"] == "12345"
    assert fake_supabase.last_call["params"]["quantity_input"] == "30"

    required_fields = [
        "rxcui_scd",
        "pharmacy_id",
        "pharmacy_name",
        "pharmacy_type",
        "delivery_only",
        "national",
        "region",
        "source_id",
        "source_name",
        "source_type",
        "price",
        "quantity",
        "product_url",
        "created_at",
    ]

    for row in data:
        for field in required_fields:
            assert field in row
        assert row["pharmacy_name"]
        assert row["source_name"]


def test_product_url_validation_guardrail(test_client, caplog):
    """Test that the guardrail logs warnings for mismatched product URLs."""
    fake_rows = [
        {
            "rxcui_scd": "896236",
            "pharmacy_id": "pharm_1",
            "pharmacy_name": "Test Pharmacy",
            "pharmacy_type": "retail",
            "delivery_only": "false",
            "national": "false",
            "region": "west",
            "source_id": "goodrx",
            "source_name": "GoodRx",
            "source_type": "coupon",
            "price": "10.50",
            "quantity": "30",
            # This URL doesn't contain "atorvastatin" - should trigger warning
            "product_url": "https://goodrx.com/metformin-500mg",
            "created_at": "2025-02-01T00:00:00Z",
        }
    ]
    
    # Mock drug data
    drug_data = [{"drug_name": "atorvastatin 20 MG Oral Tablet"}]
    
    fake_supabase = FakeSupabaseClient(fake_rows, drug_data)
    app.dependency_overrides[get_supabase] = lambda: fake_supabase

    with caplog.at_level(logging.WARNING):
        response = test_client.get(
            "/api/v1/medications/prices",
            params={"rxcui_scd": "896236", "quantity": "30"},
        )

    app.dependency_overrides = {}

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1  # Response should still be returned
    
    # Check that warning was logged
    warning_logs = [record for record in caplog.records if record.levelno == logging.WARNING]
    assert len(warning_logs) == 1
    assert "Product URL mismatch detected" in warning_logs[0].message
    assert "rxcui_scd: 896236" in warning_logs[0].message
    assert "atorvastatin 20 MG Oral Tablet" in warning_logs[0].message
    assert "https://goodrx.com/metformin-500mg" in warning_logs[0].message


def test_product_url_validation_no_warning_on_match(test_client, caplog):
    """Test that no warning is logged when product URL matches medication name."""
    fake_rows = [
        {
            "rxcui_scd": "896236",
            "pharmacy_id": "pharm_1",
            "pharmacy_name": "Test Pharmacy",
            "pharmacy_type": "retail",
            "delivery_only": "false",
            "national": "false",
            "region": "west",
            "source_id": "goodrx",
            "source_name": "GoodRx",
            "source_type": "coupon",
            "price": "10.50",
            "quantity": "30",
            # This URL contains "atorvastatin" - should NOT trigger warning
            "product_url": "https://goodrx.com/atorvastatin-20mg",
            "created_at": "2025-02-01T00:00:00Z",
        }
    ]
    
    # Mock drug data
    drug_data = [{"drug_name": "atorvastatin 20 MG Oral Tablet"}]
    
    fake_supabase = FakeSupabaseClient(fake_rows, drug_data)
    app.dependency_overrides[get_supabase] = lambda: fake_supabase

    with caplog.at_level(logging.WARNING):
        response = test_client.get(
            "/api/v1/medications/prices",
            params={"rxcui_scd": "896236", "quantity": "30"},
        )

    app.dependency_overrides = {}

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    
    # Check that NO warning was logged
    warning_logs = [record for record in caplog.records if record.levelno == logging.WARNING]
    assert len(warning_logs) == 0
