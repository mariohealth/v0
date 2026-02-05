# Master Prompt: Healthcare Market → Statistical Area Mapping (V2 with ZIP-Level Granularity)

## Purpose

This is the **national master prompt** for creating Stage-1 mapping files that link **proprietary Healthcare Shopping Zones (markets)** to **US Census statistical areas (CBSAs/counties) with ZIP-level splits**.

**This prompt applies to ALL US regions.** Regional prompts inherit from this document and add local geography but **must not override** the principles defined here.

---

## What You Are Producing

You are creating a mapping file that answers: **"Which Census statistical areas (and specific ZIPs when needed) comprise each healthcare market's catchment area?"**

### Output File: `market_to_area_<region>.csv`

```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
```

This file enables **programmatic ZIP code expansion** for downstream applications:
- Network adequacy calculations
- Price benchmarking boundaries
- Regulatory compliance filings
- Provider rate negotiations

---

## Critical V2 Schema: The `zip_list` Column

**THE MANY-TO-ONE PROBLEM:**

V1 schema broke when multiple markets shared the same county:

```csv
❌ WA-SEATTLE-MAIN,County,53033,,King County WA,primary,Central Seattle urban core
❌ WA-SEATTLE-EASTSIDE,County,53033,,King County WA,primary,Eastside portion across Lake Washington
❌ WA-SEATTLE-SOUTHKING,County,53033,,King County WA,primary,South King County portion
```

**Problem:** Programmatic ZIP expansion cannot determine which market a King County ZIP belongs to. Rationale text "central urban core" vs "Eastside portion" is human prose, not structured data.

**V2 SOLUTION:**

Add `zip_list` column with explicit ZIP codes when multiple markets share a statistical area:

```csv
✅ WA-SEATTLE-MAIN,County,53033,"98101,98102,98103...",King County WA,primary,Central Seattle
✅ WA-SEATTLE-EASTSIDE,County,53033,"98004,98005,98006...",King County WA,primary,Eastside
✅ WA-SEATTLE-SOUTHKING,County,53033,"98001,98002,98003...",King County WA,primary,South King
```

### When to Use ZIP Lists

**RULE:** Use ZIP lists **ONLY** when 2+ markets share the same statistical area.

```
Does >1 market map to the same County/CBSA?
│
├─ NO → Leave zip_list BLANK (county/CBSA alone is sufficient)
│
└─ YES → MUST populate zip_list for EACH market sharing that area
```

**Examples:**

```csv
✅ OR-SALEM,CBSA,41420,,Salem OR,primary → zip_list BLANK (only 1 market uses CBSA 41420)
✅ WA-SPOKANE,County,53063,,Spokane County WA,primary → zip_list BLANK (only 1 market)
✅ WA-SEATTLE-MAIN,County,53033,"98101,98102...",King County WA,primary → zip_list REQUIRED (3 markets share 53033)
```

### Critical V2 Requirements

1. **Column must exist** — Every mapping file must have `zip_list` column (even if mostly blank)
2. **Populate when shared** — If 2+ markets map to same statistical area, each MUST have zip_list
3. **Leave blank when unique** — If only 1 market uses area, zip_list should be empty cell
4. **Complete coverage** — ZIP lists must cover >95% of county ZIPs (allow small gaps for unpopulated areas)
5. **No overlaps** — Each ZIP appears in exactly ONE market's zip_list for a given county
6. **Correct format** — `"12345,12346,12347"` (comma-separated, no spaces, in quotes)

---

## The Many-to-One Mapping Problem (CRITICAL LESSON FROM QA)

**THIS IS THE #1 SOURCE OF CRITICAL ERRORS IN MAPPING FILES.**

### Problem Pattern

When multiple markets share a county, you MUST provide ZIP lists to disambiguate:

```csv
❌ CRITICAL ERROR:
DC-METRO-CORE,County,24031,,Montgomery County MD,primary
MD-SILVER-SPRING,County,24031,,Montgomery County MD,primary
← Both claim same county, no zip_list = MANY-TO-ONE MAPPING FAILURE
```

**Impact:** ZIP expansion fails for entire county. Cannot determine which market a Montgomery County ZIP belongs to.

