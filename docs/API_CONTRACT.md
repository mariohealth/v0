# Mario Health API Contract

This document outlines the API endpoints and data structures expected by the Mario Health frontend application.

## Base URL
- Production: `https://api.mariohealth.com`
- Staging: `https://staging-api.mariohealth.com`
- Development: `http://localhost:3000/api`

## Authentication
All API requests should include appropriate authentication headers. The exact authentication method will be determined during backend implementation.

## Endpoints

### Search Providers
**GET** `/api/search`

Search for healthcare providers based on various criteria.

#### Query Parameters
- `procedure` (required): string - The medical procedure or service to search for
- `location` (optional): string - Geographic location (city, state, or zip code)
- `insuranceProvider` (optional): string - Insurance provider name
- `maxDistance` (optional): number - Maximum distance in miles
- `minPrice` (optional): number - Minimum price filter
- `maxPrice` (optional): number - Maximum price filter
- `minRating` (optional): number - Minimum rating filter (1-5)
- `types` (optional): string - Comma-separated list of provider types

#### Response
```json
{
  "providers": [
    {
      "id": "provider-123",
      "name": "Dr. John Smith",
      "specialty": "Cardiology",
      "rating": 4.8,
      "reviewCount": 156,
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001"
      },
      "distance": "2.3 miles",
      "priceRange": {
        "min": 150,
        "max": 300
      },
      "acceptedInsurance": ["Aetna", "Blue Cross", "Cigna"],
      "phone": "(555) 123-4567",
      "website": "https://drjohnsmith.com",
      "images": ["image1.jpg", "image2.jpg"],
      "availability": "Next available: Tomorrow",
      "badges": ["Board Certified", "Same Day Appointments"],
      "type": "physician",
      "neighborhood": "Manhattan",
      "acceptsInsurance": true,
      "price": 200,
      "originalPrice": 350,
      "negotiatedRate": 180,
      "standardRate": 350,
      "savingsPercent": 49,
      "savings": 170,
      "availableTimeSlots": [
        {
          "date": "2024-01-15",
          "time": "09:00",
          "available": true
        }
      ]
    }
  ],
  "totalCount": 42,
  "filters": {
    "priceRange": [50, 2000],
    "locations": ["New York, NY", "Brooklyn, NY"],
    "insuranceProviders": ["Aetna", "Blue Cross", "Cigna"],
    "specialties": ["Cardiology", "Dermatology", "Primary Care"]
  }
}
```

### Get Provider Details
**GET** `/api/providers/:id`

Get detailed information about a specific provider.

#### Response
```json
{
  "id": "provider-123",
  "name": "Dr. John Smith",
  "specialty": "Cardiology",
  "rating": 4.8,
  "reviewCount": 156,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "distance": "2.3 miles",
  "priceRange": {
    "min": 150,
    "max": 300
  },
  "acceptedInsurance": ["Aetna", "Blue Cross", "Cigna"],
  "phone": "(555) 123-4567",
  "website": "https://drjohnsmith.com",
  "images": ["image1.jpg", "image2.jpg"],
  "reviews": [
    {
      "id": "review-1",
      "author": "Jane Doe",
      "rating": 5,
      "comment": "Excellent doctor, very thorough.",
      "date": "2024-01-10"
    }
  ],
  "availability": "Next available: Tomorrow",
  "badges": ["Board Certified", "Same Day Appointments"],
  "type": "physician",
  "neighborhood": "Manhattan",
  "acceptsInsurance": true,
  "price": 200,
  "originalPrice": 350,
  "negotiatedRate": 180,
  "standardRate": 350,
  "savingsPercent": 49,
  "savings": 170,
  "availableTimeSlots": [
    {
      "date": "2024-01-15",
      "time": "09:00",
      "available": true
    }
  ]
}
```

### Create Booking
**POST** `/api/bookings`

Create a new appointment booking.

