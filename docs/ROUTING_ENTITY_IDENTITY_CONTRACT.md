# Routing + Entity Identity Contract

**Version:** 1.0  
**Date:** January 2, 2026  
**Status:** Canonical (all new routes must follow this)

---

## Purpose

Define canonical URLs, entity identity, and routing rules so navigation stays:
- **Consistent** (same entity = same URL)
- **SEO-friendly** (stable URLs, no duplicate content)
- **Scalable** (no combinatorial page explosion)

**When to Update This Document:**
- Before adding any new routes
- When deprecating existing routes
- When changing navigation behavior

---

## Canonical Entities

### Provider (Clinician)

**Canonical ID:** `provider_id` (internal UUID/primary key)

**Why not NPI?**
- NPIs can change (rare, but happens during re-credentialing)
- One NPI can have multiple practice locations/orgs
- NPIs are public but can increase re-identification risk / make URLs messy
- Internal IDs are safer, more stable, and URL-friendly

**NPI Usage:**
- Store as `provider.npi` for external lookups
- Display in provider detail page
- Use for CMS/insurance API calls
- **Never use in URLs**

**Canonical URL:** `/providers/[provider_id]`

**Provider Page Must Support:**
- Multiple specialties (via taxonomy → Mario specialty mapping)
- Multiple practice locations/facilities (via `provider_location.org_id`)
- Optional filters as **query params** (not separate pages):
  - `?org_id=...` (focus on one facility)
  - `?specialty=...` (focus on one specialty)
  - `?zip_code=...&radius_miles=...` (context/sorting)

**Examples:**
```
/providers/prov_abc123                          (all locations, all specialties)
/providers/prov_abc123?org_id=org_xyz           (one specific facility)
/providers/prov_abc123?specialty=cardiology     (filtered to cardiology practice)
```

**Explicitly Forbidden:**
```
❌ /providers/prov_abc123/orgs/org_xyz           (creates duplicate pages)
❌ /providers/prov_abc123/specialties/cardiology (combinatorial explosion)
❌ /providers/1234567890                         (using NPI as ID)
```

---

### Organization (Facility)

**Canonical ID:** `org_id`  
**Canonical URL:** `/orgs/[org_id]`

**Org Page Must Support:**
- List of providers practicing at this facility
- Pricing for procedures offered here (org-level pricing)
- Optional filters:
  - `?specialty=...` (providers with this specialty at this org)
  - `?procedure=...` (pricing for specific procedure)

**Examples:**
```
/orgs/org_xyz                        (facility overview)
/orgs/org_xyz?specialty=cardiology   (cardiologists at this facility)
/orgs/org_xyz?procedure=proc_mri     (MRI pricing at this facility)
```

---

### Procedure

**Canonical ID:** `procedure_id` and `procedure_slug`  
**Canonical URL:** `/procedures/[procedure_slug]`

