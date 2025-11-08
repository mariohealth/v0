export interface MedicationData {
  id?: string;
  name: string;
  genericFor: string;
  category?: string;
  brandVsGeneric: string[];
  form: string[];
  dosage: string[];
  quantity: string[];
  location: string;
  image: string;
  marioPick: {
    provider: string;
    price: string;
    explanation: string;
    expandableAlternatives: Array<{
      provider: string;
      price: string;
      link: string;
    }>;
  };
  paymentOptions: {
    withoutInsurance: string;
    withInsurance: string;
    insuranceNote: string;
  };
  pharmacies: Array<{
    name: string;
    price: string;
    insurance: string;
    logo: string;
  }>;
}

export const medicationDatabase: { drugs: MedicationData[] } = {
  "drugs": [
    {
      "id": "metformin-500",
      "name": "Metformin 500 mg",
      "genericFor": "Glucophage",
      "category": "Type 2 Diabetes",
      "brandVsGeneric": ["Generic", "Brand"],
      "form": ["Tablet", "Capsule"],
      "dosage": ["500 mg", "1000 mg"],
      "quantity": ["30 tablets", "60 tablets", "90 tablets"],
      "location": "San Francisco, CA (94107)",
      "image": "pill_placeholder.png",
      "marioPick": {
        "provider": "Cost Plus Drugs",
        "price": "$9.90",
        "explanation": "We recommend paying out of pocket. Mario chose Cost Plus Drugs because we don't have your insurance information.",
        "expandableAlternatives": [
          { "provider": "GoodRx", "price": "$10.50", "link": "https://www.goodrx.com" },
          { "provider": "SingleCare", "price": "$11.20", "link": "https://www.singlecare.com" },
          { "provider": "BlinkHealth", "price": "$12.00", "link": "https://www.blinkhealth.com" }
        ]
      },
      "paymentOptions": {
        "withoutInsurance": "$9.90",
        "withInsurance": "$0",
        "insuranceNote": "Mario cannot yet provide an accurate estimate of your costs when using insurance."
      },
      "pharmacies": [
        { "name": "Walgreens", "price": "$9.90", "insurance": "without insurance", "logo": "walgreens.png" },
        { "name": "CVS Pharmacy", "price": "$10.20", "insurance": "without insurance", "logo": "cvs.png" },
        { "name": "Safeway", "price": "$10.50", "insurance": "without insurance", "logo": "safeway.png" },
        { "name": "Costco", "price": "$11.00", "insurance": "without insurance", "logo": "costco.png" },
        { "name": "Walmart", "price": "$9.90", "insurance": "without insurance", "logo": "walmart.png" },
        { "name": "Target", "price": "$10.10", "insurance": "without insurance", "logo": "target.png" },
        { "name": "Raley's", "price": "$10.80", "insurance": "without insurance", "logo": "raleys.png" }
      ]
    },
    {
      "id": "atorvastatin-20",
      "name": "Atorvastatin 20 mg",
      "genericFor": "Lipitor",
      "category": "High Cholesterol",
      "brandVsGeneric": ["Generic", "Brand"],
      "form": ["Tablet"],
      "dosage": ["10 mg", "20 mg", "40 mg", "80 mg"],
      "quantity": ["30 tablets", "60 tablets", "90 tablets"],
      "location": "Los Angeles, CA (90017)",
      "image": "pill_placeholder.png",
      "marioPick": {
        "provider": "Cost Plus Drugs",
        "price": "$8.00",
        "explanation": "Mario recommends Cost Plus Drugs for best overall value and availability in your area.",
        "expandableAlternatives": [
          { "provider": "GoodRx", "price": "$8.90", "link": "https://www.goodrx.com" },
          { "provider": "SingleCare", "price": "$9.40", "link": "https://www.singlecare.com" }
        ]
      },
      "paymentOptions": {
        "withoutInsurance": "$8.00",
        "withInsurance": "$0",
        "insuranceNote": "Mario cannot yet provide an accurate estimate of your costs when using insurance."
      },
      "pharmacies": [
        { "name": "Walgreens", "price": "$8.00", "insurance": "without insurance", "logo": "walgreens.png" },
        { "name": "CVS Pharmacy", "price": "$8.20", "insurance": "without insurance", "logo": "cvs.png" },
        { "name": "Costco", "price": "$8.50", "insurance": "without insurance", "logo": "costco.png" },
        { "name": "Target", "price": "$8.90", "insurance": "without insurance", "logo": "target.png" }
      ]
    },
    {
      "id": "ozempic-2",
      "name": "Ozempic 2 mg pen",
      "genericFor": "Semaglutide Injection",
      "brandVsGeneric": ["Brand only"],
      "form": ["Prefilled Pen"],
      "dosage": ["2 mg", "1 mg"],
      "quantity": ["1 pen", "2 pens"],
      "location": "San Jose, CA",
      "image": "ozempic_pen.png",
      "marioPick": {
        "provider": "Cost Plus Drugs",
        "price": "$499.00",
        "explanation": "Mario found Cost Plus Drugs to offer the most transparent pricing for Ozempic in your area.",
        "expandableAlternatives": [
          { "provider": "GoodRx", "price": "$505.00", "link": "https://www.goodrx.com" },
          { "provider": "Walmart", "price": "$510.00", "link": "https://www.walmart.com" }
        ]
      },
      "paymentOptions": {
        "withoutInsurance": "$499.00",
        "withInsurance": "$0",
        "insuranceNote": "Insurance estimates vary widely for Ozempic. Please verify with your plan."
      },
      "pharmacies": [
        { "name": "Walgreens", "price": "$499.00", "insurance": "without insurance", "logo": "walgreens.png" },
        { "name": "CVS Pharmacy", "price": "$499.00", "insurance": "without insurance", "logo": "cvs.png" },
        { "name": "Safeway", "price": "$499.00", "insurance": "without insurance", "logo": "safeway.png" },
        { "name": "Costco", "price": "$499.00", "insurance": "without insurance", "logo": "costco.png" },
        { "name": "Walmart", "price": "$499.00", "insurance": "without insurance", "logo": "walmart.png" },
        { "name": "Target", "price": "$499.00", "insurance": "without insurance", "logo": "target.png" },
        { "name": "Raley's", "price": "$499.00", "insurance": "without insurance", "logo": "raleys.png" }
      ]
    }
  ]
};

export function getMedicationByName(name: string): MedicationData | undefined {
  const lowerName = name.toLowerCase();
  return medicationDatabase.drugs.find(drug => {
    const lowerDrugName = drug.name.toLowerCase();
    const lowerGenericFor = drug.genericFor.toLowerCase();
    
    // Check if the drug name or brand name appears in the query, or vice versa
    return lowerDrugName.includes(lowerName) || 
           lowerName.includes(lowerDrugName) ||
           lowerGenericFor.includes(lowerName) ||
           lowerName.includes(lowerGenericFor);
  });
}

export function searchMedications(query: string): MedicationData[] {
  const lowercaseQuery = query.toLowerCase();
  return medicationDatabase.drugs.filter(drug =>
    drug.name.toLowerCase().includes(lowercaseQuery) ||
    drug.genericFor.toLowerCase().includes(lowercaseQuery)
  );
}