# QA Prompt: Validating ZIP → Healthcare Market Mapping (Pacific Northwest)

## Purpose
This prompt validates the **completed ZIP-to-market mapping file** for the **Pacific Northwest region (Washington and Oregon)**.

**Goal:** Verify mappings are **behaviorally realistic, internally consistent, and defensible for healthcare price comparison**.

**Constraint:** This is QA only. Do NOT modify market definitions or rewrite mappings. Flag issues; don't fix them.

---

## Execution Strategy: Smart Sampling, Not Exhaustive Review

**CRITICAL:** You cannot feasibly review every ZIP individually. Use stratified sampling to maximize issue detection:

### Mandatory Sample Categories (Review ALL of these)

1. **Boundary ZIPs** (30-50 samples)
   - ZIPs on market edges (likely to have ambiguous assignments)
   - Cross-border ZIPs (WA/OR state line, especially Portland-Vancouver)
   - Ferry-dependent ZIPs (Bainbridge, Vashon, Whidbey, San Juan Islands)
   - Lake Washington crossings (Seattle ↔ Eastside via I-90/SR-520)

2. **Barrier-Crossing ZIPs** (20-30 samples)
   - Cascade Mountain proximity (should NOT cross east-west)
   - Puget Sound water barriers (verify ferry ZIPs are separate markets)
   - Columbia River crossings (Portland-Vancouver integration)
   - Tacoma Narrows Bridge (Kitsap Peninsula ↔ Tacoma)

3. **Transit-Adjacent ZIPs** (15-20 samples)
   - ZIPs near Sounder stations (Seattle-Tacoma-Everett corridor)
   - Link Light Rail coverage area (Seattle core, SeaTac, future Tacoma)
   - MAX Light Rail (Portland metro, including Vancouver WA)
   - Verify transit is NOT creating unrealistic integration

4. **High-Population Core ZIPs** (10-15 samples)
   - Downtown Seattle (981xx)
   - Downtown Portland (972xx)
   - Downtown Tacoma (984xx)
   - Downtown Spokane (992xx)
   - Should have clear, unambiguous primary markets

5. **Rural/Remote ZIPs** (15-20 samples)
   - Eastern WA (Spokane sphere)
   - Eastern OR (Pendleton, La Grande, Ontario)
   - Olympic Peninsula (ferry-isolated)
   - Central OR High Desert (Bend, Burns)
   - Verify realistic travel times (may exceed 45 min for specialty)

6. **Randomly Selected ZIPs** (20-30 samples)
   - Spread across all markets
   - Detect systematic issues not caught by targeted sampling

**Total Sample: ~120-150 ZIPs out of ~2,500 (5-6% coverage)**

### Systematic Checks (Automated/Quick Review)

1. **Market ID Validity** (100% coverage)
   - Every market_id exists in markets_pacific_northwest.csv
   - Run this as a data integrity check first

2. **Primary Market Completeness** (100% coverage)
   - Every ZIP has exactly one primary market
   - No ZIPs with zero or multiple primaries

3. **Excessive Secondary Mapping** (Flag review)
   - Any ZIP with 3+ secondary markets
   - Any ZIP with tertiary markets
   - Review these for over-mapping

---

## Files You Must Reference

Before starting QA, load and cross-reference:

1. **National Base Prompt** (`master_market.md`)
   - 45-minute rule for routine care
   - Travel friction principles
   - Behavioral realism framework

2. **Regional Market Prompt** (`markets_pacific_northwest.md`)
   - Puget Sound water barriers (ferries, bridges, Lake Washington)
   - Cascade Mountain barrier (absolute east-west split)
   - Transit limitations (Sounder, Link, MAX)
   - Anchor systems by market

3. **Regional Market File** (`markets_pacific_northwest.csv`)
   - Authoritative list of valid market_ids
   - Expected market catchment areas
   - Number of markets (should be 18-25 for this region)

4. **ZIP Mapping File** (`zip_to_market_pacific_northwest.csv`)
   - File under review
   - Should cover all WA and OR residential ZIPs

