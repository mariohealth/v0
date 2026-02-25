# Bundle Estimate System Change Log
Date: 2026-01-20

This document tracks linked changes across Backend and Frontend for the Bundle Estimate feature.

---

## 🚀 PR 1: Backend Bundle Estimate Logic & Contract

### Intent
Implement the core logic for calculating bundle estimates and establish the explicit `facility_org_id` contract to align with frontend data models.

### Files Modified
- `backend/mario-health-api/app/services/bundle_service.py`
- `backend/mario-health-api/app/api/v1/endpoints/bundles.py`
- `backend/mario-health-api/tests/test_bundles.py`

### Logic Changes
1.  **Estimate Calculation**: Implemented `calculate_bundle_estimate` to aggregate costs from `code_pricing_facility_agg`.
    -   Calculates `min`, `expected` (avg), and `max` for Professional, Institutional, and Total components.
    -   Handles logic for various bundle group selection types (e.g., `ALL`, `ONE`, `ZERO_OR_MORE`).
2.  **Contract Rename**: Renamed `hospital_id` parameter to `facility_org_id`.
    -   **Why**: The frontend operates on `org_id` (from `procedure_org_pricing`). The backend `hospitals` table uses a UUID that corresponds to this `org_id` in the current data pipeline. This rename makes that assumption explicit to prevent future confusion.
3.  **Future-Proofing**: Added TODOs for splitting "Facility" vs "Professional" line items when the backend pricing model supports distinct buckets (currently aggregated at the group level).

### Concise Diff (Annotated)

#### `app/services/bundle_service.py`
```python
     def calculate_bundle_estimate(
-        self, slug: str, hospital_id: str, carrier_plan_id: str
+        self, slug: str, facility_org_id: str, carrier_plan_id: str
     ) -> Optional[BundleEstimateResponse]:
         # ...
         # 2. Check Hospital/Org Existence (Defensive)
-        # h_res = self.supabase.table("hospitals").select("name, city, state").eq("id", hospital_id).single().execute()
+        # facility_org_id currently corresponds to org_id from procedure_org_pricing.
+        h_res = self.supabase.table("hospitals").select("name, city, state").eq("id", facility_org_id).single().execute()
         
         # ...
         
         # 3. Fetch Pricing
             pricing_result = self.supabase.table("code_pricing_facility_agg") \
-                .eq("hospital_id", hospital_id) \
+                .eq("hospital_id", facility_org_id) \
                 # ...
```

#### `app/api/v1/endpoints/bundles.py`
```python
 @router.get("/{slug}/estimate", response_model=BundleEstimateResponse)
 def get_bundle_estimate(
     slug: str,
-    hospital_id: str = Query(..., description="Hospital identifier"),
+    facility_org_id: str = Query(..., description="Organization identifier (currently maps to org_id)"),
     carrier_plan_id: str = Query(..., description="Insurance plan identifier"),
     supabase: Client = Depends(get_supabase)
 ):
-    estimate = service.calculate_bundle_estimate(slug, hospital_id, carrier_plan_id)
+    estimate = service.calculate_bundle_estimate(slug, facility_org_id, carrier_plan_id)
```

---

## 🎨 PR 2: Frontend Bundle Estimate Card

### Intent
Display the "Primary Service Cost" card on the Organization Detail page (`OrgDetailClient.tsx`).

### Files Modified
- `frontend/src/app/(authed)/orgs/[id]/OrgDetailClient.tsx`
- `frontend/src/lib/api.ts`

### Logic Changes
1.  **Wiring**: Fetches estimate only if:
    -   A valid `procedure_slug` exists in `PROCEDURE_TO_BUNDLE_MAP` (e.g., knee-replacement).
    -   The user has a preferred insurance carrier (fetched via `getEffectiveCarrier`).
2.  **Empty State**: If no carrier is selected, displays a "See Your Price" card prompting the user to select insurance.
3.  **UI Simplify**: Replaces complex split-accordions with a single "What's included in this estimate" accordion to accurately reflect current data granularity.
4.  **Explicit ID Usage**: passes `orgData.org_id` to the renamed `facilityOrgId` parameter.

### Concise Diff (Annotated)

#### `frontend/src/lib/api.ts`
```typescript
 export async function getBundleEstimate(
     bundleSlug: string,
-    hospitalId: string,
+    facilityOrgId: string,
     carrierPlanId: string
 ): Promise<BundleEstimateResponse> {
     const query = new URLSearchParams({
-        hospital_id: hospitalId,
+        facility_org_id: facilityOrgId,
         carrier_plan_id: carrierPlanId,
     });
```

#### `frontend/src/app/(authed)/orgs/[id]/OrgDetailClient.tsx`
```tsx
+    // Determine effective carrier (plan) ID
+    const carrierPlanId = getEffectiveCarrier({
+       preferredCarrierIds: preferences?.preferred_insurance_carriers || [],
+    });

+    // Fetch Logic
+    const res = await getBundleEstimate(bundleSlug, orgData!.org_id, carrierPlanId!);

+    // Render Logic
+    {shouldShowEstimateCard && (
+        !hasCarrier ? (
+            // "See Your Price" Empty State
+        ) : estimate ? (
+            // Estimate Card with Unified Accordion
+            <details className="group">
+                <summary>What's included in this estimate</summary>
+                {/* ... mapped items ... */}
+            </details>
+        ) : null
+    )}
```

---

## 🔗 Key System Contracts & Assumptions

### 1. ID Mapping (`hospital_id` vs `org_id`)
-   **Assumption**: The `id` column in the backend `hospitals` table corresponds exactly to the `org_id` returned by the `procedure_org_pricing` view (and the Frontend `Org` type).
-   **Implementation**: This is why the parameter was renamed to `facility_org_id`. The frontend **must** pass `orgData.org_id`.

### 2. Insurance Plan Mapping
-   **Current State**: The frontend allows users to select a Carrier (e.g., "Aetna"). It does NOT yet allow selecting a specific Plan (e.g., "Aetna Gold HMO").
-   **Assumption**: For the MVP, we assume `carrier_id` (e.g., `aetna-1`) can map to a default `carrier_plan_id` or that the backend query logic handles this (currently expects exact ID match, so we rely on `getEffectiveCarrier` returning a valid ID that exists in the `insurance_plans` table or similar context).

### 3. Pricing Granularity
-   **Current State**: The backend aggregates pricing at the **group** level (e.g., "Surgery", "Anesthesia"). It sums `min`/`expected`/`max`.
-   **Limitation**: It does not yet distinctly flag which dollars are "Facility" vs "Professional" within a single group row in the response breakdown.
-   **UI Implication**: The frontend uses a single "What's included" accordion rather than misleading separate "Facility" vs "Professional" sections.

---

## 🛠 Future Work (TODOs)
-   **Backend**: Split `breakdown_by_group` into distinct `professional_component` and `institutional_component` when the data pipeline supports it.
-   **Frontend**: Allow selecting specific Insurance Plans (not just Carriers) to improve estimate accuracy.
-   **Frontend**: Create a full `BundleDetail` page for deep diving into the "What's included" line items.