#### Request Body
```json
{
  "providerId": "provider-123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "(555) 123-4567",
  "dateOfBirth": "1990-01-01",
  "preferredDate": "2024-01-15",
  "preferredTime": "09:00",
  "insuranceProvider": "Aetna",
  "memberId": "AET123456789",
  "reasonForVisit": "Annual checkup",
  "notes": "Patient prefers morning appointments"
}
```

#### Response
```json
{
  "bookingId": "booking-456",
  "confirmationNumber": "MH-2024-001234",
  "status": "confirmed",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "09:00",
  "provider": {
    "id": "provider-123",
    "name": "Dr. John Smith",
    "phone": "(555) 123-4567",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  },
  "patient": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567"
  }
}
```

### Get Booking Details
**GET** `/api/bookings/:bookingId`

Get details of a specific booking.

#### Response
```json
{
  "bookingId": "booking-456",
  "confirmationNumber": "MH-2024-001234",
  "status": "confirmed",
  "appointmentDate": "2024-01-15",
  "appointmentTime": "09:00",
  "provider": {
    "id": "provider-123",
    "name": "Dr. John Smith",
    "phone": "(555) 123-4567",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001"
    }
  },
  "patient": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567"
  }
}
```

### Cancel Booking
**DELETE** `/api/bookings/:bookingId/cancel`

Cancel an existing booking.

#### Response
```json
{
  "success": true
}
```

### Get Available Time Slots
**GET** `/api/providers/:providerId/time-slots`

Get available time slots for a provider.

#### Query Parameters
- `date` (optional): string - Specific date in YYYY-MM-DD format

#### Response
```json
[
  {
    "date": "2024-01-15",
    "time": "09:00",
    "available": true
  },
  {
    "date": "2024-01-15",
    "time": "10:00",
    "available": false
  }
]
```

### Verify Insurance
**POST** `/api/insurance/verify`

Verify insurance coverage for a patient.

#### Request Body
```json
{
  "memberId": "AET123456789",
  "providerId": "provider-123"
}
```

#### Response
```json
{
  "verified": true,
  "coverage": {
    "copay": 25,
    "deductible": 500,
    "coinsurance": 20
  }
}
```

### Get Procedures
**GET** `/api/procedures`

Get list of available medical procedures.

#### Query Parameters
- `q` (optional): string - Search query for procedures

#### Response
```json
{
  "procedures": [
    {
      "id": "procedure-1",
      "name": "MRI Scan (Brain)",
      "category": "Imaging",
      "description": "Magnetic resonance imaging of the brain",
      "averagePrice": 850
    }
  ]
}
```

### Get Insurance Providers
**GET** `/api/insurance/providers`

Get list of accepted insurance providers.

#### Response
```json
{
  "providers": [
    {
      "id": "aetna",
      "name": "Aetna",
      "logo": "https://example.com/aetna-logo.png"
    }
  ]
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid request data
- `PROVIDER_NOT_FOUND`: Provider does not exist
- `BOOKING_NOT_FOUND`: Booking does not exist
- `TIME_SLOT_UNAVAILABLE`: Requested time slot is not available
- `INSURANCE_NOT_VERIFIED`: Insurance verification failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_SERVER_ERROR`: Server error

## Rate Limiting
- Search endpoints: 100 requests per minute per IP
- Booking endpoints: 10 requests per minute per IP
- Other endpoints: 60 requests per minute per IP

## Data Types

### Provider Types
- `physician`: Medical doctor
- `specialist`: Specialist physician
- `clinic`: Medical clinic
- `hospital`: Hospital facility
- `imaging_center`: Imaging/diagnostic center
- `lab`: Laboratory facility

### Booking Status
- `confirmed`: Booking is confirmed
- `pending`: Booking is pending confirmation
- `cancelled`: Booking has been cancelled

### Time Format
All times are in 24-hour format (HH:MM) in the provider's local timezone.

### Date Format
All dates are in ISO 8601 format (YYYY-MM-DD).