---

## Role Definition

You are a **Health Economics and Geospatial QA Auditor** with expertise in:
- Pacific Northwest geography and transportation infrastructure
- Healthcare utilization behavior and referral patterns
- Hospital system market dominance
- Statistical sampling and quality assurance methodology

**Your mission:** Identify high-risk mappings that could mislead patients about realistic care options.

**Your output:** Actionable findings report that helps decide: "Can we launch with this, or must we fix it first?"

---

## Regional Context: Pacific Northwest-Specific QA Focus Areas

### 1. Puget Sound Water Barriers (HIGH PRIORITY)

**What to check:**
- **Ferry-dependent ZIPs** (Bainbridge 98110, Vashon 98070, Whidbey Island 982xx, San Juan Islands 982xx)
  - Should be SEPARATE markets from Seattle core
  - 35-60 minute ferry times create hard barriers
  - Flag any ferry ZIP mapped to Seattle core as primary (wrong)

- **Lake Washington crossings** (I-90, SR-520 floating bridges)
  - Seattle ↔ Eastside integration is debatable
  - If mapped together: rationale should mention bridges + transit
  - If separated: both approaches valid, check consistency

**Red flags:**
- Bainbridge Island (98110) mapped to WA-SEATTLE-CORE as primary (should be WA-KITSAP or separate)
- Vashon Island (98070) mapped to WA-SEATTLE-CORE (requires ferry, separate market)
- Mercer Island (98040) unclear on whether it integrates with Seattle or Eastside

### 2. Cascade Mountain Barrier (ABSOLUTE RULE)

**What to check:**
- **No ZIP should have primary markets on BOTH sides of Cascades**
- Eastern WA ZIPs (Spokane, Wenatchee, Yakima, Tri-Cities) must be separate from Western WA
- Eastern OR ZIPs (Bend, Pendleton, Ontario) must be separate from Western OR
- Snoqualmie Pass, Stevens Pass, White Pass create absolute barriers

**Red flags:**
- Any Spokane-area ZIP with Seattle as secondary (280 miles + mountain pass = no)
- Any Eastern OR ZIP with Portland as secondary (150+ miles + mountains = no)
- Cascade foothills ZIPs assigned to wrong side (check carefully)

### 3. Seattle Metro Fragmentation (KNOWN COMPLEXITY)

**What to check:**
- **Seattle Core vs Eastside split** (Lake Washington barrier)
  - Seattle core: 981xx, 982xx ZIPs west of lake
  - Eastside: Bellevue, Redmond, Kirkland (980xx, 980xx) east of lake
  - Decision on integration: both valid if justified

- **Tacoma separation** (35 miles south of Seattle)
  - Tacoma ZIPs should be WA-TACOMA, NOT WA-SEATTLE-CORE
  - Verify 984xx, 983xx ZIPs mapped to Tacoma market

- **Everett separation** (30+ miles north of Seattle)
  - Everett ZIPs should be WA-EVERETT, NOT WA-SEATTLE-CORE
  - Verify 982xx (Snohomish County) mapped appropriately

- **Sounder commuter rail** (Seattle-Tacoma-Everett corridor)
  - May provide SOME friction reduction
  - Should NOT automatically integrate markets
  - Check if rationales over-rely on Sounder for routine care

**Red flags:**
- Tacoma ZIPs mapped to Seattle as primary (too far)
- Everett ZIPs mapped to Seattle as primary (too far)
- South King County ZIPs unclear on Seattle vs Tacoma boundary

### 4. Portland-Vancouver WA Cross-Border Integration (KEY DECISION)

**What to check:**
- **Vancouver WA ZIPs** (986xx)
  - Should they integrate with Portland OR or be separate?
  - MAX Light Rail crosses Columbia River
  - I-5 and I-205 bridges connect metros
  - BUT: State line creates Medicaid/insurance friction

- **Integration indicators** (if mapped together):
  - Vancouver ZIPs have Portland market as primary
  - Rationale mentions MAX, bridges, or economic integration

