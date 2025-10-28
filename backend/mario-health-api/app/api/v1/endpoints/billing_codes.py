from fastapi import APIRouter, Depends, Path, Query
from supabase import Client
from app.core.dependencies import get_supabase
from app.models import BillingCodeDetail, CodeType
from app.services.billing_code_service import BillingCodeService

router = APIRouter(prefix="/codes", tags=["billing-codes"])


@router.get("/{code}", response_model=BillingCodeDetail)
async def get_billing_code_detail(
        code: str = Path(
            ...,
            min_length=4,
            max_length=10,
            description="Medical billing code (CPT, HCPCS, G-code, ICD-10-PCS, etc.)"
        ),
        code_type: CodeType | None = Query(
            None,
            description="Optional: Filter by specific code type"
        ),
        supabase: Client = Depends(get_supabase)
):
    """
    Get detailed information about a medical billing code.

    Returns all procedures that use this billing code with pricing information.

    **Supported code types:**
    - **CPT**: Current Procedural Terminology (e.g., "71046", "99213")
    - **HCPCS**: Healthcare Common Procedure Coding System (e.g., "J0170", "E0784")
    - **G-CODE**: CMS G-codes (e.g., "G0008", "G0438")
    - **ICD-10-PCS**: ICD-10 Procedure Coding System (e.g., "0016T")
    - **ICD-10-CM**: ICD-10 Clinical Modification (diagnosis codes)
    - **CDT**: Current Dental Terminology
    - **DRG**: Diagnosis-Related Group

    **Examples:**
    - `/api/v1/codes/71046` - Search all code types
    - `/api/v1/codes/71046?code_type=CPT` - Search only CPT codes
    - `/api/v1/codes/J0170?code_type=HCPCS` - Search HCPCS code
    """
    service = BillingCodeService(supabase)
    return await service.get_billing_code_detail(code, code_type)
