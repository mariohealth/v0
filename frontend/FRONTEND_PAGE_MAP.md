# FRONTEND_PAGE_MAP.md  

**Version:** 1.1  

**Last Updated:** 2025-11-10  

**Authors:** AZ, AC  

---

## 1. Domain & Entry Points  

- `/` → **Landing Page** (pre-login) → `mario-landing-page.tsx` (Status: Exists)  

- After successful login → redirect to `/home`

---

## 2. Main Route Hierarchy (Member App)

### 2.1 Home / Search  

| File Name | Route Path      | Description                                            | Status  |

|-----------|------------------|--------------------------------------------------------|---------|

| `mario-home.tsx`             | `/home`                 | Post-login Home/Search page with universal search + quick actions | Exists  |

| `mario-ai-chat-enhanced.tsx`  | `/ai`                  | Modal overlay for MarioAI across contexts              | Exists  |

### 2.2 Browse / Category Listing Pages  

| File Name                        | Route Path         | Description                                           | Status     |

|----------------------------------|---------------------|--------------------------------------------------------|------------|

| `mario-browse-procedures.tsx`    | `/procedures`       | Browse list of procedure categories                   | Exists     |

| `mario-specialty-doctors.tsx`    | `/specialties`      | Browse list of doctor specialties                     | Exists     |

| `mario-medications-browse.tsx` (renamed from `mario-find-medication.tsx`) | `/medications`       | Browse list of medications                            | Exists     |

| `mario-mariocare-landing.tsx` (planned) | `/mariocare`         | Landing page for MarioCare on-demand & scheduled care | Planned    |

### 2.3 Search Results & Detail Pages  

#### Search Results  

| File Name                         | Route Path                      | Description                                           | Status |

|-----------------------------------|----------------------------------|--------------------------------------------------------|--------|

| `mario-search-results-enhanced.tsx` (consolidated) | `/search/results` (internal route, param-driven) | Results page for search queries (procedure, specialty) | Exists |

#### Provider / Facility Detail  

| File Name                          | Route Path              | Description                                               | Status |

|------------------------------------|--------------------------|------------------------------------------------------------|--------|

| `mario-provider-hospital-detail.tsx` | `/providers/[id]`         | Facility/hospital detail view                              | Exists |

| `mario-doctor-detail.tsx`            | `/providers/[id]`         | Individual doctor detail view                              | Exists |

| `mario-provider-procedure-detail.tsx` (alias of `mario-procedure-detail.tsx`) | `/providers/[id]?procedure=[slug]` | Detail view for a specific provider performing a procedure | Exists |

#### Medication Detail & Transfer  

| File Name                         | Route Path                              | Description                                               | Status      |

|-----------------------------------|-----------------------------------------|------------------------------------------------------------|-------------|

| `mario-medication-detail.tsx`      | `/medications/[slug]`                   | View for a specific medication with price comparison        | Exists      |

| `mario-med-transfer-step1.tsx`     | `/medications/[slug]/transfer/1`        | Prescription transfer: step 1                              | Planned      |

| `mario-med-transfer-step2.tsx`     | `/medications/[slug]/transfer/2`        | Step 2                                                     | Planned      |

| `mario-med-transfer-step3.tsx`     | `/medications/[slug]/transfer/3`        | Step 3                                                     | Planned      |

| `mario-med-transfer-step4.tsx`     | `/medications/[slug]/transfer/4`        | Step 4 (Review & Confirm)                                  | Planned      |

### 2.4 Health Hub  

| File Name                           | Route Path                      | Description                                               | Status |

|-------------------------------------|----------------------------------|------------------------------------------------------------|--------|

| `mario-health-hub-refined.tsx`       | `/health-hub`                   | Root dashboard for appointments, claims, requests          | Exists |

| `mario-concierge-requests.tsx`       | `/health-hub/requests`           | List of active concierge/booking requests                  | Exists |

