from fastapi import HTTPException
from supabase import Client
from decimal import Decimal
from postgrest.exceptions import APIError

from app.models import BillingCodeDetail, BillingCodeProcedureMapping, CodeType
from app.middleware.logging import log_structured


class BillingCodeService:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_billing_code_detail(
            self,
            code: str,
            code_type: CodeType | None = None
    ) -> BillingCodeDetail:
        """
        Fetch all procedures associated with a billing code.

        Args:
            code: The billing code (e.g., "71046", "J0170", "0016T")
            code_type: Optional filter by code type (CPT, HCPCS, etc.)
        """
        try:
            # Call RPC function
            result = self.supabase.rpc(
                "get_billing_code_detail",
                {
                    "code_input": code,
                    "code_type_input": code_type.value if code_type else None
                }
            ).execute()

            if not result.data or len(result.data) == 0:
                code_type_msg = f" (type: {code_type.value})" if code_type else ""

                log_structured(
                    severity="INFO",  # Not an error - expected behavior
                    message="Billing code not found",
                    code=code,
                    code_type=code_type,
                )

                raise HTTPException(
                    status_code=404,
                    detail=f"Billing code '{code}'{code_type_msg} not found"
                )

            # Get code description from first result
            code_description = result.data[0].get("code_description")
            detected_code_type = result.data[0].get("code_type")

            # Map procedures
            procedures = [
                BillingCodeProcedureMapping(
                    procedure_id=r["procedure_id"],
                    procedure_name=r["procedure_name"],
                    procedure_slug=r["procedure_slug"],
                    procedure_description=r.get("procedure_description"),
                    family_name=r["family_name"],
                    family_slug=r["family_slug"],
                    category_name=r["category_name"],
                    category_slug=r["category_slug"],
                    min_price=Decimal(str(r["min_price"])) if r.get("min_price") else None,
                    max_price=Decimal(str(r["max_price"])) if r.get("max_price") else None,
                    avg_price=Decimal(str(r["avg_price"])) if r.get("avg_price") else None,
                    provider_count=r.get("provider_count", 0),
                    code_type=CodeType(r["code_type"]),
                    is_primary=r.get("is_primary", False)
                )
                for r in result.data
            ]

            # Calculate overall statistics
            all_min_prices = [p.min_price for p in procedures if p.min_price]
            all_max_prices = [p.max_price for p in procedures if p.max_price]
            all_avg_prices = [p.avg_price for p in procedures if p.avg_price]

            overall_min = min(all_min_prices) if all_min_prices else None
            overall_max = max(all_max_prices) if all_max_prices else None
            overall_avg = sum(all_avg_prices) / len(all_avg_prices) if all_avg_prices else None
            total_providers = sum(p.provider_count for p in procedures)

            return BillingCodeDetail(
                code=code,
                code_type=CodeType(detected_code_type) if detected_code_type else code_type,
                description=code_description,
                procedures=procedures,
                overall_min_price=overall_min,
                overall_max_price=overall_max,
                overall_avg_price=overall_avg,
                total_providers=total_providers
            )

        except HTTPException:
            # Re-raise 404 as-is
            raise

        except APIError as e:
            log_structured(
                severity="ERROR",
                message="Database error fetching billing code detail",
                code=code,
                code_type=code_type,
                error=str(e),
            )
            raise HTTPException(
                status_code=503,
                detail="Service temporarily unavailable"
            )

        except Exception as e:
            log_structured(
                severity="ERROR",
                message="Unexpected error fetching billing code detail",
                code=code,
                code_type=code_type,
                error_type=type(e).__name__,
                error_message=str(e),
            )
            raise