### Correct Pattern

```csv
✅ CORRECT:
DC-METRO-CORE,County,24031,"20814,20815,20816,20817",Montgomery County MD,primary
MD-SILVER-SPRING,County,24031,"20901,20902,20903,20904,20905",Montgomery County MD,primary
← Each market has distinct ZIPs, programmatic expansion works
```

### Overlap Detection (CRITICAL QA FINDING)

**NEVER allow the same ZIP to appear in multiple markets' zip_lists for the same county:**

```csv
❌ CRITICAL ERROR — ZIP OVERLAP:
DC-METRO-CORE,County,51013,"22201,22202,22203,22204,22205",Arlington County VA,primary
VA-ARLINGTON,County,51013,"22201,22202,22203,22204,22205,22210,22211",Arlington County VA,primary
← ZIPs 22201-22205 appear in BOTH lists = AMBIGUOUS ASSIGNMENT
```

This creates a many-to-many mapping where programmatic expansion cannot determine which market these ZIPs belong to.

**Solution:** Each ZIP must be assigned to exactly one market. Make behavioral decisions about which market "owns" each ZIP based on:
- Proximity to anchor hospital
- Natural boundaries (rivers, highways, transit lines)
- Historical utilization patterns

---

## Relationship Types: Primary vs Secondary

### Primary Relationship

**Definition:** Where residents go for **routine care** (PCPs, imaging, labs, basic procedures).

**Criteria:**
- Travel time <45 minutes door-to-door under typical traffic
- Where most births, routine surgeries, and regular appointments occur
- Where residents have PCPs and maintain medical homes

**Examples:**
```csv
OR-SALEM,CBSA,41420,,Salem OR,primary → Residents use Salem Health for routine care
VA-RICHMOND,CBSA,40060,,Richmond VA,primary → Residents use VCU/Bon Secours for routine care
```

**Rules:**
- Every market MUST have ≥1 primary statistical area
- Primary area must contain the market's anchor city
- Can have multiple primary areas (counties, CBSAs) if geographically contiguous
- Most markets have 1-5 primary statistical areas

### Secondary Relationship

**Definition:** Where residents go for **specialty/tertiary care only** (complex surgery, rare specialties, academic referrals).

**Criteria:**
- Travel time typically >60 minutes (infrequent trips)
- Used for conditions requiring specialized expertise not available locally
- Typically academic medical centers or Level 1 trauma centers
- NOT routine care

**Examples:**
```csv
OR-MEDFORD,CBSA,38900,,Portland-Vancouver OR-WA,secondary,Complex cases referred to OHSU
WV-BECKLEY,CBSA,16620,,Charleston WV,secondary,Tertiary referrals to Charleston Area Medical Center
VA-WINCHESTER,CBSA,47900,,Washington-Baltimore-Arlington,secondary,Complex cases to Johns Hopkins
```

