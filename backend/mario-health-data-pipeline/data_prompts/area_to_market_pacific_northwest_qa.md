# QA Prompt: Validating Stage-1 Market → Statistical Area Mapping (V2 with ZIP-Level Granularity)

## TLDR

**What:** Validate that healthcare markets are correctly mapped to Census statistical areas with ZIP-level splits where needed.

**Why:** This mapping drives downstream ZIP assignments that determine network adequacy, price benchmarking, and regulatory compliance. The V2 schema adds ZIP-level granularity to solve many-to-one county mapping problems.

**How:** Check 10 dimensions using severity-based flagging. Surface issues, don't fix them.

**Output:** Structured findings report with executive summary, flagged issues table, and pattern analysis.

**Critical V2 Change:** Validate that `zip_list` column is used correctly — populated when multiple markets share a statistical area, blank otherwise.

---

## Purpose

This prompt quality-assures the **Stage-1 mapping file (V2 format)** linking **proprietary Healthcare Shopping Zones (markets)** to **statistical areas (CBSAs/counties) with ZIP-level splits** for the **Pacific Northwest region (WA/OR)**.

### V2 Schema Requirements

**The mapping file now includes a `zip_list` column:**

```csv
market_id,statistical_area_type,statistical_area_id,zip_list,statistical_area_name,relationship_type,mapping_rationale
```

**Critical V2 validation:**
- `zip_list` must be **populated** when 2+ markets share the same statistical area
- `zip_list` must be **blank** when only 1 market uses the statistical area
- ZIP lists must have **complete coverage** (all county ZIPs assigned)
- ZIP lists must have **no overlaps** (each ZIP in exactly one market)

### Validation Objectives

The mapping must be:

1. **Behaviorally realistic** — Reflects how patients actually seek care
2. **Geographically sound** — Respects barriers, transit, and travel friction
3. **Programmatically unambiguous** — Each ZIP maps to exactly one market
4. **Operationally usable** — Enables clean ZIP expansion without manual intervention

This is a **review and validation task**, NOT a remapping exercise.

### Downstream Impact (Why This Matters)

This mapping directly feeds:
- **ZIP code expansion** → Network adequacy calculations
- **Market definitions** → Price comparison boundaries
- **Regulatory compliance** → Federal adequacy standards
- **Provider contracting** → Market-based rate negotiations

**A bad mapping here cascades into bad data everywhere downstream.**

---

## Files You Must Reference

Review the mapping against these authoritative inputs:

| File | Purpose |
|------|---------|
| `master_market.md` | National framework (45-min rule, friction factors) |
| `markets_pacific_northwest.md` | Regional geography (Cascades, Puget Sound, transit) |
| `markets_pacific_northwest.csv` | Canonical market list (22 markets for WA/OR) |
| `market_to_area_pacific_northwest.csv` | **The V2 file under QA review** (with zip_list column) |

**Do not assume context beyond these materials.**

---

## Role Definition

You are an **Independent Health Economics & Geospatial QA Auditor** with expertise in ZIP code geography.

### Your Responsibilities

✅ **Surface:** Logical inconsistencies, behavioral implausibility, mapping errors, ZIP list problems
✅ **Flag:** Issues with severity ratings and corrective actions
✅ **Document:** Patterns and systemic risks
✅ **Validate:** ZIP list completeness, coverage, and non-overlap

❌ **Do NOT:** Silently fix issues, redefine markets, modify the mapping, collapse ambiguity, create ZIP lists

---

## Regional Context (Pacific Northwest Specifics)

Your QA **must actively apply** these regional realities:

### 1. Geographic Barriers

**Absolute Barriers:**
- **Cascade Mountains** — Hard east-west split, winter closures, 3+ hour drives
- **Puget Sound** — Ferry-dependent islands/peninsulas (60+ min crossings)
- **Columbia River** — State border effects (WA/OR)

**Moderate Barriers:**
- **Lake Washington** — Limited bridge crossings (I-90, SR-520)
- **Congestion corridors** — I-5 Seattle/Tacoma, I-405 Eastside

**Test:** Markets on opposite sides of absolute barriers should NEVER share primary statistical areas.

### 2. Transit Reality Check

**Meaningful for healthcare access:**
- ✅ MAX light rail (Portland-Vancouver) — Crosses state line, frequent service
- ⚠️ Sounder commuter rail (Seattle-Tacoma) — Peak direction only, limited medical facility access

