# QA Prompt: Validating Stage-1 Market → Statistical Area Mapping (Pacific Northwest)

## TLDR

**What:** Validate that healthcare markets are correctly mapped to Census statistical areas.

**Why:** This mapping drives downstream ZIP assignments that determine network adequacy, price benchmarking, and regulatory compliance.

**How:** Check 9 dimensions using severity-based flagging. Surface issues, don't fix them.

**Output:** Structured findings report with executive summary, flagged issues table, and pattern analysis.

---

## Purpose

This prompt quality-assures the **Stage-1 mapping file** linking **proprietary Healthcare Shopping Zones (markets)** to **statistical areas (CBSAs/counties)** for the **Pacific Northwest region (WA/OR)**.

### Validation Objectives

The mapping must be:

1. **Behaviorally realistic** — Reflects how patients actually seek care
2. **Geographically sound** — Respects barriers, transit, and travel friction
3. **Operationally usable** — Enables clean ZIP expansion without arbitrary splits

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
| `market_to_statistical_area_pacific_northwest.csv` | **The file under QA review** |

**Do not assume context beyond these materials.**

---

## Role Definition

You are an **Independent Health Economics & Geospatial QA Auditor**.

### Your Responsibilities

✅ **Surface:** Logical inconsistencies, behavioral implausibility, mapping errors
✅ **Flag:** Issues with severity ratings and corrective actions
✅ **Document:** Patterns and systemic risks

❌ **Do NOT:** Silently fix issues, redefine markets, modify the mapping, collapse ambiguity

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

**Seattle metro MUST split into 5 distinct markets:**
1. WA-SEATTLE-MAIN (King County central)
2. WA-SEATTLE-EASTSIDE (Bellevue/Redmond across Lake Washington)
3. WA-SEATTLE-SOUTHKING (Renton/Kent/Federal Way)
4. WA-SEATTLE-TACOMA (Pierce County, 35 miles south)
5. WA-SEATTLE-EVERETT (Snohomish County, 30 miles north)

**Test:** Each should map to DISTINCT statistical areas (different counties or CBSA divisions).

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

**Red flags:**
- Market missing entirely from mapping file
- Primary statistical area doesn't contain anchor city (e.g., OR-SALEM mapped to Eugene CBSA)
- Market has only secondary relationships, no primary

**Severity:** CRITICAL — Incomplete coverage breaks downstream ZIP expansion

---

### Dimension 2: Primary Relationship Validity (Core Test)

**What to check:**
- Statistical area plausibly represents routine-care behavior
- 45-minute door-to-door threshold respected
- Geography and barriers appropriately considered

**Good primary examples:**
```csv
OR-SALEM,CBSA,41420,Salem OR,primary → Correct (Salem anchor in Salem CBSA)
WA-SPOKANE,CBSA,44060,Spokane-Spokane Valley WA,primary → Correct (Spokane anchor)
```

**Bad primary examples:**
```csv
WA-SEATTLE-EASTSIDE,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary → WRONG (too broad, loses Eastside granularity)
OR-BEND,CBSA,38900,Portland-Vancouver OR-WA,primary → WRONG (300 miles away, wrong anchor)
```

**Severity levels:**
- **CRITICAL:** Primary area >100 miles from anchor or crosses absolute barrier
- **HIGH:** Primary area likely >45 min for routine care
- **MEDIUM:** Primary area marginally plausible but suspicious

---

### Dimension 3: Secondary Relationship Discipline

**What to check:**
- Secondary = specialty spillover or tertiary referrals only
- Clear geographic/transit justification
- ≤2 secondary areas per market (exceptions need strong rationale)

**Good secondary examples:**
```csv
OR-MEDFORD,CBSA,38900,Portland-Vancouver OR-WA,secondary,Complex tertiary cases to OHSU 270 mi north
WA-SPOKANE,County,16055,Kootenai County ID,secondary,Cross-border specialty referral from Coeur d'Alene
```

**Bad secondary examples:**
```csv
OR-SALEM,County,41039,Lane County OR,secondary → Why? Eugene is separate market 50 mi away
WA-BELLINGHAM,CBSA,42660,Seattle-Tacoma-Bellevue WA,secondary → 90 mi with barrier, implausible
```

