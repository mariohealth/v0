from fastapi import APIRouter, Query, Depends, HTTPException
from supabase import Client
from postgrest.exceptions import APIError

from app.core.dependencies import get_supabase
from app.models import MedicationPriceRow


router = APIRouter(prefix="/medications", tags=["medications"])


@router.get("/prices", response_model=list[MedicationPriceRow])
async def get_medication_prices(
    rxcui_scd: str = Query(..., description="RXCUI SCD identifier"),
    quantity: str | int | None = Query(None, description="Requested quantity"),
    supabase: Client = Depends(get_supabase),
):
    """Fetch medication prices with pharmacy and source details."""
    quantity_value = str(quantity) if quantity is not None else None

    try:
        result = supabase.rpc(
            "get_medication_prices",
            {"rxcui_scd_input": rxcui_scd, "quantity_input": quantity_value},
        ).execute()
    except APIError as exc:
        raise HTTPException(
            status_code=503, detail="Medication prices temporarily unavailable"
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail="Failed to fetch medication prices"
        ) from exc

    rows = result.data or []
    normalized: list[MedicationPriceRow] = []

    for row in rows:
        price_value = row.get("price")
        if price_value is None:
            continue
        try:
            price_number = float(price_value)
        except (TypeError, ValueError):
            continue

        normalized.append(
            MedicationPriceRow(
                rxcui_scd=row.get("rxcui_scd"),
                pharmacy_id=row.get("pharmacy_id"),
                pharmacy_name=row.get("pharmacy_name"),
                pharmacy_type=row.get("pharmacy_type"),
                delivery_only=row.get("delivery_only"),
                national=row.get("national"),
                region=row.get("region"),
                source_id=row.get("source_id"),
                source_name=row.get("source_name"),
                source_type=row.get("source_type"),
                price=price_number,
                quantity=row.get("quantity"),
                product_url=row.get("product_url"),
                created_at=row.get("created_at"),
            )
        )

    normalized.sort(key=lambda item: item.price)
    return normalized
