"""
Bookings API endpoints.

Provides CRUD operations for appointment bookings.
TODO: Implement logic to match frontend requirements.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Path
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from supabase import Client
from app.core.dependencies import get_supabase

router = APIRouter(prefix="/bookings", tags=["bookings"])


# Request/Response models
class BookingData(BaseModel):
    """Booking creation request model."""
    provider_id: str
    procedure_id: str
    appointment_date: str
    appointment_time: str
    patient_name: str
    patient_email: str
    patient_phone: Optional[str] = None
    insurance_provider: Optional[str] = None
    notes: Optional[str] = None


class BookingResponse(BaseModel):
    """Booking response model."""
    id: str
    provider_id: str
    procedure_id: str
    appointment_date: str
    appointment_time: str
    patient_name: str
    patient_email: str
    status: str
    created_at: str


@router.post("", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingData,
    supabase: Client = Depends(get_supabase)
):
    """
    Create a new appointment booking.
    
    TODO: Implement logic to match frontend requirements.
    """
    # Stub response for now
    return BookingResponse(
        id="booking_stub_001",
        provider_id=booking_data.provider_id,
        procedure_id=booking_data.procedure_id,
        appointment_date=booking_data.appointment_date,
        appointment_time=booking_data.appointment_time,
        patient_name=booking_data.patient_name,
        patient_email=booking_data.patient_email,
        status="pending",
        created_at=datetime.utcnow().isoformat(),
    )


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking_details(
    booking_id: str = Path(..., description="Booking ID"),
    supabase: Client = Depends(get_supabase)
):
    """
    Get details of a specific booking.
    
    TODO: Implement logic to match frontend requirements.
    """
    # Stub response for now
    return BookingResponse(
        id=booking_id,
        provider_id="provider_stub",
        procedure_id="procedure_stub",
        appointment_date="2024-01-01",
        appointment_time="10:00 AM",
        patient_name="Patient Name",
        patient_email="patient@example.com",
        status="confirmed",
        created_at=datetime.utcnow().isoformat(),
    )


@router.delete("/{booking_id}/cancel")
async def cancel_booking(
    booking_id: str = Path(..., description="Booking ID"),
    supabase: Client = Depends(get_supabase)
):
    """
    Cancel an existing booking.
    
    TODO: Implement logic to match frontend requirements.
    """
    # Stub response for now
    return {
        "success": True,
        "message": f"Booking {booking_id} cancelled",
    }

