import logging
from fastapi import APIRouter, Query, Depends, HTTPException
from supabase import Client
from postgrest.exceptions import APIError

from app.core.dependencies import get_supabase
from app.models import MedicationPriceRow

logger = logging.getLogger(__name__)


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

    # Guardrail: Check if product URLs match the medication name
    _validate_product_urls(supabase, rxcui_scd, rows)

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


def _validate_product_urls(supabase: Client, rxcui_scd: str, rows: list[dict]) -> None:
    """
    Guardrail: Check if product URLs contain the medication name.
    Logs warnings for mismatches but doesn't block the response.
    """
    if not rows:
        return

    # Get the drug name from the drugs table
    try:
        drug_result = supabase.table("drugs").select("drug_name").eq("rxnorm_cui", rxcui_scd).execute()
        if not drug_result.data:
            logger.warning(f"No drug name found for rxcui_scd: {rxcui_scd}")
            return
        
        drug_name = drug_result.data[0]["drug_name"]
        if not drug_name:
            return

        # Extract key medication terms from drug name (remove common words)
        drug_terms = _extract_medication_terms(drug_name.lower())
        
        # Check each product URL
        for row in rows:
            product_url = row.get("product_url")
            if not product_url:
                continue
                
            url_lower = product_url.lower()
            
            # Check if any medication term appears in the URL
            if not any(term in url_lower for term in drug_terms if len(term) >= 4):
                logger.warning(
                    f"Product URL mismatch detected - rxcui_scd: {rxcui_scd}, "
                    f"drug_name: '{drug_name}', product_url: '{product_url}'"
                )
                break  # Only log once per request
                
    except Exception as e:
        logger.error(f"Error validating product URLs for rxcui_scd {rxcui_scd}: {e}")


def _extract_medication_terms(drug_name: str) -> list[str]:
    """
    Extract meaningful medication terms from drug name.
    Filters out common words and dosage information.
    """
    # Common words to ignore
    ignore_words = {
        "mg", "mcg", "ml", "tablet", "capsule", "oral", "injection", "solution",
        "suspension", "cream", "gel", "ointment", "patch", "inhaler", "pen",
        "extended", "release", "delayed", "immediate", "hydrochloride", "hcl",
        "sodium", "potassium", "calcium", "sulfate", "citrate", "acetate",
        "maleate", "tartrate", "fumarate", "succinate", "phosphate", "chloride"
    }
    
    # Split on common separators and filter
    import re
    words = re.split(r'[\s\-_/]+', drug_name.lower())
    
    # Keep words that are meaningful medication names
    meaningful_terms = []
    for word in words:
        # Remove dosage numbers and units
        clean_word = re.sub(r'\d+(\.\d+)?', '', word).strip()
        if (len(clean_word) >= 4 and 
            clean_word not in ignore_words and 
            not clean_word.isdigit()):
            meaningful_terms.append(clean_word)
    
    return meaningful_terms