**Red flags:**
- Secondary duplicates primary's function (both same geographic scope)
- >2 secondaries without clear academic referral pattern
- Secondary closer/easier than primary

**Severity:** MEDIUM — Overstated referral patterns inflate market scope

---

### Dimension 4: Over-Aggregation Risk (Granularity Loss)

**Critical pattern to detect:**
Multiple granular markets all pointing to the SAME large CBSA.

**WRONG approach (loses granularity):**
```csv
WA-SEATTLE-MAIN,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-EASTSIDE,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
WA-SEATTLE-TACOMA,CBSA,42660,Seattle-Tacoma-Bellevue WA,primary
```
↑ All map to same CBSA → Granular markets become meaningless

**CORRECT approach (preserves granularity):**
```csv
WA-SEATTLE-MAIN,County,53033,King County WA,primary,Central Seattle urban core
WA-SEATTLE-EASTSIDE,County,53033,King County WA,primary,Eastside portion across Lake Washington
WA-SEATTLE-TACOMA,County,53053,Pierce County WA,primary,Pierce County with MultiCare system
WA-SEATTLE-TACOMA,CBSA,45104,Tacoma-Lakewood WA,primary,Tacoma metro division
```
↑ Uses counties and CBSA divisions to maintain distinctions

**Test questions:**
1. Do Seattle's 5 markets map to distinct statistical areas?
2. Does Portland-Vancouver integration vs separation make sense?
3. Are county-based splits justified in rationale field?

**Severity:** HIGH — Over-aggregation defeats purpose of granular market design

---

### Dimension 5: Under-Coverage Risk

**What to check:**
- Markets aren't too narrowly scoped
- Known referral patterns reflected
- Adjacent areas reasonably included

**Examples of under-coverage:**
```csv
WA-SPOKANE,CBSA,44060,Spokane-Spokane Valley WA,primary
[Missing Spokane County or surrounding rural counties]
```
→ Spokane serves vast Eastern WA catchment, needs county coverage

```csv
OR-MEDFORD,CBSA,32780,Medford OR,primary
[Missing Jackson County or secondary to Portland]
```
→ Southern Oregon is isolated, needs broader rural coverage + tertiary referral

**Red flags:**
- Regional hub with only narrow CBSA, no county fallback
- No secondary for isolated markets >150 mi from tertiary center
- Rural catchment areas obviously missing

**Severity:** MEDIUM — Under-coverage creates network adequacy gaps

---

### Dimension 6: County Fallback Usage (Critical Verification)

**When county usage is CORRECT:**
1. ✅ No CBSA/micro exists for the area
2. ✅ Large CBSA needs to be split across multiple granular markets
3. ✅ County represents distinct healthcare catchment

**When county usage is WRONG:**
1. ❌ CBSA exists but was ignored for convenience
2. ❌ County doesn't align with actual care patterns
3. ❌ Rationale doesn't explain why county vs CBSA

**Validation process:**
```
For each county mapping:
1. Check: Does a CBSA/micro exist covering this area?
   → If YES, why wasn't it used? (rationale must explain)
   → If NO, proceed to step 2

2. Check: Is county split across multiple markets?
   → If YES, rationale must specify which portion (e.g., "Eastside portion of King County")
   → If NO, why use county instead of CBSA?

3. Check: Does rationale justify county choice?
   → Must mention either: (a) CBSA splitting, (b) no CBSA exists, or (c) rural catchment beyond metro
```

**Examples to flag:**
```csv
OR-SALEM,County,41047,Marion County OR,primary → Why county when CBSA 41420 exists?
WA-BELLINGHAM,County,53073,Whatcom County WA,primary → Why county when CBSA 13380 exists?
```

**Examples that are OK:**
```csv
WA-SEATTLE-MAIN,County,53033,King County WA,primary,Central Seattle urban core
[Rationale explains: splitting large CBSA across 3 markets using county portions]
```

**Severity:** HIGH — Improper county use creates arbitrary boundaries

---

### Dimension 7: Many-to-Many Logic Integrity

