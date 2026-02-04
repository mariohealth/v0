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


class FakeSupabaseClient:
    def __init__(self, data):
        self.data = data
        self.last_call = None

    def rpc(self, name, params):
        self.last_call = {"name": name, "params": params}
        return FakeRPCRequest(self.data)


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