| `mario-concierge-detail.tsx`         | `/health-hub/requests/[id]`      | Detail of a single request                                 | Exists |

| `mario-appointment-detail.tsx`        | `/health-hub/appointments/[id]`  | Detail of a confirmed appointment                          | Exists |

| `mario-claims-benefits.tsx`           | `/health-hub/claims`             | List and overview of claims & benefits                     | Exists |

| `mario-claims-detail.tsx`             | `/health-hub/claims/[id]`        | Detail page for a claim/dispute                            | Exists |

### 2.5 Rewards  

| File Name                           | Route Path               | Description                                             | Status |

|-------------------------------------|----------------------------|----------------------------------------------------------|--------|

| `mario-rewards-v2.tsx`               | `/rewards`                | Rewards page with balances, tier progress                | Exists |

| `mario-rewards-enhanced.tsx`         | `/rewards/tiers`          | Detailed tier view (enhanced version)                    | Exists |

| `mario-toast-notifications.tsx`      | (component)               | Toast and confetti for reward triggers                   | Exists |

### 2.6 Profile & Saved Items  

| File Name                          | Route Path                          | Description                                              | Status |

|------------------------------------|-------------------------------------|----------------------------------------------------------|--------|

| `mario-profile-v2.tsx`             | `/profile`                          | Profile overview page                                    | Exists |

| `mario-saved-providers.tsx`        | `/profile/saved/providers`          | Saved/favorite providers list                             | Exists |

| `mario-saved-medications.tsx`      | `/profile/saved/medications`        | Saved medications list                                    | Exists |

| `mario-saved-pharmacies.tsx`       | `/profile/saved/pharmacies`         | Saved pharmacies list                                     | Exists |

| `mario-profile-settings.tsx`       | `/profile/settings`                 | Notification, dark mode, account settings                 | Exists |

---

## 3. Navigation Structure  

### Mobile (bottom nav)  

[ Home/Search ] [ Health Hub ] [ Rewards ] [ Profile ]

### Desktop (top nav)  

Home | Search Bar (prominent) | Health Hub | Rewards | Profile

---

## 4. Search & Query Behavior  

- Search input on `/home` handles four primary intent types: Procedure, Specialty, Doctor by Name, Medication.  

- Autocomplete logic routes accordingly: 

  - Procedure → `/procedures` → specific detail

  - Specialty → `/specialties` → doctor list

  - Doctor → direct `/providers/[id]`

  - Medication → direct `/medications/[slug]`

---

## 5. State & Context Persistence  

- Global context: insurance plan, user info, location  

- Session context: last search filters, scroll position  

- Modal context: provider or claim context passed into MarioAI `/ai`  

- Health Hub context: active requests, appointments, claims  

---

## 6. Rewards & Behavioral Loop  

| Trigger Event                       | Points | Redirect                 |

|------------------------------------|--------|--------------------------|

| Book with Concierge                | +50    | Toast → `/rewards`       |

| Choose "Mario's Pick" provider     | +100   | Confetti + Toast → `/rewards` |

| Transfer Prescription              | +50    | Toast → `/rewards`       |

| Complete Profile (one-time)        | +50    | One-time award            |

---

## 7. Error / Edge States (v1)

See previous doc. (No changes.)

---

## 8. Developer Notes  

(Unchanged from previous version.)

---

## 9. Revision History  

| Version | Date       | Author | Changes                              |

|---------|------------|--------|---------------------------------------|

| 1.0     | 2025-11-10 | AZ     | Initial version                        |

| 1.1     | 2025-11-10 | AZ     | Added browse pages file names, statuses, normalized names |

---

### 🧾 File Name Changes

- `mario-find-medication.tsx` → `mario-medications-browse.tsx`

- `mario-search-enhanced.tsx` → `mario-search-results-enhanced.tsx`

- Added planned transfer steps (`mario-med-transfer-step1.tsx`–`step4`)

- Added planned `mario-mariocare-landing.tsx`

