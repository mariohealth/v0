export interface MarioProvider {
  id: string;
  name: string;
  specialty: string;
  rating: string;
  reviews: string;
  network: string;
  marioPick: boolean;
  bio: string;
  education?: string[];
  appointmentCosts: Array<{
    label: string;
    price: string;
  }>;
  appointments: Array<{
    day: string;
    time: string;
    status: string;
  }>;
  insuranceAccepted: string[];
  rewards: {
    points: string;
    savings: string;
  };
}

export const marioProviderData: { providers: MarioProvider[] } = {
  "providers": [
    {
      "id": "dr_sarah_johnson",
      "name": "Dr. Sarah Johnson",
      "specialty": "Orthopedic Surgery",
      "rating": "4.9",
      "reviews": "127",
      "network": "In-Network",
      "marioPick": true,
      "bio": "Dr. Johnson is a board-certified orthopedic surgeon with 10+ years of experience specializing in joint repair, sports medicine, and comprehensive patient care. She emphasizes evidence-based treatment and clear recovery guidance for optimal outcomes.",
      "appointmentCosts": [
        { "label": "Initial Consultation", "price": "$250" },
        { "label": "Follow-up Visit", "price": "$180" },
        { "label": "Telehealth", "price": "$150" },
        { "label": "Physical Therapy Session", "price": "$200" }
      ],
      "appointments": [
        { "day": "Tomorrow", "time": "2:30 PM", "status": "Available" },
        { "day": "Wednesday", "time": "10:15 AM", "status": "Available" },
        { "day": "Thursday", "time": "9:00 AM", "status": "Available" }
      ],
      "insuranceAccepted": [
        "Blue Cross Blue Shield",
        "Aetna",
        "Cigna",
        "UnitedHealth"
      ],
      "rewards": {
        "points": "+150 Points",
        "savings": "$175 estimated savings"
      }
    },
    {
      "id": "dr_amelia_thorne",
      "name": "Dr. Amelia Thorne",
      "specialty": "Cardiology",
      "rating": "4.8",
      "reviews": "245",
      "network": "In-Network",
      "marioPick": false,
      "bio": "Dr. Thorne is a dedicated cardiologist with over 12 years of experience in heart health and preventative care. She integrates technology to provide personalized patient treatments.",
      "education": [
        "Stanford University School of Medicine – MD, Cardiology Fellowship",
        "Johns Hopkins Hospital – Residency, Internal Medicine"
      ],
      "appointmentCosts": [
        { "label": "New Patient Office Visit", "price": "$250" },
        { "label": "Telehealth Visit", "price": "$150" },
        { "label": "Consultation (low complexity)", "price": "$120" },
        { "label": "Consultation (medium complexity)", "price": "$180" },
        { "label": "Consultation (high complexity)", "price": "$220" }
      ],
      "appointments": [
        { "day": "Tomorrow", "time": "11:00 AM", "status": "Available" },
        { "day": "Thursday", "time": "3:30 PM", "status": "Available" },
        { "day": "Friday", "time": "9:00 AM", "status": "Available" }
      ],
      "insuranceAccepted": [
        "Aetna",
        "Cigna",
        "Blue Shield of California"
      ],
      "rewards": {
        "points": "+120 Points",
        "savings": "$150 estimated savings"
      }
    },
    {
      "id": "dr_michael_ortiz",
      "name": "Dr. Michael Ortiz",
      "specialty": "Dermatology",
      "rating": "4.7",
      "reviews": "98",
      "network": "In-Network",
      "marioPick": false,
      "bio": "Dr. Ortiz is a board-certified dermatologist specializing in skin health, acne management, and cosmetic dermatology. He focuses on safe, minimally invasive treatments.",
      "appointmentCosts": [
        { "label": "Initial Skin Consultation", "price": "$190" },
        { "label": "Follow-up Visit", "price": "$140" },
        { "label": "Telehealth Visit", "price": "$120" }
      ],
      "appointments": [
        { "day": "Today", "time": "4:00 PM", "status": "Available" },
        { "day": "Tomorrow", "time": "10:00 AM", "status": "Available" },
        { "day": "Friday", "time": "2:30 PM", "status": "Available" }
      ],
      "insuranceAccepted": [
        "Blue Cross Blue Shield",
        "UnitedHealth",
        "Aetna"
      ],
      "rewards": {
        "points": "+100 Points",
        "savings": "$125 estimated savings"
      }
    }
  ]
};

export function getProviderById(id: string): MarioProvider | undefined {
  return marioProviderData.providers.find(provider => provider.id === id);
}

export function getAllProviders(): MarioProvider[] {
  return marioProviderData.providers;
}