**What to check:**
- Markets CAN share statistical areas if behaviorally justified
- Sharing is documented in rationale
- No artificial forcing of exclusivity

**Valid sharing scenarios:**
1. **County splits** — Multiple markets serve different portions of same county
2. **Overlapping catchments** — Two markets legitimately serve same rural areas
3. **Integrated metros** — Cross-border markets share same CBSA

**Example of valid sharing:**
```csv
WA-SEATTLE-MAIN,County,53033,King County WA,primary,Central Seattle urban core
WA-SEATTLE-EASTSIDE,County,53033,King County WA,primary,Eastside portion across Lake Washington
WA-SEATTLE-SOUTHKING,County,53033,King County WA,primary,South King County portion
```
↑ All three share King County but rationales specify distinct portions

**Red flags:**
- Markets share county WITHOUT portion specified in rationale
- Rationales identical across markets sharing same area
- Sharing creates obvious conflict (e.g., both claim to be "primary hub")

**Severity:** MEDIUM — Ambiguous overlaps complicate ZIP expansion

---

### Dimension 8: Naming and Identifier Integrity (Data Quality)

**What to verify:**

**CBSA codes:**
- 5-digit code format
- Code matches name exactly
- Code exists in Census CBSA definitions

**County FIPS codes:**
- 5-digit format (2-digit state + 3-digit county)
- Code matches name exactly
- Code exists in Census county definitions

**Market IDs:**
- Every market_id exists in `markets_pacific_northwest.csv`
- No markets from CSV missing in mapping
- No extra markets created

**Common errors to catch:**
```csv
OR-SALEM,CBSA,41400,Salem OR → WRONG code (correct is 41420)
WA-SEATTLE,County,53033 → WRONG market_id (should be WA-SEATTLE-MAIN)
OR-EUGENE,County,41093 → WRONG FIPS (Lane County is 41039, not 41093)
```

**Validation approach:**
1. Cross-reference every CBSA code against official Census list
2. Cross-reference every county FIPS against official Census list
3. Cross-reference every market_id against regional CSV
4. Flag any mismatches immediately

**Severity:** CRITICAL — Invalid codes break downstream processing

---

### Dimension 9: Mapping Rationale Quality

**What makes a good rationale:**
- ✅ Explains WHY this statistical area for this market
- ✅ References specific geography (rivers, mountains, distances)
- ✅ Notes barriers or transit if relevant
- ✅ Specifies portion if sharing county
- ✅ Different wording across markets (not copy-paste)

**What makes a bad rationale:**
- ❌ Generic boilerplate ("serves the region")
- ❌ Doesn't explain relationship type (why primary vs secondary?)
- ❌ Identical across multiple markets
- ❌ Doesn't address obvious questions (Why county? Why not adjacent CBSA?)

**Examples:**

**Good rationales:**
```csv
WA-BREMERTON,CBSA,14740,Bremerton-Silverdale-Port Orchard WA,primary,Ferry-dependent Kitsap Peninsula metropolitan area separated from Seattle by 60-minute Puget Sound ferry crossing anchored by CHI Franciscan Harrison
→ Explains barrier (ferry), distance (60 min), separation from Seattle, anchor

OR-MEDFORD,CBSA,38900,Portland-Vancouver OR-WA,secondary,Complex tertiary cases referred to OHSU in Portland 270 miles north for academic medical center services
→ Explains secondary nature (tertiary only), distance, academic referral pattern
```

**Bad rationales:**
```csv
OR-SALEM,CBSA,41420,Salem OR,primary,Metropolitan area for Salem
→ Doesn't explain why, generic language, adds no value

WA-SEATTLE-EASTSIDE,County,53033,King County WA,primary,King County
→ Doesn't specify WHICH portion, why county, or what makes it distinct
```

**Flag if:**
- Rationale <10 words (too brief to be useful)
- Rationale >100 words (overly verbose)
- Rationale doesn't mention key geography when relevant
- Rationales across similar markets are identical

**Severity:** LOW — Poor rationales don't break processing but reduce QA confidence

---

## Required QA Outputs

Produce a **QA Findings Report** with these sections:

