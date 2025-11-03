export interface Procedure {
  id: string;
  name: string;
  category: string;
  avgPrice: number;
  marioPrice: number;
  savings: number;
  description: string;
}

export interface ProcedureCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  procedures: Procedure[];
}

// Export all procedures as a flat array
export function getAllProcedures(): Procedure[] {
  return procedureCategories.flatMap(cat => cat.procedures);
}

export const procedures = getAllProcedures();

export const procedureCategories: ProcedureCategory[] = [
  {
    id: "imaging",
    name: "Imaging",
    icon: "scan",
    description: "X-rays, MRIs, CT scans & more",
    procedures: [
      {
        id: "mri_brain",
        name: "MRI - Brain",
        category: "imaging",
        avgPrice: 1400,
        marioPrice: 850,
        savings: 39,
        description: "Detailed brain imaging scan"
      },
      {
        id: "mri_knee",
        name: "MRI - Knee",
        category: "imaging",
        avgPrice: 1200,
        marioPrice: 695,
        savings: 42,
        description: "Knee joint imaging"
      },
      {
        id: "ct_scan_chest",
        name: "CT Scan - Chest",
        category: "imaging",
        avgPrice: 950,
        marioPrice: 575,
        savings: 39,
        description: "Chest cavity imaging"
      },
      {
        id: "xray_chest",
        name: "X-Ray - Chest",
        category: "imaging",
        avgPrice: 180,
        marioPrice: 85,
        savings: 53,
        description: "Standard chest X-ray"
      },
      {
        id: "ultrasound_abdominal",
        name: "Ultrasound - Abdominal",
        category: "imaging",
        avgPrice: 420,
        marioPrice: 245,
        savings: 42,
        description: "Abdominal organ imaging"
      }
    ]
  },
  {
    id: "lab_tests",
    name: "Lab Tests",
    icon: "flask",
    description: "Blood work, panels & diagnostics",
    procedures: [
      {
        id: "complete_blood_count",
        name: "Complete Blood Count (CBC)",
        category: "lab_tests",
        avgPrice: 180,
        marioPrice: 75,
        savings: 58,
        description: "Comprehensive blood cell analysis"
      },
      {
        id: "thyroid_panel",
        name: "Thyroid Panel (TSH, T3, T4)",
        category: "lab_tests",
        avgPrice: 220,
        marioPrice: 95,
        savings: 57,
        description: "Complete thyroid function test"
      },
      {
        id: "hba1c",
        name: "HbA1C (Diabetes)",
        category: "lab_tests",
        avgPrice: 120,
        marioPrice: 45,
        savings: 63,
        description: "3-month blood sugar average"
      },
      {
        id: "lipid_panel",
        name: "Lipid Panel (Cholesterol)",
        category: "lab_tests",
        avgPrice: 150,
        marioPrice: 65,
        savings: 57,
        description: "Cholesterol and triglycerides"
      },
      {
        id: "comprehensive_metabolic",
        name: "Comprehensive Metabolic Panel",
        category: "lab_tests",
        avgPrice: 190,
        marioPrice: 80,
        savings: 58,
        description: "Kidney, liver, electrolyte function"
      }
    ]
  },
  {
    id: "preventive_care",
    name: "Preventive Care",
    icon: "shield",
    description: "Checkups, vaccines & screenings",
    procedures: [
      {
        id: "annual_physical",
        name: "Annual Physical Exam",
        category: "preventive_care",
        avgPrice: 220,
        marioPrice: 95,
        savings: 57,
        description: "Comprehensive yearly checkup"
      },
      {
        id: "flu_vaccine",
        name: "Flu Vaccination",
        category: "preventive_care",
        avgPrice: 45,
        marioPrice: 20,
        savings: 56,
        description: "Annual influenza vaccine"
      },
      {
        id: "wellness_visit",
        name: "Wellness Visit",
        category: "preventive_care",
        avgPrice: 180,
        marioPrice: 85,
        savings: 53,
        description: "Preventive health screening"
      },
      {
        id: "colonoscopy_screening",
        name: "Colonoscopy Screening",
        category: "preventive_care",
        avgPrice: 1200,
        marioPrice: 695,
        savings: 42,
        description: "Colon cancer screening"
      },
      {
        id: "skin_cancer_screening",
        name: "Skin Cancer Screening",
        category: "preventive_care",
        avgPrice: 160,
        marioPrice: 75,
        savings: 53,
        description: "Full body skin examination"
      }
    ]
  },
  {
    id: "specialist_consultations",
    name: "Specialist Consultations",
    icon: "user-doctor",
    description: "Expert doctor visits",
    procedures: [
      {
        id: "orthopedic_consultation",
        name: "Orthopedic Consultation",
        category: "specialist_consultations",
        avgPrice: 425,
        marioPrice: 280,
        savings: 34,
        description: "Bone and joint specialist"
      },
      {
        id: "cardiology_consultation",
        name: "Cardiology Consultation",
        category: "specialist_consultations",
        avgPrice: 380,
        marioPrice: 245,
        savings: 36,
        description: "Heart specialist visit"
      },
      {
        id: "dermatology_consultation",
        name: "Dermatology Consultation",
        category: "specialist_consultations",
        avgPrice: 295,
        marioPrice: 185,
        savings: 37,
        description: "Skin specialist visit"
      },
      {
        id: "neurology_consultation",
        name: "Neurology Consultation",
        category: "specialist_consultations",
        avgPrice: 420,
        marioPrice: 285,
        savings: 32,
        description: "Brain and nerve specialist"
      },
      {
        id: "endocrinology_consultation",
        name: "Endocrinology Consultation",
        category: "specialist_consultations",
        avgPrice: 390,
        marioPrice: 260,
        savings: 33,
        description: "Hormone specialist visit"
      }
    ]
  },
  {
    id: "womens_health",
    name: "Women's Health",
    icon: "heart-pulse",
    description: "OB/GYN & women's wellness",
    procedures: [
      {
        id: "obgyn_annual",
        name: "OB/GYN Annual Exam",
        category: "womens_health",
        avgPrice: 240,
        marioPrice: 115,
        savings: 52,
        description: "Comprehensive women's health exam"
      },
      {
        id: "mammogram",
        name: "Mammogram",
        category: "womens_health",
        avgPrice: 280,
        marioPrice: 125,
        savings: 55,
        description: "Breast cancer screening"
      },
      {
        id: "pap_smear",
        name: "Pap Smear",
        category: "womens_health",
        avgPrice: 180,
        marioPrice: 85,
        savings: 53,
        description: "Cervical cancer screening"
      },
      {
        id: "prenatal_visit",
        name: "Prenatal Visit",
        category: "womens_health",
        avgPrice: 220,
        marioPrice: 105,
        savings: 52,
        description: "Pregnancy checkup"
      },
      {
        id: "bone_density_scan",
        name: "Bone Density Scan",
        category: "womens_health",
        avgPrice: 320,
        marioPrice: 165,
        savings: 48,
        description: "Osteoporosis screening"
      }
    ]
  },
  {
    id: "surgery",
    name: "Surgery",
    icon: "activity",
    description: "Surgical procedures",
    procedures: [
      {
        id: "arthroscopy_knee",
        name: "Arthroscopy - Knee",
        category: "surgery",
        avgPrice: 8500,
        marioPrice: 5200,
        savings: 39,
        description: "Minimally invasive knee surgery"
      },
      {
        id: "laparoscopic_gallbladder",
        name: "Laparoscopic Gallbladder Removal",
        category: "surgery",
        avgPrice: 12000,
        marioPrice: 7500,
        savings: 38,
        description: "Minimally invasive gallbladder surgery"
      },
      {
        id: "cataract_surgery",
        name: "Cataract Surgery",
        category: "surgery",
        avgPrice: 3500,
        marioPrice: 2100,
        savings: 40,
        description: "Eye lens replacement"
      },
      {
        id: "hernia_repair",
        name: "Hernia Repair (Outpatient)",
        category: "surgery",
        avgPrice: 6800,
        marioPrice: 4200,
        savings: 38,
        description: "Outpatient hernia surgery"
      },
      {
        id: "carpal_tunnel",
        name: "Carpal Tunnel Release",
        category: "surgery",
        avgPrice: 4200,
        marioPrice: 2600,
        savings: 38,
        description: "Wrist nerve decompression"
      }
    ]
  }
];