**Rules:**
- Secondary relationships are OPTIONAL (most markets have 0-2)
- Should be >50 miles from anchor (exceptions rare)
- Rationale must specify "tertiary," "complex," "referral," or "specialized"
- Secondary relationships should NOT have zip_list (they're spillover, not primary coverage)

**Decision Test:**

> "Would a resident realistically drive there for a routine checkup or basic imaging?"
> - If YES → Primary
> - If NO → Secondary

---

## Statistical Area Hierarchy and Selection

### Preference Order (Use the Most Specific Available)

1. **Metropolitan/Micropolitan CBSA** (preferred when market = entire metro)
2. **Metropolitan Division** (when large CBSA must be split)
3. **County** (when no CBSA exists, or when splitting CBSA components)

### CBSAs vs Counties: When to Use Each

**Use CBSA when:**
- Market boundaries align with metropolitan area
- CBSA represents single behavioral market
- Anchor city is the CBSA's principal city

**Use Counties when:**
- No CBSA exists (rural areas)
- CBSA is too large and must be decomposed
- Market is suburban ring outside core metro
- Market spans portions of multiple CBSAs

**Use Metropolitan Division when:**
- Large CBSA (>2M population) is split into multiple markets
- Census Bureau defines divisions within the CBSA
- Division aligns with behavioral market

### The CSA Problem (CRITICAL QA FINDING)

**Combined Statistical Areas (CSAs) are almost NEVER appropriate as primary statistical areas.**

CSAs combine multiple CBSAs into mega-regions for economic analysis. They violate the 45-minute rule.

```csv
❌ CRITICAL ERROR:
DC-METRO-CORE,CBSA,47900,,Washington-Baltimore-Arlington CSA,primary
← CSA 47900 contains 10M people, 280 miles, includes both DC and Baltimore (45+ min apart, no transit)
```

**Why this is wrong:**
- CSAs are too large for routine care (often 100+ miles across)
- Violates 45-minute rule
- Combines distinct behavioral markets
- Baltimore and DC are separate healthcare markets despite being in same CSA

**Correct approach:**
```csv
✅ Use Metropolitan Division or component CBSAs:
DC-METRO-CORE,CBSA,47894,,Washington-Arlington-Alexandria DC-VA-MD-WV,primary
MD-BALTIMORE,CBSA,12580,,Baltimore-Columbia-Towson MD,primary
```

**RULE:** If you find yourself using a CSA as primary, **STOP** and decompose into Metropolitan Divisions or component CBSAs.

**Only acceptable CSA usage:** Secondary relationships for distant tertiary referrals (rare).

---

## Large CBSA Decomposition Rules

### When to Split a CBSA

Consider splitting when:
- CBSA population >2M people
- CBSA spans >50 miles across
- Multiple anchor systems operate independently
- Internal travel time >45 minutes for routine care
- Natural barriers divide the metro (water, mountains, congestion)

### How to Split

**Option 1: Use Metropolitan Divisions (if they exist)**
```csv
Seattle-Tacoma-Bellevue CBSA → Split into:
- Seattle-Bellevue-Everett Metropolitan Division (42644)
- Tacoma-Lakewood Metropolitan Division (45104)
```

**Option 2: Use counties**
```csv
Los Angeles-Long Beach-Anaheim CBSA → Split by county:
- Los Angeles County (06037) → Multiple markets
- Orange County (06059) → Separate market
- Riverside County (06065) → Separate market
```

**Option 3: Use counties with ZIP lists (when multiple markets share county)**
```csv
King County WA (53033) → Split into 3 markets with ZIP lists:
- WA-SEATTLE-MAIN + zip_list
- WA-SEATTLE-EASTSIDE + zip_list
- WA-SEATTLE-SOUTHKING + zip_list
```

---

## Cross-Border CBSAs and State Effects

### Handling Cross-Border CBSAs

Many CBSAs span state lines. This is acceptable when behavioral integration exists.

**Examples:**
- Portland-Vancouver-Hillsboro OR-WA (CBSA 38900)
- Washington-Arlington-Alexandria DC-VA-MD-WV (CBSA components)
- Wilmington DE-MD-NJ (CBSA 48864)
- Cincinnati OH-KY-IN (CBSA 17140)

**Rules:**
1. **Acknowledge in rationale:** "Cross-border CBSA integrates [STATE1] and [STATE2]"
2. **Document integration factors:** Transit (MAX, WMATA), bridges (I-5, I-205), economic ties
3. **Note Medicaid implications:** Different state Medicaid programs require separate adequacy filings
4. **Justify behavioral integration:** Why do residents cross state line for routine care?

### State Border Effects on Markets

**Default assumption:** State borders create market splits unless integration is documented.

**Why state borders matter:**
- **Medicaid programs differ** (eligibility, rates, networks)
- **Provider licensing** requires separate credentials
- **Insurance networks** typically don't cross states for routine care
- **Regulatory oversight** by different state agencies

**When to cross state borders:**
- Strong transit integration (WMATA DC-MD-VA, MAX Portland-Vancouver)
- Economic integration (daily commuting patterns)
- Limited in-state alternatives (rural border areas)
- Cross-border CBSA with documented behavioral integration

**When NOT to cross:**
- Convenience only (shorter drive across border)
- Tertiary care only (use secondary relationship)
- Weak integration (occasional crossing)

---

## ZIP List Construction Guidelines

### Step 1: Identify Counties Needing ZIP Lists

Review your market definitions:
- Do 2+ markets map to the same county? → YES → ZIP lists required

### Step 2: Obtain ZIP Code Maps

**Sources:**
- Census Bureau ZCTA (ZIP Code Tabulation Area) maps
- UnitedStatesZipCodes.org county maps
- Google: "[County Name] ZIP code map"

### Step 3: Assign ZIPs Based on Behavioral Boundaries

**Boundary criteria (in priority order):**

1. **Natural barriers** (rivers, mountains, large bodies of water)
2. **Transit lines** (Metro/subway stations, rail corridors)
3. **Major highways** (interstates as dividing lines)
4. **City limits** (incorporated city boundaries)
5. **Distance to anchors** (assign to nearest hospital)

**Example: Montgomery County MD (split between DC-integrated vs suburban)**

Natural boundary: WMATA Red Line extent
- **DC-METRO-CORE gets:** ZIPs within 1 mile of Red Line stations (Bethesda, Medical Center, Grosvenor)
- **MD-SILVER-SPRING gets:** ZIPs in I-270 corridor beyond Red Line (Rockville, Gaithersburg, Germantown)

### Step 4: Verify Coverage and Non-Overlap

**Coverage test:**
```
Total county ZIPs = 50
Market A zip_list = 30 ZIPs
Market B zip_list = 18 ZIPs
Total assigned = 48 ZIPs
Coverage = 96% ✅ (>95% threshold)
Missing 2 ZIPs = unpopulated areas (national park, reservoir)
```

**Overlap test:**
```
Market A zip_list: "12345,12346,12347"
Market B zip_list: "12347,12348,12349"
Overlap detected: 12347 appears in both ❌ CRITICAL ERROR
```

**Solution to overlap:** Assign 12347 to whichever market it's behaviorally closer to (nearest anchor, better road access, historical patterns).

### Step 5: Format Correctly

**Correct format:**
```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103,98104,98105",King County WA,primary,Central Seattle
```

**Format rules:**
- Comma-separated, no spaces: `"98101,98102,98103"`
- Wrapped in double quotes: `"..."`
- All numeric (5-digit ZIPs)
- No hyphens or extensions (98101-1234 → 98101)
- Sorted or unsorted (doesn't matter, but sorted is cleaner)

---

## Rationale Field Requirements

Every mapping row requires a rationale that explains the behavioral logic.

### Good Rationales Include

1. **Geographic anchor** — "Serving [city/region] with [hospital system] anchor"
2. **Friction factors** — "Separated from [other market] by [barrier/distance]"
3. **Integration factors** — "Integrated via [transit/highway]"
4. **Behavioral justification** — "Where residents routinely seek care for [services]"

### Good Examples

```csv
✅ "Metropolitan area represents central Virginia academic medical center serving residents within 45 min drive time"
✅ "Eastern Shore isolated from mainland by Bay Bridge 30-60 min bottleneck serving lower Delmarva Peninsula"
✅ "Inner Montgomery County integrated with DC via WMATA Red Line Medical Center station <30 min to DC hospitals"
✅ "Rural WV hub isolated from Charleston by 90+ min mountain drive serving northern panhandle closer to Pittsburgh"
```

### Bad Examples (Too Vague)

```csv
❌ "Serves the area" ← What area? What makes it distinct?
❌ "Hospital is here" ← Why is this a separate market?
❌ "Primary market" ← This just repeats the relationship_type column
❌ "Portion of county" ← Which portion? What boundary?
```

### When Multiple Markets Share County (ZIP Lists Required)

**Rationale must explain the boundary:**

```csv
✅ "Central Seattle west of Lake Washington including downtown Capitol Hill Ballard University District served by UW Medicine Swedish Virginia Mason"
✅ "Eastside across Lake Washington including Bellevue Redmond Kirkland via I-90 SR-520 bridges served by Overlake Evergreen Health"
```

These rationales explain:
- Which portion of shared county
- What defines the boundary (Lake Washington)
- Why this portion is distinct (different anchor systems, bridge crossing)

---

## Common Mapping Errors and How to Avoid Them

### Error 1: Using CSA as Primary Statistical Area

**Problem:**
```csv
❌ DC-METRO-CORE,CBSA,47900,,Washington-Baltimore-Arlington CSA,primary
```

**Why wrong:** CSAs are too large, violate 45-minute rule

**Solution:** Use Metropolitan Division or component CBSAs
```csv
✅ DC-METRO-CORE,CBSA,47894,,Washington-Arlington-Alexandria DC-VA-MD-WV,primary
```

### Error 2: Many-to-One Mapping Without ZIP Lists

**Problem:**
```csv
❌ MARKET-A,County,12345,,Example County,primary
❌ MARKET-B,County,12345,,Example County,primary
← Both claim same county, no zip_list
```

**Solution:** Add ZIP lists to disambiguate
```csv
✅ MARKET-A,County,12345,"11111,11112,11113",Example County,primary
✅ MARKET-B,County,12345,"11114,11115,11116",Example County,primary
```

### Error 3: ZIP List Overlaps

**Problem:**
```csv
❌ MARKET-A,County,12345,"11111,11112,11113",Example County,primary
❌ MARKET-B,County,12345,"11112,11113,11114",Example County,primary
← ZIPs 11112, 11113 appear in both
```

**Solution:** Assign each ZIP to exactly one market
```csv
✅ MARKET-A,County,12345,"11111,11112",Example County,primary
✅ MARKET-B,County,12345,"11113,11114",Example County,primary
```

### Error 4: Incomplete ZIP Coverage

**Problem:**
```csv
County has 50 ZIPs
MARKET-A: 10 ZIPs
MARKET-B: 15 ZIPs
Total: 25 ZIPs (50% coverage) ❌
```

**Solution:** Assign all county ZIPs (except unpopulated)
- Missing 25 ZIPs likely represent real population
- Review county ZIP map and assign to nearest market

### Error 5: ZIP Lists When Not Needed

**Problem:**
```csv
❌ OR-SALEM,CBSA,41420,"97301,97302,97303",Salem OR,primary
← Only 1 market uses CBSA 41420, zip_list should be blank
```

**Solution:** Leave zip_list blank when statistical area is unique
```csv
✅ OR-SALEM,CBSA,41420,,Salem OR,primary
```

### Error 6: Wrong Statistical Area for Anchor

**Problem:**
```csv
❌ VA-RICHMOND,CBSA,47900,,Washington-Baltimore-Arlington CSA,primary
← Richmond anchor is NOT in this CSA
```

**Solution:** Use CBSA containing anchor city
```csv
✅ VA-RICHMOND,CBSA,40060,,Richmond VA,primary
```

### Error 7: Secondary Relationships That Should Be Primary

**Problem:**
```csv
❌ MARKET-A,County,12345,,Example County,secondary
← Market is 20 miles away, residents go there for routine care
```

**Solution:** Use primary for routine care destinations
```csv
✅ MARKET-A,County,12345,,Example County,primary
```

**Test:** If <45 min and used for routine care → primary

### Error 8: County FIPS Code Errors

**Problem:**
```csv
❌ WV-BECKLEY,County,54063,,Raleigh County WV,primary
← FIPS 54063 is Wyoming County, not Raleigh County (54081)
```

**Solution:** Verify FIPS codes against Census Bureau reference
```csv
✅ WV-BECKLEY,County,54081,,Raleigh County WV,primary
```

---

## Quality Assurance Self-Checks

Before submitting your mapping file, verify:

### Schema Compliance
- [ ] `zip_list` column exists in header
- [ ] Every county shared by 2+ markets has zip_list for each market
- [ ] Every county used by only 1 market has blank zip_list
- [ ] ZIP lists use correct format: `"12345,12346,12347"`

### Coverage Completeness
- [ ] Every market has ≥1 primary statistical area
- [ ] Primary statistical area contains market's anchor city
- [ ] All markets from input CSV are present

### No Duplicates or Overlaps
- [ ] No ZIP appears in multiple markets' zip_lists for same county
- [ ] No market appears twice with identical coverage
- [ ] No statistical area assigned to conflicting markets without ZIP disambiguation

### Large CBSA Decomposition
- [ ] No CSA used as primary statistical area
- [ ] CBSAs >2M population are scrutinized for splits
- [ ] Decomposition uses Metropolitan Divisions or counties

### Cross-Border Validation
- [ ] Cross-border CBSAs acknowledged in rationale
- [ ] State Medicaid implications documented (if relevant)
- [ ] Integration justification provided

### County FIPS Accuracy
- [ ] All county FIPS codes verified against Census reference
- [ ] State codes match (first 2 digits)
- [ ] County names match FIPS codes

### Rationale Quality
- [ ] Every rationale explains behavioral logic
- [ ] Friction factors documented (barriers, distance, congestion)
- [ ] Integration factors documented (transit, highways)
- [ ] Rationales are 1-3 sentences (not paragraphs)

---

## Output Format Specification

### CSV Structure

```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
MD-BALTIMORE,CBSA,12580,,"Baltimore-Columbia-Towson, MD",primary,Metropolitan area represents independent anchor 45+ min from DC
MD-BALTIMORE,County,24005,,Baltimore County MD,primary,Suburban Baltimore served by Johns Hopkins
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103",King County WA,primary,Central Seattle west of Lake Washington
```

### Column Specifications

| Column | Required | Format | Notes |
|--------|----------|--------|-------|
| market_id | Yes | String | From input markets CSV, do not modify |
| statistical_area_type | Yes | CBSA/County | Census geography type |
| statistical_area_id | Yes | String | 5-digit CBSA code or 5-digit County FIPS |
| zip_list | Conditional | String | Populated ONLY when 2+ markets share area |
| statistical_area_name | Yes | String | Human-readable name |
| relationship_type | Yes | primary/secondary | Routine care vs specialty referral |
| mapping_rationale | Yes | String | 1-3 sentence behavioral justification |

### Sorting

Output should be sorted alphabetically by `market_id`.

### File Naming

`market_to_area_<region>.csv`

Examples:
- `market_to_area_pacific_northwest.csv`
- `market_to_area_mid_atlantic.csv`
- `market_to_area_california.csv`

---

## Execution Instructions

When creating a regional mapping file:

1. **Read this master prompt first**
2. **Read the regional prompt** (adds local geography and transit)
3. **Read the markets CSV** (canonical market list)
4. Load Census CBSA definitions for region
5. Load county FIPS codes for region
6. **Identify counties that will need ZIP lists** (multiple markets sharing)
7. Obtain county-to-ZIP crosswalks for shared counties
8. Map each market to appropriate statistical areas
9. **Build ZIP lists for shared counties**
10. Verify coverage, overlaps, and completeness
11. Output ONLY the CSV content (no preamble)
12. Sort by market_id alphabetically

---

## Critical Reminders

**From QA Findings:**

1. ⚠️ **CSA = RED FLAG** — Almost never use CSAs as primary statistical areas
2. ⚠️ **Shared County = ZIP List Required** — Don't create many-to-one mappings
3. ⚠️ **Overlaps = Critical Error** — Each ZIP in exactly one market per county
4. ⚠️ **Coverage Gaps = High Risk** — Aim for >95% coverage of county ZIPs
5. ⚠️ **Verify FIPS Codes** — County name must match FIPS code

**Behavioral Accuracy > Statistical Neatness**

When in doubt:
- Split markets rather than force integration
- Use counties rather than oversized CBSAs
- Document friction rather than ignore it
- Ask for clarification rather than guess

---

## Final Instruction

Produce a programmatically unambiguous mapping that enables clean ZIP expansion.

**Test:** Could a data engineer build a ZIP-to-market lookup table from your file without manual intervention?

If the answer is **NO** (due to overlaps, gaps, or many-to-one mappings), the file is **NOT READY**.

**Success criteria:**
- Every market has distinct coverage (different areas OR different ZIPs)
- Every ZIP maps to exactly one market
- Every behavioral market decision is documented
- File works as input to automated ZIP expansion pipeline

---

**End of Master Mapping Prompt**