**NOT meaningful for routine care:**
- ❌ Ferries — Schedules too restrictive for routine appointments
- ❌ Long-distance commuter rail — Designed for work trips, not medical access

**Test:** Transit should only collapse markets if it enables <45 min door-to-door routine care trips.

### 3. Known Market Fragmentation

**King County (53033) MUST have ZIP-level splits for 3 markets:**
1. WA-SEATTLE-MAIN (central Seattle west of Lake Washington)
2. WA-SEATTLE-EASTSIDE (Bellevue/Redmond/Kirkland across lake)
3. WA-SEATTLE-SOUTHKING (Renton/Kent/Federal Way)

**Test:** All 3 must have zip_list populated. ZIPs must not overlap. Coverage must be complete.

**Pierce County (53053) — Single market only:**
- WA-SEATTLE-TACOMA (entire Pierce County)

**Test:** zip_list should be blank (only 1 market uses this county).

**Snohomish County (53061) — Single market only:**
- WA-SEATTLE-EVERETT (entire Snohomish County)

**Test:** zip_list should be blank.

**Portland-Vancouver integration:**
- OR-PORTLAND covers integrated cross-border market (CBSA 38900)
- WA-VANCOUVER may be redundant (flag if both map to same CBSA)

**Eastern isolation:**
- WA-SPOKANE separated by Cascades (280 miles from Seattle)
- All eastern markets (Yakima, Tri-Cities, Walla Walla, Wenatchee) completely separate from west

---

## QA Dimensions (Systematic Checks)

### Dimension 1: Market Coverage Completeness

**What to check:**
- Every market has ≥1 primary statistical area
- Primary area contains the market's anchor city
- All 22 markets from CSV are mapped
- **V2:** zip_list column exists in CSV header

**Red flags:**
- Market missing entirely from mapping file
- Primary statistical area doesn't contain anchor city (e.g., OR-SALEM mapped to Eugene CBSA)
- Market has only secondary relationships, no primary
- **V2:** zip_list column missing from header

**Severity:** CRITICAL — Incomplete coverage breaks downstream ZIP expansion

---

### Dimension 2: Primary Relationship Validity (Core Test)

**What to check:**
- Statistical area plausibly represents routine-care behavior
- 45-minute door-to-door threshold respected
- Geography and barriers appropriately considered
- **V2:** If multiple markets share statistical area, each has zip_list

**Good primary examples:**
```csv
OR-SALEM,CBSA,41420,,Salem OR,primary → Correct (Salem anchor in Salem CBSA, zip_list blank = only 1 market)
WA-SPOKANE,CBSA,44060,,Spokane-Spokane Valley WA,primary → Correct (zip_list blank = only 1 market)
```

**Bad primary examples:**
```csv
WA-SEATTLE-MAIN,County,53033,,King County WA,primary → WRONG (3 markets share 53033, zip_list must be populated)
WA-SEATTLE-EASTSIDE,County,53033,,King County WA,primary → WRONG (same issue)
OR-BEND,CBSA,38900,,Portland-Vancouver OR-WA,primary → WRONG (300 miles away, wrong anchor)
```

**Severity levels:**
- **CRITICAL:** Primary area >100 miles from anchor or crosses absolute barrier OR many-to-one mapping without zip_list
- **HIGH:** Primary area likely >45 min for routine care
- **MEDIUM:** Primary area marginally plausible but suspicious

---

### Dimension 3: Secondary Relationship Discipline

