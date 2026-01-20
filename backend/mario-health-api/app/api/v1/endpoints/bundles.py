from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from app.models.bundle import (
    BundleListResponse,
    BundleDetail,
    BundleEstimateResponse,
    BundleHospitalsResponse,
)
from supabase import Client
from app.core.dependencies import get_supabase
from app.services.bundle_service import BundleService

router = APIRouter(prefix="/bundles", tags=["bundles"])

@router.get("", response_model=BundleListResponse)
def list_bundles(
    supabase: Client = Depends(get_supabase)
):
    """
    List all available bundles.
    """
    service = BundleService(supabase)
    return service.list_bundles()

@router.get("/{slug}", response_model=BundleDetail)
def get_bundle_detail(
    slug: str,
    supabase: Client = Depends(get_supabase)
):
    """
    Get bundle details by slug.
    """
    service = BundleService(supabase)
    bundle = service.get_bundle_detail(slug)
    if not bundle:
        raise HTTPException(status_code=404, detail="Bundle not found")
    return bundle

@router.get("/{slug}/estimate", response_model=BundleEstimateResponse)
def get_bundle_estimate(
    slug: str,
    facility_org_id: str = Query(..., description="Organization identifier (currently maps to org_id)"),
    carrier_plan_id: str = Query(..., description="Insurance plan identifier"),
    supabase: Client = Depends(get_supabase)
):
    """
    Calculate price estimate for a bundle.
    """
    service = BundleService(supabase)
    estimate = service.calculate_bundle_estimate(slug, facility_org_id, carrier_plan_id)
    if not estimate:
        raise HTTPException(status_code=501, detail="Estimate calculation not yet implemented")
    return estimate

@router.get("/{slug}/hospitals", response_model=BundleHospitalsResponse)
def get_bundle_hospitals(
    slug: str,
    zip_code: Optional[str] = Query(None, description="Filter by proximity"),
    radius_miles: float = Query(25.0, description="Search radius in miles"),
    carrier_plan_id: Optional[str] = Query(None, description="Filter by insurance plan"),
    supabase: Client = Depends(get_supabase)
):
    """
    Get hospitals that have pricing data for this bundle.
    """
    service = BundleService(supabase)
    return service.get_bundle_hospitals(slug, zip_code, radius_miles, carrier_plan_id)
