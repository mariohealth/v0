# Procedure Coverage Verification Report

**Generated:** 2025-11-11 18:25:25

## Summary

- Total procedure families: 31
- Key families analyzed: MRI, CT, X-ray, Ultrasound, Lab

## 1. Top 20 Procedures with Provider Counts

| Rank | Slug | Name | Family | Provider Count |
|------|------|------|--------|----------------|
| 1 | `automated-urine-test` | Automated urine test | Urine tests | 329 |
| 2 | `screening-mammography` | Screening mammography | Mammographies | 97 |
| 3 | `blood-collection` | Insertion of needle into vein for collection of blood sample | Blood tests | 68 |
| 4 | `microscope-urinalysis` | Urinalysis with microscope | Urine tests | 67 |
| 5 | `hemoglobin-a1c-blood-test` | Hemoglobin A1C blood test | Blood tests | 63 |
| 6 | `free-thyroxine-blood-test` | Free thyroxine blood test | Blood tests | 63 |
| 7 | `complete-blood-cell-count-blood-test` | Complete blood cell count | Blood tests | 62 |
| 8 | `group-chemicals-blood-test` | Group chemicals blood test | Blood tests | 62 |
| 9 | `routine-ecg` | Routine ECG | ECGs (Electrocardiogram) | 49 |
| 10 | `psychotherapy` | Psychotherapy | Mental health therapies | 23 |
| 11 | `subsequent-nursing-facility-care` | Subsequent nursing facility care | None | 15 |
| 12 | `lipids-blood-test` | Lipids blood test | Blood tests | 11 |
| 13 | `vitamin-d3-blood-test` | Vitamin D3 blood test | Blood tests | 11 |
| 14 | `tsh-blood-test` |  Thyroid stimulating hormone (tsh) blood test | Blood tests | 11 |
| 15 | `influenza-vaccine` | Influenza vaccine | Vaccines | 11 |
| 16 | `sarscov2-vaccine` | SARS-COV2 vaccine | Vaccines | 11 |
| 17 | `subsequent-hospital-care` | Subsequent hospital care | None | 11 |
| 18 | `initial-hospital-care` | Initial hospital care | None | 11 |
| 19 | `chronic-care-management` | Chronic care management | None | 9 |
| 20 | `heart-blood-flow-ultrasound` | Ultrasound of heart blood flow | Ultrasounds | 7 |

## 2. Coverage by Family

| Family | Total Procedures | With Pricing | Coverage % |
|--------|-----------------|--------------|-------------|

## 3. MRI Procedures Status

| Slug | Name | Family | Provider Count | Price Range |
|------|------|--------|----------------|-------------|
| `arm-joint-mri` | Arm joint MRI | MRI Scans (Magnetic Resonance Imaging) | 0 | N/A |
| `brain-mri` | MRI of brain | MRI Scans (Magnetic Resonance Imaging) | 0 | N/A |
| `leg-joint-mri` | MRI of leg joint | MRI Scans (Magnetic Resonance Imaging) | 0 | N/A |
| `lower-spinal-canal-mri` | MRI of lower spinal canal | MRI Scans (Magnetic Resonance Imaging) | 0 | N/A |
| `upper-spinal-canal-mri` | MRI of upper spinal canal | MRI Scans (Magnetic Resonance Imaging) | 0 | N/A |

## 4. Recommendations

### MRI Procedures Missing Pricing Data:

- `arm-joint-mri` (Arm joint MRI)
- `brain-mri` (MRI of brain)
- `leg-joint-mri` (MRI of leg joint)
- `lower-spinal-canal-mri` (MRI of lower spinal canal)
- `upper-spinal-canal-mri` (MRI of upper spinal canal)

**Action Items:**
1. Ask AC to seed pricing data for missing MRI procedures
2. Verify that `search_procedures_v2` RPC is correctly filtering results
3. Check if Type-2 logic is incorrectly filtering out valid pricing data
4. Confirm frontend normalization maps `mri_brain` → correct database slug