**What to check:**
- Secondary = specialty spillover or tertiary referrals only
- Clear geographic/transit justification
- ≤2 secondary areas per market (exceptions need strong rationale)
- **V2:** Secondary relationships should NOT have zip_list (they're spillover, not primary coverage)

**Good secondary examples:**
```csv
OR-MEDFORD,CBSA,38900,,"Portland-Vancouver OR-WA",secondary,Complex tertiary cases to OHSU 270 mi north
WA-SPOKANE,County,16055,,Kootenai County ID,secondary,Cross-border specialty referral from Coeur d'Alene
```

**Bad secondary examples:**
```csv
OR-SALEM,County,41039,,Lane County OR,secondary → Why? Eugene is separate market 50 mi away
WA-BELLINGHAM,CBSA,42660,,Seattle-Tacoma-Bellevue WA,secondary → 90 mi with barrier, implausible
```

**Red flags:**
- Secondary duplicates primary's function (both same geographic scope)
- >2 secondaries without clear academic referral pattern
- Secondary closer/easier than primary
- **V2:** Secondary has zip_list populated (should be blank)

**Severity:** MEDIUM — Overstated referral patterns inflate market scope

---

### Dimension 4: Many-to-One Mapping Resolution (NEW - CRITICAL FOR V2)

**Status:** This is the PRIMARY validation for V2 schema

**What to check:**
- Identify all statistical areas used by 2+ markets
- Verify each market using that area has zip_list populated
- Verify ZIP lists are mutually exclusive (no overlaps)
- Verify ZIP lists provide complete coverage of the statistical area

**Test Pattern:**
```
For each county/CBSA:
  markets_using_this = count(distinct market_id)
  
  If markets_using_this > 1:
    For each market:
      - zip_list must NOT be blank
      - zip_list must be comma-separated numbers
      - zip_list must not overlap with other markets' lists
    
    All zip_lists combined must cover entire county/CBSA
  
  If markets_using_this == 1:
    - zip_list SHOULD be blank (not required but cleaner)
```

**King County (53033) Example - Correct:**
```csv
WA-SEATTLE-MAIN,County,53033,"98101,98102,98103",King County WA,primary → ✅ Has zip_list
WA-SEATTLE-EASTSIDE,County,53033,"98004,98005,98006",King County WA,primary → ✅ Has zip_list
WA-SEATTLE-SOUTHKING,County,53033,"98023,98030,98031",King County WA,primary → ✅ Has zip_list
```

**King County Example - WRONG:**
```csv
WA-SEATTLE-MAIN,County,53033,,King County WA,primary → ❌ Missing zip_list
WA-SEATTLE-EASTSIDE,County,53033,,King County WA,primary → ❌ Missing zip_list
WA-SEATTLE-SOUTHKING,County,53033,,King County WA,primary → ❌ Missing zip_list
```

**Pierce County (53053) Example - Correct:**
```csv
WA-SEATTLE-TACOMA,County,53053,,Pierce County WA,primary → ✅ Blank zip_list (only 1 market)
```

**Red flags:**
- Multiple markets share statistical area WITHOUT zip_list
- zip_list populated but only 1 market uses the statistical area (unnecessary but not wrong)
- ZIP overlap detected (same ZIP in multiple markets' lists)
- Coverage gaps (county ZIPs missing from all lists)

**Severity:** 
- **CRITICAL:** Multiple markets share area without zip_list (breaks programmatic consumption)
- **HIGH:** ZIP overlaps or coverage gaps within shared areas
- **LOW:** Unnecessary zip_list when only 1 market (works but adds complexity)

---

### Dimension 5: ZIP List Quality (NEW FOR V2)

**What to check when zip_list is populated:**

**Format validation:**
- Comma-separated with no spaces: `98101,98102,98103` ✅
- With spaces: `98101, 98102, 98103` ❌
- Non-numeric: `98101,downtown,98103` ❌
- ZIP format: 5-digit numbers only

**Coverage validation:**
```
For each shared county:
  expected_zips = all_zips_in_county(county_fips)
  assigned_zips = union(all markets' zip_lists for this county)
  
  coverage_rate = len(assigned_zips) / len(expected_zips)
  
  If coverage_rate < 0.95:
    FLAG: Incomplete coverage (>5% of ZIPs missing)
  
  If coverage_rate > 1.0:
    FLAG: Invalid ZIPs (ZIPs not in county or duplicates)
```

**Overlap validation:**
```
For each pair of markets sharing a county:
  overlap = intersection(market1_zips, market2_zips)
  
  If len(overlap) > 0:
    FLAG: ZIP overlap detected
    LIST: Specific ZIPs that appear in multiple lists
```

**Behavioral validation:**
- ZIPs near anchor hospital assigned to that market
- Natural boundaries respected (Lake Washington = dividing line)
- City boundaries generally respected (Bellevue ZIPs in Eastside market)

**Red flags:**
- Coverage <95% (missing ZIPs)
- Coverage >100% (invalid or duplicate ZIPs)
- ZIP overlaps between markets
- Format errors (spaces, non-numeric, wrong length)
- Behavioral mismatch (downtown Seattle ZIPs in Eastside market)

**Severity:**
- **CRITICAL:** Coverage gaps >10% or overlaps >5 ZIPs
- **HIGH:** Coverage gaps 5-10% or overlaps 1-5 ZIPs or format errors
- **MEDIUM:** Behavioral mismatches (ZIP assigned to wrong market but no technical error)

---

### Dimension 6: Over-Aggregation Risk

**What to check:**
- Markets with distinct behavioral patterns have distinct coverage
- ZIP lists successfully differentiate markets when statistical area is shared
- No loss of granularity from market design to mapping

**Critical Test — Seattle Metro:**
Do the 5 Seattle markets have distinct coverage?

| Market | Statistical Area | ZIP List? | Maintains Distinctiveness? |
|--------|------------------|-----------|---------------------------|
| WA-SEATTLE-MAIN | County 53033 | Required | ✅ If has unique ZIP list |
| WA-SEATTLE-EASTSIDE | County 53033 | Required | ✅ If has unique ZIP list |
| WA-SEATTLE-SOUTHKING | County 53033 | Required | ✅ If has unique ZIP list |
| WA-SEATTLE-TACOMA | County 53053 | Not needed | ✅ Only market in Pierce |
| WA-SEATTLE-EVERETT | County 53061 | Not needed | ✅ Only market in Snohomish |

**Result:** PASS only if King County markets have non-overlapping ZIP lists

**Severity:** CRITICAL — Over-aggregation defeats purpose of granular market design

---

### Dimension 7: Under-Aggregation Risk

**What to check:**
- Markets aren't over-split beyond behavioral reality
- ZIP list boundaries reflect actual utilization patterns
- Natural barriers justify splits (not administrative convenience)

**Question for King County 3-way split:**
- Does Lake Washington justify Main vs Eastside split? → YES (clear natural barrier)
- Does Valley Medical Center justify SouthKing split? → Requires validation
- Would 2 markets (West-of-Lake, East-of-Lake) be more behaviorally accurate?

**Red flags:**
- ZIP boundaries don't follow natural barriers
- Anchor hospitals serve ZIPs in multiple "separate" markets
- Over-precision without behavioral justification

**Severity:** MEDIUM — May over-fragment routine care behavior

---

### Dimension 8: Barrier Compliance

**What to check:**
- Absolute barriers never crossed in primary relationships
- Water barriers properly reflected in ZIP assignments
- Mountain barriers (Cascades) create hard east-west split

**Cascade Mountains:**
- ✅ Zero primary relationships cross Cascades
- ✅ Eastern markets have no Western statistical areas
- ✅ OR-BEND (high desert) separated from Willamette Valley

**Lake Washington (within King County):**
- ✅ Eastside ZIPs (98004-98077) east of lake
- ✅ Main ZIPs (98101-98199) west of lake
- ✅ Bridges acknowledged but split maintained

**Ferry Barriers:**
- ✅ WA-BREMERTON isolated from Seattle markets
- ✅ No ferry-dependent ZIPs in Seattle-Main zip_list

**Severity:** CRITICAL — Barrier violations break behavioral realism

---

### Dimension 9: Statistical Area Selection Appropriateness

**What to check:**
- CBSAs used when they exist and match market scope
- Counties used when CBSA is too broad or doesn't exist
- ZIP lists used when counties are shared
- Metro divisions used when available (Tacoma, Everett)

**Good patterns:**
```csv
OR-SALEM,CBSA,41420,,Salem OR,primary → CBSA exists and matches market
WA-SEATTLE-TACOMA,CBSA,45104,,Tacoma-Lakewood WA,primary → Metro division exists
WA-SEATTLE-MAIN,County,53033,"98101...",King County WA,primary → County + ZIP list for shared county
```

**Bad patterns:**
```csv
WA-SEATTLE-MAIN,CBSA,42660,,Seattle-Tacoma-Bellevue WA,primary → Too broad, loses granularity
```

**Severity:** HIGH — Poor statistical area selection undermines entire mapping

---

### Dimension 10: Rationale Quality

**What to check:**
- Rationale mentions specific geography
- Barrier/integration mechanisms documented
- ZIP list boundaries explained when present
- Anchor systems named

**Good rationales WITH zip_list:**
```
"Central Seattle urban core west of Lake Washington including downtown Capitol Hill Ballard University District served by UW Medicine Swedish Virginia Mason"
```
✅ Geographic scope (west of lake, specific neighborhoods)
✅ Natural barrier (Lake Washington)
✅ Cities/areas included (downtown, Capitol Hill, Ballard, U-District)
✅ Anchor systems (UW Medicine, Swedish, Virginia Mason)

**Good rationales WITHOUT zip_list:**
```
"Ferry-dependent Kitsap Peninsula separated from Seattle by 60-minute Puget Sound ferry crossing anchored by CHI Franciscan Harrison"
```
✅ Barrier type (ferry)
✅ Quantified friction (60 minutes)
✅ Geographic context (Puget Sound)
✅ Anchor system (CHI Franciscan Harrison)

**Bad rationales:**
```
"Central portion of county" → ❌ Vague, no anchor, no geography
"Seattle area market" → ❌ Generic, no barrier info, no scope
```

**When zip_list present, rationale should explain boundaries:**
- "West of Lake Washington" ✅
- "Eastside across lake via I-90 SR-520 bridges" ✅
- "South King County including Renton Kent Auburn" ✅
- "Central Seattle portion" ❌ (vague)

**Severity:** MEDIUM — Poor rationale makes validation harder but doesn't break functionality

---

## Output Format: Structured QA Report

### Section 1: Executive Summary

**Include:**
- Overall confidence rating (High/Medium/Low)
- Count of issues by severity (Critical/High/Medium/Low)
- Key findings (3-5 bullets on biggest problems)
- Statistics (markets mapped, markets missing, avg relationships per market)
- **V2 specific:** ZIP list usage rate, counties with splits, ZIP overlap count
- Production readiness assessment

**Example:**
```
**Confidence Rating:** MEDIUM

**Summary:** Mapping demonstrates strong understanding of regional geography but contains 
CRITICAL many-to-one mapping issue for King County (3 markets share County 53033 without 
ZIP lists). This blocks all downstream processing for 30% of WA population.

**Key Findings:**
- CRITICAL: King County (53033) has 3 markets but all have blank zip_list
- 3 markets completely missing from mapping file (14% coverage gap)
- Portland-Vancouver redundancy requires resolution
- Rationale quality is excellent (specific geography, quantified barriers)

**Statistics:**
- Markets mapped: 19 of 22 (86%)
- Markets missing: 3 (14%)
- Counties with multiple markets: 1 (King County only)
- ZIP lists populated: 0 of 3 required (0% compliance)
- Issues flagged: 8 (3 Critical, 2 High, 2 Medium, 1 Low)
```

---

### Section 2: Flagged Issues Table

**Format:**
```csv
issue_id,market_ids,statistical_area,issue_type,severity,description,suggested_fix
```

**Issue types:**
- `missing_zip_list` — Multiple markets share area but zip_list blank
- `unnecessary_zip_list` — Single market uses area but zip_list populated (minor)
- `zip_overlap` — ZIPs appear in multiple markets' lists
- `zip_coverage_gap` — County ZIPs missing from all lists
- `zip_format_error` — Spaces, non-numeric, wrong length
- `missing_market` — Market in canonical CSV but not in mapping
- `overaggregation` — Markets collapse to same area without distinction
- `underaggregation` — Market scope too narrow for known catchment
- `improper_county` — County used when CBSA exists or without justification
- `implausible_primary` — Primary area doesn't match anchor or violates 45-min rule
- `weak_secondary` — Secondary relationship unjustified or implausible
- `poor_rationale` — Mapping explanation inadequate or generic
- `overlap_ambiguity` — Multiple markets share area without clear distinction
- `barrier_violation` — Mapping crosses Cascades, ferry, or other absolute barrier

**Severity definitions:**
- **CRITICAL:** Breaks downstream processing or fundamentally wrong
- **HIGH:** Behaviorally implausible or creates significant data quality risk
- **MEDIUM:** Suboptimal but usable, should be improved
- **LOW:** Minor issue, cosmetic or documentation quality

**Sort order:** Critical first, then High, Medium, Low. Within severity, alphabetical by market_id.

**Example:**
```csv
issue_id,market_ids,statistical_area,issue_type,severity,description,suggested_fix
1,WA-SEATTLE-MAIN|WA-SEATTLE-EASTSIDE|WA-SEATTLE-SOUTHKING,County 53033,missing_zip_list,CRITICAL,Three markets share King County 53033 but all have blank zip_list. Programmatic ZIP expansion cannot distinguish which ZIPs belong to which market. This blocks processing for 2.3M people (30% of WA).,Build ZIP lists for each market: WA-SEATTLE-MAIN gets downtown/west-of-lake ZIPs (98101-98199 range); WA-SEATTLE-EASTSIDE gets Bellevue/Redmond/Kirkland ZIPs (98004-98077 range); WA-SEATTLE-SOUTHKING gets Renton/Kent/Auburn ZIPs (98001-98065 range). See V2 prompt ZIP building guide.
2,WA-MOUNTVERNON,N/A,missing_market,CRITICAL,Market present in canonical CSV but completely missing from mapping file. Cannot expand to ZIPs.,Add mapping: CBSA 35940 (Mount Vernon-Anacortes) + Skagit County 53057
```

---

### Section 3: Pattern-Level Observations

**Required analyses:**

**3.1 ZIP List Usage Patterns (NEW FOR V2)**
- How many markets have zip_list populated?
- How many counties have multiple markets?
- Are ZIP lists being used correctly (populated when needed, blank when not)?
- What's the compliance rate for shared statistical areas?

**Example:**
```
**ZIP List Usage:**
- Total counties with 2+ markets: 1 (King County 53033)
- Markets sharing those counties: 3 (WA-SEATTLE-MAIN, EASTSIDE, SOUTHKING)
- ZIP lists populated: 0 of 3 (0% compliance) ← CRITICAL FAILURE
- ZIP lists unnecessary but present: 0 (good)

**Pattern:** V2 schema not yet adopted. All markets use V1 format (no zip_list column or all blank).
```

**3.2 Many-to-One Mapping Issues**
- Which statistical areas are shared by multiple markets?
- Do those markets have distinct ZIP lists?
- Are there any overlaps or coverage gaps?

**3.3 Geographic Consistency**
- Are Seattle's 5 markets properly split?
- Is Portland-Vancouver integration handled consistently?
- Are Eastern vs Western markets clearly separated by Cascades?

**3.4 Statistical Area Coverage**
- Which CBSAs appear most frequently?
- Are any major CBSAs accidentally omitted?
- Is county usage concentrated in specific regions?

**3.5 Rationale Quality Patterns**
- What % of rationales mention specific barriers/geography?
- What % are generic boilerplate?
- Are rationales consistent across similar markets?

**3.6 Recommendations for Systematic Improvements**
- If multiple markets have same issue type, what's the root cause?
- Are there methodological improvements needed?
- Should any markets be reconsidered at source (markets CSV)?

---

## Execution Workflow

### Step 1: Pre-Check (5 min)
- Load all 4 reference files
- Count markets in CSV (should be 22 for Pacific NW)
- Count markets in mapping file (should match)
- **V2:** Verify zip_list column exists in header
- Flag any immediate discrepancies

### Step 2: V2 Schema Validation (10 min) - NEW
- Identify all statistical areas used by 2+ markets
- For each shared area, verify each market has zip_list populated
- Check format: comma-separated, no spaces, numeric only
- Flag missing ZIP lists (CRITICAL issue)

### Step 3: ZIP List Quality Check (15-20 min per shared county) - NEW
- For each county with multiple markets:
  - Extract all ZIP lists
  - Check for overlaps
  - Check for coverage gaps
  - Validate format
  - Assess behavioral accuracy (ZIPs near anchors)

### Step 4: Traditional Dimension Review (30-45 min)
- For EACH dimension (1-10):
  - Review every market against that dimension's criteria
  - Flag issues in working notes with severity
  - Document pattern observations
  - Identify root causes if issues cluster

### Step 5: Cross-Cutting Analysis (15 min)
- Review Seattle metro split (5 markets)
- Review Portland-Vancouver integration
- Review Eastern markets isolation
- Verify ferry-dependent market separation

### Step 6: Compile Findings (15 min)
- Assign final severity ratings
- Write executive summary
- Format flagged issues table
- Document pattern observations
- Generate recommendations

### Step 7: Confidence Rating (5 min)
- Count issues by severity
- Assess systemic vs isolated problems
- Assign overall confidence (High/Medium/Low)
- Write confidence rationale

**Total time: 90-110 minutes for thorough QA (includes V2 validation)**

---

## What You Must NOT Do

**Prohibited actions:**
- ❌ Redefine markets or create new market_ids
- ❌ Modify the mapping file directly
- ❌ Build ZIP lists yourself (only flag missing ones)
- ❌ Resolve ambiguity by making assumptions
- ❌ Optimize for completeness over accuracy
- ❌ Suppress issues to make findings "cleaner"
- ❌ Create corrective mappings (only describe needed fixes)

**Your role is to surface problems, not solve them.**

---

## Decision Frameworks for Edge Cases

### Framework 1: When ZIP List Is Needed

**Ask:**
1. Do 2+ markets map to the same statistical area? → If YES, zip_list REQUIRED
2. Is statistical area unique to this market? → If YES, zip_list should be BLANK

**If both YES:** Error in market design, flag as redundancy

**If missing zip_list when needed:**
- Severity: CRITICAL
- Description: Many-to-one mapping without disambiguation
- Fix: Build ZIP lists using V2 prompt guide

### Framework 2: When ZIP Overlap Is Detected

**Ask:**
1. Are overlapping ZIPs truly part of both markets' catchments? → Usually NO
2. Is overlap <5 ZIPs? → Flag as HIGH
3. Is overlap >5 ZIPs? → Flag as CRITICAL

**Common causes:**
- Data entry error (wrong ZIP in list)
- Boundary ambiguity (ZIP spans behavioral boundary)
- Intentional overlap (ZIP legitimately serves both markets)

**Action:**
- Document specific ZIPs that overlap
- Suggest moving ZIPs to market nearest their anchor
- Flag for stakeholder review if legitimately ambiguous

### Framework 3: When Coverage Gap Is Detected

**Ask:**
1. Are missing ZIPs populated areas? → If YES, CRITICAL gap
2. Are missing ZIPs unpopulated (parks, military bases)? → If YES, MEDIUM issue
3. Is gap >10% of county ZIPs? → If YES, CRITICAL
4. Is gap 5-10%? → HIGH
5. Is gap <5%? → MEDIUM

**Action:**
- List specific missing ZIPs
- Determine which market should claim them (nearest anchor)
- If truly unpopulated, note in findings but lower severity

### Framework 4: When Primary vs Secondary Is Unclear

**Primary = Routine care** (PCP, imaging, basic procedures)
- <45 min travel
- Where residents go for regular appointments
- Where most births/surgeries occur

**Secondary = Specialty/tertiary only** (complex surgery, rare specialties, academic referrals)
- Often >60 min travel
- Infrequent trips
- Typically academic medical centers

**Test:** "Would a resident realistically drive there for a routine checkup?"
- If YES → Primary
- If NO → Secondary

---

## Regional Validation Checklist (Pacific Northwest)

Before finalizing your QA report, verify:

**V2 Schema Compliance:**
- [ ] zip_list column exists in CSV header
- [ ] King County (53033) used by 3 markets → each has zip_list populated
- [ ] Pierce County (53053) used by 1 market → zip_list is blank
- [ ] Snohomish County (53061) used by 1 market → zip_list is blank
- [ ] No ZIP overlaps within King County split
- [ ] King County ZIP lists provide >95% coverage

**Geographic Accuracy:**
- [ ] Seattle's 5 markets each have DISTINCT coverage (via counties or ZIP lists)
- [ ] WA-SEATTLE-MAIN ZIP list includes downtown, Capitol Hill, Ballard (west of lake)
- [ ] WA-SEATTLE-EASTSIDE ZIP list includes Bellevue, Redmond, Kirkland (east of lake)
- [ ] WA-SEATTLE-SOUTHKING ZIP list includes Renton, Kent, Auburn, Federal Way
- [ ] OR-PORTLAND and WA-VANCOUVER redundancy is flagged if both map to CBSA 38900
- [ ] All Eastern markets (Spokane, Yakima, Tri-Cities, Walla Walla, Wenatchee) have NO statistical areas west of Cascades
- [ ] WA-BREMERTON is separated from Seattle markets (ferry barrier)
- [ ] Ferry-dependent markets don't map to Seattle metro areas
- [ ] No market crosses Cascade Mountains in primary relationship

**Data Completeness:**
- [ ] All 22 markets from CSV are present in mapping
- [ ] No invalid CBSA codes or FIPS codes
- [ ] Rationales reference specific PNW geography when relevant

---

## Example QA Finding (V2 Format)

**Issue ID:** 1

**Market(s):** WA-SEATTLE-MAIN, WA-SEATTLE-EASTSIDE, WA-SEATTLE-SOUTHKING

**Statistical Area:** County 53033 (King County WA)

**Issue Type:** missing_zip_list

**Severity:** CRITICAL

**Description:**
Three distinct markets all map to identical County 53033 King County WA as primary, but all have blank zip_list field. This creates a many-to-one mapping where programmatic ZIP expansion cannot distinguish which market a King County ZIP belongs to. The rationale fields contain human-readable text like "central urban core" vs "Eastside portion" vs "south portion" but these cannot be parsed programmatically.

This blocks downstream processing for King County, which contains ~2.3M people (30% of Washington's population) and includes Seattle, Bellevue, Redmond, Kirkland, Renton, Kent, Auburn, Federal Way, and other major cities.

**Impact:**
- ZIP code expansion fails for all King County ZIPs
- Network adequacy calculations incomplete for Seattle metro
- Price benchmarking cannot distinguish Seattle markets
- Cannot determine provider network participation by market

**Suggested Fix:**
Populate zip_list for each of the three markets using behavioral boundaries:

**WA-SEATTLE-MAIN:**
```
"98101,98102,98103,98104,98105,98107,98109,98112,98115,98116,98117,98118,98119,98121,98122,98125,98126,98133,98134,98136,98144,98146,98154,98164,98174,98177,98178,98195,98199"
```
Rationale: Central Seattle west of Lake Washington including downtown, Capitol Hill, Ballard, University District, Fremont, Wallingford, Queen Anne, West Seattle

**WA-SEATTLE-EASTSIDE:**
```
"98004,98005,98006,98007,98008,98011,98027,98029,98033,98034,98039,98040,98052,98053,98056,98059,98072,98074,98075,98077"
```
Rationale: Eastside across Lake Washington including Bellevue, Redmond, Kirkland, Sammamish, Issaquah, Mercer Island via I-90/SR-520 bridges

**WA-SEATTLE-SOUTHKING:**
```
"98001,98002,98003,98023,98030,98031,98032,98042,98055,98057,98058,98063,98064,98065,98092,98188,98198"
```
Rationale: South King County including Renton, Kent, Auburn, Federal Way, SeaTac, Tukwila, Burien, Des Moines

**Validation Required:**
- Verify ZIP lists provide complete coverage (all King County ZIPs assigned)
- Verify no overlaps (each ZIP in exactly one list)
- Ground-truth with King County ZIP map
- Validate behavioral accuracy with local health plans

---

## Self-Validation Checklist (V2 Updates)

### V2 Schema Validation
- [ ] Verified zip_list column exists in CSV header
- [ ] Identified all statistical areas used by 2+ markets
- [ ] Verified each market sharing an area has zip_list populated
- [ ] Verified markets with unique statistical areas have blank zip_list
- [ ] Checked ZIP list format (comma-separated, no spaces, numeric)
- [ ] Checked for ZIP overlaps within shared areas
- [ ] Checked for coverage gaps within shared areas
- [ ] Assessed behavioral accuracy of ZIP assignments

### Traditional Validation (Unchanged)
- [ ] Every market from CSV has at least one primary statistical area
- [ ] Primary areas plausibly represent routine-care behavior
- [ ] Secondary relationships clearly specialty-only
- [ ] Large CBSAs appropriately decomposed into counties or divisions
- [ ] Cross-border CBSAs properly assigned
- [ ] County usage justified in rationales
- [ ] All CBSA codes and county FIPS codes correct
- [ ] Redundant markets flagged (if any)

### Regional Specifics (Updated for V2)
- [ ] King County 3-market split has ZIP lists for all 3 markets
- [ ] Lake Washington forms east-west boundary in ZIP assignments
- [ ] Cascade barrier prevents any east-west primary statistical area sharing
- [ ] Ferry-dependent areas properly isolated
- [ ] Portland-Vancouver integration/redundancy addressed

---

## Final Instruction

Evaluate this V2 mapping as if it will be used to:
- Justify healthcare price comparisons to employers
- Demonstrate network adequacy to regulators
- Define market concentration for antitrust analysis
- Support provider rate negotiations
- **Enable programmatic ZIP expansion without manual intervention**

**Standard:** If a knowledgeable local stakeholder (hospital CFO, health plan actuary, regional health economist) OR a data engineer building the ZIP expansion pipeline would reasonably dispute a mapping, it must be flagged.

**V2 Standard:** If programmatic ZIP expansion would fail or produce ambiguous results, it's CRITICAL severity.

**Confidence test:** Would you stake your professional reputation on this mapping being correct AND programmatically unambiguous?

---

**End of V2 QA Prompt**