**Procedure Page Must Support:**
- Procedure description and metadata
- Pricing comparison across orgs (near user's location)
- Optional filters:
  - `?zip_code=...` (location context)
  - `?radius_miles=...` (search radius)
  - `?carrier=...` (insurance filter)

**Examples:**
```
/procedures/mri-brain                          (procedure detail + pricing)
/procedures/mri-brain?zip_code=90210           (pricing near Beverly Hills)
/procedures/mri-brain?carrier=cigna            (Cigna pricing only)
```

---

### Specialty

**Canonical ID:** `specialty_id` and `specialty_slug`  
**Canonical URL:** `/specialties/[specialty_slug]`

**Specialty Page Meaning:** "Browse providers for this specialty near the user"

**Join Path (for developers):**
1. `specialty.slug` → `specialty.id`
2. `specialty.id` → `specialty_map.specialty_id`
3. `specialty_map.taxonomy_id` → provider taxonomy field(s) (currently stored as `provider.specialty_id` if single-valued)
4. `provider.provider_id` → `provider_location.provider_id`
5. Filter by: `zip_code`, `radius_miles`
6. Sort by: distance (default)

**Required Data:**
- `specialty` table (66 consumer-friendly specialties)
- `specialty_map` (Mario specialty ↔ NUCC taxonomy)
- `provider.specialty_id` (NUCC taxonomy code, not Mario specialty)
- `provider_location` (for distance calculation)

**Examples:**
```
/specialties/cardiologist                      (cardiologists near user)
/specialties/cardiologist?zip_code=90210       (cardiologists near Beverly Hills)
/specialties/dermatologist?radius_miles=10     (dermatologists within 10 miles)
```

---

## Global Search Bar Contract

### UI Consistency
The **same** search bar/autocomplete component is used across all pages.

### Navigation Rules (Non-Negotiable)

**1. Navigation is Suggestion-Driven Only**
- User must select from autocomplete suggestions
- Each suggestion routes to its canonical URL:
  - Specialty → `/specialties/[slug]?zip_code={user_zip}`
  - Procedure → `/procedures/[slug]?zip_code={user_zip}`
  - Provider → `/providers/[id]`
  - Org → `/orgs/[id]`

**2. Pressing Enter Without Selection**
- **Must NOT navigate**
- Shows inline message:
  > "Please select a suggestion from the list"
- Optional: Highlight closest match in dropdown

**3. Search Query Persistence**
- Query string stays in input field
- Dropdown remains open
- Keyboard navigation works (Arrow Up/Down, Enter to select)

**Why This Matters:**
- Prevents generic `/search?q=...` pages (SEO nightmare)
- Forces users into structured navigation
- Eliminates duplicate content penalties
- Creates cleaner analytics

---

## Location Context Rules

**Hierarchy (in order of precedence):**
1. **Query param:** `?zip_code=12345` (explicit user input)
2. **localStorage:** `localStorage.getItem('userZipCode')` (auto-detected or previously entered)
3. **Prompt user:** Show ZIP input modal/prompt

**Pages That Require Location:**
- `/specialties/[slug]` (always)
- `/procedures/[slug]` (always)
- Browse pages: `/browse/procedures`, `/browse/specialties` (implicit filter)

**Implementation Pattern:**
```typescript
const getZipCode = () => {
  const fromUrl = searchParams.get('zip_code');
  if (fromUrl) return fromUrl;
  
  const fromStorage = localStorage.getItem('userZipCode');
  if (fromStorage) return fromStorage;
  
  // Trigger ZIP prompt modal
  return null;
};
```

---

## Browse Pages (Index Pages)

We intentionally support browse indexes (for SEO + user discovery):

**Allowed Browse Routes:**
- `/browse/procedures` (procedure directory by category)
- `/browse/procedures/[category_slug]` (procedures in category)
- `/browse/specialties` (specialty directory)
- `/browse/insurance-plans` (future)

**Browse pages also use implicit ZIP filter** (same hierarchy as above).

**Example:**
```
/browse/procedures?zip_code=90210              (all procedures, sorted by popularity)
/browse/procedures/imaging?zip_code=90210      (imaging procedures only)
/browse/specialties?zip_code=90210             (all specialties, show provider counts)
```

---

## Deprecated Routes (Already Implemented)

| Route | Status | Action | Redirect Target | Implemented |
|-------|--------|--------|-----------------|-------------|
| `/doctors` | Deprecated | 301 redirect | `/browse/specialties?zip_code={user_zip}` | ✅ Jan 1, 2026 |
| `/doctors?specialty={name}` | Legacy support | 301 redirect | `/specialties/{slug}?zip_code={zip}` | ✅ Jan 1, 2026 |
| `/search` | Never implement | - | Use autocomplete only | N/A |
| `/find-doctors` | Legacy mockup | Removed | `/browse/specialties` | ✅ Jan 1, 2026 |

**Status:** ✅ **Completed as of January 1, 2026**
- All redirects are live
- Internal links updated
- Old pages removed from codebase

**Ongoing Monitoring:**
- Track 301 redirect usage in Google Analytics
- Set up alert if deprecated routes get >5% of traffic (indicates external links still pointing to old URLs)
- Monthly check: Are old routes still being linked externally? (use Google Search Console)

---

## Future Routes (Pre-Approved)

These routes are **allowed** when needed, but not required for MVP:

### Provider Detail Enhancements
```
/providers/[id]/reviews           (provider reviews page)
/providers/[id]/availability      (appointment booking calendar)
/providers/[id]/insurance         (accepted insurance detail)
```

**Rule:** These are **tabs/sections** on provider detail, not separate canonical pages.  
**Navigation:** Use anchor links or query params, not separate routes.

### Browse Enhancements
```
/browse/procedures/[category_slug]   (procedure category pages)
/browse/insurance-plans              (insurance plan directory)
/browse/orgs                         (facility directory)
```

### Search Result Pages (Only If Search Bar Changes)
If we ever add a "Show All Results" button to autocomplete:
```
/search-results?q={query}&type=providers
/search-results?q={query}&type=procedures
```

**Rule:** These are **ephemeral** (noindex, don't rank in SEO).  
**Use Case:** User wants to see "everything matching X" instead of picking suggestion.

### Explicitly Forbidden Routes

These routes **will never be allowed** (violate contract):

```
❌ /providers/[id]/specialties/[slug]         (use ?specialty= instead)
❌ /providers/[id]/orgs/[org_id]              (use ?org_id= instead)
❌ /specialties/[slug]/procedures/[proc_slug] (combinatorial explosion)
❌ /procedures/[slug]/specialties/[spec_slug] (inverse, equally bad)
❌ /orgs/[org_id]/providers/[provider_id]     (duplicate of /providers/[id])
❌ Any route with more than 2 path segments   (unless pre-approved above)
```

**Why?** These create duplicate pages, hurt SEO, and make navigation unpredictable.

---

## Error Handling & 404 Behavior

### Entity Not Found (404)

| Route | Error Condition | Response |
|-------|----------------|----------|
| `/providers/[invalid_id]` | `provider_id` not in DB | 404 page + "Provider not found" message |
| `/specialties/[invalid_slug]` | `specialty.slug` not found | 404 page + list of valid specialties |
| `/procedures/[invalid_slug]` | `procedure.slug` not found | 404 page + search suggestions |
| `/orgs/[invalid_id]` | `org_id` not in DB | 404 page + "Facility not found" message |

### Empty Results (200 OK, but empty list)

| Route | Empty Condition | Response |
|-------|----------------|----------|
| `/specialties/{slug}?zip_code=00000` | Invalid ZIP | Show: "Invalid ZIP code. Please enter a 5-digit US ZIP." |
| `/specialties/{slug}?zip_code=99501&radius_miles=5` | No providers in radius | Show: "No providers found within 5 miles. Try expanding your search radius." |
| `/procedures/{slug}?zip_code=12345` | No orgs nearby | Show: "No facilities found within 25 miles. Showing national pricing instead." |

### Malformed Query Params

| Route | Malformed Input | Behavior |
|-------|----------------|----------|
| `/specialties/{slug}?radius_miles=abc` | Non-numeric radius | Ignore param, use default (25 miles) |
| `/specialties/{slug}?zip_code=1234` | 4-digit ZIP | Show error: "Please enter 5-digit ZIP code" |
| `/providers/[id]?org_id=invalid` | `org_id` not linked to provider | Ignore filter, show all orgs |
| `/procedures/{slug}?carrier=invalid` | Unknown carrier | Ignore filter, show all carriers |

---

## Data Identity Rules (For Developers)

### Join Keys
- **Org-level pricing:** `procedure_org_pricing.org_id` (NOT provider-level)
- **Provider → Org:** `provider_location.org_id` (one provider, many locations)
- **Specialty → Provider:** Via `specialty_map` (Mario specialty ↔ NUCC taxonomy)

### Important Gotchas
1. **Pricing is at org-level**, not provider-level
   - Multiple providers at same org share pricing
   - Don't show "This doctor charges $X" — show "At this facility: $X"

2. **Provider specialty is NUCC taxonomy**, not Mario specialty
   - `provider.specialty_id` = NUCC code (e.g., "207RC0000X")
   - Must join via `specialty_map` to get Mario specialty (e.g., "Cardiologist")

3. **One provider can have multiple orgs**
   - `provider_location` is many-to-many
   - Provider page must list all practice locations

4. **Orgs can have multiple providers**
   - Org page shows all providers practicing there
   - Filter by specialty using `?specialty=` param

---

## Decision Log

**Why these routes?**
- Follow REST principles (resources as nouns)
- Match user mental model (specialty = provider category)
- Avoid duplicate content (filters as query params, not paths)
- Enable future features (tabs, filters) without new routes

**Why deprecate `/doctors`?**
- Unclear semantics ("doctors" vs. "providers" vs. "specialists")
- Encourages generic search behavior (bad for SEO)
- Doesn't match backend entity model

**Why no `/search` page?**
- Generic search pages create SEO nightmares
- Forces structured navigation through autocomplete
- Eliminates thin content penalties

**Why require ZIP code?**
- Healthcare is local (distance matters)
- Pricing varies by location (geo-based negotiated rates)
- Better UX (show "2.3 mi away" vs. generic list)

---

## Enforcement

**Before merging any PR that adds a route:**
1. Check this contract
2. If route is allowed → proceed
3. If route is forbidden → reject
4. If route is unclear → discuss with team, update contract

**Tools:**
- Add linter rule to catch `/providers/[id]/[something]` patterns
- CI check: Flag routes with >2 path segments
- Quarterly audit: Review all routes in `app/` directory

---

## Changelog

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-02 | Initial version | Prevent route explosion during specialty search build |
| TBD | Add insurance plan routes | When insurance feature launches |
| TBD | Add booking routes | When appointment booking launches |

