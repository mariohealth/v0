"""Hospital-related models."""
from pydantic import BaseModel, Field
from typing import List


class Hospital(BaseModel):
    """Single hospital"""
    hospital_id: str
    hospital_name: str
    system_id: str
    address: str
    city: str
    state: str
    zipcode: str
    latitude: float
    longitude: float
    phone: str
    hospital_type: str
    operational_status: str

class HospitalResponse(BaseModel):
    """Response for GET /api/v1/hospitals"""
    hospitals: List[Hospital]

    class ConfigDict:
        json_schema_extra = {
            "examples": {
                "hospitals": [
                    {
                        "hospital_id": "nyc_001",
                        "hospital_name": "NYU Langone",
                        "system_id": "SYS_NYU",
                        "address": "123 St",
                        "city": "New York",
                        "state": "NY",
                        "zipcode": "01245",
                        "latitude": 51.23,
                        "longitude": -0.21,
                        "phone": "+55555555",
                        "hospital_type": "University",
                        "operational_status": "Active",
                    }
                ]
            }
        }
        