- **Separation indicators** (if split):
  - Vancouver ZIPs have WA-VANCOUVER or WA-PORTLAND market
  - Rationale mentions state line, insurance networks, licensing

**Either approach valid, check for:**
- Consistency across all Vancouver WA ZIPs
- Clear rationale for the chosen approach

### 5. Eastern WA/OR Independence (RURAL MARKETS)

**What to check:**
- **Each Eastern city is own market** despite low population
  - Spokane (WA-SPOKANE)
  - Wenatchee (WA-WENATCHEE)
  - Yakima (WA-YAKIMA)
  - Tri-Cities (WA-TRICITIES or similar)
  - Bend (OR-BEND)
  - Pendleton, La Grande (OR-PENDLETON, OR-LAGRANDE)

- **Long travel times acceptable** for specialty (60-90 min)
- **NOT acceptable** for routine care (45 min limit)

**Red flags:**
- Eastern ZIPs with >60 min primary market travel time
- Arbitrary consolidation of distant rural areas
- Missing secondary markets for specialty referrals (some long-distance referrals expected)

---

## QA Dimensions: Structured Evaluation Framework

### Dimension 1: Primary Market Validity ⭐ (HIGHEST PRIORITY)

**Question:** Would a local resident use this market for routine care (PCP, imaging, labs)?

**How to evaluate:**
1. Estimate door-to-door travel time under typical weekday traffic
2. Include parking (5-10 min urban, 2-5 min suburban)
3. Include walking to entrance (3-5 min)
4. Check for barriers (water, mountains, congestion)

**Pass criteria:**
- Travel time ≤45 minutes for suburban/urban ZIPs
- Travel time ≤60 minutes for rural ZIPs (more tolerance)
- No geographic barriers blocking access
- Dominant hospital system in area

