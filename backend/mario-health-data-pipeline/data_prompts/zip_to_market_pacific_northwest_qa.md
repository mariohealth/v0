# QA Prompt: Validating ZIP → Healthcare Market Mapping (V2.0 - Production)

## CRITICAL: This QA Caught a 25.8% Data Integrity Failure

**Context:** In February 2026, this QA process caught that 259 out of 1,002 ZIP mappings (25.8%) used invalid market IDs, making the data completely unusable. The file had to be fully regenerated.

**This prompt has been updated to:**
1. Catch market ID integrity failures FIRST (before any other analysis)
2. Use automated validation for 100% coverage (not just sampling)
3. Fail fast when critical errors are found (don't continue QA on broken data)
4. Provide actionable fix recommendations (not just flag issues)

---

## Purpose

This prompt validates the **completed ZIP-to-market mapping file** for a specific region.

**Goal:** Verify mappings are **behaviorally realistic, internally consistent, and defensible for healthcare price comparison**.

**Constraint:** This is QA only. Do NOT modify market definitions or rewrite mappings. Flag issues clearly with specific recommended fixes.

---

## QA Philosophy: Fail Fast on Critical Issues

**Priority order for QA:**
1. **Data Integrity (P0)** — Broken data kills the system → Check FIRST
2. **Geographic Accuracy (P1)** — Wrong markets mislead patients → Check SECOND  
3. **Behavioral Realism (P2)** — Refinement issues → Check THIRD
4. **Documentation Quality (P3)** — Nice-to-haves → Check LAST

**If P0 checks fail → STOP QA and block launch immediately.**
- No point checking travel times if market IDs don't exist in the database
- No point sampling ZIPs if 25% of the data is structurally broken

**This is production data. Critical failures require complete regeneration, not patches.**

---

## Required Files (You Must Have All Four)

Before starting QA, confirm you have:

1. ✅ **`master_market.md`** — National framework (45-minute rule, barriers, behavioral principles)
2. ✅ **`markets_<region>.md`** — Regional geography, transit, and mobility factors
3. ✅ **`markets_<region>.csv`** — Authoritative list of valid market_ids (your source of truth)
4. ✅ **`zip_to_market_<region>.csv`** — The file under review

**If any file is missing → Request it before starting QA.**

---

## Phase 1: Automated Data Integrity Checks (100% Coverage, MANDATORY)

**Run these checks on EVERY row before any manual sampling.**

These checks are automated, fast, and catch systematic failures that manual sampling might miss.

### Check 1.1: Market ID Validity (CRITICAL - P0)

**What:** Every market_id in the ZIP file must exist in markets_<region>.csv

**Why:** Invalid market IDs cause database JOIN failures, making data unusable

**How:**
```python
# Load valid market IDs from authoritative source
valid_markets = set(row['market_id'] from markets_<region>.csv)

# Check every ZIP mapping
invalid_refs = []
for row in zip_file:
    if row['market_id'] not in valid_markets:
        invalid_refs.append((row['zip_code'], row['market_id']))

# Report
if invalid_refs:
    FAIL: Report all invalid IDs with counts
else:
    PASS
```

**Pass Criteria:** Zero invalid market_id references (100% pass rate required)

**If this check fails:**
- ❌ **BLOCK LAUNCH IMMEDIATELY**
- Calculate % of rows affected
- List all invalid market IDs with usage counts
- **STOP ALL OTHER QA** — This is a complete regeneration scenario
- Provide market ID translation table for fixing

**Output Format:**
```
CHECK 1.1: Market ID Validity
Status: [PASS / FAIL]
Invalid references: [N] rows ([X]% of total)

Invalid market IDs found:
  - 'WA-SEATTLE-CORE': Used in 87 rows (should be 'WA-SEATTLE-MAIN')
  - 'WA-SEATTLE-SOUTH': Used in 52 rows (should be 'WA-SEATTLE-SOUTHKING')
  - 'WA-TACOMA': Used in 43 rows (should be 'WA-SEATTLE-TACOMA')
  ...

ACTION REQUIRED: Complete file regeneration using correct market IDs from markets_<region>.csv
```

---

### Check 1.2: Primary Market Completeness (CRITICAL - P0)

**What:** Every ZIP must have exactly one (not zero, not multiple) primary market

**Why:** Primary market drives price comparison queries; missing/multiple primaries break the system

**How:**
```python
# Count primaries per ZIP
zip_primaries = defaultdict(list)
for row in zip_file where relationship_type == 'primary':
    zip_primaries[row['zip_code']].append(row['market_id'])

# Check for issues
all_zips = unique zip_codes in file
missing_primary = all_zips - zip_primaries.keys()
multiple_primary = {z: markets for z, markets in zip_primaries if len(markets) > 1}

# Report
if missing_primary or multiple_primary:
    FAIL: Report affected ZIPs
else:
    PASS
```

**Pass Criteria:** Every ZIP has exactly one primary market (100% pass rate required)

**If this check fails:**
- ❌ **BLOCK LAUNCH** — Data integrity violation
- List all ZIPs with missing primaries
- List all ZIPs with multiple primaries
- **STOP OTHER QA** — Must fix before continuing

**Output Format:**
```
CHECK 1.2: Primary Market Completeness
Status: [PASS / FAIL]

ZIPs with zero primaries: [N]
  - [ZIP1], [ZIP2], [ZIP3] ...
  
ZIPs with multiple primaries: [N]
  - ZIP [ZIP]: ['MARKET-A', 'MARKET-B']
  - ZIP [ZIP]: ['MARKET-C', 'MARKET-D']

ACTION REQUIRED: Assign exactly one primary market to each ZIP
```

---

### Check 1.3: Required Columns Present (CRITICAL - P0)

**What:** Verify all required columns exist with correct names

**Required columns:**
- `zip_code` (5-digit string)
- `market_id` (string, must match markets file)
- `relationship_type` (must be: primary, secondary, or tertiary)
- `mapping_rationale` (non-empty string)

**Pass Criteria:** All required columns present and properly named

**Output Format:**
```
CHECK 1.3: Required Columns
Status: [PASS / FAIL]

Missing columns: [List]
Incorrect column names: [List with corrections]
Invalid relationship_type values: [Count and examples]
```

---

### Check 1.4: Data Format Validation (HIGH - P1)

**What:** Check for formatting issues that break parsing

**Validations:**
- ZIP codes are 5-digit strings (not 4-digit, not 6-digit)
- No duplicate rows (same zip_code + market_id + relationship_type)
- No empty required fields
- Properly formatted CSV (commas, quotes handled correctly)

**Pass Criteria:** Zero formatting errors

**Output Format:**
```
CHECK 1.4: Data Format Validation
Status: [PASS / FAIL]

Invalid ZIP codes: [Count and examples]
Duplicate rows: [Count and examples]
Empty required fields: [Count and examples]
CSV formatting errors: [Description]
```

---

### Check 1.5: Market Coverage Completeness (MEDIUM - P1)

**What:** Verify every market in markets_<region>.csv has at least one ZIP assigned

**Why:** If a market has zero ZIPs, either:
- The market definition is wrong (should be removed from markets file), OR
- The mapping is incomplete (ZIPs should be assigned to it)

**Pass Criteria:** All markets have at least one ZIP, OR documented reason for zero ZIPs

**Output Format:**
```
CHECK 1.5: Market Coverage Completeness
Status: [PASS / FAIL with warnings]

Markets with zero ZIPs assigned: [N]
  - [MARKET-ID]: [Expected catchment area from markets.csv notes]
  - [MARKET-ID]: [Expected catchment area]

ASSESSMENT: [Are these legitimately empty, or is mapping incomplete?]
```

---

### Check 1.6: Excessive Secondary Mapping (MEDIUM - P1)

**What:** Flag ZIPs with 3+ total markets (primary + secondaries)

**Why:** 3+ markets suggests over-mapping, imprecision, or lack of clear primary

**Threshold:**
- 0-2 total markets per ZIP: Normal
- 3 total markets: Review recommended
- 4+ total markets: Flag as over-mapping

**Pass Criteria:** <5% of ZIPs have 3+ markets, <1% have 4+ markets

**Output Format:**
```
CHECK 1.6: Excessive Secondary Mapping
Status: [PASS / WARNING / FAIL]

ZIPs with 3 markets: [N] ([X]%)
ZIPs with 4+ markets: [N] ([X]%)

Top over-mapped ZIPs:
  - ZIP [ZIP]: [N] markets - [List markets]
  - ZIP [ZIP]: [N] markets - [List markets]

PATTERN: [Is this systematic or isolated cases?]
```

---

## DECISION GATE: Continue or Stop?

**After completing Phase 1 automated checks:**

### ❌ STOP QA if:
- Check 1.1 (Market ID Validity) failed
- Check 1.2 (Primary Completeness) failed
- Check 1.3 (Required Columns) failed

**Rationale:** These are data integrity failures. Manual QA on broken data is pointless. File requires complete regeneration.

### ⚠️ Continue with caution if:
- Check 1.4 (Data Format) had minor issues (e.g., 1-2 bad ZIP codes)
- Check 1.5 (Market Coverage) has 1-2 empty markets with valid reasons
- Check 1.6 (Over-mapping) affects <10% of ZIPs

### ✅ Proceed to Phase 2 if:
- All Phase 1 checks passed
- Ready for manual sampling and behavioral validation

---

## Phase 2: Strategic Manual Sampling (Smart Sampling, ~120-150 ZIPs)

**Only proceed to Phase 2 if Phase 1 passed.**

### Sampling Strategy: Maximize Issue Detection

You cannot review every ZIP individually. Use stratified sampling to catch different types of errors.

**Sample Categories:**

#### Category A: Boundary ZIPs (30-50 samples)
**What:** ZIPs on market edges, likely to have ambiguous assignments
**Examples:** 
- Cross-border ZIPs (state lines, county lines)
- ZIPs equidistant from two markets
- Edge of metro areas (urban-suburban transition)

**Focus:** Is the primary market choice defensible? Are secondaries appropriate?

#### Category B: Barrier-Crossing ZIPs (20-30 samples)
**What:** ZIPs near geographic barriers that should NOT be crossed
**Region-Specific (Pacific Northwest):**
- Cascade Mountain proximity (must NOT cross east-west)
- Puget Sound water barriers (ferries, Lake Washington)
- Columbia River crossings (Portland-Vancouver integration)
- Tacoma Narrows Bridge (Kitsap Peninsula)

**Focus:** Are documented barriers honored? No invalid barrier crossings?

#### Category C: Transit-Adjacent ZIPs (15-20 samples)
**What:** ZIPs near rail/transit stations
**Region-Specific (Pacific Northwest):**
- Sounder stations (Seattle-Tacoma-Everett corridor)
- Link Light Rail coverage (Seattle, SeaTac)
- MAX Light Rail (Portland metro, Vancouver WA)

**Focus:** Is transit impact realistic? Not over-weighted? Actually serves hospitals?

#### Category D: Core Urban ZIPs (10-15 samples)
**What:** High-population downtown areas with clear dominant markets
**Examples:**
- Downtown Seattle (981xx)
- Downtown Portland (972xx)
- Downtown Spokane (992xx)
- Downtown Tacoma (984xx)

**Focus:** Clear, unambiguous primary markets? No unexpected assignments?

#### Category E: Rural/Remote ZIPs (15-20 samples)
**What:** Low-density areas with longer travel times
**Region-Specific (Pacific Northwest):**
- Eastern WA (Spokane sphere, Tri-Cities, Wenatchee, Yakima)
- Eastern OR (Pendleton, La Grande, Bend)
- Olympic Peninsula (ferry-isolated)
- Central OR High Desert

**Focus:** Realistic travel times (may exceed 45 min)? Appropriate secondary markets for specialty referrals?

#### Category F: Random Sample (20-30 samples)
**What:** ZIPs selected randomly across all markets
**Purpose:** Detect systematic issues not caught by targeted sampling

**Selection:** Use random number generator to select ZIPs from each market

---

### Manual Review Dimensions (For Each Sampled ZIP)

#### Dimension 1: Primary Market Validity ⭐ (HIGHEST PRIORITY)

**Question:** Would a local resident actually use this market for routine care?

**How to evaluate:**
1. Estimate door-to-door travel time:
   - Google Maps "typical traffic" (Tuesday 10am or Wednesday 2pm)
   - Add parking time (5-10 min urban, 2-5 min suburban)
   - Add walking to entrance (3-5 min)
2. Check for barriers:
   - Water crossings (ferries, bridges)
   - Mountain passes (seasonal closures)
   - Chronic congestion corridors
3. Verify dominant hospital system in area

**Pass criteria:**
- Travel time ≤45 min for urban/suburban ZIPs
- Travel time ≤60 min for rural ZIPs (with documented reason)
- No geographic barriers blocking access
- Aligns with known hospital system dominance

**Flag if:**
- Travel time >45 min for routine care (urban/suburban)
- Ferry or mountain pass required (should be separate market)
- "Aspirational" assignment (patient wouldn't actually go there)
- Ignores documented barriers from regional prompt

**Severity:** HIGH (primary market errors directly mislead patients)

---

#### Dimension 2: Secondary Market Discipline (MEDIUM PRIORITY)

**Question:** Are secondary markets justified by actual referral patterns or transit?

**Valid reasons for secondary:**
- Specialty care spillover (primary lacks specialists)
- Alternative transit access (one-seat ride to major medical center)
- Border ZIP serving two markets (equidistant)
- Academic medical center referral (complex cases)

**Invalid reasons for secondary:**
- "Just in case" mapping (no evidence)
- Arbitrary geographic proximity
- Commuter rail that doesn't serve hospitals
- >60 min travel with no referral relationship

**Pass criteria:**
- 0-1 secondary markets per ZIP (most common)
- 2 secondary markets (acceptable for border ZIPs)
- Clear rationale in mapping_rationale field

**Flag if:**
- 3+ secondary markets (over-mapping)
- Secondary market farther than 60 min
- Transit doesn't actually serve hospitals
- No evidence of referral pattern

**Severity:** MEDIUM (over-mapping clutters results but doesn't break system)

---

#### Dimension 3: Geographic Barrier Compliance (HIGH PRIORITY)

**Question:** Are documented regional barriers honored in assignments?

**Region-Specific (Pacific Northwest):**

**ABSOLUTE BARRIERS (Never Cross):**
- ✅ Cascade Mountains (no east-west crossings for routine care)
- ✅ Ferry-dependent islands (separate markets from mainland)
- ✅ State borders (except documented cross-border markets)

**FRICTION BARRIERS (May Split Markets):**
- ⚠️ Lake Washington (Seattle ↔ Eastside decision)
- ⚠️ Puget Sound limited crossings (Tacoma Narrows Bridge)
- ⚠️ Columbia River (Portland ↔ Vancouver WA integration decision)

**Pass criteria:**
- Zero Cascade Mountain crossings for primary markets
- Ferry ZIPs separate from mainland markets
- State borders honored (except OR-PORTLAND includes Vancouver WA)
- Lake Washington decision (integrate or split) applied consistently

**Flag if:**
- Eastern WA ZIP assigned to Seattle market (Cascade violation)
- Ferry-dependent ZIP assigned to mainland market (barrier violation)
- State border crossed without documented integration
- Inconsistent Lake Washington treatment

**Severity:** HIGH (barrier violations create unrealistic assignments)

---

#### Dimension 4: Transit Realism (MEDIUM PRIORITY)

**Question:** If transit is cited as rationale, does it actually enable healthcare access?

**Transit reality check:**
- Does transit route actually go to/near hospitals?
- Are headways ≤15 minutes (high frequency)?
- Is it single-seat or one-transfer?
- Do residents actually use it for medical appointments (not just commuting)?

**Region-Specific (Pacific Northwest):**

**Sounder (Seattle commuter rail):**
- Serves work commutes (Seattle ↔ Tacoma ↔ Everett)
- Some stations near hospitals
- Should NOT automatically integrate markets

**Link Light Rail (Seattle):**
- Serves Seattle core, SeaTac, expanding to Tacoma
- Some coverage of medical areas
- May justify SOME secondary assignments

**MAX Light Rail (Portland):**
- Extensive Portland metro coverage
- Crosses to Vancouver WA
- Strong case for Portland-Vancouver integration

**Pass criteria:**
- Transit cited only when it materially reduces friction
- Rationale explains specific route/connection
- Not over-relied upon (most care is car-based)

**Flag if:**
- Sounder cited as reason to merge Seattle-Tacoma-Everett (too far)
- Commuter rail assumed to serve medical trips (usually doesn't)
- Transit creates unrealistic long-distance integration

**Severity:** MEDIUM (mis-use of transit creates marginal assignments)

---

#### Dimension 5: Rationale Quality (LOW PRIORITY)

**Question:** Is the mapping_rationale clear, specific, and locally grounded?

**Good rationale characteristics:**
- Mentions specific hospital systems
- Includes approximate travel time
- Notes relevant barriers or transit
- 1-2 sentences (concise)

**Examples of good rationales:**
```
"Bellevue ZIP uses Overlake Medical Center within 10-min drive"
"Ferry-dependent island requires 35-min crossing, separate from Seattle"
"Red Line enables access to Longwood medical area for specialty care"
```

**Examples of weak rationales:**
```
"Close to market" (vague, no specifics)
"Serves area" (tautological)
"Primary market" (states the obvious)
```

**Pass criteria:**
- Rationale is specific and locally grounded
- Mentions relevant systems, times, or barriers
- Concise (≤2 sentences)

**Flag if:**
- Generic/vague rationale
- Missing key context (e.g., ferry time, barrier)
- Overly verbose (>3 sentences)

**Severity:** LOW (doesn't affect correctness, just documentation quality)

---

## Phase 3: Pattern-Level Analysis

**After completing manual sampling, look for systematic patterns.**

### Pattern Analysis Questions:

#### 3.1 Geographic Patterns

**Puget Sound Water Barriers:**
- Are ferry-dependent ZIPs consistently separate from Seattle?
- Is Lake Washington treatment consistent (integrate or split)?
- Are limited bridge crossings (Tacoma Narrows) handled correctly?

**Cascade Mountain Barrier:**
- Zero east-west crossings for primary markets?
- Eastern WA/OR independent from Western WA/OR?
- Mountain pass ZIPs assigned to correct side?

**Portland-Vancouver Integration:**
- Was integration or separation chosen?
- Is it applied consistently across all Vancouver WA ZIPs (986xx)?
- Is MAX light rail rationale valid if integrated?

#### 3.2 Market-Specific Patterns

**Seattle Metro:**
- How was Seattle Core vs Eastside split handled?
- Is Tacoma (35 mi south) kept separate from Seattle?
- Is Everett (30 mi north) kept separate from Seattle?
- Is South King County defined consistently?

**Eastern WA/OR:**
- Are rural markets properly independent (Spokane, Wenatchee, Yakima, Tri-Cities)?
- Do they have appropriate specialty referral secondaries?
- Are travel times realistic for low-density areas?

#### 3.3 Methodology Observations

**Strengths:**
- What was done particularly well?
- Which types of ZIPs have consistently good assignments?
- Are rationales generally high quality?

**Weaknesses:**
- What systematic risks or recurring errors exist?
- Which types of ZIPs have problematic assignments?
- Are there conceptual misunderstandings of regional geography?

---

## Required QA Output Format

### STRUCTURE: Executive Summary → Systematic Checks → Manual Findings → Recommendations

---

## QA FINDINGS REPORT: [Region] ZIP-to-Market Mapping

**Date:** [Date]  
**Region:** [Region name] ([State codes])  
**File Reviewed:** `zip_to_market_<region>.csv`  
**Total ZIPs in File:** [N]  
**Manual Sample Size:** [N ZIPs reviewed]

---

## EXECUTIVE SUMMARY

**Overall Assessment:** [HIGH CONFIDENCE / MEDIUM CONFIDENCE / LOW CONFIDENCE / CRITICAL FAILURE]

**Launch Recommendation:**
- ✅ **APPROVE FOR LAUNCH** — Mappings are defensible with minor issues
- ⚠️ **CONDITIONAL APPROVAL** — Launch with documented limitations, fix in v1.1
- ❌ **BLOCK LAUNCH** — Critical errors require immediate correction before any launch

**Key Findings (2-3 sentences):**
- [Most critical finding]
- [Second most critical finding]
- [Overall quality assessment]

**Required Actions Before Launch:** [Number and severity of fixes needed]

**Confidence Level Rationale:**
[1-2 sentences explaining why you have high/medium/low confidence in the mappings]

---

## SECTION 1: AUTOMATED DATA INTEGRITY CHECKS (Phase 1)

**Purpose:** 100% coverage automated validation catches systematic failures

---

### CHECK 1.1: Market ID Validity ⚠️ CRITICAL

**Status:** [✅ PASS / ❌ FAIL]

**Invalid market_id references:** [N] rows ([X]% of total)

**If FAIL, detail:**
```
Invalid market IDs found:
  - '[INVALID-ID]': Used in [N] rows (should be '[VALID-ID]')
  - '[INVALID-ID]': Used in [N] rows (should be '[VALID-ID]')
  
Sample invalid references:
  - ZIP [ZIP]: '[INVALID-ID]'
  - ZIP [ZIP]: '[INVALID-ID]'
  
Market ID translation table:
| Invalid ID Used | Valid ID from markets.csv | Action Required |
|-----------------|---------------------------|-----------------|
| [INVALID]       | [VALID]                   | Find/replace    |
| [INVALID]       | [VALID]                   | Find/replace    |
```

**If PASS:**
```
✅ All [N] rows use valid market IDs from markets_<region>.csv
✅ Character-for-character exact matches confirmed
```

**Impact if FAIL:**
- ❌ Database JOINs will fail for affected rows
- ❌ Price queries will return errors/nulls
- ❌ Product non-functional for [X]% of region population

**Action Required if FAIL:**
- ❌ BLOCK LAUNCH immediately
- Complete file regeneration using correct market IDs
- Do NOT attempt to patch—systematic error requires rebuild

---

### CHECK 1.2: Primary Market Completeness ⚠️ CRITICAL

**Status:** [✅ PASS / ❌ FAIL]

**ZIPs with zero primaries:** [N]  
**ZIPs with multiple primaries:** [N]

**If FAIL, detail:**
```
ZIPs with zero primaries: [N]
  - [ZIP], [ZIP], [ZIP] ... (list first 10)
  
ZIPs with multiple primaries: [N]
  - ZIP [ZIP]: ['MARKET-A', 'MARKET-B']
  - ZIP [ZIP]: ['MARKET-C', 'MARKET-D']
  ... (list first 10)
```

**If PASS:**
```
✅ All [N] ZIPs have exactly one primary market
✅ Zero ZIPs with missing primaries
✅ Zero ZIPs with multiple primaries
```

**Impact if FAIL:**
- ❌ System cannot determine primary market for queries
- ❌ Affected ZIPs return no results or ambiguous results

**Action Required if FAIL:**
- ❌ BLOCK LAUNCH
- Assign exactly one primary to each affected ZIP
- Review mapping methodology for systematic error

---

### CHECK 1.3: Required Columns Present

**Status:** [✅ PASS / ❌ FAIL]

**Missing columns:** [List or "None"]  
**Incorrect names:** [List with corrections or "None"]  
**Invalid relationship_type values:** [Count and examples or "None"]

**If PASS:**
```
✅ All required columns present: zip_code, market_id, relationship_type, mapping_rationale
✅ All relationship_type values valid (primary/secondary/tertiary)
✅ No empty required fields
```

---

### CHECK 1.4: Data Format Validation

**Status:** [✅ PASS / ⚠️ WARNING / ❌ FAIL]

**Invalid ZIP codes:** [Count and examples]  
**Duplicate rows:** [Count and examples]  
**Empty required fields:** [Count and examples]  
**CSV formatting errors:** [Description]

---

### CHECK 1.5: Market Coverage Completeness

**Status:** [✅ PASS / ⚠️ WARNING / ❌ FAIL]

**Markets with zero ZIPs assigned:** [N]

**If any, detail:**
```
Unused markets: [N]
  - [MARKET-ID]: Expected catchment [description from markets.csv]
  - [MARKET-ID]: Expected catchment [description]
  
Assessment: [Are these legitimately empty or is mapping incomplete?]
```

---

### CHECK 1.6: Excessive Secondary Mapping

**Status:** [✅ PASS / ⚠️ WARNING / ❌ FAIL]

**ZIPs with 3 markets:** [N] ([X]%)  
**ZIPs with 4+ markets:** [N] ([X]%)

**If flagged, detail:**
```
Top over-mapped ZIPs:
  - ZIP [ZIP]: [N] markets - [List]
  - ZIP [ZIP]: [N] markets - [List]
  
Pattern: [Systematic across border regions OR isolated cases?]
```

---

## DECISION GATE RESULT

**Based on Phase 1 automated checks:**

[✅ PROCEED TO PHASE 2 / ⚠️ CONTINUE WITH CAUTION / ❌ STOP QA]

**Rationale:**
[1-2 sentences explaining why continuing or stopping]

---

## SECTION 2: MANUAL SAMPLE REVIEW FINDINGS (Phase 2)

**Sample Distribution:**
- Boundary ZIPs: [N] reviewed
- Barrier-crossing ZIPs: [N] reviewed
- Transit-adjacent ZIPs: [N] reviewed
- Core urban ZIPs: [N] reviewed
- Rural/remote ZIPs: [N] reviewed
- Random sample: [N] reviewed
- **Total:** [N] ZIPs reviewed ([X]% of total)

---

### 2.1 HIGH-SEVERITY ISSUES (Must Fix Before Launch)

**Definition:** Issues that directly mislead patients about care access

| ZIP | Market ID | Issue Type | Description | Recommended Fix |
|-----|-----------|------------|-------------|-----------------|
| [ZIP] | [MKT] | Invalid Primary | [Specific problem] | [Specific fix] |
| [ZIP] | [MKT] | Barrier Violation | [Specific problem] | [Specific fix] |
| [ZIP] | [MKT] | Travel Time >60min | [Specific problem] | [Specific fix] |

**Total high-severity issues:** [N] ([X]% of sample)

**Extrapolated to full dataset:** Estimated [N] high-severity issues total

**Impact:** [Description of how these errors would affect patients]

---

### 2.2 MEDIUM-SEVERITY ISSUES (Should Fix, May Be Launch-Blocking if Systematic)

**Definition:** Issues that reduce quality but don't break core functionality

| ZIP | Market ID | Issue Type | Description | Recommended Fix |
|-----|-----------|------------|-------------|-----------------|
| [ZIP] | [MKT] | Over-Mapped | [Specific problem] | [Specific fix] |
| [ZIP] | [MKT] | Weak Secondary | [Specific problem] | [Specific fix] |
| [ZIP] | [MKT] | Transit Over-Relied | [Specific problem] | [Specific fix] |

**Total medium-severity issues:** [N] ([X]% of sample)

**Pattern Analysis:** [Systematic across region OR isolated to specific areas?]

---

### 2.3 LOW-SEVERITY ISSUES (Nice to Fix, Not Launch-Blocking)

**Definition:** Documentation quality, not correctness

| ZIP | Market ID | Issue Type | Description | Recommended Fix |
|-----|-----------|------------|-------------|-----------------|
| [ZIP] | [MKT] | Weak Rationale | [Specific problem] | [Specific fix] |
| [ZIP] | [MKT] | Missing Context | [Specific problem] | [Specific fix] |

**Total low-severity issues:** [N] ([X]% of sample)

---

## SECTION 3: PATTERN-LEVEL OBSERVATIONS (Phase 3)

### 3.1 Geographic Patterns

**[Region-Specific Barrier 1] (e.g., Cascade Mountains):**
- Compliance: [Excellent / Good / Poor]
- Observations: [How well were barriers honored?]
- Issues found: [Count and description]

**[Region-Specific Barrier 2] (e.g., Puget Sound Water):**
- Compliance: [Excellent / Good / Poor]
- Observations: [Ferry handling, bridge crossings, etc.]
- Issues found: [Count and description]

**[Region-Specific Decision] (e.g., Portland-Vancouver):**
- Approach taken: [Integration / Separation]
- Consistency: [Applied consistently across all relevant ZIPs?]
- Rationale quality: [Strong / Adequate / Weak]

### 3.2 Market-Specific Patterns

**[Major Market 1] (e.g., Seattle Metro):**
- How handled: [Core vs Eastside split, Tacoma separation, etc.]
- Quality: [High / Medium / Low]
- Issues: [Description]

**[Major Market 2] (e.g., Eastern WA):**
- Independence maintained: [Yes / No / Partial]
- Rural travel times: [Realistic / Optimistic]
- Specialty referrals: [Appropriate / Missing / Over-mapped]

### 3.3 Methodology Observations

**Strengths (Top 3):**
1. [What was done particularly well?]
2. [What types of ZIPs have consistently good assignments?]
3. [Other strengths]

**Weaknesses (Top 3):**
1. [What systematic risks exist?]
2. [What recurring errors were found?]
3. [Other weaknesses]

**Overall Methodology Assessment:**
[2-3 sentences on whether the mapper understood regional geography, followed rules, applied good judgment]

---

## SECTION 4: STATISTICAL SUMMARY

### Sample Quality Metrics

**Primary market validity pass rate:** [X]% (target: ≥95%)  
**Secondary market discipline pass rate:** [X]% (target: ≥90%)  
**Geographic barrier compliance:** [X]% (target: ≥98%)  
**Transit realism pass rate:** [X]% (target: ≥95%)  
**Over-mapping rate:** [X]% of ZIPs with 3+ markets (target: ≤5%)

### Projections to Full Dataset

**Based on sample findings:**
- **Estimated high-severity issues in full dataset:** [N] (calculation method)
- **Estimated medium-severity issues in full dataset:** [N] (calculation method)
- **Confidence interval:** [Range] at 95% confidence

**Methodology for projection:**
[Explain how you extrapolated from sample to full dataset]

---

## SECTION 5: RECOMMENDATIONS

### Immediate Actions (Before Launch)

**If approved for launch:**
1. [Fix all high-severity issues - specific count and areas]
2. [Fix systematic medium-severity patterns - specific areas]
3. [Document any known limitations]

**If conditionally approved:**
1. [Fix most critical high-severity issues]
2. [Document remaining issues for v1.1]
3. [Set up monitoring to validate assumptions]

**If blocked:**
1. [Complete file regeneration with specific focus areas]
2. [Re-run Phase 1 automated checks before manual QA]
3. [Pay special attention to: specific geographic areas]

### Post-Launch Improvements (v1.1)

1. [Medium-severity issues to address in next version]
2. [Rationale quality improvements]
3. [Additional secondary markets to consider based on user feedback]

### Monitoring & Validation

**How to validate assumptions in production:**
- [User behavior tracking - which markets do they actually query?]
- [Error rate monitoring - null results or failed lookups?]
- [User feedback - complaints about unrealistic markets?]

**Metrics to track:**
- [Specific metrics based on findings]

**How to prioritize fixes:**
- [Framework for deciding what to fix first based on usage data]

---

## SECTION 6: LAUNCH DECISION FRAMEWORK

### ✅ APPROVE FOR LAUNCH IF:

**Data Integrity:**
- ✅ Market ID validity: 100% pass
- ✅ Primary completeness: 100% pass
- ✅ Required columns: All present

**Quality Metrics:**
- ✅ High-severity issues: ≤5 issues OR clear pattern with batch fix identified
- ✅ Medium-severity issues: ≤20 issues AND non-systematic
- ✅ Sample pass rates: ≥90% on key dimensions

**Overall:** Mappings are defensible, minor issues can be fixed post-launch or in v1.1

---

### ⚠️ CONDITIONAL APPROVAL IF:

**Data Integrity:**
- ✅ Market ID validity: 100% pass (non-negotiable)
- ✅ Primary completeness: 100% pass (non-negotiable)
- ⚠️ Minor format issues: <1% of rows affected

**Quality Metrics:**
- ⚠️ High-severity issues: 6-15 issues with fixes identified
- ⚠️ Medium-severity issues: 21-50 issues, some patterns but manageable
- ⚠️ Sample pass rates: 80-89% on key dimensions

**Conditions for launch:**
1. Document known limitations clearly
2. Fix most critical high-severity issues before launch
3. Commit to v1.1 fix schedule for remaining issues
4. Set up monitoring to validate assumptions

---

### ❌ BLOCK LAUNCH IF:

**Data Integrity:**
- ❌ Market ID validity: ANY failures (makes data unusable)
- ❌ Primary completeness: ANY failures (breaks system queries)
- ❌ Required columns: Missing or incorrect

**Quality Metrics:**
- ❌ High-severity issues: >15 issues OR fundamental methodology flaw
- ❌ Medium-severity issues: >50 issues OR systematic pattern indicating flawed approach
- ❌ Sample pass rates: <80% on key dimensions

**Why blocked:**
- Not defensible to patients, providers, or health plans
- Would mislead users about realistic care options
- Requires complete regeneration, not patches

---

## APPENDIX A: DETAILED FLAGGED ZIPS

[Complete table of all flagged ZIPs with full details, organized by severity]

| Severity | ZIP | Market ID | Issue | Description | Fix |
|----------|-----|-----------|-------|-------------|-----|
| HIGH | [ZIP] | [MKT] | [Type] | [Detail] | [Action] |
| HIGH | [ZIP] | [MKT] | [Type] | [Detail] | [Action] |
| MEDIUM | [ZIP] | [MKT] | [Type] | [Detail] | [Action] |
| ... | ... | ... | ... | ... | ... |

---

## APPENDIX B: VALIDATION SCRIPT OUTPUT

[Paste full output of automated validation script for documentation]

```
[Script output showing all automated check results]
```

---

## APPENDIX C: SAMPLE ZIPS REVIEWED

[List of all manually reviewed ZIPs for audit trail]

**Boundary ZIPs ([N]):**
[ZIP], [ZIP], [ZIP] ...

**Barrier-crossing ZIPs ([N]):**
[ZIP], [ZIP], [ZIP] ...

**Transit-adjacent ZIPs ([N]):**
[ZIP], [ZIP], [ZIP] ...

**Core urban ZIPs ([N]):**
[ZIP], [ZIP], [ZIP] ...

**Rural/remote ZIPs ([N]):**
[ZIP], [ZIP], [ZIP] ...

**Random sample ([N]):**
[ZIP], [ZIP], [ZIP] ...

---

## QA CERTIFICATION

**Reviewed by:** [Name/Role]  
**Date completed:** [Date]  
**Hours invested:** [Hours]  
**Confidence in assessment:** [High / Medium / Low]  
**Recommendation:** [APPROVE / CONDITIONAL / BLOCK]

**QA Checklist:**
- [ ] Phase 1 automated checks completed (100% coverage)
- [ ] Phase 2 manual sampling completed (~120-150 ZIPs)
- [ ] Phase 3 pattern analysis completed
- [ ] Launch decision framework applied
- [ ] Recommendations are specific and actionable
- [ ] Validation script output documented

---

**Report Version:** 2.0 (Production)  
**Template Last Updated:** February 2026  
**Changes from V1.0:** Fail-fast on data integrity, automated checks first, clear decision gates, actionable recommendations