### Section 1: Executive Summary

**Template:**
```
Overall Confidence Level: [High / Medium / Low]

Confidence Rationale:
[2-3 sentences explaining overall assessment]

Top 3 Strengths:
1. [Specific positive finding]
2. [Specific positive finding]
3. [Specific positive finding]

Top 3 Systemic Risks:
1. [Pattern or category of issues]
2. [Pattern or category of issues]
3. [Pattern or category of issues]

Critical Issues Requiring Immediate Fix: [Number]
High-Severity Issues: [Number]
Medium-Severity Issues: [Number]
Low-Severity Issues: [Number]
```

**Confidence level definitions:**
- **High:** 0-2 critical issues, <5 high-severity, mapping ready for production
- **Medium:** 3-5 critical issues OR 5-10 high-severity, needs revision before use
- **Low:** >5 critical issues OR >10 high-severity, requires substantial rework

---

### Section 2: Flagged Issues Table

**Format:**
| market_id | statistical_area | issue_type | severity | description | suggested_fix |
|-----------|-----------------|------------|----------|-------------|---------------|
| [ID] | [Name/Code] | [Type] | [C/H/M/L] | [What's wrong] | [How to fix] |

**Issue type taxonomy:**
- `missing_primary` — Market lacks primary statistical area
- `invalid_identifier` — CBSA code or FIPS code wrong/missing
- `overaggregation` — Large CBSA loses granular market distinctions
- `undercoverage` — Market scope too narrow for known catchment
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

---

### Section 3: Pattern-Level Observations

**Required analyses:**

**3.1 Repeating Issues**
- Which issue types appear most frequently?
- Do certain error patterns cluster around specific geographies?
- Example: "6 markets in Eastern WA all missing county fallback coverage"

**3.2 Geographic Consistency**
- Are Seattle's 5 markets properly split?
- Is Portland-Vancouver integration handled consistently?
- Are Eastern vs Western markets clearly separated by Cascades?

**3.3 Statistical Area Coverage**
- Which CBSAs appear most frequently?
- Are any major CBSAs accidentally omitted?
- Is county usage concentrated in specific regions?

**3.4 Rationale Quality Patterns**
- What % of rationales mention specific barriers/geography?
- What % are generic boilerplate?
- Are rationales consistent across similar markets?

**3.5 Recommendations for Systematic Improvements**
- If multiple markets have same issue type, what's the root cause?
- Are there methodological improvements needed?
- Should any markets be reconsidered at source (markets CSV)?

---

## Execution Workflow

### Step 1: Pre-Check (5 min)
- Load all 4 reference files
- Count markets in CSV (should be 22 for Pacific NW)
- Count markets in mapping file (should match)
- Flag any immediate discrepancies

### Step 2: Dimension-by-Dimension Review (30-45 min)

For EACH dimension (1-9):
1. Review every market against that dimension's criteria
2. Flag issues in working notes with severity
3. Document pattern observations
4. Identify root causes if issues cluster

### Step 3: Cross-Cutting Analysis (15 min)
- Review Seattle metro split (5 markets)
- Review Portland-Vancouver integration
- Review Eastern markets isolation
- Verify ferry-dependent market separation

### Step 4: Compile Findings (15 min)
- Assign final severity ratings
- Write executive summary
- Format flagged issues table
- Document pattern observations
- Generate recommendations

### Step 5: Confidence Rating (5 min)
- Count issues by severity
- Assess systemic vs isolated problems
- Assign overall confidence (High/Medium/Low)
- Write confidence rationale

**Total time: 70-85 minutes for thorough QA**

---

## What You Must NOT Do

**Prohibited actions:**
- ❌ Redefine markets or create new market_ids
- ❌ Modify the mapping file directly
- ❌ Resolve ambiguity by making assumptions
- ❌ Optimize for completeness over accuracy
- ❌ Suppress issues to make findings "cleaner"
- ❌ Create corrective mappings (only describe needed fixes)

**Your role is to surface problems, not solve them.**

---

## Decision Frameworks for Edge Cases

### Framework 1: When County vs CBSA Is Unclear

**Ask:**
1. Does a CBSA/micro exist for this area? → If NO, county is correct
2. Is the CBSA being split across multiple markets? → If YES, county is correct
3. Does the CBSA extend beyond reasonable routine-care range? → If YES, county may be correct

**If all NO:** Flag as improper county use

---

### Framework 2: When Primary vs Secondary Is Unclear

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

### Framework 3: When Market Redundancy Is Suspected

**Indicators of redundancy:**
1. Two markets have identical statistical area assignments
2. Two markets' rationales describe same geography
3. One market explicitly notes it "may be redundant"

**Action:**
- Flag both markets in findings
- Recommend which to keep based on anchor strength
- Note that fixing redundancy requires markets CSV revision, not mapping revision

---

### Framework 4: When Barrier Crossing Is Ambiguous

**Absolute barriers (always separate markets):**
- Cascade Mountains east-west
- Ferry-only access (60+ min crossing)
- >150 mile distance

**Moderate barriers (evaluate case-by-case):**
- Lake Washington (bridges may integrate)
- State borders (may integrate if CBSA crosses)
- Congestion corridors (may still be <45 min)

**Test:** Does the barrier make routine care >45 min door-to-door?

---

## Final Instruction

Evaluate this mapping as if it will be used to:
- Justify healthcare price comparisons to employers
- Demonstrate network adequacy to regulators
- Define market concentration for antitrust analysis
- Support provider rate negotiations

**Standard:** If a knowledgeable local stakeholder (hospital CFO, health plan actuary, regional health economist) would reasonably dispute a mapping, it must be flagged.

**Confidence test:** Would you stake your professional reputation on this mapping being correct?

---

## Example QA Finding (Complete)

**Market:** WA-SEATTLE-EASTSIDE

**Issue:**
```
market_id: WA-SEATTLE-EASTSIDE
statistical_area: CBSA 42660 (Seattle-Tacoma-Bellevue WA)
issue_type: overaggregation
severity: HIGH
description: Market maps to entire Seattle-Tacoma CBSA as primary, losing Eastside granularity. This CBSA covers 4M people across Seattle, Tacoma, Bellevue, and Everett. WA-SEATTLE-EASTSIDE was created specifically to separate Eastside (Bellevue/Redmond) from Seattle core due to Lake Washington barrier and distinct anchor systems (Overlake, Evergreen Health). Mapping entire CBSA defeats purpose of granular market design.
suggested_fix: Change primary mapping to County 53033 (King County WA) with rationale specifying "Eastside portion of King County including Bellevue Redmond Kirkland across Lake Washington from Seattle core served by Overlake Medical Center and Evergreen Health via I-90 SR-520 bridge connections"
```

This finding:
- ✅ Identifies specific issue
- ✅ Explains why it matters (context)
- ✅ Assigns severity with justification
- ✅ Provides concrete corrective action
- ✅ References regional geography (Lake Washington, bridges)

---

## Region-Specific Validation Checklist

Before finalizing your QA report, verify:

- [ ] Seattle's 5 markets each map to DISTINCT statistical areas
- [ ] WA-SEATTLE-MAIN, WA-SEATTLE-EASTSIDE, WA-SEATTLE-SOUTHKING all use King County with distinct portions specified
- [ ] WA-SEATTLE-TACOMA uses Pierce County/Tacoma CBSA
- [ ] WA-SEATTLE-EVERETT uses Snohomish County/Everett CBSA
- [ ] OR-PORTLAND and WA-VANCOUVER redundancy is flagged if both map to CBSA 38900
- [ ] All Eastern markets (Spokane, Yakima, Tri-Cities, Walla Walla, Wenatchee) have NO statistical areas west of Cascades
- [ ] WA-BREMERTON is separated from Seattle markets (ferry barrier)
- [ ] Ferry-dependent markets don't map to Seattle metro areas
- [ ] No market crosses Cascade Mountains in primary relationship
- [ ] County usage for Seattle metro splits is justified in rationales
- [ ] All 22 markets from CSV are present in mapping
- [ ] No invalid CBSA codes or FIPS codes
- [ ] Rationales reference specific PNW geography when relevant

---

**End of QA Prompt**