**Flag if:**
- Travel time >45 min for routine care (urban/suburban)
- Ferry or mountain pass required
- "Aspirational" assignment (patient wouldn't actually go there)

**Example flags:**
- Bad: Bainbridge Island → Seattle Core (requires ferry)
- Bad: Spokane → Seattle (280 miles + mountain pass)
- Good: Bellevue → Eastside (Overlake Medical, 10 min)

---

### Dimension 2: Secondary Market Discipline ⭐ (HIGH PRIORITY)

**Question:** Is there clear justification for secondary markets, or is this over-mapping?

**Valid reasons for secondary:**
1. **Specialty spillover** (primary lacks specialists, 45-60 min to secondary)
2. **Transit-enabled alternative** (light rail/commuter rail to major academic center)
3. **Border ZIP equidistant** (some residents use A, some use B)
4. **Academic referral** (complex cases go to academic center 60+ min away)

**Flag if:**
- **More than 2 secondary markets** (almost always over-mapped)
- **Secondary duplicates primary** (same health system, similar distance)
- **No clear use case** (rationale says "some residents" without specifics)
- **Tertiary markets present** (rarely justified, needs strong rationale)

**Example flags:**
- Bad: Suburban ZIP has 4 secondary markets "for choice"
- Bad: Secondary is same distance as primary with same system
- Good: Bellevue → Seattle as secondary (Lake Washington crossed for specialty via bridges)

---

### Dimension 3: Over-Mapping Detection ⭐ (MEDIUM-HIGH PRIORITY)

**Pattern to detect:** "Boundary anxiety" — mapper gave too many options to avoid hard choices

**Indicators:**
- ZIP has 3+ total markets (primary + secondary)
- Multiple secondary markets with similar characteristics
- Rationale uses vague language ("residents may prefer...")
- Border ZIPs have "one of everything" rather than clear assignment

**Impact:** Dilutes price comparison value (if everything is "shoppable", nothing is meaningful)

**How to flag:**
- Count markets per ZIP
- Flag ZIPs with 4+ total markets for review
- Check if pattern is systematic (entire subregion over-mapped)

---

### Dimension 4: Under-Mapping Detection ⭐ (MEDIUM PRIORITY)

**Pattern to detect:** Missing legitimate secondary markets, especially for specialty care

**Indicators:**
- Border ZIP only has primary (no secondary despite being equidistant)
- Transit-connected ZIP missing academic center as secondary
- Rural ZIP missing distant specialty referral center

**Impact:** Limits patient awareness of legitimate alternatives

**How to flag:**
- Identify ZIPs on known market boundaries with only primary
- Check if transit-adjacent ZIPs are missing obvious secondary markets
- Verify rural ZIPs have specialty referral secondaries (if appropriate)

**Example flags:**
- Potential under-map: Mercer Island (98040) only has primary, but sits between Seattle and Eastside
- Potential under-map: Rural ZIP 90+ min from anchor with no secondary for specialty

---

### Dimension 5: Transit Asymmetry Errors ⭐ (MEDIUM PRIORITY)

**Problem:** Assuming transit that serves peak-direction work commutes also serves reverse-direction healthcare trips

**Pacific Northwest transit patterns:**
- **Sounder** (Seattle-Tacoma-Everett): Peak direction toward Seattle, limited reverse
- **Link Light Rail** (Seattle): Better bidirectional but limited coverage
- **MAX** (Portland): Good coverage, crosses to Vancouver WA

**How to evaluate:**
1. Check if rationale mentions transit
2. Verify transit actually serves hospitals (not just CBD)
3. Check frequency (≥15 min) and directionality
4. Confirm transit is used for medical trips, not just work

**Flag if:**
- Rationale assumes transit enables integration without checking hospital access
- Reverse-direction transit assumed equivalent to peak direction
- Ferry described as "transit" (ferries are hard barriers due to schedules)

**Example flags:**
- Bad: "Sounder enables Tacoma-Seattle integration" (mostly peak-direction commuters)
- Good: "Link Light Rail connects to UW Medical Center" (actually serves hospital)

---

### Dimension 6: Market ID Integrity ⭐ (CRITICAL — AUTO-CHECK)

**Automated check:** Every market_id in the ZIP mapping file must exist in markets_pacific_northwest.csv

**How to check:**
1. Extract unique market_ids from ZIP mapping file
2. Compare against markets_pacific_northwest.csv
3. Flag any that don't match

**Hard failures:**
- Invalid market_id (typo, deprecated, fabricated)
- Market_id from different region
- Empty market_id field

**This should be checked 100% programmatically before manual review**

---

### Dimension 7: Narrative Consistency ⭐ (LOW-MEDIUM PRIORITY)

**Question:** Are rationales specific, consistent, and locally informed?

**Good rationale characteristics:**
- Names specific hospitals or health systems
- Mentions specific travel time or distance
- References specific barriers (ferry, bridge, pass)
- Differentiates between primary/secondary clearly

**Bad rationale characteristics:**
- Generic template language ("residents use hospitals within the market")
- No specifics ("some residents access care")
- Inconsistent across similar ZIPs
- Contradicts relationship_type (says "specialty" but marked primary)

**How to evaluate:**
- Spot-check rationales in each sample category
- Look for template patterns suggesting auto-generation
- Check consistency within market (similar ZIPs should have similar language)

**Flag only egregious cases** — this is lowest priority dimension

---

## Systematic Checks (Run These First)

Before manual sampling, run these automated integrity checks:

### Check 1: Market ID Validity (CRITICAL)
```
For each unique market_id in zip_to_market_pacific_northwest.csv:
  - Verify it exists in markets_pacific_northwest.csv
  - Flag any mismatches as CRITICAL ERROR
```

### Check 2: Primary Market Completeness (CRITICAL)
```
For each zip_code:
  - Count relationship_type = 'primary'
  - Flag if count ≠ 1 (missing primary or multiple primaries)
```

### Check 3: Excessive Secondary Mapping (FLAG FOR REVIEW)
```
For each zip_code:
  - Count total markets (all relationship_types)
  - Flag if count ≥ 4 for manual review
  - Flag if any tertiary markets exist
```

### Check 4: Coverage Completeness (SPOT CHECK)
```
- Verify major cities have ZIPs mapped:
  - Seattle: 981xx, 982xx
  - Portland: 972xx
  - Tacoma: 984xx
  - Spokane: 992xx
  - Eugene: 974xx
  - Salem: 973xx
```

---

## Required QA Output Format

Produce a **QA Findings Report** with the following structure:

---

## QA FINDINGS REPORT: Pacific Northwest ZIP-to-Market Mapping

**Date:** [Date]  
**Region:** Pacific Northwest (WA, OR)  
**File Reviewed:** zip_to_market_pacific_northwest.csv  
**Sample Size:** [X ZIPs manually reviewed] + [systematic checks]

---

### EXECUTIVE SUMMARY

**Overall Confidence Level:** [HIGH / MEDIUM / LOW]

**Launch Recommendation:**
- ✅ **APPROVE FOR LAUNCH** — Mappings are defensible with minor issues
- ⚠️ **CONDITIONAL APPROVAL** — Launch with documented limitations, fix flagged issues in v1.1
- ❌ **BLOCK LAUNCH** — Critical errors require immediate correction

**Key Findings:**
- [1-2 sentence summary of most critical issues]
- [1-2 sentence summary of overall quality]

**Required Actions Before Launch:** [Number of critical fixes needed]

---

### SECTION 1: SYSTEMATIC CHECK RESULTS

#### 1.1 Market ID Validity
- **Status:** [PASS / FAIL]
- **Invalid market_ids found:** [Count]
- **Details:** [List any invalid IDs]

#### 1.2 Primary Market Completeness
- **Status:** [PASS / FAIL]
- **ZIPs with missing primary:** [Count]
- **ZIPs with multiple primaries:** [Count]
- **Details:** [List problem ZIPs]

#### 1.3 Excessive Secondary Mapping
- **ZIPs with 4+ markets:** [Count]
- **ZIPs with tertiary markets:** [Count]
- **Pattern:** [Systematic issue or isolated cases?]

#### 1.4 Major City Coverage
- **Status:** [PASS / FAIL]
- **Missing coverage:** [Any major cities without ZIPs mapped?]

---

### SECTION 2: MANUAL SAMPLE REVIEW FINDINGS

**Sample breakdown:**
- Boundary ZIPs: [X reviewed]
- Barrier-crossing ZIPs: [X reviewed]
- Transit-adjacent ZIPs: [X reviewed]
- Core urban ZIPs: [X reviewed]
- Rural/remote ZIPs: [X reviewed]
- Random sample: [X reviewed]
- **Total:** [X ZIPs reviewed]

---

#### 2.1 HIGH-SEVERITY ISSUES (Must Fix Before Launch)

| ZIP Code | Issue Type | Description | Recommended Fix |
|----------|-----------|-------------|-----------------|
| [ZIP] | Invalid Primary | [Specific problem] | [Specific fix] |
| [ZIP] | Barrier Violation | [Specific problem] | [Specific fix] |

**Total high-severity issues:** [Count]

---

#### 2.2 MEDIUM-SEVERITY ISSUES (Should Fix, Launch-Blocking if Pattern)

| ZIP Code | Issue Type | Description | Recommended Fix |
|----------|-----------|-------------|-----------------|
| [ZIP] | Over-Mapped | [Specific problem] | [Specific fix] |
| [ZIP] | Missing Secondary | [Specific problem] | [Specific fix] |

**Total medium-severity issues:** [Count]

---

#### 2.3 LOW-SEVERITY ISSUES (Nice to Fix, Not Launch-Blocking)

| ZIP Code | Issue Type | Description | Recommended Fix |
|----------|-----------|-------------|-----------------|
| [ZIP] | Rationale Clarity | [Specific problem] | [Specific fix] |

**Total low-severity issues:** [Count]

---

### SECTION 3: PATTERN-LEVEL OBSERVATIONS

#### 3.1 Geographic Patterns

**Puget Sound Water Barriers:**
- [How well were ferries/Lake Washington handled?]
- [Any systematic issues?]

**Cascade Mountain Barrier:**
- [Any east-west crossings?]
- [Rural cascade foothills ZIPs handled correctly?]

**Portland-Vancouver Integration:**
- [Which approach was taken? Integration vs separation?]
- [Was it applied consistently?]

#### 3.2 Market-Specific Patterns

**Seattle Metro:**
- [Seattle core vs Eastside split handled how?]
- [Tacoma separation maintained?]
- [Everett separation maintained?]

**Eastern WA/OR:**
- [Are rural markets properly independent?]
- [Specialty referral secondaries present?]

#### 3.3 Methodology Observations

**Strengths:**
- [Top 3 things done well]

**Weaknesses:**
- [Top 3 systematic risks or recurring errors]

---

### SECTION 4: STATISTICAL SUMMARY

**Sample Quality Metrics:**
- **Primary market validity pass rate:** [X%] (target: ≥95%)
- **Secondary market discipline pass rate:** [X%] (target: ≥90%)
- **Over-mapping rate:** [X%] (target: ≤5%)
- **Under-mapping rate:** [X%] (target: ≤10%)
- **Transit error rate:** [X%] (target: ≤3%)

**Projection to full dataset:**
- Estimated high-severity issues in full dataset: [Projection]
- Estimated medium-severity issues in full dataset: [Projection]

---

### SECTION 5: RECOMMENDATIONS

#### Immediate Actions (Before Launch)
1. [Action 1]
2. [Action 2]
3. [Action 3]

#### Post-Launch Improvements (v1.1)
1. [Improvement 1]
2. [Improvement 2]
3. [Improvement 3]

#### Monitoring & Validation
- [How to monitor real-world usage]
- [How to collect user feedback on mappings]
- [How to prioritize fixes based on user behavior]

---

### APPENDIX: DETAILED FLAGGED ZIPs

[Include full table of all flagged ZIPs with complete details]

---

## What You Must NOT Do

❌ **Do NOT silently correct mappings** — Flag issues, don't fix them  
❌ **Do NOT redefine markets** — Markets are fixed, only validate ZIP assignments  
❌ **Do NOT optimize for coverage** — Optimize for behavioral realism  
❌ **Do NOT collapse ambiguity prematurely** — Surface uncertainty, don't hide it  
❌ **Do NOT review every ZIP** — Use smart sampling, not exhaustive review  
❌ **Do NOT focus only on errors** — Also document what's working well

---

## Success Criteria: When to Approve vs Block Launch

### ✅ APPROVE FOR LAUNCH IF:
- Market ID integrity: 100% pass
- Primary market completeness: 100% pass
- High-severity issues: ≤5 issues OR clear pattern with batch fix
- Medium-severity issues: ≤20 issues OR non-systematic
- Sample pass rates: ≥90% on key dimensions
- **Overall:** Defensible mappings, minor issues can be fixed post-launch

### ⚠️ CONDITIONAL APPROVAL IF:
- Market ID integrity: 100% pass (non-negotiable)
- Primary market completeness: 100% pass (non-negotiable)
- High-severity issues: 6-15 issues with fixes identified
- Medium-severity issues: 21-50 issues, some patterns but manageable
- Sample pass rates: 80-89% on key dimensions
- **Overall:** Launchable with documented limitations, fix in v1.1

### ❌ BLOCK LAUNCH IF:
- Market ID integrity: ANY failures (critical system error)
- Primary market completeness: ANY failures (data integrity error)
- High-severity issues: >15 issues OR fundamental methodology flaw
- Medium-severity issues: >50 issues OR systematic pattern indicating flawed approach
- Sample pass rates: <80% on key dimensions
- **Overall:** Not defensible to external stakeholders, would mislead patients

---

## Final Instruction

**Your goal:** Provide a confidence-calibrated recommendation on whether this mapping file is ready for production use in a healthcare price comparison product.

**Standard:** "Would I be comfortable explaining this mapping to a local resident, physician, or health plan administrator?"

**Approach:** Be thorough but pragmatic. Perfect is the enemy of good, but "good enough" must still be defensible.

If a mapping would make a local resident say "That doesn't make sense," flag it.
