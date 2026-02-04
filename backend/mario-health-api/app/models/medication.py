from pydantic import BaseModel


class MedicationPriceRow(BaseModel):
    rxcui_scd: str | None
    pharmacy_id: str | None
    pharmacy_name: str | None
    pharmacy_type: str | None
    delivery_only: str | None
    national: str | None
    region: str | None
    source_id: str | None
    source_name: str | None
    source_type: str | None
    price: float
    quantity: str | None
    product_url: str | None
    created_at: str | None
