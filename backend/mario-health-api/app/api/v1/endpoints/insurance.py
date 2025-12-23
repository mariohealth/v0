"""
Insurance API endpoints.

Provides insurance verification and provider listing.
TODO: Implement logic to match frontend requirements.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from supabase import Client
from app.core.dependencies import get_supabase

router = APIRouter(prefix="/insurance", tags=["insurance"])


# Request/Response models
class InsuranceVerificationRequest(BaseModel):
    """Insurance verification request model."""
    member_id: str
    provider_id: str


class InsuranceVerificationResponse(BaseModel):
    """Insurance verification response model."""
    verified: bool
    member_id: str
    provider_id: str
    coverage_type: Optional[str] = None
    copay: Optional[float] = None
    deductible: Optional[float] = None
    message: str


class InsuranceProvider(BaseModel):
    """Insurance provider model."""
    id: str
    name: str
    type: str
    network: Optional[str] = None
    available: bool = True  # Whether this carrier has pricing data loaded


class InsuranceProvidersResponse(BaseModel):
    """Insurance providers list response model."""
    providers: List[InsuranceProvider]


@router.post("/verify", response_model=InsuranceVerificationResponse)
async def verify_insurance(
    request: InsuranceVerificationRequest,
    supabase: Client = Depends(get_supabase)
):
    """
    Verify insurance coverage for a patient/provider combination.
    
    TODO: Implement logic to match frontend requirements.
    """
    # Stub response for now
    return InsuranceVerificationResponse(
        verified=True,
        member_id=request.member_id,
        provider_id=request.provider_id,
        coverage_type="PPO",
        copay=25.0,
        deductible=500.0,
        message="Insurance verified successfully",
    )


@router.get("/providers", response_model=InsuranceProvidersResponse)
async def get_insurance_providers(
    supabase: Client = Depends(get_supabase)
):
    """
    Get list of all major insurance providers.

    Shows all carriers, with 'available' flag indicating which ones have pricing data.
    Currently only Cigna and UnitedHealthcare have pricing data loaded.
    """
    # IMPORTANT: Carriers with available=True must match carrier_id values in
    # the procedure_pricing table:
    # - cigna_national_oap (from cigna/national_oap_plan data pipeline)
    # - united_pp1_00 (from united_healthcare/pp1_00_plan data pipeline)
    return InsuranceProvidersResponse(
        providers=[
            # Available carriers (have pricing data)
            InsuranceProvider(
                id="cigna_national_oap",
                name="Cigna",
                type="PPO",
                network="National",
                available=True,
            ),
            InsuranceProvider(
                id="united_pp1_00",
                name="UnitedHealthcare",
                type="PPO",
                network="National",
                available=True,
            ),
            # Unavailable carriers (coming soon)
            InsuranceProvider(
                id="bcbs",
                name="Blue Cross Blue Shield",
                type="PPO",
                network="National",
                available=False,
            ),
            InsuranceProvider(
                id="aetna",
                name="Aetna",
                type="HMO",
                network="National",
                available=False,
            ),
            InsuranceProvider(
                id="humana",
                name="Humana",
                type="HMO",
                network="National",
                available=False,
            ),
            InsuranceProvider(
                id="kaiser",
                name="Kaiser Permanente",
                type="HMO",
                network="Regional",
                available=False,
            ),
            InsuranceProvider(
                id="anthem",
                name="Anthem",
                type="PPO",
                network="National",
                available=False,
            ),
            InsuranceProvider(
                id="centene",
                name="Centene",
                type="HMO",
                network="National",
                available=False,
            ),
            InsuranceProvider(
                id="molina",
                name="Molina Healthcare",
                type="HMO",
                network="Regional",
                available=False,
            ),
            InsuranceProvider(
                id="other",
                name="Other Insurance",
                type="PPO",
                network="National",
                available=False,
            ),
        ]
    )

